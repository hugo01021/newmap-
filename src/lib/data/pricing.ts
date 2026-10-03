import type { PlanId, PlayerCount } from "../types";

export interface Plan {
  id: PlanId;
  name: string;
  players: PlayerCount;
  /** Prix mensuel TTC affiché. */
  monthly: number;
  /** Coût mensuel estimé de la machine chez l'hébergeur (suivi des marges, non affiché). */
  hostingCost: number;
  tagline: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
}

/**
 * Grille : prix = coût estimé de la machine + marge.
 *   32 joueurs : 12 € + 10 € = 22 €
 *   64 joueurs : 25 € + 15 € = 40 €
 *  128 joueurs : 45 € + 20 € = 65 €
 *  256 joueurs : 80 € + 30 € = 110 €
 * Vérifie les coûts réels chez l'hébergeur avant le lancement, puis ajuste ici.
 */
export const plans: Plan[] = [
  {
    id: "p32",
    name: "32 joueurs",
    players: 32,
    monthly: 22,
    hostingCost: 12,
    tagline: "Pour lancer une première communauté, sans risque.",
    features: [
      "Serveur jusqu'à 32 joueurs",
      "Création complète par IA",
      "Panel et IA de gestion",
      "Discord automatique",
      "Site web du serveur",
      "Sauvegardes quotidiennes",
    ],
    cta: "Choisir 32 joueurs",
  },
  {
    id: "p64",
    name: "64 joueurs",
    players: 64,
    monthly: 40,
    hostingCost: 25,
    tagline: "Le format classique d'un serveur RP qui tourne bien.",
    features: [
      "Serveur jusqu'à 64 joueurs",
      "Machine plus puissante",
      "Tout ce que comprend l'offre 32 joueurs",
      "Sauvegardes toutes les heures",
      "Support prioritaire",
    ],
    highlighted: true,
    cta: "Choisir 64 joueurs",
  },
  {
    id: "p128",
    name: "128 joueurs",
    players: 128,
    monthly: 65,
    hostingCost: 45,
    tagline: "Une vraie ville animée, pour une communauté installée.",
    features: [
      "Serveur jusqu'à 128 joueurs",
      "Machine dédiée haute performance",
      "Tout ce que comprend l'offre 64 joueurs",
      "Sauvegardes toutes les heures",
      "Support prioritaire",
    ],
    cta: "Choisir 128 joueurs",
  },
  {
    id: "p256",
    name: "256 joueurs",
    players: 256,
    monthly: 110,
    hostingCost: 80,
    tagline: "Grande échelle, pour les projets ambitieux.",
    features: [
      "Serveur jusqu'à 256 joueurs",
      "Machine dédiée la plus puissante",
      "Tout ce que comprend l'offre 128 joueurs",
      "Accompagnement au lancement",
      "Support prioritaire",
    ],
    cta: "Choisir 256 joueurs",
  },
];

export const isPlanId = (value: unknown): value is PlanId => plans.some((p) => p.id === value);

/** L'offre qui correspond au nombre de joueurs choisi dans le parcours. */
export const planForPlayers = (players: PlayerCount): Plan => plans.find((p) => p.players === players) ?? plans[1];

export const formatEuro = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
