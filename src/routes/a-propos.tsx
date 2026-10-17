import { createFileRoute } from "@tanstack/react-router";
import { siteConfig } from "@/data/site-config";

export const Route = createFileRoute("/a-propos")({
  component: About,
  head: () => ({
    meta: [{ title: `À propos — ${siteConfig.nomCourt}` }],
  }),
});

function About() {
  return (
    <section className="px-5 py-16">
      <div className="mx-auto max-w-[820px]">
        <p className="mb-1 font-display text-[1.05rem] text-ochre-dark italic">À propos</p>
        <h1 className="text-display font-medium">{siteConfig.nomComplet}</h1>
        <p>
          Le {siteConfig.nomCourt} est une structure sénégalaise à dimension sociale, inclusive et
          entrepreneuriale, basée à {siteConfig.adresse}. Sa mission est d'accompagner des femmes et
          des hommes vers l'autonomie économique, à travers la formation, l'artisanat et le
          développement de petites activités génératrices de revenus.
        </p>
        <p>
          Le centre intervient dans des domaines variés et complémentaires : formation
          professionnelle, artisanat, cosmétique naturelle, transformation agroalimentaire,
          savonnerie, maraîchage, pépinière, élevage, e-commerce, santé communautaire, ainsi que
          l'équité et l'accès aux droits.
        </p>
        <p>
          Loin d'une logique industrielle, le {siteConfig.nomCourt} met en avant un savoir-faire
          humain, solidaire et artisanal : chaque produit est le fruit d'un travail manuel, porté
          par une équipe engagée pour l'inclusion et le développement local.
        </p>

        <h2 className="mt-10 text-title">Notre approche</h2>
        <ul className="mt-4 flex flex-col gap-3 pl-5 text-charcoal">
          <li>Un accompagnement humain, au plus près des besoins de chacun.</li>
          <li>Des activités génératrices de revenus, ancrées dans le tissu local sénégalais.</li>
          <li>
            Une exigence de qualité, du choix des matières premières à la finition des produits.
          </li>
          <li>Une volonté de rendre l'entrepreneuriat accessible et inclusif.</li>
        </ul>
      </div>
    </section>
  );
}
