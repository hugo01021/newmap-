import type { PlanId } from "../types";

export interface Plan {
  id: PlanId;
  name: string;
  setup: number;
  monthly: number;
  setupPrefix?: string;
  tagline: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
}

export const plans: Plan[] = [
  {
    id: "launch",
    name: "Launch",
    setup: 299,
    monthly: 79,
    tagline: "Pour lancer un premier serveur sérieux, vite et bien.",
    features: [
      "Serveur jusqu'à 64 joueurs",
      "Création complète par IA",
      "Configuration des jobs et de l'économie",
      "Sauvegardes quotidiennes",
      "Surveillance 24h/24",
    ],
    cta: "Choisir Launch",
  },
  {
    id: "pro",
    name: "Pro RP",
    setup: 799,
    monthly: 149,
    tagline: "Le choix des communautés qui veulent durer.",
    features: [
      "Serveur plus puissant, jusqu'à 128 joueurs",
      "Discord automatique synchronisé",
      "Gangs, immobilier, braquages inclus",
      "IA de gestion avancée",
      "Sauvegardes toutes les heures",
      "Support prioritaire",
    ],
    highlighted: true,
    cta: "Choisir Pro RP",
  },
  {
    id: "studio",
    name: "Studio",
    setup: 1500,
    setupPrefix: "à partir de",
    monthly: 299,
    tagline: "Sur mesure, pour les projets ambitieux.",
    features: [
      "Jusqu'à 256 joueurs",
      "Site web et identité visuelle",
      "Fonctionnalités personnalisées",
      "Accompagnement dédié au lancement",
      "Tout Pro RP inclus",
    ],
    cta: "Choisir Studio",
  },
];

export const formatEuro = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
