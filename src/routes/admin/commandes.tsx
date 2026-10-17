import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { siteConfig } from "@/data/site-config";
import { formatFCFA } from "@/lib/format";
import {
  getMyAccount,
  getMyOrder,
  listAdminOrders,
  updateAdminOrderStatus,
  updateAdminPaymentStatus,
} from "@/lib/orders/server";
import {
  ORDER_STATUS,
  PAYMENT_STATUS,
  isMobileMoney,
  orderStatusLabel,
  paymentStatusLabel,
  type OrderStatus,
  type PaymentStatus,
} from "@/lib/orders/status";
import type { OrderDetail, OrderRecord } from "@/lib/orders/types";

export const Route = createFileRoute("/admin/commandes")({
  component: AdminOrders,
  head: () => ({
    meta: [{ title: `Commandes — Admin ${siteConfig.nomCourt}` }],
  }),
});

function AdminOrders() {
  const { user, isPending } = useCurrentUserState();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [selected, setSelected] = useState<OrderDetail | null>(null);

  async function refresh() {
    const list = await listAdminOrders();
    setOrders(list);
  }

  useEffect(() => {
    if (isPending || !user) return;
    void getMyAccount()
      .then(async (me) => {
        setAllowed(me.isAdmin);
        if (me.isAdmin) await refresh();
      })
      .catch(() => setAllowed(false));
  }, [user, isPending]);

  async function openOrder(numero: string) {
    const detail = await getMyOrder({ data: { numero } });
    setSelected(detail);
  }

  async function changePayment(status: PaymentStatus) {
    if (!selected) return;
    try {
      await updateAdminPaymentStatus({ data: { numero: selected.order_number, status } });
      toast.success("Statut du paiement mis à jour");
      await refresh();
      await openOrder(selected.order_number);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Mise à jour impossible");
    }
  }

  async function changeOrder(status: OrderStatus) {
    if (!selected) return;
    try {
      await updateAdminOrderStatus({ data: { numero: selected.order_number, status } });
      toast.success("Statut de la commande mis à jour");
      await refresh();
      await openOrder(selected.order_number);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Mise à jour impossible");
    }
  }

  if (isPending || allowed === null) {
    return (
      <section className="px-5 py-16">
        <div className="mx-auto max-w-[1140px]">
          <div className="h-32 animate-pulse rounded-md bg-sand" />
        </div>
      </section>
    );
  }

  if (!user) return <RedirectToSignIn />;

  if (!allowed) {
    return (
      <section className="px-5 py-16">
        <div className="mx-auto max-w-[720px]">
          <h1 className="text-display font-medium">Accès réservé</h1>
          <p>Cet espace est réservé à l'équipe CDSI.</p>
          <Button asChild>
            <Link to="/compte">Retour au compte</Link>
          </Button>
        </div>
      </section>
    );
  }

  const paymentOptions = selected
    ? isMobileMoney(selected.payment_method)
    ? (["awaiting_payment", "pending_verification", "confirmed", "refused"] as PaymentStatus[])
      : (["cash_on_delivery", "cash_received"] as PaymentStatus[])
    : [];

  return (
    <section className="px-5 py-16">
      <div className="mx-auto max-w-[1140px]">
        <p className="mb-1 font-display text-[1.05rem] text-ochre-dark italic">Administration</p>
        <h1 className="text-display font-medium">Commandes</h1>
        <p className="mb-8 text-charcoal-soft">
          Vérifiez les paiements Wave et Orange Money, puis suivez la préparation.
        </p>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-sand-dark">
                  <th className="py-3 pr-3">N°</th>
                  <th className="py-3 pr-3">Client</th>
                  <th className="py-3 pr-3">Total</th>
                  <th className="py-3 pr-3">Moyen</th>
                  <th className="py-3 pr-3">Paiement</th>
                  <th className="py-3 pr-3">Commande</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-sand-dark">
                    <td className="py-3 pr-3">
                      <button
                        type="button"
                        className="font-semibold text-forest-dark hover:underline"
                        onClick={() => void openOrder(order.order_number)}
                      >
                        {order.order_number}
                      </button>
                    </td>
                    <td className="py-3 pr-3">
                      {order.customer_name}
                      <br />
                      <span className="text-charcoal-soft">{order.customer_phone}</span>
                    </td>
                    <td className="py-3 pr-3 tabular-nums">{formatFCFA(order.total)}</td>
                    <td className="py-3 pr-3">{order.payment_method}</td>
                    <td className="py-3 pr-3">{paymentStatusLabel(order.payment_status)}</td>
                    <td className="py-3 pr-3">{orderStatusLabel(order.order_status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && <p className="text-charcoal-soft">Aucune commande.</p>}
          </div>

          {selected && (
            <aside className="rounded-md border border-sand-dark bg-white p-5">
              <h2 className="text-title">{selected.order_number}</h2>
              <p className="text-sm">
                {selected.customer_name} · {selected.customer_phone}
                <br />
                {selected.customer_email || "Pas d'e-mail"}
                <br />
                {selected.address}, {selected.city}
              </p>
              <ul className="mt-3 text-sm">
                {selected.items.map((item) => (
                  <li key={item.id}>
                    {item.name} × {item.quantity} — {formatFCFA(item.unit_price * item.quantity)}
                  </li>
                ))}
              </ul>
              <p className="font-semibold">{formatFCFA(selected.total)}</p>
              <p className="text-sm">
                {selected.payment_method} · {paymentStatusLabel(selected.payment_status)}
              </p>

              <label className="mt-4 block text-sm font-semibold">Statut du paiement</label>
              <select
                className="mt-1 min-h-11 w-full rounded-sm border-[1.5px] border-sand-dark bg-white px-3"
                value={selected.payment_status}
                onChange={(e) => void changePayment(e.target.value as PaymentStatus)}
              >
                {paymentOptions.map((key) => (
                  <option key={key} value={key}>
                    {PAYMENT_STATUS[key]}
                  </option>
                ))}
              </select>

              <label className="mt-4 block text-sm font-semibold">Statut de la commande</label>
              <select
                className="mt-1 min-h-11 w-full rounded-sm border-[1.5px] border-sand-dark bg-white px-3"
                value={selected.order_status}
                onChange={(e) => void changeOrder(e.target.value as OrderStatus)}
              >
                {(Object.keys(ORDER_STATUS) as OrderStatus[]).map((key) => (
                  <option key={key} value={key}>
                    {ORDER_STATUS[key]}
                  </option>
                ))}
              </select>

              <h3 className="mt-5 text-sm font-semibold">Historique</h3>
              <ol className="mt-2 flex flex-col gap-1 text-[0.8rem] text-charcoal-soft">
                {selected.events.map((event) => (
                  <li key={event.id}>
                    {new Date(event.created_at).toLocaleString("fr-FR")} —{" "}
                    {event.field === "payment_status" ? "Paiement" : "Commande"} :{" "}
                    {event.old_value
                      ? event.field === "payment_status"
                        ? paymentStatusLabel(event.old_value)
                        : orderStatusLabel(event.old_value)
                      : "—"}{" "}
                    →{" "}
                    {event.field === "payment_status"
                      ? paymentStatusLabel(event.new_value)
                      : orderStatusLabel(event.new_value)}
                    {event.actor_email ? ` (${event.actor_email})` : ""}
                  </li>
                ))}
              </ol>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}
