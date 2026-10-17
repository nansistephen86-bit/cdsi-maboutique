import { createFileRoute } from "@tanstack/react-router";
import {
  CookingPot,
  Droplets,
  GraduationCap,
  HeartHandshake,
  HeartPulse,
  Leaf,
  PawPrint,
  Scale,
  ShoppingBag,
  Sparkles,
  Sprout,
  Store,
} from "lucide-react";
import { siteConfig } from "@/data/site-config";

export const Route = createFileRoute("/activites")({
  component: Activities,
  head: () => ({
    meta: [{ title: `Nos activités — ${siteConfig.nomCourt}` }],
  }),
});

const activities = [
  {
    icon: GraduationCap,
    title: "Formation",
    text: "Formations professionnelles et entrepreneuriales destinées à renforcer les compétences et l'autonomie des bénéficiaires.",
  },
  {
    icon: ShoppingBag,
    title: "Artisanat",
    text: "Sacs à dos en wax, senteurs d'ambiance et thiouraay — SAK by Sateou, alliant tradition et créativité.",
  },
  {
    icon: Sparkles,
    title: "Cosmétique",
    text: "Élaboration de soins naturels, dont la crème capillaire au beurre d'avocat, à base d'ingrédients locaux.",
  },
  {
    icon: CookingPot,
    title: "Transformation agroalimentaire",
    text: "Transformation de produits locaux en confitures, jus et huiles de qualité.",
  },
  {
    icon: Droplets,
    title: "Savonnerie",
    text: "Fabrication de savons artisanaux naturels, sous la marque TOUR'VERT.",
  },
  {
    icon: Leaf,
    title: "Maraîchage",
    text: "Culture de légumes destinés à l'autoconsommation et à la vente locale.",
  },
  {
    icon: Sprout,
    title: "Pépinière",
    text: "Production de plants pour soutenir le maraîchage et les initiatives de reboisement.",
  },
  {
    icon: PawPrint,
    title: "Élevage",
    text: "Activités d'élevage complémentaires aux autres filières du centre.",
  },
  {
    icon: Store,
    title: "E-commerce",
    text: "Vente en ligne des produits du centre pour élargir leur portée au-delà de Dakar.",
  },
  {
    icon: HeartHandshake,
    title: "Développement socio-économique",
    text: "Actions favorisant l'autonomisation économique des populations accompagnées.",
  },
  {
    icon: HeartPulse,
    title: "Santé communautaire",
    text: "Sensibilisation et actions de proximité en faveur de la santé des communautés.",
  },
  {
    icon: Scale,
    title: "Équité et accès aux droits",
    text: "Initiatives visant à renforcer l'équité sociale et l'accès aux droits fondamentaux.",
  },
];

function Activities() {
  return (
    <section className="px-5 py-16">
      <div className="mx-auto max-w-[1140px]">
        <div className="mb-9 max-w-xl">
          <p className="mb-1 font-display text-[1.05rem] text-ochre-dark italic">Nos activités</p>
          <h1 className="text-display font-medium">Un centre, plusieurs savoir-faire</h1>
          <p className="text-charcoal-soft">
            Le CDSI développe des activités complémentaires, au service de l'inclusion et du
            développement local à Dakar.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map((a) => (
            <div key={a.title} className="rounded-md border border-sand-dark bg-white p-6">
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
  );
}
