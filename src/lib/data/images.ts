/**
 * Emplacements d'images.
 * Remplace les fichiers dans /public/images en gardant le même nom
 * (ou change simplement le chemin ici). Les fichiers actuels sont des
 * placeholders SVG générés : scripts/placeholders.mjs.
 */
export const images = {
  hero: { src: "/images/hero-accueil.svg", alt: "Vue du serveur au coucher du soleil" },
  showcase1: { src: "/images/showcase-ville.svg", alt: "La ville de nuit" },
  showcase2: { src: "/images/showcase-police.svg", alt: "Intervention de police" },
  showcase3: { src: "/images/showcase-panel.svg", alt: "Le panel de gestion" },
  showcase4: { src: "/images/showcase-discord.svg", alt: "Le Discord généré" },
  featureServer: { src: "/images/feature-serveur.svg", alt: "Serveur de jeu" },
  featureJobs: { src: "/images/feature-jobs.svg", alt: "Jobs et factions" },
  featureEconomy: { src: "/images/feature-economie.svg", alt: "Économie" },
  featureDiscord: { src: "/images/feature-discord.svg", alt: "Discord automatique" },
  featureSite: { src: "/images/feature-site.svg", alt: "Site web" },
  featureAi: { src: "/images/feature-ia.svg", alt: "IA de gestion" },
  includedGangs: { src: "/images/inclus-gangs.svg", alt: "Gangs" },
  includedHousing: { src: "/images/inclus-immobilier.svg", alt: "Immobilier" },
  includedHeists: { src: "/images/inclus-braquages.svg", alt: "Braquages" },
  includedBackups: { src: "/images/inclus-sauvegardes.svg", alt: "Sauvegardes" },
  includedRepair: { src: "/images/inclus-reparation.svg", alt: "Réparation automatique" },
  finalCta: { src: "/images/final-noir-et-blanc.svg", alt: "Rue déserte en noir et blanc" },
  about: { src: "/images/a-propos.svg", alt: "L'équipe ServCraft" },
  community: { src: "/images/communaute.svg", alt: "La communauté" },
} as const;

export type ImageKey = keyof typeof images;
