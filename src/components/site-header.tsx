import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, ShoppingBag, X } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { siteConfig } from "@/data/site-config";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useCart } from "@/lib/cart";
import { getMyAccount } from "@/lib/orders/server";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Accueil" },
  { to: "/a-propos", label: "À propos" },
  { to: "/activites", label: "Nos activités" },
  { to: "/tourvert", label: "TOUR'VERT" },
  { to: "/boutique-sak", label: "Boutique SAK" },
  { to: "/boutique", label: "Boutique" },
  { to: "/contact", label: "Contact" },
] as const;

function AuthSlot() {
  const { user, isPending } = useCurrentUserState();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    void getMyAccount()
      .then((me) => setIsAdmin(me.isAdmin))
      .catch(() => setIsAdmin(false));
  }, [user]);

  if (isPending) {
    return <div className="h-11 w-24 animate-pulse rounded-sm bg-sand" />;
  }

  return (
    <>
      <SignedOut>
        <Link
          to="/login"
          search={{ next: "/compte" }}
          className="hidden min-h-11 items-center px-2 text-sm font-semibold text-forest-dark hover:underline sm:flex"
        >
          Connexion
        </Link>
      </SignedOut>
      <SignedIn>
        {isAdmin && (
          <Link
            to="/admin/commandes"
            className="hidden text-sm font-semibold text-forest-dark hover:underline lg:inline"
          >
            Admin
          </Link>
        )}
        <Link
          to="/compte"
          className="hidden text-sm font-semibold text-forest-dark hover:underline sm:inline"
        >
          Mes commandes
        </Link>
        <UserButton />
      </SignedIn>
    </>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { totalItems } = useCart();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-40 border-b border-sand-dark bg-cream/95 backdrop-blur-sm">
      <div className="mx-auto flex h-[76px] max-w-[1140px] items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <BrandMark />
          <span className="font-display text-xl text-forest-dark">{siteConfig.nomCourt}</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Navigation principale">
          {links.map((l) => {
            const active = l.to === "/" ? pathname === "/" : pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "border-b-2 py-1.5 text-sm font-medium",
                  active
                    ? "border-ochre text-forest-dark"
                    : "border-transparent text-charcoal-soft hover:border-ochre hover:text-forest-dark",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5">
          <AuthSlot />
          <Link
            to="/panier"
            className="flex min-h-11 items-center gap-1.5 rounded-sm bg-forest px-3.5 py-2.5 text-cream"
            aria-label={`Voir le panier, ${totalItems} article${totalItems > 1 ? "s" : ""}`}
          >
            <ShoppingBag className="size-4" strokeWidth={2.2} />
            <span className="hidden font-semibold sm:inline">Panier</span>
            <span className="flex size-5 items-center justify-center rounded-full bg-ochre text-[0.72rem] font-bold text-charcoal tabular-nums">
              {totalItems}
            </span>
          </Link>
          <button
            type="button"
            className="flex size-11 flex-col items-center justify-center rounded-sm border-[1.5px] border-sand-dark bg-transparent lg:hidden"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X className="size-5 text-forest-dark" />
            ) : (
              <Menu className="size-5 text-forest-dark" />
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="flex flex-col border-b border-sand-dark bg-cream px-5 pb-5 lg:hidden"
          aria-label="Navigation mobile"
        >
          {links.map((l) => {
            const active = l.to === "/" ? pathname === "/" : pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "border-b border-sand-dark py-3.5 text-[1.05rem] font-medium",
                  active ? "font-bold text-forest-dark" : "text-charcoal-soft",
                )}
              >
                {l.label}
              </Link>
            );
          })}
          <SignedIn>
            <Link
              to="/compte"
              onClick={() => setOpen(false)}
              className="border-b border-sand-dark py-3.5 text-[1.05rem] font-medium text-charcoal-soft"
            >
              Mon compte
            </Link>
          </SignedIn>
          <SignedOut>
            <Link
              to="/login"
              search={{ next: "/compte" }}
              onClick={() => setOpen(false)}
              className="py-3.5 text-[1.05rem] font-medium text-charcoal-soft"
            >
              Connexion
            </Link>
          </SignedOut>
        </nav>
      )}
    </header>
  );
}
