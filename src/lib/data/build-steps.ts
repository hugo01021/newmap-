import type { BuildStep } from "../types";
import type { Dictionary } from "../i18n/dictionaries";

/** 10 étapes, ~20 secondes au total. Les libellés viennent du dictionnaire (construction.steps). */
export const buildStepTimings = [
  { id: "architecture", duration: 1800 },
  { id: "database", duration: 1600 },
  { id: "jobs", duration: 2600 },
  { id: "economy", duration: 2200 },
  { id: "vehicles", duration: 1800 },
  { id: "permissions", duration: 1400 },
  { id: "discord", duration: 2400 },
  { id: "website", duration: 1800 },
  { id: "backup", duration: 1400 },
  { id: "tests", duration: 3000 },
] as const;

export const totalBuildDuration = buildStepTimings.reduce((acc, s) => acc + s.duration, 0);

export function localizedBuildSteps(t: Dictionary): BuildStep[] {
  return buildStepTimings.map((s, i) => ({ ...s, ...t.construction.steps[i] }));
}
