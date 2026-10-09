export interface Step {
  index: number;
  path: string;
}

/** Le chemin guidé : une étape = une page, un objectif. Les libellés viennent du dictionnaire (steps). */
export const steps: Step[] = [
  { index: 1, path: "/creer" },
  { index: 2, path: "/creer/questions" },
  { index: 3, path: "/creer/recap" },
  { index: 4, path: "/creer/offre" },
  { index: 5, path: "/creer/construction" },
  { index: 6, path: "/creer/mise-en-ligne" },
  { index: 7, path: "/panel" },
];

export function stepForPath(pathname: string): Step | undefined {
  if (pathname === "/creer/paiement") return steps[3];
  return steps.find((s) => s.path === pathname) ?? (pathname.startsWith("/panel") ? steps[6] : undefined);
}
