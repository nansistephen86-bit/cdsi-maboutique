import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { categories, products } from "@/data/products";
import { siteConfig } from "@/data/site-config";
import { cn } from "@/lib/utils";

type BoutiqueSearch = {
  categorie?: string;
};

export const Route = createFileRoute("/boutique")({
  validateSearch: (search: Record<string, unknown>): BoutiqueSearch => ({
    categorie: typeof search.categorie === "string" ? search.categorie : undefined,
  }),
  component: Boutique,
  head: () => ({
    meta: [{ title: `Boutique — ${siteConfig.nomCourt}` }],
  }),
});

function Boutique() {
  const { categorie } = Route.useSearch();
  const navigate = Route.useNavigate();
  const category = categorie || "tous";

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("defaut");

  function handleCategoryChange(slug: string) {
    navigate({
      search: slug === "tous" ? {} : { categorie: slug },
      replace: true,
    });
  }

  const filtered = useMemo(() => {
    let list = products;

    if (category !== "tous") {
      list = list.filter((p) => p.category === category);
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
      );
    }

    if (sort === "prix-asc") {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sort === "prix-desc") {
      list = [...list].sort((a, b) => b.price - a.price);
    }

    return list;
  }, [category, query, sort]);

  return (
    <section className="px-5 py-16">
      <div className="mx-auto max-w-[1140px]">
        <p className="mb-1 font-display text-[1.05rem] text-ochre-dark italic">Boutique</p>
        <h1 className="text-display font-medium">Notre catalogue</h1>
        <p className="mb-9 max-w-xl text-charcoal-soft">
          Retrouvez l'ensemble des créations TOUR'VERT et Boutique SAK : savons naturels,
          confitures, crème capillaire, sacs à dos, senteurs et thiouraay.
        </p>

        <div className="mb-7 flex flex-col gap-3.5">
          <div className="flex flex-wrap items-center justify-between gap-3.5">
            <div className="flex h-12 min-w-[220px] flex-1 items-center gap-2 rounded-sm border-[1.5px] border-sand-dark bg-white px-3.5">
              <Search className="size-4 shrink-0 text-charcoal-soft" />
              <label htmlFor="recherche" className="sr-only">
                Rechercher un produit
              </label>
              <input
                id="recherche"
                type="search"
                placeholder="Rechercher un produit…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-full min-w-0 flex-1 bg-transparent outline-none"
              />
            </div>
            <select
              className="h-11 rounded-sm border-[1.5px] border-sand-dark bg-white px-3 py-2.5"
              aria-label="Trier les produits"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="defaut">Pertinence</option>
              <option value="prix-asc">Prix croissant</option>
              <option value="prix-desc">Prix décroissant</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-2.5" role="group" aria-label="Filtrer par catégorie">
            {categories.map((c) => (
              <button
                key={c.slug}
                type="button"
                className={cn(
                  "min-h-10 rounded-full border-[1.5px] px-4 py-2 text-sm font-medium",
                  category === c.slug
                    ? "border-forest bg-forest text-cream"
                    : "border-sand-dark bg-white text-charcoal hover:border-forest",
                )}
                onClick={() => handleCategoryChange(c.slug)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="px-5 py-16 text-center text-charcoal-soft">
            Aucun produit ne correspond à votre recherche pour le moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
