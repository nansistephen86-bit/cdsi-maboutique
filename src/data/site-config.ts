export const siteConfig = {
  isDemo: false,

  nomComplet: "Centre de Développement Solidaire et Inclusif",
  nomCourt: "CDSI",
  slogan: "L'inclusion par la formation, l'artisanat et l'entrepreneuriat",

  adresse: "Liberté 6, Dakar, Sénégal",
  telephone: "77 330 83 81",
  telephoneLien: "+221773308381",
  whatsappNumero: "221773308381",
  email: "cdsi.impactsocial1@gmail.com",

  instagram: "https://instagram.com/cdsi_dakar",
  instagramHandle: "@cdsi_dakar",
  facebook: "https://facebook.com/CDSIOfficiel",
  facebookHandle: "CDSI Officiel",

  horaires: [
    { jours: "Lundi – Vendredi", heures: "10h00 – 18h00" },
    { jours: "Samedi", heures: "Fermé" },
    { jours: "Dimanche", heures: "Fermé" },
  ],

  livraison: {
    zone: "Dakar, tous quartiers",
    forfait: 2000,
    texte:
      "Livraison à 2 000 FCFA partout à Dakar, quel que soit le quartier. Le forfait est ajouté automatiquement à votre commande.",
  },

  paiement: {
    numero: "77 330 83 81",
    numeroLien: "221773308381",
  },

  moyensPaiement: ["Wave", "Orange Money", "Espèces à la livraison"] as const,
} as const;

export type SiteConfig = typeof siteConfig;
export type MoyenPaiement = (typeof siteConfig.moyensPaiement)[number];
