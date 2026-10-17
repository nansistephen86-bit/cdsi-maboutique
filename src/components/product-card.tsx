import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { ProductArt } from "@/components/product-art";
import { Button } from "@/components/ui/button";
import { getCategoryLabel, type Product } from "@/data/products";
import { useCart } from "@/lib/cart";
import { formatFCFA } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const categoryLabel = getCategoryLabel(product.category);

  function handleQuickAdd() {
    addItem(product, 1, {
      color: product.colors[0],
      size: product.sizes[0],
    });
    toast.success(`${product.name} ajouté au panier`, {
      action: {
        label: "Voir",
        onClick: () => navigate({ to: "/panier" }),
      },
    });
  }

  return (
    <article className="flex flex-col overflow-hidden rounded-md border border-sand-dark bg-white transition-[box-shadow,transform] duration-200 ease-[var(--ease-smooth-out)] hover:-translate-y-0.5 hover:shadow-lift">
      <Link
        to="/produit/$id"
        params={{ id: product.id }}
        className="relative aspect-square overflow-hidden bg-white"
      >
        <ProductArt productId={product.id} className="size-full" />
        <span className="absolute top-2.5 left-2.5 rounded-sm bg-forest px-2.5 py-1 text-[0.72rem] font-bold text-cream">
          {categoryLabel}
        </span>
        {!product.available && (
          <span className="absolute top-2.5 right-2.5 rounded-sm bg-danger px-2.5 py-1 text-[0.7rem] font-bold text-white">
            Épuisé
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="m-0 text-[1.05rem] font-semibold">
          <Link to="/produit/$id" params={{ id: product.id }} className="text-forest-dark">
            {product.name}
          </Link>
        </h3>
        <p className="m-0 line-clamp-2 text-[0.88rem] text-charcoal-soft">{product.description}</p>
        <span className="font-display text-lg font-semibold text-forest-dark tabular-nums">
          {formatFCFA(product.price)}
        </span>
        {product.format && (
          <span className="text-[0.78rem] text-charcoal-soft">{product.format}</span>
        )}
        <div className="mt-auto flex gap-2">
          <Button variant="secondary" size="sm" className="flex-1 px-3 text-[0.88rem]" asChild>
            <Link to="/produit/$id" params={{ id: product.id }}>
              Voir le produit
            </Link>
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="flex-1 px-3 text-[0.88rem]"
            onClick={handleQuickAdd}
            disabled={!product.available}
          >
            Ajouter
          </Button>
        </div>
      </div>
    </article>
  );
}
