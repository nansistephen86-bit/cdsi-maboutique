import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { ProductArt } from "@/components/product-art";
import { QtyControl } from "@/components/qty-control";
import { Button } from "@/components/ui/button";
import { getCategoryLabel, getProductById } from "@/data/products";
import { siteConfig } from "@/data/site-config";
import { useCart } from "@/lib/cart";
import { formatFCFA } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/produit/$id")({
  component: ProductDetail,
  head: ({ params }) => {
    const product = getProductById(params.id);
    return {
      meta: [
        {
          title: product
            ? `${product.name} — ${siteConfig.nomCourt}`
            : `Produit introuvable — ${siteConfig.nomCourt}`,
        },
      ],
    };
  },
});

function ProductDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const product = getProductById(id);
  const { addItem } = useCart();

  const [color, setColor] = useState<string | null>(product?.colors[0] ?? null);
  const [size, setSize] = useState<string | null>(product?.sizes[0] ?? null);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <section className="px-5 py-16">
        <div className="mx-auto max-w-[1140px]">
          <h1 className="text-display font-medium">Produit introuvable</h1>
          <p>Ce produit n'existe pas ou n'est plus disponible.</p>
          <Button asChild>
            <Link to="/boutique">Retour à la boutique</Link>
          </Button>
        </div>
      </section>
    );
  }

  const selected = product;
  const categoryLabel = getCategoryLabel(selected.category);

  function handleAddToCart() {
    addItem(selected, quantity, { color, size });
    toast.success(`${selected.name} ajouté au panier`, {
      action: {
        label: "Voir le panier",
        onClick: () => navigate({ to: "/panier" }),
      },
    });
  }

  return (
    <section className="px-5 py-16">
      <div className="mx-auto max-w-[1140px]">
        <p className="mb-2 text-sm text-charcoal-soft">
          <Link to="/boutique" className="hover:text-forest-dark">
            Boutique
          </Link>{" "}
          · {categoryLabel}
        </p>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div className="overflow-hidden rounded-md border-[6px] border-white bg-white shadow-card">
            <ProductArt productId={product.id} className="aspect-square w-full" />
          </div>

          <div>
            <span className="mb-3 inline-block rounded-sm bg-forest px-2.5 py-1 text-[0.72rem] font-bold text-cream">
              {categoryLabel}
            </span>
            {!product.available && (
              <span className="mb-3 ml-2 inline-block rounded-sm bg-danger px-2.5 py-1 text-[0.7rem] font-bold text-white">
                Épuisé
              </span>
            )}
            <h1 className="text-display font-medium">{product.name}</h1>
            {product.format && (
              <p className="mb-2 text-sm font-medium text-charcoal-soft">{product.format}</p>
            )}
            <p className="font-display text-xl font-semibold text-forest-dark tabular-nums">
              {formatFCFA(product.price)}
            </p>
            <p>{product.description}</p>
            {product.highlights && product.highlights.length > 0 && (
              <ul className="my-4 flex flex-col gap-1.5 pl-5 text-charcoal">
                {product.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            )}

            {product.colors.length > 0 && (
              <div className="my-4">
                <span className="mb-2 block text-sm font-semibold">Couleur</span>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={cn(
                        "min-h-11 rounded-sm border-[1.5px] px-4 py-2",
                        color === c
                          ? "border-forest bg-forest text-cream"
                          : "border-sand-dark bg-white hover:border-forest",
                      )}
                      onClick={() => setColor(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes.length > 0 && (
              <div className="my-4">
                <span className="mb-2 block text-sm font-semibold">Taille</span>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={cn(
                        "min-h-11 rounded-sm border-[1.5px] px-4 py-2",
                        size === s
                          ? "border-forest bg-forest text-cream"
                          : "border-sand-dark bg-white hover:border-forest",
                      )}
                      onClick={() => setSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="my-4">
              <span className="mb-2 block text-sm font-semibold">Quantité</span>
              <QtyControl
                value={quantity}
                label="la quantité"
                onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
                onIncrease={() => setQuantity((q) => q + 1)}
              />
            </div>

            <p>
              {product.available ? (
                <span className="font-semibold text-forest">Disponible</span>
              ) : (
                <span className="font-semibold text-danger">Actuellement épuisé</span>
              )}
            </p>

            <div className="mt-4 flex flex-wrap gap-3.5">
              <Button onClick={handleAddToCart} disabled={!product.available}>
                Ajouter au panier
              </Button>
              <Button variant="secondary" onClick={() => navigate({ to: "/boutique" })}>
                Continuer mes achats
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
