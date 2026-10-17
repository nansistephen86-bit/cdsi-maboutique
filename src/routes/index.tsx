import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CookingPot,
  Droplets,
  GraduationCap,
  Leaf,
  ShoppingBag,
  Store,
} from "lucide-react";
import { CategoryCard } from "@/components/category-card";
import { HeroVisual } from "@/components/product-art";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { products, FEATURED_IDS } from "@/data/products";
import { siteConfig } from "@/data/site-config";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [{ title: "CDSI — Centre de Développement Solidaire et Inclusif" }],
  }),
});

const activities = [
  {
    icon: GraduationCap,
    title: "Formation",
    text: "Programmes de formation professionnelle et entrepreneuriale, ouverts à tous.",
  },
  {
    icon: Droplets,
    title: "Savonnerie",
    text: "Fabrication artisanale de savons naturels : ordinaire, lait de riz, mbërbëf, goowé, citron, carotte, bissap.",
  },
  {
    icon: ShoppingBag,
    title: "Artisanat",
    text: "Sacs à dos en wax, senteurs d'ambiance et thiouraay — SAK by Sateou.",
  },
  {
    icon: CookingPot,
    title: "Transformation agroalimentaire",
    text: "Confitures, jus et huiles issus de produits locaux.",
  },
  {
    icon: Leaf,
    title: "Maraîchage",
    text: "Culture de légumes et pépinière au service de l'autonomie alimentaire.",
  },
  {
    icon: Store,
    title: "E-commerce",
    text: "Vente en ligne des créations et produits transformés du centre.",
  },
];

const values = [
  { title: "Produits artisanaux", text: "Chaque pièce est façonnée à la main, avec soin et patience." },
  { title: "Savoir-faire local", text: "Des techniques transmises et perfectionnées à Dakar." },
  { title: "Projet solidaire", text: "Votre achat soutient une dynamique d'inclusion sociale." },
  { title: "Qualité", text: "Des matières choisies et un contrôle attentif à chaque étape." },
  { title: "Impact social", text: "Formation, emploi et autonomie pour la communauté." },
];

function Home() {
  const featured = FEATURED_IDS.map((id) => products.find((p) => p.id === id)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p),
  );

  return (
    <>
      <section className="relative overflow-hidden px-5 py-10 md:py-14">
        <div className="mx-auto grid max-w-[1140px] items-center gap-10 md:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-xl">
            <p className="mb-1 font-display text-[1.05rem] text-ochre-dark italic">
              Centre de Développement Solidaire et Inclusif
            </p>
            <h1 className="text-display font-medium text-forest-dark">{siteConfig.slogan}</h1>
            <p className="mt-3 text-charcoal-soft">
              Découvrez les initiatives et produits du Centre de Développement Solidaire et
              Inclusif.
            </p>
            <div className="mt-7 flex flex-wrap gap-3.5">
              <Button asChild>
                <Link to="/boutique">Découvrir nos produits</Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link to="/a-propos">Découvrir le CDSI</Link>
              </Button>
            </div>
          </div>
          <HeroVisual />
        </div>
      </section>

      <div className="woven-divider" aria-hidden="true" />

      <section className="px-5 py-16">
        <div className="mx-auto max-w-[1140px]">
          <div className="mb-9 max-w-xl">
            <p className="mb-1 font-display text-[1.05rem] text-ochre-dark italic">
              Nos collections
            </p>
            <h2 className="text-title">Deux univers, un même engagement</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <CategoryCard
              title="TOUR'VERT"
              subtitle="Savons, confitures et soins naturels"
              to="/tourvert"
              variant="tourvert"
            />
            <CategoryCard
              title="Boutique SAK"
              subtitle="Sacs à dos, senteurs et thiouraay"
              to="/boutique-sak"
              variant="sak"
            />
          </div>
        </div>
      </section>

      <section className="bg-sand px-5 py-16">
        <div className="mx-auto max-w-[1140px]">
          <div className="mb-9 max-w-xl">
            <p className="mb-1 font-display text-[1.05rem] text-ochre-dark italic">
              Qui sommes-nous ?
            </p>
            <h2 className="text-title">Une structure au service de l'inclusion</h2>
          </div>
          <p className="mb-6 max-w-[720px] text-charcoal">
            Le CDSI accompagne des femmes et des hommes à Dakar à travers la formation, l'artisanat
            et l'entrepreneuriat solidaire. De la savonnerie à la transformation agroalimentaire, en
            passant par le maraîchage et l'e-commerce, chaque activité vise un même objectif : créer
            des opportunités concrètes et durables pour la communauté.
          </p>
          <Button variant="secondary" asChild>
            <Link to="/a-propos">En savoir plus sur le CDSI</Link>
          </Button>
        </div>
      </section>

      <section className="px-5 py-16">
        <div className="mx-auto max-w-[1140px]">
          <div className="mb-9 max-w-xl">
            <p className="mb-1 font-display text-[1.05rem] text-ochre-dark italic">Nos activités</p>
            <h2 className="text-title">Un centre, plusieurs savoir-faire</h2>
          </div>
          <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2 lg:grid-cols-3">
            {activities.map((a) => (
              <div
                key={a.title}
                className="rounded-md border border-sand-dark bg-white p-6"
              >
                <div className="mb-3.5 flex size-11 items-center justify-center rounded-full bg-sand text-forest">
                  <a.icon className="size-5" strokeWidth={1.8} />
                </div>
                <h3 className="text-xl">{a.title}</h3>
                <p className="mb-0 text-charcoal-soft">{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sand px-5 py-16">
        <div className="mx-auto max-w-[1140px]">
          <div className="mb-9 max-w-xl">
            <p className="mb-1 font-display text-[1.05rem] text-ochre-dark italic">Sélection</p>
            <h2 className="text-title">Quelques produits du moment</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button asChild>
              <Link to="/boutique">Voir toute la boutique</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="px-5 py-16">
        <div className="mx-auto max-w-[1140px]">
          <div className="mb-9 max-w-xl">
            <p className="mb-1 font-display text-[1.05rem] text-ochre-dark italic">
              Nos engagements
            </p>
            <h2 className="text-title">Pourquoi choisir nos produits ?</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {values.map((v) => (
              <div key={v.title} className="border-t-[3px] border-ochre pt-3.5">
                <h3 className="text-xl">{v.title}</h3>
                <p className="mb-0 text-charcoal-soft">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-forest px-5 py-16 text-center text-cream">
        <div className="mx-auto max-w-[1140px]">
          <h2 className="text-title text-cream">Envie de découvrir nos créations ?</h2>
          <p className="mb-6 text-sand">
            Parcourez notre boutique, payez par Wave ou Orange Money, et recevez votre commande à
            Dakar pour 2 000 FCFA.
          </p>
          <Button variant="ochre" asChild>
            <Link to="/boutique">Aller à la boutique</Link>
          </Button>
        </div>
      </section>

      <section className="px-5 py-16">
        <div className="mx-auto max-w-[1140px]">
          <div className="rounded-md border border-sand-dark bg-white p-7">
            <p className="mb-1 font-display text-[1.05rem] text-ochre-dark italic">Contact</p>
            <h2 className="mt-0 text-title">Une question ? Écrivez-nous</h2>
            <p className="mb-1">{siteConfig.adresse}</p>
            <p>
              Tél / WhatsApp : {siteConfig.telephone} · {siteConfig.email}
            </p>
            <Button variant="secondary" asChild>
              <Link to="/contact">Voir la page contact</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
