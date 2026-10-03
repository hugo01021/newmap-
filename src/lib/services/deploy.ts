/**
 * Moteur de déploiement (simulé).
 * À brancher sur le vrai moteur : écouter un flux d'événements (SSE ou WebSocket)
 * et appeler onStep à chaque étape terminée.
 */
import { buildSteps } from "../data/build-steps";
import type { ServerSpec } from "../types";

export interface DeployResult {
  address: string;
  discordInvite: string;
  siteUrl: string;
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function runDeployment(
  spec: ServerSpec,
  onStep: (index: number) => void,
  onDone: (result: DeployResult) => void,
) {
  let cancelled = false;
  let i = 0;
  let timer: ReturnType<typeof setTimeout>;

  const next = () => {
    if (cancelled) return;
    if (i >= buildSteps.length) {
      const slug = slugify(spec.name);
      onDone({
        address: `connect ${slug}.servcraft.gg`,
        discordInvite: `https://discord.gg/${slug.slice(0, 8)}`,
        siteUrl: `https://${slug}.servcraft.gg`,
      });
      return;
    }
    timer = setTimeout(() => {
      onStep(i);
      i += 1;
      next();
    }, buildSteps[i].duration);
  };
  next();

  return () => {
    cancelled = true;
    clearTimeout(timer);
  };
}
