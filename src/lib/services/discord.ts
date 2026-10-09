/**
 * Discord (simulé).
 * À brancher : un robot Discord (application créée sur discord.com/developers) que le client
 * invite sur son serveur ; le robot crée ensuite salons, rôles, règlement et formulaire de whitelist.
 */
import type { BuildStep } from "../types";
import type { Dictionary } from "../i18n/dictionaries";

/** Lien d'invitation du robot ServCraft. Remplace CLIENT_ID par l'identifiant de ton application Discord. */
export const botInviteUrl =
  "https://discord.com/oauth2/authorize?client_id=CLIENT_ID&scope=bot%20applications.commands&permissions=8";

/** Les libellés viennent du dictionnaire (guide.discord.steps). */
export const discordStepTimings = [
  { id: "roles", duration: 1100 },
  { id: "channels", duration: 1400 },
  { id: "rules", duration: 1200 },
  { id: "whitelist", duration: 1000 },
  { id: "sync", duration: 900 },
] as const;

export function localizedDiscordSteps(t: Dictionary): BuildStep[] {
  return discordStepTimings.map((s, i) => ({ ...s, ...t.guide.discord.steps[i] }));
}

export function runDiscordBuild(onStep: (index: number) => void, onDone: () => void) {
  let cancelled = false;
  let i = 0;
  let timer: ReturnType<typeof setTimeout>;
  const next = () => {
    if (cancelled) return;
    if (i >= discordStepTimings.length) {
      onDone();
      return;
    }
    timer = setTimeout(() => {
      onStep(i);
      i += 1;
      next();
    }, discordStepTimings[i].duration);
  };
  next();
  return () => {
    cancelled = true;
    clearTimeout(timer);
  };
}
