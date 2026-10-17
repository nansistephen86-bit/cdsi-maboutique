import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { getProductsByCollection } from "@/data/products";
import { siteConfig } from "@/data/site-config";

export const Route = createFileRoute("/tourvert")({
  component: TourVert,
  head: () => ({
    meta: [{ title: `TOUR'VERT — ${siteConfig.nomCourt}` }],
  }),
});

function TourVert() {
  const items = getProductsByCollection("tourvert");

  return (
    <>
      <section className="bg-forest px-5 py-16 text-cream">
        <div className="mx-auto max-w-[1140px]">
          <p className="mb-1 font-display text-[1.05rem] text-ochre italic">Collection</p>
          <h1 className="text-display font-medium text-cream">TOUR'VERT</h1>
          <p className="max-w-xl text-sand">
            Savons naturels, confitures, marmelades et crème capillaire — fabriqués au Sénégal
            avec des ingrédients locaux.
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
              <Link to="/boutique" search={{ categorie: "savons" }}>
                Voir toute la boutique
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
