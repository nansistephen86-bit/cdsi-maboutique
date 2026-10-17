import { Link } from "@tanstack/react-router";
import { CollectionArt } from "@/components/product-art";
import { Button } from "@/components/ui/button";

export function CategoryCard({
  title,
  subtitle,
  to,
  variant,
}: {
  title: string;
  subtitle: string;
  to: "/tourvert" | "/boutique-sak";
  variant: "tourvert" | "sak";
}) {
  return (
    <Link
      to={to}
      className="group relative isolate flex min-h-[260px] items-end overflow-hidden rounded-md text-white"
    >
      <CollectionArt variant={variant} />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
      <div className="relative z-10 p-6">
        <h3 className="mb-1 text-white">{title}</h3>
        <p className="mb-4 text-sand">{subtitle}</p>
        <Button variant="ochre" size="sm" tabIndex={-1}>
          Découvrir
        </Button>
      </div>
    </Link>
  );
}
