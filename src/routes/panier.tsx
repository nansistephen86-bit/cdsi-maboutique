import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { ProductArt } from "@/components/product-art";
import { QtyControl } from "@/components/qty-control";
import { Button } from "@/components/ui/button";
import { SignInGate } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { GROK_PROVIDERS, signIn } from "@/lib/auth/client";
import { siteConfig, type MoyenPaiement } from "@/data/site-config";
import { useCart } from "@/lib/cart";
import { formatFCFA } from "@/lib/format";
import { createOrder, getMyAccount, getPublicPaymentSettings } from "@/lib/orders/server";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/panier")({
  component: CartPage,
  head: () => ({
    meta: [{ title: `Panier — ${siteConfig.nomCourt}` }],
  }),
});

function CartPage() {
  const { items, increaseQuantity, decreaseQuantity, removeItem, subtotal, totalItems, clearCart } =
    useCart();
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();

  const [deliveryFee, setDeliveryFee] = useState<number>(siteConfig.livraison.forfait);
  const total = subtotal + deliveryFee;

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "Dakar",
    payment: "Wave" as MoyenPaiement,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void getPublicPaymentSettings()
      .then((s) => setDeliveryFee(s.deliveryFee))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!user) return;
    void getMyAccount()
      .then((me) => {
        setCustomer((c) => ({
          ...c,
          name: c.name || me.profile?.name || user.displayName || "",
          phone: c.phone || me.profile?.phone || "",
          email: c.email || me.email || user.primaryEmail || "",
          address: c.address || me.profile?.address || "",
          city: c.city || me.profile?.city || "Dakar",
        }));
      })
      .catch(() => {
        setCustomer((c) => ({
          ...c,
          name: c.name || user.displayName || "",
          email: c.email || user.primaryEmail || "",
        }));
      });
  }, [user]);

  function updateField<K extends keyof typeof customer>(field: K, value: (typeof customer)[K]) {
    setCustomer((c) => ({ ...c, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) {
      toast.error("Connectez-vous pour valider la commande.");
      return;
    }
    if (!customer.name.trim() || !customer.phone.trim() || !customer.address.trim()) {
      toast.error("Indiquez votre nom, téléphone et adresse de livraison.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await createOrder({
        data: {
          name: customer.name.trim(),
          phone: customer.phone.trim(),
          email: customer.email.trim(),
          address: customer.address.trim(),
          city: customer.city.trim() || "Dakar",
          payment: customer.payment,
          items: items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            color: item.color,
            size: item.size,
          })),
        },
      });
      clearCart();
      toast.success("Commande enregistrée");
      await navigate({ to: "/commande/$numero", params: { numero: result.orderNumber } });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Commande impossible";
      if (message === "Unauthorized") {
        toast.error("Connectez-vous pour commander.");
        await navigate({ to: "/login", search: { next: "/panier" } });
      } else {
        toast.error(message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <section className="px-5 py-16">
        <div className="mx-auto max-w-[1140px]">
          <h1 className="text-display font-medium">Votre panier</h1>
          <p className="py-10 text-center text-charcoal-soft">
            Votre panier est vide pour le moment.
          </p>
          <Button asChild>
            <Link to="/boutique">Découvrir la boutique</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="px-5 py-16">
      <div className="mx-auto max-w-[1140px]">
        <h1 className="text-display font-medium">Votre panier</h1>
        <p>
          {totalItems} article{totalItems > 1 ? "s" : ""} dans votre panier
        </p>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-start">
          <div>
            {items.map((item) => (
              <div
                key={`${item.id}-${item.optionKey}`}
                className="grid grid-cols-[76px_1fr] items-center gap-3.5 border-b border-sand-dark py-4 sm:grid-cols-[76px_1fr_auto]"
              >
                <div className="size-[76px] overflow-hidden rounded-sm bg-white">
                  <ProductArt productId={item.id} className="size-full" />
                </div>
                <div>
                  <h3 className="mb-1 text-[1.05rem]">{item.name}</h3>
                  {(item.color || item.size) && (
                    <p className="m-0 text-[0.85rem] text-charcoal-soft">
                      {[item.color, item.size].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  <p className="mt-1 mb-0 font-display font-semibold text-forest-dark tabular-nums">
                    {formatFCFA(item.price)} × {item.quantity} ={" "}
                    {formatFCFA(item.price * item.quantity)}
                  </p>
                </div>
                <div className="col-span-2 flex items-center justify-between gap-2 sm:col-span-1 sm:flex-col sm:items-end">
                  <QtyControl
                    value={item.quantity}
                    label={`la quantité de ${item.name}`}
                    onDecrease={() => decreaseQuantity(item.id, item.optionKey)}
                    onIncrease={() => increaseQuantity(item.id, item.optionKey)}
                  />
                  <button
                    type="button"
                    className="text-[0.82rem] font-semibold text-danger hover:underline"
                    onClick={() => removeItem(item.id, item.optionKey)}
                    aria-label={`Supprimer ${item.name} du panier`}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside className="sticky top-24 rounded-md border border-sand-dark bg-white p-6">
            <h2 className="text-title">Récapitulatif</h2>
            <div className="mt-3 flex justify-between text-sm">
              <span>Sous-total produits</span>
              <span className="tabular-nums">{formatFCFA(subtotal)}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span>Livraison Dakar (forfait)</span>
              <span className="tabular-nums">{formatFCFA(deliveryFee)}</span>
            </div>
            <div className="mt-3 flex justify-between border-t border-sand-dark pt-3 text-[1.15rem] font-bold">
              <span>Total</span>
              <span className="tabular-nums">{formatFCFA(total)}</span>
            </div>
            <p className="my-4 rounded-sm bg-sand p-3.5 text-[0.85rem]">{siteConfig.livraison.texte}</p>

            {isPending ? (
              <div className="h-24 animate-pulse rounded-sm bg-sand" />
            ) : (
              <SignInGate
                fallback={
                  <div className="grid gap-3">
                    <p className="m-0 font-semibold">Connectez-vous pour commander</p>
                    <p className="m-0 text-sm text-charcoal-soft">
                      Un compte permet de suivre le paiement Wave / Orange Money et vos commandes.
                    </p>
                    {GROK_PROVIDERS.map((p) => (
                      <Button
                        key={p.providerId}
                        type="button"
                        variant="secondary"
                        onClick={() => signIn(p.providerId, { callbackURL: "/panier" })}
                      >
                        Continuer avec {p.label}
                      </Button>
                    ))}
                    <Button asChild>
                      <Link to="/login" search={{ next: "/panier" }}>
                        E-mail / mot de passe
                      </Link>
                    </Button>
                  </div>
                }
              >
                <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
                  <h3 className="m-0">Livraison et paiement</h3>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="text-sm font-semibold">
                      Nom
                    </label>
                    <input
                      id="name"
                      required
                      value={customer.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      className="min-h-12 rounded-sm border-[1.5px] border-sand-dark bg-white px-3.5 py-3"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="phone" className="text-sm font-semibold">
                      Téléphone
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={customer.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      placeholder="77 000 00 00"
                      className="min-h-12 rounded-sm border-[1.5px] border-sand-dark bg-white px-3.5 py-3"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-sm font-semibold">
                      E-mail (confirmation)
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={customer.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className="min-h-12 rounded-sm border-[1.5px] border-sand-dark bg-white px-3.5 py-3"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="address" className="text-sm font-semibold">
                      Adresse de livraison à Dakar
                    </label>
                    <input
                      id="address"
                      required
                      value={customer.address}
                      onChange={(e) => updateField("address", e.target.value)}
                      placeholder="Quartier, rue, repère..."
                      className="min-h-12 rounded-sm border-[1.5px] border-sand-dark bg-white px-3.5 py-3"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="city" className="text-sm font-semibold">
                      Ville
                    </label>
                    <input
                      id="city"
                      value={customer.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      className="min-h-12 rounded-sm border-[1.5px] border-sand-dark bg-white px-3.5 py-3"
                    />
                  </div>

                  <fieldset className="flex flex-col gap-2">
                    <legend className="mb-1 text-sm font-semibold">Moyen de paiement</legend>
                    {siteConfig.moyensPaiement.map((m) => (
                      <label
                        key={m}
                        className={cn(
                          "flex min-h-12 cursor-pointer items-center gap-3 rounded-sm border-[1.5px] px-3.5 py-3",
                          customer.payment === m
                            ? "border-forest bg-sand"
                            : "border-sand-dark bg-white",
                        )}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={m}
                          checked={customer.payment === m}
                          onChange={() => updateField("payment", m)}
                          className="accent-forest"
                        />
                        <span className="font-medium">{m}</span>
                      </label>
                    ))}
                  </fieldset>

                  <p className="m-0 text-[0.82rem] text-charcoal-soft">
                    Wave et Orange Money : vous payez depuis votre application, puis CDSI vérifie
                    le paiement. Aucune carte bancaire n'est demandée.
                  </p>

                  <Button type="submit" size="lg" disabled={submitting}>
                    {submitting ? "Enregistrement…" : "Valider la commande"}
                  </Button>
                </form>
              </SignInGate>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
