/**
 * Authentification (simulée).
 * À brancher : connexion Discord OAuth (/api/auth/discord) et e-mail (lien magique).
 */
import type { Account } from "../types";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function signInWithEmail(email: string): Promise<Account> {
  await wait(900);
  const name = email.split("@")[0] || "Joueur";
  return { email, provider: "email", displayName: name.charAt(0).toUpperCase() + name.slice(1) };
}

export async function signInWithDiscord(): Promise<Account> {
  await wait(1100);
  return { email: "toi@discord.local", provider: "discord", displayName: "Ton compte Discord" };
}
