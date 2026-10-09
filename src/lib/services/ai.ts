/**
 * Service IA.
 * Avec une clé Anthropic, les pages appellent /api/ai/* (vraie IA). Sans clé, ou si l'IA
 * ne répond pas, on retombe sur la simulation ci-dessous (règles simples, textes du dictionnaire).
 */
import { isServerLanguage, type AiProposal, type ServerLanguage, type ServerSpec, type WizardAnswers } from "../types";
import type { Locale } from "../i18n/config";
import { fmt } from "../i18n/config";
import type { Dictionary } from "../i18n/dictionaries";
import { formatGameMoney } from "../format";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

type JobKey = keyof Dictionary["services"]["jobs"];

/** Mots-clés (français, anglais, espagnol, allemand) qui font apparaître un métier. */
const JOB_KEYWORDS: Record<JobKey, string[]> = {
  police: ["police", "lspd", "flic", "sheriff", "cops", "policía", "policia", "polizei", "polizist"],
  ems: ["ems", "ambulance", "médecin", "medecin", "hôpital", "hopital", "secours", "paramedic", "hospital", "medic", "ambulancia", "médico", "medico", "rettungsdienst", "sanitäter", "krankenhaus", "arzt"],
  mechanic: ["méca", "meca", "garage", "mécano", "mechanic", "mecánico", "mecanico", "taller", "mechaniker", "werkstatt"],
  taxi: ["taxi", "uber", "chauffeur", "cab driver", "bus driver", "conductor", "fahrer"],
  lawyer: ["avocat", "juge", "tribunal", "justice", "lawyer", "attorney", "judge", "abogado", "juez", "anwalt", "richter", "gericht"],
  journalist: ["journal", "weazel", "presse", "reporter", "periodista", "prensa"],
  realtor: ["immobilier", "agent immo", "real estate", "realtor", "inmobiliaria", "immobilienmakler", "makler"],
  dealer: ["concession", "vendeur auto", "dealership", "car dealer", "concesionario", "autohändler", "autohaendler"],
};

const GANG_KEYWORDS: Record<string, string[]> = {
  Ballas: ["ballas"],
  Vagos: ["vagos"],
  Families: ["families", "grove"],
  Mafia: ["mafia", "cartel"],
  Bikers: ["biker", "moto", "lost mc", "motorrad", "motero"],
};

const LANGUAGE_HINTS: Array<{ test: RegExp; language: ServerLanguage }> = [
  { test: /\b(english|anglais|inglés|ingles|englisch)\b/, language: "en" },
  { test: /\b(español|espanol|espagnol|spanish|spanisch)\b/, language: "es" },
  { test: /\b(deutsch|allemand|german|alemán|aleman)\b/, language: "de" },
  { test: /\b(français|francais|french|francés|frances|französisch)\b/, language: "fr" },
];

