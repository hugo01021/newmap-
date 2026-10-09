/**
 * Moteur de déploiement (simulé).
 * À brancher sur le vrai moteur : écouter un flux d'événements (SSE ou WebSocket)
 * et appeler onStep à chaque étape terminée.
 */
import { buildStepTimings } from "../data/build-steps";
import type { ServerSpec } from "../types";

export interface DeployResult {
  address: string;
  ip: string;
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

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/**
 * Enregistre la clé de serveur Cfx.re du client (simulé).
 * À brancher : vérification côté serveur puis écriture dans la configuration du serveur.
 */
export async function registerLicenseKey(key: string): Promise<{ ok: true } | { ok: false; reason: "invalidFormat" }> {
  await new Promise((r) => setTimeout(r, 900));
  const trimmed = key.trim();
  if (!/^cfxk_[A-Za-z0-9]{8,}(_[A-Za-z0-9]+)?$/.test(trimmed)) return { ok: false, reason: "invalidFormat" };
  return { ok: true };
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
    if (i >= buildStepTimings.length) {
      const slug = slugify(spec.name);
      onDone({
        address: `connect ${slug}.servcraft.gg`,
        ip: `51.210.${(hash(slug) % 200) + 20}.${(hash(slug + "x") % 200) + 20}`,
        discordInvite: `https://discord.gg/${slug.slice(0, 8)}`,
        siteUrl: `https://${slug}.servcraft.gg`,
      });
      return;
    }
    timer = setTimeout(() => {
      onStep(i);
      i += 1;
      next();
    }, buildStepTimings[i].duration);
  };
  next();

  return () => {
    cancelled = true;
    clearTimeout(timer);
  };
}
