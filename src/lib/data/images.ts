/**
 * Images du site.
 * Les fichiers actuels sont des illustrations vectorielles générées par
 * scripts/images.mjs. Remplace n'importe lequel par ta propre image
 * (capture du serveur, du panel…) en gardant le même nom, ou change le chemin ici.
 */
export interface SiteImage {
  src: string;
  alt: string;
  /** Point de cadrage (object-position CSS) quand l'image est recadrée. */
  position?: string;
}

export const images = {
  hero: { src: "/images/hero-accueil.jpg", alt: "Route bordée de palmiers au coucher du soleil, la ville à l'horizon" },
  showcase1: { src: "/images/showcase-ville.jpg", alt: "Le centre-ville illuminé la nuit" },
  showcase2: { src: "/images/showcase-police.jpg", alt: "Voiture de police, gyrophares allumés, dans la circulation de nuit", position: "42% 50%" },
  showcase3: { src: "/images/showcase-panel.svg", alt: "Le panel de gestion" },
  showcase4: { src: "/images/showcase-discord.svg", alt: "Le Discord généré" },
  featureServer: { src: "/images/feature-serveur.svg", alt: "Serveur de jeu" },
  featureJobs: { src: "/images/feature-jobs.jpg", alt: "Ambulance en intervention dans la circulation" },
  featureEconomy: { src: "/images/feature-economie.svg", alt: "Économie" },
  featureDiscord: { src: "/images/feature-discord.svg", alt: "Discord automatique" },
  featureSite: { src: "/images/feature-site.svg", alt: "Site web" },
  featureAi: { src: "/images/feature-ia.svg", alt: "IA de gestion" },
  includedGangs: { src: "/images/inclus-gangs.jpg", alt: "Façade d'immeuble couverte de graffitis" },
  includedHousing: { src: "/images/inclus-immobilier.jpg", alt: "Villa moderne avec jardin et bassin" },
  includedHeists: { src: "/images/inclus-braquages.jpg", alt: "Façade d'une banque historique", position: "50% 75%" },
  includedBackups: { src: "/images/inclus-sauvegardes.svg", alt: "Sauvegardes" },
  includedRepair: { src: "/images/inclus-reparation.svg", alt: "Réparation automatique" },
  finalCta: { src: "/images/final-noir-et-blanc.jpg", alt: "Route de nuit, traînées de phares" },
  about: { src: "/images/a-propos.jpg", alt: "Bureau de nuit éclairé en rouge, écran et ordinateur portable", position: "50% 62%" },
  community: { src: "/images/communaute.jpg", alt: "Foule sous des lasers verts pendant un concert" },
} as const satisfies Record<string, SiteImage>;

export type ImageKey = keyof typeof images;