function pick<T>(arr: readonly T[], seed: number) {
  return arr[Math.abs(seed) % arr.length];
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

const NAMES = [
  "Los Santos Legacy",
  "Nova City RP",
  "Horizon Roleplay",
  "Vinewood Stories",
  "Pacific State",
  "Blaine County Life",
  "Midnight District",
  "Côte Ouest RP",
];

/** Simulation : fiche produite par des règles simples, dans la langue du site. */
async function simulateSpec(prompt: string, answers: WizardAnswers, locale: Locale, t: Dictionary): Promise<ServerSpec> {
  await wait(900);
  const text = prompt.toLowerCase();
  const seed = hash(prompt);
  const names = t.services.jobs;

  const jobs = (Object.keys(JOB_KEYWORDS) as JobKey[]).filter((job) => JOB_KEYWORDS[job].some((k) => text.includes(k)));
  const mergedJobs = Array.from(new Set<JobKey>(["police", "ems", "mechanic", ...jobs])).map((job) => names[job]);

  const gangs = Object.entries(GANG_KEYWORDS)
    .filter(([, kws]) => kws.some((k) => text.includes(k)))
    .map(([g]) => g);
  const wantsGangs = /gang|\brue\b|trafic|cartel|mafia|territoire|street|traffick|\bdrugs?\b|territory|calle|tráfico|trafico|territorio|straße|strasse|revier/.test(text);
  const mergedGangs = gangs.length ? gangs : wantsGangs ? ["Ballas", "Vagos", "Families"] : ["Ballas", "Vagos"];

  const style = answers.seriousness ?? (/hardcore|strict|sérieux|serieux|serious|serio|ernst/.test(text) ? "hardcore" : "semi");

  const economy =
    answers.economy ??
    (/hardcore|lente|très lente|\bslow\b|lenta|langsam/.test(text) ? "hardcore" : /rapide|arcade|\bfun\b|\bfast\b|quick|rápida|rapida|schnell/.test(text) ? "rapide" : "realiste");

  const players =
    answers.players ??
    ((text.match(/(32|64|128|256)\s*(joueurs|slots|places|players|jugadores|spieler)?/)?.[1] as unknown as 32 | 64 | 128 | 256) || 64);

  const whitelist =
    answers.whitelist ?? (/whitelist/.test(text) && !/pas de whitelist|sans whitelist|no whitelist|without whitelist|sin whitelist|ohne whitelist|keine whitelist/.test(text));
  const discord = answers.discord ?? true;

  const o = t.services.options;
  const options: string[] = [whitelist ? o.whitelist : o.open, discord ? o.discord : o.noDiscord, o.housing, o.heists, o.site, o.backups];
  if (/course|illégal|illegal|street|\brace|racing|carrera|rennen/.test(text)) options.push(o.races);
  if (/club|boîte|boite|business|negocio|unternehmen|geschäft|geschaeft/.test(text)) options.push(o.business);
  if (/mort permanente|permadeath|permanent death|muerte permanente|permanenter tod/.test(text)) options.push(o.permadeath);

  const language = LANGUAGE_HINTS.find((h) => h.test.test(text))?.language ?? locale;

  return {
    name: pick(NAMES, seed),
    tagline: pick(t.services.taglines, seed >> 3),
    language,
    style,
    players,
    economy,
    jobs: mergedJobs,
    gangs: mergedGangs,
    options,
  };
}

type AreaKey = keyof Dictionary["services"]["proposals"]["areas"];
type Draft = Omit<AiProposal, "id" | "request" | "area">;

interface Ctx {
  locale: Locale;
  t: Dictionary;
}

const AREAS: Array<{ test: RegExp; area: AreaKey; build: (req: string, ctx: Ctx) => Draft }> = [
  {
    test: /salaire|paie|paye|salary|salaries|wage|paycheck|\bpay\b|sueldo|salario|gehalt|gehälter|lohn|löhne/,
    area: "jobs",
    build: (req, { locale, t }) => {
      const lower = req.toLowerCase();
      const divide =
        lower.match(/(?:divis[\wé]*|divide\w*|teil\w*)\s.*?(?:par|by|entre|durch)\s+(\d+)/)?.[1] ?? (/halve|in half|halbier|a la mitad|por la mitad|moitié/.test(lower) ? "2" : undefined);
      const times = lower.match(/(?:multipli[\wé]*|multiply\w*|multipliz\w*)\s.*?(?:par|by|por|mit)\s+(\d+)/)?.[1] ?? (/double|doppel|verdopp|duplica/.test(lower) ? "2" : undefined);
      const jobKey = (Object.keys(JOB_KEYWORDS) as JobKey[]).find((j) => JOB_KEYWORDS[j].some((k) => lower.includes(k))) ?? "police";
      const job = t.services.jobs[jobKey];
      const p = t.services.proposals.salary;
      const op = divide ? fmt(p.dividedBy, { n: divide }) : times ? fmt(p.multipliedBy, { n: times }) : p.adjusted;
      const to = divide ? Math.round(2400 / Number(divide)) : times ? 2400 * Number(times) : 1800;
      return {
        title: fmt(p.title, { job, op }),
        summary: fmt(p.summary, { job, op }),
        changes: [fmt(p.base, { job, from: formatGameMoney(2400, locale), to: formatGameMoney(to, locale) }), p.grades, p.announce],
        impact: "moyen",
      };
    },
  },
  {
    test: /braquage|heist|cambriol|robbery|\brob\b|atraco|asalto|überfall|ueberfall|raub/,
    area: "gameplay",
    build: (req, { t }) => {
      const min = req.match(/(\d+)\s*(?:polic|cops?|flics|polizist)/i)?.[1] ?? "4";
      const p = t.services.proposals.heist;
      const target = /banque|bank|banco/i.test(req) ? p.bank : /bijou|jewel|joyer|juwel/i.test(req) ? p.jewelry : p.store;
      return {
        title: fmt(p.title, { target }),
        summary: fmt(p.summary, { target, min }),
        changes: [fmt(p.enabled, { target }), fmt(p.condition, { min }), p.loot, p.cooldown, p.alert],
        impact: "important",
      };
    },
  },
  {
    test: /prix|loyer|taxe|coût|cout|price|\brent\b|\btax|\bcost|precio|alquiler|impuesto|preis|miete|steuer/,
    area: "economy",
    build: (_, { t }) => ({ ...t.services.proposals.prices, impact: "moyen" }),
  },
  {
    test: /véhicule|vehicule|voiture|\bmoto\b|concession|vehicle|\bcars?\b|\bbikes?\b|dealership|vehículo|vehiculo|coche|motocicleta|fahrzeug|\bautos?\b|motorrad|händler|haendler/,
    area: "vehicles",
    build: (_, { t }) => ({ ...t.services.proposals.vehicles, impact: "faible" }),
  },
  {
    test: /whitelist|candidature|application|candidatura|bewerbung/,
    area: "settings",
    build: (_, { t }) => ({ ...t.services.proposals.whitelist, impact: "moyen" }),
  },
  {
    test: /\bjob|métier|metier|faction|ajoute|\badd\b|añade|anade|trabajo|hinzu|beruf|oficio/,
    area: "jobs",
    build: (_, { t }) => ({ ...t.services.proposals.job, impact: "moyen" }),
  },
];

let counter = 0;

/** Simulation : réponse à une demande de modification, par mots-clés. */
async function simulateProposal(request: string, locale: Locale, t: Dictionary): Promise<AiProposal> {
  await wait(1200 + Math.random() * 600);
  const ctx: Ctx = { locale, t };
  const match = AREAS.find((a) => a.test.test(request.toLowerCase()));
  const base: Draft = match
    ? match.build(request, ctx)
    : {
        title: t.services.proposals.generic.title,
        summary: fmt(t.services.proposals.generic.summary, { request: request.trim() }),
        changes: t.services.proposals.generic.changes,
        impact: "faible",
      };
  counter += 1;
  return { id: `prop-${Date.now()}-${counter}`, request, area: t.services.proposals.areas[match?.area ?? "general"], ...base };
}

/* ------------------------------------------------------------------ */
/* Vraie IA (routes /api/ai/*), avec repli sur la simulation            */
/* ------------------------------------------------------------------ */

const aiEnabled = process.env.NEXT_PUBLIC_AI_ENABLED === "1";
const PLAYERS = [32, 64, 128, 256];
const SERIOUSNESS = ["casual", "semi", "hardcore"];
const ECONOMIES = ["rapide", "realiste", "hardcore"];
const IMPACTS = ["faible", "moyen", "important"];

const isStringList = (v: unknown): v is string[] => Array.isArray(v) && v.every((x) => typeof x === "string");

function asSpec(v: unknown): ServerSpec | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  if (typeof o.name !== "string" || typeof o.tagline !== "string" || !isServerLanguage(o.language)) return null;
  if (!SERIOUSNESS.includes(o.style as string) || !ECONOMIES.includes(o.economy as string) || !PLAYERS.includes(o.players as number)) return null;
  if (!isStringList(o.jobs) || !isStringList(o.gangs) || !isStringList(o.options)) return null;
  return o as unknown as ServerSpec;
}

