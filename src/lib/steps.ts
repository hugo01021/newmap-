export interface Step {
  index: number;
  path: string;
  label: string;
  short: string;
}

/** Le chemin guidé : une étape = une page, un objectif. */
export const steps: Step[] = [
  { index: 1, path: "/creer", label: "Décris ton serveur", short: "Décris" },
  { index: 2, path: "/creer/questions", label: "Quelques questions", short: "Questions" },
  { index: 3, path: "/creer/recap", label: "Récapitulatif", short: "Récap" },
  { index: 4, path: "/creer/offre", label: "Offre et compte", short: "Offre" },
  { index: 5, path: "/creer/construction", label: "Construction", short: "Construction" },
  { index: 6, path: "/creer/pret", label: "Serveur prêt", short: "Prêt" },
  { index: 7, path: "/panel", label: "Panel de gestion", short: "Panel" },
];

export function stepForPath(pathname: string): Step | undefined {
  return steps.find((s) => s.path === pathname) ?? (pathname.startsWith("/panel") ? steps[6] : undefined);
}
