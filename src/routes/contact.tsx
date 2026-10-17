import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/data/site-config";
import { buildWhatsAppGenericUrl } from "@/lib/whatsapp";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [{ title: `Contact — ${siteConfig.nomCourt}` }],
  }),
});

function Contact() {
  return (
    <section className="px-5 py-16">
      <div className="mx-auto max-w-[1140px]">
        <p className="mb-1 font-display text-[1.05rem] text-ochre-dark italic">Contact</p>
        <h1 className="text-display font-medium">Discutons de votre projet</h1>
        <p className="mb-9 max-w-xl text-charcoal-soft">
          Une question sur nos produits, une commande, une envie de collaboration ? L'équipe du CDSI
          vous répond avec plaisir.
        </p>

        <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
          <div className="rounded-md border border-sand-dark bg-white p-7">
            <h2 className="mb-1 text-title">{siteConfig.nomCourt}</h2>
            <p className="text-charcoal-soft">{siteConfig.nomComplet}</p>
            <p>{siteConfig.adresse}</p>

            <div className="mb-4 flex gap-3">
              <strong>Téléphone :</strong> <span>{siteConfig.telephone}</span>
            </div>
            <div className="mb-4 flex gap-3">
              <strong>WhatsApp :</strong> <span>{siteConfig.telephone}</span>
            </div>
            <div className="mb-4 flex gap-3">
              <strong>E-mail :</strong>{" "}
              <a href={`mailto:${siteConfig.email}`} className="hover:underline">
                {siteConfig.email}
              </a>
            </div>
            <div className="mb-4 flex flex-col gap-1">
              <strong>Horaires :</strong>
              {siteConfig.horaires.map((h) => (
                <span key={h.jours}>
                  {h.jours} : {h.heures}
                </span>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild>
                <a href={`tel:${siteConfig.telephoneLien}`}>Appeler</a>
              </Button>
              <Button variant="whatsapp" asChild>
                <a
                  href={buildWhatsAppGenericUrl(
                    `Bonjour ${siteConfig.nomCourt}, j'ai une question.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </Button>
              <Button variant="secondary" asChild>
                <a href={`mailto:${siteConfig.email}`}>E-mail</a>
              </Button>
              <Button variant="ochre" asChild>
                <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </Button>
              <Button variant="ochre" asChild>
                <a href={siteConfig.facebook} target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
              </Button>
            </div>
          </div>

          <div className="rounded-md border border-sand-dark bg-white p-7">
            <h2 className="text-title">Livraison à Dakar</h2>
            <p>{siteConfig.livraison.texte}</p>
            <p className="font-display text-lg font-semibold text-forest-dark tabular-nums">
              {new Intl.NumberFormat("fr-FR").format(siteConfig.livraison.forfait)} FCFA
            </p>

            <h2 className="mt-8 text-title">Payer simplement</h2>
            <p>
              Wave, Orange Money ou espèces à la livraison. Vous recevez un numéro de commande
              unique (CDSI-2026-00001) à indiquer comme référence lors du transfert. CDSI vérifie
              ensuite le paiement manuellement — aucune carte bancaire n'est demandée.
            </p>
            <div className="flex flex-col gap-2.5">
              {siteConfig.moyensPaiement.map((m) => (
                <span
                  key={m}
                  className="inline-block w-fit rounded-full bg-sand px-2.5 py-1 text-[0.78rem] font-semibold text-charcoal-soft"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