function asProposal(v: unknown): AiProposal | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  if (typeof o.id !== "string" || typeof o.title !== "string" || typeof o.summary !== "string" || typeof o.area !== "string") return null;
  if (!isStringList(o.changes) || !IMPACTS.includes(o.impact as string)) return null;
  return o as unknown as AiProposal;
}

async function callAi<T>(path: string, body: unknown, pick: (data: Record<string, unknown>) => T | null): Promise<T | null> {
  if (!aiEnabled) return null;
  try {
    const res = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!res.ok) return null;
    const data = (await res.json()) as Record<string, unknown>;
    if (data.mock) return null;
    return pick(data);
  } catch {
    return null;
  }
}

/** Produit la fiche du serveur à partir du prompt et des réponses, dans la langue du site. */
export async function generateSpec(prompt: string, answers: WizardAnswers, locale: Locale, t: Dictionary): Promise<ServerSpec> {
  const real = await callAi("/api/ai/spec", { prompt, answers }, (d) => asSpec(d.spec));
  return real ?? simulateSpec(prompt, answers, locale, t);
}

/** Répond à une demande de modification en langage naturel, dans la langue du site. */
export async function proposeChange(request: string, locale: Locale, t: Dictionary, spec: ServerSpec | null = null): Promise<AiProposal> {
  const context = spec ? { name: spec.name, style: spec.style, economy: spec.economy, players: spec.players, jobs: spec.jobs, gangs: spec.gangs, options: spec.options } : null;
  const real = await callAi("/api/ai/propose", { request, spec: context }, (d) => asProposal(d.proposal));
  return real ?? simulateProposal(request, locale, t);
}
