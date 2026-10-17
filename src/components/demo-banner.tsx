import { siteConfig } from "@/data/site-config";

export function DemoBanner() {
  if (!siteConfig.isDemo) return null;
  return (
    <div className="bg-ochre px-4 py-2 text-center text-sm font-semibold text-charcoal">
      Site de démonstration — produits, prix et informations présentés à titre illustratif.
    </div>
  );
}
