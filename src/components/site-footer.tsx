import { Link } from "@tanstack/react-router";
import { siteConfig } from "@/data/site-config";

export function SiteFooter() {
  return (
    <footer className="bg-forest-dark px-5 pt-12 pb-24 text-sand md:pb-8">
      <div className="mx-auto max-w-[1140px]">
        {siteConfig.isDemo && (
          <p className="mb-5 rounded-sm border border-ochre/40 bg-ochre/15 p-3.5 text-[0.82rem] text-sand">
            Version démonstration — les produits, prix et informations commerciales présentés
            peuvent être fictifs et seront remplacés après validation par CDSI.
          </p>
        )}

        <div className="mb-6 grid grid-cols-1 gap-7 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <h4 className="mb-3.5 font-sans text-[0.95rem] font-bold text-cream">
              {siteConfig.nomCourt}
            </h4>
            <p className="text-sand">{siteConfig.nomComplet}</p>
            <p className="text-sand">{siteConfig.adresse}</p>
          </div>

          <div>
            <h4 className="mb-3.5 font-sans text-[0.95rem] font-bold text-cream">Liens utiles</h4>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
              <li>
                <Link to="/a-propos" className="text-sand hover:text-cream">
                  À propos du CDSI
                </Link>
              </li>
              <li>
                <Link to="/boutique" className="text-sand hover:text-cream">
                  Boutique
                </Link>
              </li>
              <li>
                <Link to="/compte" className="text-sand hover:text-cream">
                  Mes commandes
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sand hover:text-cream">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3.5 font-sans text-[0.95rem] font-bold text-cream">Contact</h4>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0 text-sand">
              <li>Tél / WhatsApp : {siteConfig.telephone}</li>
              <li>{siteConfig.email}</li>
              <li>
                {siteConfig.instagramHandle} · {siteConfig.facebookHandle}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cream/15 pt-5 text-[0.82rem] text-cream/70">
          © {new Date().getFullYear()} {siteConfig.nomCourt} — {siteConfig.nomComplet}
        </div>
      </div>
    </footer>
  );
}
