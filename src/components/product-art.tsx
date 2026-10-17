import { getProductById } from "@/data/products";
import { cn } from "@/lib/utils";

export function ProductArt({
  productId,
  className,
}: {
  productId: string;
  className?: string;
}) {
  const product = getProductById(productId);
  if (product?.image) {
    return (
      <div className={cn("overflow-hidden bg-white", className)}>
        <img
          src={product.image}
          alt={product.name}
          className="size-full object-contain"
          loading="lazy"
        />
      </div>
    );
  }
  return <div className={cn("bg-sand", className)} />;
}

export function HeroVisual() {
  return (
    <div className="relative aspect-square overflow-hidden rounded-md border-[6px] border-white bg-forest shadow-card sm:aspect-[4/3]">
      <div className="grid size-full grid-cols-2 grid-rows-2">
        <img
          src="/images/produits/savon-ordinaire.jpg"
          alt="Savons naturels CDSI"
          className="size-full object-contain bg-white"
        />
        <img
          src="/images/produits/confiture-ananas-melon.jpg"
          alt="Confitures et marmelades CDSI"
          className="size-full object-contain bg-white"
        />
        <img
          src="/images/produits/creme-capillaire.jpg"
          alt="Crème capillaire au beurre d'avocat"
          className="size-full object-contain bg-white"
        />
        <img
          src="/images/produits/sac-dos-bleu.jpg"
          alt="Sac à dos wax Boutique SAK"
          className="size-full object-contain bg-white"
        />
      </div>
    </div>
  );
}

export function CollectionArt({ variant }: { variant: "tourvert" | "sak" }) {
  const src =
    variant === "tourvert"
      ? "/images/produits/collection-tourvert.jpg"
      : "/images/produits/collection-sak.jpg";
  const alt = variant === "tourvert" ? "Collection TOUR'VERT" : "Boutique SAK";
  return (
    <div className="absolute inset-0">
      <img src={src} alt={alt} className="size-full object-cover" />
    </div>
  );
}
