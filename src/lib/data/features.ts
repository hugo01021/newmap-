import type { Dictionary } from "../i18n/dictionaries";
import type { ImageKey } from "./images";

/** Les adresses des pages de fonctionnalités (stables, quelle que soit la langue). */
export const featureSlugs = ["serveur-de-jeu", "jobs-et-factions", "economie", "discord-automatique", "site-web", "ia-de-gestion", "protection-anti-attaques"] as const;
export type FeatureSlug = (typeof featureSlugs)[number];

export interface Feature {
  slug: FeatureSlug;
  label: string;
  title: string;
  intro: string;
  points: string[];
  image: ImageKey;
  /** false : absente du méga-menu (grille de six), mais présente partout ailleurs. */
  menu?: boolean;
}

const meta: Record<FeatureSlug, { image: ImageKey; menu?: boolean }> = {
  "serveur-de-jeu": { image: "featureServer" },
  "jobs-et-factions": { image: "featureJobs" },
  economie: { image: "featureEconomy" },
  "discord-automatique": { image: "featureDiscord" },
  "site-web": { image: "featureSite" },
  "ia-de-gestion": { image: "featureAi" },
  "protection-anti-attaques": { image: "includedProtection", menu: false },
};

export const isFeatureSlug = (value: string): value is FeatureSlug => (featureSlugs as readonly string[]).includes(value);

/** Les fonctionnalités avec leurs textes dans la langue du dictionnaire. */
export function localizedFeatures(t: Dictionary): Feature[] {
  return featureSlugs.map((slug) => ({ slug, ...meta[slug], ...t.pages.features[slug] }));
}

export const menuFeatures = (t: Dictionary) => localizedFeatures(t).filter((f) => f.menu !== false);
