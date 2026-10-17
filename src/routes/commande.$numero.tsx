import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { PaymentInstructions, type PublicPaymentInfo } from "@/components/payment-instructions";
import { Button } from "@/components/ui/button";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { siteConfig } from "@/data/site-config";
import { formatFCFA } from "@/lib/format";
import { getMyOrder, getPublicPaymentSettings, markPaymentDone } from "@/lib/orders/server";
import { isMobileMoney, orderStatusLabel, paymentStatusLabel } from "@/lib/orders/status";
import type { OrderDetail } from "@/lib/orders/types";

export const Route = createFileRoute("/commande/$numero")({
  component: OrderConfirmation,
  head: ({ params }) => ({
    meta: [{ title: `Commande ${params.numero} — ${siteConfig.nomCourt}` }],
  }),
});

function OrderConfirmation() {
  const { numero } = Route.useParams();
  const { user, isPending } = useCurrentUserState();
  const [order, setOrder] = useState<OrderDetail | null | undefined>(undefined);
  const [settings, setSettings] = useState<PublicPaymentInfo | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void getPublicPaymentSettings()
      .then(setSettings)
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (isPending || !user) return;
    void getMyOrder({ data: { numero } })
      .then(setOrder)
      .catch(() => setOrder(null));
  }, [numero, user, isPending]);

  async function handlePaid() {
    setBusy(true);
    try {
      const result = await markPaymentDone({ data: { numero } });
      setOrder((current) =>
        current ? { ...current, payment_status: result.paymentStatus } : current,
      );
      toast.success("CDSI va vérifier votre paiement.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Impossible d'enregistrer");
    } finally {
      setBusy(false);
    }
  }

  if (isPending || order === undefined) {
    return (
      <section className="px-5 py-16">
        <div className="mx-auto max-w-[720px]">
          <div className="h-40 animate-pulse rounded-md bg-sand" />
        </div>
      </section>
    );
  }

  if (!user) return <RedirectToSignIn />;

  if (!order) {
    return (
      <section className="px-5 py-16">
        <div className="mx-auto max-w-[720px]">
          <h1 className="text-display font-medium">Commande introuvable</h1>
          <Button asChild>
            <Link to="/compte">Mes commandes</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="px-5 py-16">
      <div className="mx-auto max-w-[720px]">
        <p className="mb-1 font-display text-[1.05rem] text-ochre-dark italic">Confirmation</p>
        <h1 className="text-display font-medium">Commande confirmée !</h1>
        <p className="text-lg">
          Votre numéro de commande : <strong>{order.order_number}</strong>
        </p>

        <div className="mt-6 rounded-md border border-sand-dark bg-white p-6">
          <h2 className="text-title">Détail</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-3 text-sm">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span className="tabular-nums">{formatFCFA(item.unit_price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between text-sm">
            <span>Livraison</span>
            <span className="tabular-nums">{formatFCFA(order.delivery_fee)}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-sand-dark pt-3 font-bold">
            <span>Total</span>
            <span className="tabular-nums">{formatFCFA(order.total)}</span>
          </div>
          <p className="mt-4 mb-1 text-sm">
            Paiement : <strong>{order.payment_method}</strong>
          </p>
          <p className="m-0 text-sm">
            Statut du paiement : <strong>{paymentStatusLabel(order.payment_status)}</strong>
          </p>
          <p className="mt-1 mb-0 text-sm">
            Statut de la commande : <strong>{orderStatusLabel(order.order_status)}</strong>
          </p>
          <p className="mt-4 mb-0 text-sm">
            Livraison : {order.address}, {order.city}
          </p>
        </div>

        {settings && (
          <div className="mt-6">
            <PaymentInstructions
              method={order.payment_method}
              amount={order.total}
              orderNumber={order.order_number}
              settings={settings}
            />
          </div>
        )}

        {isMobileMoney(order.payment_method) && order.payment_status === "awaiting_payment" && (
          <div className="mt-4">
            <Button type="button" size="lg" disabled={busy} onClick={handlePaid}>
              {busy ? "Enregistrement…" : "J'ai effectué le paiement"}
            </Button>
          </div>
        )}

        {order.payment_status === "pending_verification" && (
          <p className="mt-4 rounded-sm bg-sand p-3.5 text-sm">
            Paiement à vérifier. CDSI confirmera dès réception sur {order.payment_method}.
          </p>
        )}

        {order.payment_status === "confirmed" && (
          <p className="mt-4 rounded-sm bg-sand p-3.5 text-sm">Votre paiement a été confirmé.</p>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Button variant="secondary" asChild>
            <Link to="/compte">Mes commandes</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/boutique">Continuer les achats</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
