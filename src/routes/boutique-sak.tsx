import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { getProductsByCollection } from "@/data/products";
import { siteConfig } from "@/data/site-config";

export const Route = createFileRoute("/boutique-sak")({
  component: BoutiqueSak,
  head: () => ({
    meta: [{ title: `Boutique SAK — ${siteConfig.nomCourt}` }],
  }),
});

function BoutiqueSak() {
  const items = getProductsByCollection("sak");

  return (
    <>
      <section className="bg-ochre px-5 py-16">
        <div className="mx-auto max-w-[1140px]">
          <p className="mb-1 font-display text-[1.05rem] text-forest-dark italic">Collection</p>
          <h1 className="text-display font-medium text-charcoal">Boutique SAK</h1>
          <p className="max-w-xl text-charcoal">
            Sacs à dos en wax, senteurs d'ambiance et thiouraay — SAK by Sateou.
          </p>
        </div>
      </section>

      <section className="px-5 py-16">
        <div className="mx-auto max-w-[1140px]">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button variant="secondary" asChild>
              <Link to="/boutique" search={{ categorie: "sacs" }}>
                Voir toute la boutique
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
