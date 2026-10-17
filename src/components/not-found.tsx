import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function NotFound() {
  return (
    <section className="px-5 py-16">
      <div className="mx-auto max-w-[1140px] text-center">
        <p className="font-display text-ochre-dark italic">Erreur 404</p>
        <h1 className="text-display font-medium">Page introuvable</h1>
        <p className="mx-auto mb-6 max-w-md text-charcoal-soft">
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <Button asChild>
          <Link to="/">Retour à l'accueil</Link>
        </Button>
      </div>
    </section>
  );
}
