import { siteConfig } from "@/data/site-config";
import { env } from "@/lib/env.server";
import { formatFCFA } from "@/lib/format";
import { paymentStatusLabel, orderStatusLabel, isMobileMoney } from "@/lib/orders/status";
import { getPaymentSettings } from "@/lib/payments/config.server";
import type { OrderRecord, OrderItemRecord } from "@/lib/orders/types";

type MailPayload = { to: string; subject: string; text: string };

async function sendEmail(payload: MailPayload): Promise<{ sent: boolean }> {
  const key = env("RESEND_API_KEY");
  const from = env("MAIL_FROM") ?? `CDSI <${siteConfig.email}>`;
  if (!key) {
    console.info("[mail] skipped — RESEND_API_KEY not set", payload.subject, payload.to);
    return { sent: false };
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: payload.to,
        subject: payload.subject,
        text: payload.text,
      }),
    });
    if (!res.ok) {
      console.error("[mail] provider error", res.status, await res.text());
      return { sent: false };
    }
    return { sent: true };
  } catch (err) {
    console.error("[mail] failed", err);
    return { sent: false };
  }
}

export async function sendWhatsAppNotification(text: string): Promise<{
  configured: boolean;
  sent: boolean;
}> {
  const token = env("WHATSAPP_ACCESS_TOKEN");
  const phoneNumberId = env("WHATSAPP_PHONE_NUMBER_ID");
  const to = env("ADMIN_WHATSAPP_NUMBER");
  if (!token || !phoneNumberId || !to) {
    return { configured: false, sent: false };
  }
  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: text },
      }),
    });
    if (!res.ok) {
      console.error("[whatsapp] provider error", res.status, await res.text());
      return { configured: true, sent: false };
    }
    return { configured: true, sent: true };
  } catch (err) {
    console.error("[whatsapp] failed", err);
    return { configured: true, sent: false };
  }
}

function itemsLines(items: OrderItemRecord[]): string {
  return items
    .map((i) => {
      const variante = [i.color, i.size].filter(Boolean).join(" / ");
      return `- ${i.name}${variante ? ` (${variante})` : ""} × ${i.quantity} — ${formatFCFA(i.unit_price * i.quantity)}`;
    })
    .join("\n");
}

function paymentInstructionsText(order: OrderRecord): string {
  if (!isMobileMoney(order.payment_method)) return "Paiement à la livraison, en espèces au livreur.";
  const settings = getPaymentSettings();
  const phone = order.payment_method === "Wave" ? settings.wavePhone : settings.orangePhone;
  const name = order.payment_method === "Wave" ? settings.waveName : settings.orangeName;
  return [
    `Payez ${formatFCFA(order.total)} par ${order.payment_method}`,
    `Bénéficiaire : ${name}`,
    `Numéro : ${phone}`,
    `Référence / libellé : ${order.order_number}`,
    "Indiquez ce numéro de commande dans le libellé du transfert si l'application le permet.",
  ].join("\n");
}

export function buildAdminWhatsAppMessage(order: OrderRecord, items: OrderItemRecord[]): string {
  return [
    "🛒 Nouvelle commande CDSI",
    "",
    `Commande : ${order.order_number}`,
    "",
    `Client : ${order.customer_name}`,
    `Téléphone : ${order.customer_phone}`,
    `E-mail : ${order.customer_email || "—"}`,
    "",
    "Produits :",
    itemsLines(items),
    "",
    `Total : ${formatFCFA(order.total)}`,
    "",
    `Paiement : ${order.payment_method}`,
    `Statut : ${paymentStatusLabel(order.payment_status)}`,
    "",
    "Livraison :",
    `${order.address}, ${order.city}`,
  ].join("\n");
}

export async function notifyNewOrder(order: OrderRecord, items: OrderItemRecord[]): Promise<void> {
  const settings = getPaymentSettings();
  const adminText = [
    `Nouvelle commande ${order.order_number}`,
    `Date : ${order.created_at}`,
    `Client : ${order.customer_name}`,
    `Téléphone : ${order.customer_phone}`,
    `E-mail : ${order.customer_email || "—"}`,
    `Adresse : ${order.address}, ${order.city}`,
    "",
    itemsLines(items),
    "",
    `Sous-total : ${formatFCFA(order.subtotal)}`,
    `Livraison : ${formatFCFA(order.delivery_fee)}`,
    `Total : ${formatFCFA(order.total)}`,
    `Paiement : ${order.payment_method}`,
    `Statut paiement : ${paymentStatusLabel(order.payment_status)}`,
    `Statut commande : ${orderStatusLabel(order.order_status)}`,
  ].join("\n");

  await sendEmail({
    to: settings.adminEmail,
    subject: `Nouvelle commande ${order.order_number}`,
    text: adminText,
  });

  const wa = buildAdminWhatsAppMessage(order, items);
  await sendWhatsAppNotification(wa);

  if (order.customer_email) {
    await sendEmail({
      to: order.customer_email,
      subject: `Commande ${order.order_number} — CDSI`,
      text: [
        `Bonjour ${order.customer_name},`,
        "",
        "Votre commande est confirmée.",
        `Numéro de commande : ${order.order_number}`,
        "",
        itemsLines(items),
        "",
        `Sous-total : ${formatFCFA(order.subtotal)}`,
        `Livraison : ${formatFCFA(order.delivery_fee)}`,
        `Total : ${formatFCFA(order.total)}`,
        `Paiement : ${order.payment_method}`,
        `Statut du paiement : ${paymentStatusLabel(order.payment_status)}`,
        `Adresse de livraison : ${order.address}, ${order.city}`,
        "",
        paymentInstructionsText(order),
        "",
        "CDSI — Centre de Développement Solidaire et Inclusif",
        siteConfig.adresse,
        siteConfig.telephone,
        siteConfig.email,
      ].join("\n"),
    });
  }
}

export async function notifyPaymentConfirmed(order: OrderRecord): Promise<void> {
  if (!order.customer_email) return;
  await sendEmail({
    to: order.customer_email,
    subject: `Paiement confirmé — ${order.order_number}`,
    text: [
      `Bonjour ${order.customer_name},`,
      "",
      "Votre paiement a été confirmé.",
      `Commande : ${order.order_number}`,
      `Montant : ${formatFCFA(order.total)}`,
      "",
      "Nous préparons votre commande.",
      "",
      "CDSI",
      siteConfig.telephone,
    ].join("\n"),
  });
}
