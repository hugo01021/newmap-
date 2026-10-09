import type { PlanId, PlayerCount } from "../types";
import type { Dictionary } from "../i18n/dictionaries";

export { formatEuro } from "../format";

/** Une offre : les chiffres. Les textes (nom, accroche, liste) viennent du dictionnaire. */
export interface PlanBase {
  id: PlanId;
  players: PlayerCount;
  /** Prix mensuel TTC affiché. */
  monthly: number;
  /** Coût mensuel estimé de la machine chez l'hébergeur (suivi des marges, non affiché). */
  hostingCost: number;
  highlighted?: boolean;
}

export interface Plan extends PlanBase {
  name: string;
  tagline: string;
  features: string[];
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
export const planBases: PlanBase[] = [
  { id: "p32", players: 32, monthly: 22, hostingCost: 12 },
  { id: "p64", players: 64, monthly: 40, hostingCost: 25, highlighted: true },
  { id: "p128", players: 128, monthly: 65, hostingCost: 45 },
  { id: "p256", players: 256, monthly: 110, hostingCost: 80 },
];

export const isPlanId = (value: unknown): value is PlanId => planBases.some((p) => p.id === value);

export const planBaseById = (id: string): PlanBase | undefined => planBases.find((p) => p.id === id);

/** L'offre qui correspond au nombre de joueurs choisi dans le parcours. */
export const planForPlayers = (players: PlayerCount): PlanBase => planBases.find((p) => p.players === players) ?? planBases[1];

/** Les offres avec leurs textes dans la langue du dictionnaire. */
export function localizedPlans(t: Dictionary): Plan[] {
  return planBases.map((p) => ({ ...p, ...t.pricing.plans[p.id] }));
}
