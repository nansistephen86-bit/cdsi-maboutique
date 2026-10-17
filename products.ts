export type Category = {
  slug: string;
  label: string;
  collection?: "tourvert" | "sak";
};

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  available: boolean;
  colors: string[];
  sizes: string[];
  highlights?: string[];
  format?: string;
};

export const categories: Category[] = [
  { slug: "tous", label: "Tous" },
  { slug: "savons", label: "Savons", collection: "tourvert" },
  { slug: "confitures", label: "Confitures", collection: "tourvert" },
  { slug: "soins", label: "Soins", collection: "tourvert" },
  { slug: "senteurs", label: "Senteurs", collection: "sak" },
  { slug: "encens", label: "Thiouraay", collection: "sak" },
  { slug: "sacs", label: "Sacs à dos", collection: "sak" },
  { slug: "accessoires", label: "Accessoires", collection: "sak" },
];

const confitureHighlights = [
  "Sans colorants artificiels",
  "Sans conservateurs chimiques",
  "Fruits locaux soigneusement sélectionnés",
  "Un savoir-faire artisanal",
];

export const products: Product[] = [
  {
    id: "sak-evantail-1",
    name: "Éventail artisanal",
    category: "accessoires",
    price: 3000,
    description:
      "Éventail artisanal élégant et coloré de la collection SAK, idéal pour se rafraîchir avec style au quotidien.",
    image: "/images/produits/evantail-1.jpg",
    available: true,
    colors: [],
    sizes: [],
    highlights: [
      "Confection artisanale",
      "Léger et pratique",
      "Design unique SAK",
    ],
  },
  {
    id: "sak-evantail-2",
    name: "Éventail artisanal (Modèle 2)",
    category: "accessoires",
    price: 3000,
    description:
      "Éventail artisanal élégant et coloré de la collection SAK, idéal pour se rafraîchir avec style au quotidien.",
    image: "/images/produits/evantail-2.jpg",
    available: true,
    colors: [],
    sizes: [],
    highlights: [
      "Confection artisanale",
      "Léger et pratique",
      "Design unique SAK",
    ],
  },
  {
    id: "sv-ordinaire",
    name: "Savon ordinaire",
    category: "savons",
    price: 1000,
    format: "Rectangle",
    description:
      "Savon quotidien 100 % naturel. Simple, efficace, sans produits chimiques agressifs. Idéal pour toute la famille.",
    image: "/images/produits/savon-ordinaire.jpg",
    available: true,
    colors: [],
    sizes: [],
    highlights: [
      "Nettoie en profondeur",
      "Respecte tous les types de peau",
      "Sans produits chimiques agressifs",
      "Un choix sain pour vous et pour l'environnement",
    ],
  },
  {
    id: "sv-lait-riz",
    name: "Savon au lait de riz",
    category: "savons",
    price: 1000,
    format: "Rectangle",
    description:
      "Savon au lait de riz pour un teint unifié, une peau hydratée, douce et lumineuse. Convient à tous les types de peau.",
    image: "/images/produits/savon-lait-riz.jpg",
    available: true,
    colors: [],
    sizes: [],
    highlights: [
      "Unifie le teint",
      "Hydrate la peau",
      "Rend la peau douce et lumineuse",
      "Idéal pour tous les types de peau",
    ],
  },
  {
    id: "sv-mberbef",
    name: "Savon Mbërbëf",
    category: "savons",
    price: 1500,
    format: "Triangle",
    description:
      "Savon triangulaire au mbërbëf : pureté et protection. Nettoie en profondeur, aide à lutter contre les imperfections et laisse une sensation de fraîcheur.",
    image: "/images/produits/savon-mberbef.jpg",
    available: true,
    colors: [],
    sizes: [],
    highlights: [
      "Nettoie en profondeur",
      "Aide à lutter contre les imperfections",
      "Purifie la peau",
      "Laisse une sensation de fraîcheur",
    ],
  },
  {
    id: "sv-carotte-miel",
    name: "Savon carotte / miel",
    category: "savons",
    price: 1500,
    format: "Triangle",
    description:
      "Savon triangulaire à la carotte et au miel, enrichi de curcuma et de henné. Illumine le teint et aide à réduire les taches.",
    image: "/images/produits/savon-carotte-miel.jpg",
    available: true,
    colors: [],
    sizes: [],
    highlights: [
      "Illumine le teint",
      "Aide à réduire les taches",
      "Purifie et tonifie la peau",
      "Apporte un effet bonne mine naturel",
    ],
  },
  {
    id: "sv-goowe",
    name: "Savon Goowé",
    category: "savons",
    price: 1000,
    format: "Rectangle",
    description:
      "Savon au goowé, pour une peau douce et veloutée. Pureté, protection et une touche de mystère inspirée des traditions sénégalaises.",
    image: "/images/produits/savon-goowe.jpg",
    available: true,
    colors: [],
    sizes: [],
    highlights: [
      "Nettoie en profondeur",
      "Lutte contre les imperfections",
      "Purifie la peau",
      "Sensation de fraîcheur",
    ],
  },
  {
    id: "sv-citron",
    name: "Savon citron / menthe",
    category: "savons",
    price: 1000,
    format: "Rectangle",
    description:
      "Savon au citron et à la menthe (citronnelle). Fraîcheur et éclat : tonifie la peau, aide à réduire l'excès de sébum et laisse un parfum agréable.",
    image: "/images/produits/savon-citron.jpg",
    available: true,
    colors: [],
    sizes: [],
    highlights: [
      "Tonifie et rafraîchit la peau",
      "Aide à réduire l'excès de sébum",
      "Lutte contre les mauvaises odeurs",
      "Laisse un parfum agréable et durable",
    ],
  },
  {
    id: "sv-carotte",
    name: "Savon à la carotte",
    category: "savons",
    price: 1000,
    format: "Rectangle",
    description:
      "Savon à la carotte, riche en bêta-carotène. Illumine le teint, nourrit la peau et aide à atténuer les taches.",
    image: "/images/produits/savon-carotte.jpg",
    available: true,
    colors: [],
    sizes: [],
    highlights: [
      "Éclat et bonne mine",
      "Illumine le teint",
      "Aide à atténuer les taches",
      "Nourrit et adoucit",
    ],
  },
  {
    id: "sv-bissap",
    name: "Savon au bissap rouge",
    category: "savons",
    price: 1000,
    format: "Rectangle",
    description:
      "Savon au bissap rouge, riche en antioxydants. Tonifie, revitalise, et laisse une peau douce, lumineuse et un teint frais.",
    image: "/images/produits/savon-bissap.jpeg",
    available: true,
    colors: [],
    sizes: [],
    highlights: [
      "Riche en antioxydants",
      "Tonifie et revitalise la peau",
      "Aide à lutter contre le vieillissement cutané",
      "Laisse une peau douce et lumineuse",
    ],
  },
  {
    id: "cf-ananas-melon",
    name: "Marmelade ananas / melon / pastèque",
    category: "confitures",
    price: 2000,
    description:
      "Marmelade artisanale ananas, melon et pastèque — les gourmandises de la Tour, sans colorant artificiel ni conservateur chimique.",
    image: "/images/produits/confiture-ananas-melon.jpg",
    available: true,
    colors: [],
    sizes: [],
    highlights: confitureHighlights,
  },
  {
    id: "cf-fraises-ananas",
    name: "Confiture fraises / ananas",
    category: "confitures",
    price: 2000,
    description:
      "Confiture artisanale fraises et ananas, préparée à partir de fruits locaux soigneusement sélectionnés.",
    image: "/images/produits/confiture-fraises-ananas.jpg",
    available: true,
    colors: [],
    sizes: [],
    highlights: confitureHighlights,
  },
  {
    id: "cf-agrumes",
    name: "Confiture agrumes",
    category: "confitures",
    price: 2000,
    description:
      "Confiture d'agrumes au savoir-faire artisanal, pour une alimentation saine et savoureuse.",
    image: "/images/produits/confiture-agrumes.jpg",
    available: true,
    colors: [],
    sizes: [],
    highlights: confitureHighlights,
  },
  {
    id: "cf-exotique",
    name: "Confiture exotique",
    category: "confitures",
    price: 2000,
    description:
      "Confiture exotique aux fruits du terroir sénégalais. Un goût de chez nous, à partager en famille.",
    image: "/images/produits/confiture-exotique.jpg",
    available: true,
    colors: [],
    sizes: [],
    highlights: confitureHighlights,
  },
  {
    id: "cf-patate-bouye",
    name: "Marmelade patate douce / bouyé",
    category: "confitures",
    price: 2000,
    description:
      "Marmelade patate douce et bouyé (pain de singe), une recette locale unique des ateliers du CDSI.",
    image: "/images/produits/confiture-patate-bouye.jpg",
    available: true,
    colors: [],
    sizes: [],
    highlights: confitureHighlights,
  },
  {
    id: "cf-mangue",
    name: "Marmelade mangue",
    category: "confitures",
    price: 2000,
    description:
      "Marmelade de mangue, 100 % naturelle, riche en fruits locaux. Made in Sénégal, avec cœur.",
    image: "/images/produits/confiture-mangue.jpg",
    available: true,
    colors: [],
    sizes: [],
    highlights: confitureHighlights,
  },
  {
    id: "tr-marinade",
    name: "Marinade",
    category: "confitures",
    price: 3000,
    description:
      "Marinade artisanale préparée par les ateliers de transformation du CDSI, à base de produits locaux.",
    image: "/images/produits/marinade.jpg",
    available: true,
    colors: [],
    sizes: [],
  },
  {
    id: "so-creme-avocat",
    name: "Crème capillaire au beurre d'avocat",
    category: "soins",
    price: 4500,
    description:
      "Soin complet pour des cheveux plus forts, plus doux et éclatants. Beurre d'avocat, cire d'abeilles, huile d'argan, huile de ricin et huile d'amande douce. Sans paraben, sans sulfate, sans silicone.",
    image: "/images/produits/creme-capillaire.jpg",
    available: true,
    colors: [],
    sizes: [],
    highlights: [
      "Nourrit en profondeur",
      "Favorise la pousse",
      "Apporte brillance et souplesse",
      "Protège et répare",
      "Idéale pour cheveux secs, fragiles ou abîmés",
    ],
  },
  {
    id: "st-agrumes",
    name: "Senteur aux agrumes",
    category: "senteurs",
    price: 5000,
    description:
      "Parfum d'ambiance SAK by Sateou aux agrumes. Fraîcheur naturelle pour la maison, le linge et les espaces de travail. Élimine les mauvaises odeurs.",
    image: "/images/produits/senteur-agrumes.jpg",
    available: true,
    colors: [],
    sizes: [],
    highlights: [
      "Parfum frais et naturel",
      "Élimine les mauvaises odeurs",
      "Ambiance agréable et énergisante",
      "Sans produits chimiques agressifs",
    ],
  },
  {
    id: "st-goowe",
    name: "Senteur Goowé — Éclat sauvage",
    category: "senteurs",
    price: 5000,
    description:
      "Parfum d'ambiance et de linge au goowé. Chaleur et tradition : une touche d'authenticité qui respire le Sénégal.",
    image: "/images/produits/senteur-goowe.jpg",
    available: true,
    colors: [],
    sizes: [],
    highlights: [
      "Parfum naturel et authentique",
      "Élimine les mauvaises odeurs",
      "Atmosphère chaleureuse et accueillante",
      "Idéal pour la maison, le linge et vos espaces de vie",
    ],
  },
  {
    id: "st-vetiver",
    name: "Senteur vétiver — Éclat sauvage",
    category: "senteurs",
    price: 5000,
    description:
      "Parfum d'ambiance et de linge au vétiver. Fraîcheur et sérénité : une atmosphère apaisante, naturellement élégante.",
    image: "/images/produits/senteur-vetiver.jpg",
    available: true,
    colors: [],
    sizes: [],
    highlights: [
      "Parfum boisé et apaisant",
      "Purifie l'air et neutralise les odeurs",
      "Ambiance calme et relaxante",
      "Idéal pour la maison, le linge et le travail",
    ],
  },
  {
    id: "th-eclat-sauvage",
    name: "Thiouraay Éclat sauvage",
    category: "encens",
    price: 5000,
    description:
      "Thiouraay — l'encens témoin des secrets des joongoma. Purifie l'atmosphère, apaise l'esprit et crée une ambiance spirituelle et harmonieuse. SAK by Sateou.",
    image: "/images/produits/thiouraay.jpg",
    available: true,
    colors: [],
    sizes: [],
    highlights: [
      "Purifie l'atmosphère",
      "Apaise l'esprit et réduit le stress",
      "Héritage des savoirs ancestraux",
      "Un lien avec nos racines africaines",
    ],
  },
  {
    id: "sac-dos-bleu",
    name: "Sac à dos wax bleu",
    category: "sacs",
    price: 15000,
    description:
      "Sac à dos en tissu wax bleu et or, rabat et finitions en cuir noir. Poche avant zippée, cordon et boucle métallique. Confection artisanale SAK.",
    image: "/images/produits/sac-dos-bleu.jpg",
    available: true,
    colors: [],
    sizes: [],
    highlights: [
      "Tissu wax authentique",
      "Rabat et finitions en cuir",
      "Poche avant zippée",
      "Cordon et boucle métallique",
      "Fabriqué à la main au Sénégal",
    ],
  },
  {
    id: "sac-dos-wax-orange",
    name: "Sac à dos wax orange",
    category: "sacs",
    price: 15000,
    description:
      "Sac à dos en wax orange, noir et blanc, motifs figuratifs. Rabat cuir, poche avant zippée et cordon à boucle. Pièce unique artisanale.",
    image: "/images/produits/sac-dos-wax-orange.jpg",
    available: true,
    colors: [],
    sizes: [],
    highlights: [
      "Tissu wax authentique",
      "Rabat et finitions en cuir",
      "Poche avant zippée",
      "Cordon et boucle métallique",
      "Fabriqué à la main au Sénégal",
    ],
  },
  {
    id: "sac-dos-rose",
    name: "Sac à dos wax rose",
    category: "sacs",
    price: 15000,
    description:
      "Sac à dos en wax rose, jaune et noir, motif écailles. Rabat cuir noir, poche avant et cordon à boucle. Confection SAK by Sateou.",
    image: "/images/produits/sac-dos-rose.jpg",
    available: true,
    colors: [],
    sizes: [],
    highlights: [
      "Tissu wax authentique",
      "Rabat et finitions en cuir",
      "Poche avant zippée",
      "Cordon et boucle métallique",
      "Fabriqué à la main au Sénégal",
    ],
  },
  {
    id: "sac-dos-orange-noir",
    name: "Sac à dos wax orange et noir",
    category: "sacs",
    price: 15000,
    description:
      "Sac à dos en wax orange et noir, motifs graphiques blancs. Rabat cuir, poche avant zippée, cordon et boucle. Fabriqué à la main à Dakar.",
    image: "/images/produits/sac-dos-orange-noir.jpg",
    available: true,
    colors: [],
    sizes: [],
    highlights: [
      "Tissu wax authentique",
      "Rabat et finitions en cuir",
      "Poche avant zippée",
      "Cordon et boucle métallique",
      "Fabriqué à la main au Sénégal",
    ],
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  if (!categorySlug || categorySlug === "tous") return products;
  return products.filter((p) => p.category === categorySlug);
}

export function getProductsByCollection(collection: "tourvert" | "sak"): Product[] {
  const slugs = categories.filter((c) => c.collection === collection).map((c) => c.slug);
  return products.filter((p) => slugs.includes(p.category));
}

export function getCategoryLabel(slug: string): string {
  return categories.find((c) => c.slug === slug)?.label ?? slug;
}

export const FEATURED_IDS = [
  "sv-ordinaire",
  "sv-goowe",
  "so-creme-avocat",
  "cf-ananas-melon",
] as const;