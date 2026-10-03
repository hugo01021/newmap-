/**
 * Discord (simulé).
 * À brancher : un robot Discord (application créée sur discord.com/developers) que le client
 * invite sur son serveur ; le robot crée ensuite salons, rôles, règlement et formulaire de whitelist.
 */
import type { BuildStep } from "../types";

/** Lien d'invitation du robot ServCraft. Remplace CLIENT_ID par l'identifiant de ton application Discord. */
export const botInviteUrl =
  "https://discord.com/oauth2/authorize?client_id=CLIENT_ID&scope=bot%20applications.commands&permissions=8";

export const discordBuildSteps: BuildStep[] = [
  { id: "roles", label: "Rôles", detail: "Fondateur, staff, police, EMS, citoyens", duration: 1100 },
  { id: "channels", label: "Salons", detail: "Accueil, règlement, annonces, jobs, support", duration: 1400 },
  { id: "rules", label: "Règlement", detail: "Rédigé à partir de ta fiche", duration: 1200 },
  { id: "whitelist", label: "Candidatures", detail: "Formulaire de whitelist", duration: 1000 },
  { id: "sync", label: "Synchronisation", detail: "Statut du serveur en direct", duration: 900 },
];

export function runDiscordBuild(onStep: (index: number) => void, onDone: () => void) {
  let cancelled = false;
  let i = 0;
  let timer: ReturnType<typeof setTimeout>;
  const next = () => {
    if (cancelled) return;
    if (i >= discordBuildSteps.length) {
      onDone();
      return;
    }
    timer = setTimeout(() => {
      onStep(i);
      i += 1;
      next();
    }, discordBuildSteps[i].duration);
  };
  next();
  return () => {
    cancelled = true;
    clearTimeout(timer);
  };
}
