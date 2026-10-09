export type Seriousness = "casual" | "semi" | "hardcore";
export type PlayerCount = 32 | 64 | 128 | 256;
export type EconomyMode = "rapide" | "realiste" | "hardcore";
export type PlanId = "p32" | "p64" | "p128" | "p256";
/** Langue parlée sur le serveur (celle des joueurs), indépendante de la langue du site. */
export type ServerLanguage = "fr" | "en" | "es" | "de";
export const serverLanguages: ServerLanguage[] = ["fr", "en", "es", "de"];
export const isServerLanguage = (v: unknown): v is ServerLanguage => (serverLanguages as unknown[]).includes(v);

export interface WizardAnswers {
  seriousness?: Seriousness;
  players?: PlayerCount;
  economy?: EconomyMode;
  whitelist?: boolean;
  discord?: boolean;
}

/** La fiche d'un serveur telle que l'IA la produit à partir du prompt + des réponses. */
export interface ServerSpec {
  name: string;
  tagline: string;
  language: ServerLanguage;
  style: Seriousness;
  players: PlayerCount;
  economy: EconomyMode;
  jobs: string[];
  gangs: string[];
  options: string[];
}

export interface Account {
  email: string;
  provider: "email" | "discord";
  displayName: string;
}

/** Les trois étapes que le client doit faire lui-même après la construction. */
export interface Onboarding {
  /** Clé de serveur Cfx.re collée par le client. */
  cfxKey: string;
  cfxDone: boolean;
  discordCreated: boolean;
  discordBuilt: boolean;
  playDone: boolean;
}

export interface WizardState {
  prompt: string;
  answers: WizardAnswers;
  spec: ServerSpec | null;
  plan: PlanId | null;
  account: Account | null;
  paid: boolean;
  built: boolean;
  server: {
    address: string;
    /** Adresse IP de la machine, à renseigner lors de la création de la clé. */
    ip: string;
    discordInvite: string;
    siteUrl: string;
  } | null;
  onboarding: Onboarding;
  /** Identifiants Stripe une fois le paiement réel effectué. */
  billing: { customerId: string; subscriptionId: string; reference: string } | null;
}

/** Une proposition de changement renvoyée par l'IA de gestion. */
export interface AiProposal {
  id: string;
  request: string;
  title: string;
  summary: string;
  changes: string[];
  impact: "faible" | "moyen" | "important";
  area: string;
}

export interface BuildStep {
  id: string;
  label: string;
  detail: string;
  /** Durée simulée en millisecondes. */
  duration: number;
}
