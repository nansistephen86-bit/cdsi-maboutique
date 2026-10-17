import { siteConfig } from "@/data/site-config";
import { formatFCFA } from "@/lib/format";
import type { CartItem } from "@/lib/cart";

export function buildWhatsAppOrderUrl(
  items: CartItem[],
  subtotal: number,
  customer: {
    name?: string;
    phone?: string;
    address?: string;
    city?: string;
    payment?: string;
  } = {},
): string {
  const livraison = siteConfig.livraison.forfait;
  const total = subtotal + livraison;
  const lines: string[] = [];
  lines.push(`Bonjour ${siteConfig.nomCourt},`);
  lines.push("");
  lines.push("Je souhaite passer une commande :");
  lines.push("");

  items.forEach((item) => {
    const variante = [item.color, item.size].filter(Boolean).join(" / ");
    const varianteTxt = variante ? ` (${variante})` : "";
    lines.push(
      `- ${item.name}${varianteTxt} x${item.quantity} — ${formatFCFA(item.price * item.quantity)}`,
    );
  });

  lines.push("");
  lines.push(`Sous-total produits : ${formatFCFA(subtotal)}`);
  lines.push(`Livraison Dakar (forfait) : ${formatFCFA(livraison)}`);
  lines.push(`Total à payer : ${formatFCFA(total)}`);
  lines.push("");
  lines.push(`Livraison à ${customer.city || "Dakar"}.`);
  lines.push(`Adresse : ${customer.address || ""}`);
  lines.push("");
  if (customer.payment === "Wave" || customer.payment === "Orange Money") {
    lines.push(
      `Paiement : ${customer.payment} — j'envoie ${formatFCFA(total)} au ${siteConfig.paiement.numero}.`,
    );
  } else if (customer.payment === "Espèces à la livraison") {
    lines.push("Paiement : espèces à la livraison.");
  } else if (customer.payment) {
    lines.push(`Paiement : ${customer.payment}`);
  }
  lines.push("");
  lines.push(`Nom : ${customer.name || ""}`);
  lines.push(`Téléphone : ${customer.phone || ""}`);

  return `https://wa.me/${siteConfig.whatsappNumero}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export function buildWhatsAppGenericUrl(message = ""): string {
  const base = `https://wa.me/${siteConfig.whatsappNumero}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
