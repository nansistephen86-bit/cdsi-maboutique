import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { RedirectToSignIn, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { siteConfig } from "@/data/site-config";
import { formatFCFA } from "@/lib/format";
import { getMyAccount, listMyOrders } from "@/lib/orders/server";
import { orderStatusLabel, paymentStatusLabel } from "@/lib/orders/status";
import type { OrderSummary } from "@/lib/orders/types";

export const Route = createFileRoute("/compte")({
  component: AccountPage,
  head: () => ({
    meta: [{ title: `Mon compte — ${siteConfig.nomCourt}` }],
  }),
});

function AccountPage() {
  const { user, isPending } = useCurrentUserState();
  const [orders, setOrders] = useState<OrderSummary[] | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (isPending || !user) return;
    void listMyOrders()
      .then(setOrders)
      .catch(() => setOrders([]));
    void getMyAccount()
      .then((me) => setIsAdmin(me.isAdmin))
      .catch(() => undefined);
  }, [user, isPending]);

  if (isPending) {
    return (
      <section className="px-5 py-16">
        <div className="mx-auto max-w-[1140px]">
          <div className="h-32 animate-pulse rounded-md bg-sand" />
        </div>
      </section>
    );
  }

  if (!user) return <RedirectToSignIn />;

  return (
    <section className="px-5 py-16">
      <div className="mx-auto max-w-[1140px]">
        <p className="mb-1 font-display text-[1.05rem] text-ochre-dark italic">Espace client</p>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-display font-medium">Mon compte</h1>
            <p className="m-0 text-charcoal-soft">
              {user.displayName || user.primaryEmail} — mes commandes
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Button variant="secondary" asChild>
                <Link to="/admin/commandes">Administration</Link>
              </Button>
            )}
            <UserButton />
          </div>
        </div>

        <h2 className="text-title">Mes commandes</h2>
        {orders === null ? (
          <div className="h-24 animate-pulse rounded-md bg-sand" />
        ) : orders.length === 0 ? (
          <p className="text-charcoal-soft">
            Aucune commande pour le moment.{" "}
            <Link to="/boutique" className="font-semibold text-forest-dark hover:underline">
              Voir la boutique
            </Link>
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                to="/commande/$numero"
                params={{ numero: order.order_number }}
                className="rounded-md border border-sand-dark bg-white p-4 hover:border-forest"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <strong>{order.order_number}</strong>
                  <span className="tabular-nums font-display font-semibold text-forest-dark">
                    {formatFCFA(order.total)}
                  </span>
                </div>
                <p className="mt-1 mb-2 text-sm text-charcoal-soft">
                  {new Date(order.created_at).toLocaleString("fr-FR")} · {order.payment_method}
                </p>
                <ul className="m-0 list-none p-0 text-sm">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.name} × {item.quantity}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 mb-0 text-sm">
                  Paiement : {paymentStatusLabel(order.payment_status)} · Commande :{" "}
                  {orderStatusLabel(order.order_status)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
