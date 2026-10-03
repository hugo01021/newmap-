/**
 * Service IA (simulé).
 * À brancher ensuite sur l'API d'IA : remplacer le corps de ces fonctions
 * par des appels à /api/ai/* en conservant les mêmes signatures.
 */
import type { AiProposal, ServerSpec, WizardAnswers } from "../types";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const JOB_KEYWORDS: Record<string, string[]> = {
  Police: ["police", "lspd", "flic", "sheriff"],
  EMS: ["ems", "ambulance", "médecin", "medecin", "hôpital", "hopital", "secours"],
  Mécano: ["méca", "meca", "garage", "mécano"],
  Taxi: ["taxi", "uber", "chauffeur"],
  Avocat: ["avocat", "juge", "tribunal", "justice"],
  Journaliste: ["journal", "weazel", "presse"],
  "Agent immobilier": ["immobilier", "agent immo"],
  Concessionnaire: ["concession", "vendeur auto"],
};

const GANG_KEYWORDS: Record<string, string[]> = {
  Ballas: ["ballas"],
  Vagos: ["vagos"],
  Families: ["families", "grove"],
  Mafia: ["mafia", "cartel"],
  Bikers: ["biker", "moto", "lost mc"],
};

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

const TAGLINES = [
  "Une ville qui vit, même quand tu dors.",
  "Chaque personnage a une histoire.",
  "Pas de script. Juste ta ville.",
  "Le RP, sans la prise de tête.",
];

/** Produit la fiche du serveur à partir du prompt et des réponses. */
export async function generateSpec(prompt: string, answers: WizardAnswers): Promise<ServerSpec> {
  await wait(900);
  const text = prompt.toLowerCase();
  const seed = hash(prompt);

  const jobs = Object.entries(JOB_KEYWORDS)
    .filter(([, kws]) => kws.some((k) => text.includes(k)))
    .map(([job]) => job);
  const baseJobs = ["Police", "EMS", "Mécano"];
  const mergedJobs = Array.from(new Set([...baseJobs, ...jobs]));

  const gangs = Object.entries(GANG_KEYWORDS)
    .filter(([, kws]) => kws.some((k) => text.includes(k)))
    .map(([g]) => g);
  const wantsGangs = /gang|rue|trafic|cartel|mafia|territoire/.test(text);
  const mergedGangs = gangs.length ? gangs : wantsGangs ? ["Ballas", "Vagos", "Families"] : ["Ballas", "Vagos"];

  const style =
    answers.seriousness ??
    (/hardcore|strict|sérieux|serieux/.test(text) ? "hardcore" : /semi|détendu|detendu|débutant/.test(text) ? "semi" : "semi");

  const economy =
    answers.economy ??
    (/hardcore|lente|très lente/.test(text) ? "hardcore" : /rapide|arcade|fun/.test(text) ? "rapide" : "realiste");

  const players =
    answers.players ??
    ((text.match(/(32|64|128|256)\s*(joueurs|slots|places)?/)?.[1] as unknown as 32 | 64 | 128 | 256) || 64);

  const whitelist = answers.whitelist ?? (/whitelist/.test(text) && !/pas de whitelist|sans whitelist/.test(text));
  const discord = answers.discord ?? true;

  const options: string[] = [
    whitelist ? "Whitelist avec candidatures" : "Accès libre",
    discord ? "Discord généré automatiquement" : "Sans Discord",
    "Immobilier et location",
    "Braquages (épicerie, bijouterie, banque)",
    "Site web du serveur",
    "Sauvegardes et réparation automatique",
  ];
  if (/course|illégal|illegal|street/.test(text)) options.push("Courses illégales");
  if (/club|boîte|boite|business/.test(text)) options.push("Business de joueurs");
  if (/mort permanente|permadeath/.test(text)) options.push("Mort permanente");

  const language = /english|anglais|\ben\b/.test(text) ? "Anglais" : "Français";

  return {
    name: pick(NAMES, seed),
    tagline: pick(TAGLINES, seed >> 3),
    language,
    style,
    players,
    economy,
    jobs: mergedJobs,
    gangs: mergedGangs,
    options,
  };
}

const AREAS: Array<{ test: RegExp; area: string; build: (req: string) => Omit<AiProposal, "id" | "request" | "area"> }> = [
  {
    test: /salaire|paie|paye/,
    area: "Jobs",
    build: (req) => {
      const divide = req.match(/divis\w*\s+.*?par\s+(\d+)/i)?.[1];
      const times = req.match(/multipli\w*\s+.*?par\s+(\d+)/i)?.[1];
      const job = Object.keys(JOB_KEYWORDS).find((j) => JOB_KEYWORDS[j].some((k) => req.toLowerCase().includes(k))) ?? "Police";
      const op = divide ? `divisé par ${divide}` : times ? `multiplié par ${times}` : "ajusté";
      return {
        title: `Salaire ${job} ${op}`,
        summary: `Le salaire des membres du job ${job} sera ${op} pour tous les grades. Les paies déjà versées ne changent pas.`,
        changes: [
          `Salaire de base ${job} : ${divide ? `2 400 € → ${Math.round(2400 / Number(divide))} €` : times ? `2 400 € → ${2400 * Number(times)} €` : "2 400 € → 1 800 €"} par heure`,
          "Grades intermédiaires et supérieurs recalculés proportionnellement",
          "Annonce automatique dans le salon Discord du job",
        ],
        impact: "moyen",
      };
    },
  },
  {
    test: /braquage|heist|cambriol/,
    area: "Gameplay",
    build: (req) => {
      const min = req.match(/(\d+)\s*polic/i)?.[1] ?? "4";
      const target = /banque|bank/i.test(req) ? "banque" : /bijou/i.test(req) ? "bijouterie" : "épicerie";
      return {
        title: `Nouveau braquage de ${target}`,
        summary: `Un braquage de ${target} sera disponible, uniquement quand au moins ${min} policiers sont en service. Le butin et le temps de recharge sont équilibrés selon ton économie.`,
        changes: [
          `Braquage de ${target} activé`,
          `Condition : ${min} policiers minimum en service`,
          "Butin : 45 000 à 80 000 € selon la difficulté",
          "Recharge : 2 heures entre deux braquages",
          "Alerte envoyée à la police au déclenchement",
        ],
        impact: "important",
      };
    },
  },
  {
    test: /véhicule|vehicule|voiture|moto|concession/,
    area: "Véhicules",
    build: () => ({
      title: "Catalogue de véhicules mis à jour",
      summary: "Le concessionnaire proposera les véhicules demandés, avec des prix cohérents avec ton économie.",
      changes: ["Nouveaux véhicules ajoutés au concessionnaire", "Prix calculés selon le mode d'économie", "Garages mis à jour"],
      impact: "faible",
    }),
  },
  {
    test: /prix|loyer|taxe|coût|cout/,
    area: "Économie",
    build: () => ({
      title: "Ajustement des prix",
      summary: "Les prix concernés seront ajustés. Les transactions déjà effectuées ne changent pas.",
      changes: ["Prix mis à jour dans les commerces concernés", "Équilibrage vérifié par l'IA", "Changement visible immédiatement en jeu"],
      impact: "moyen",
    }),
  },
  {
    test: /whitelist|candidature/,
    area: "Paramètres",
    build: () => ({
      title: "Whitelist modifiée",
      summary: "Les règles d'accès à ton serveur seront mises à jour et synchronisées avec Discord.",
      changes: ["Règles d'accès mises à jour", "Formulaire de candidature Discord ajusté", "Rôles synchronisés"],
      impact: "moyen",
    }),
  },
  {
    test: /job|métier|metier|faction|ajoute/,
    area: "Jobs",
    build: () => ({
      title: "Nouveau job créé",
      summary: "Le métier demandé sera ajouté avec ses grades, son salaire et son lieu de travail. Les joueurs pourront y postuler dès la publication.",
      changes: ["Job créé avec 4 grades", "Salaire de base : 1 600 € par heure", "Lieu de travail placé sur la carte", "Rôle Discord dédié"],
      impact: "moyen",
    }),
  },
];

let counter = 0;

/** Répond à une demande de modification en langage naturel. */
export async function proposeChange(request: string): Promise<AiProposal> {
  await wait(1200 + Math.random() * 600);
  const match = AREAS.find((a) => a.test.test(request.toLowerCase()));
  const base = match
    ? match.build(request)
    : {
        title: "Modification préparée",
        summary: `J'ai préparé la modification suivante : « ${request.trim()} ». Vérifie le résumé, puis publie pour l'appliquer sur ton serveur.`,
        changes: ["Configuration mise à jour", "Vérification automatique des conflits", "Sauvegarde créée avant publication"],
        impact: "faible" as const,
      };
  counter += 1;
  return { id: `prop-${Date.now()}-${counter}`, request, area: match?.area ?? "Général", ...base };
}
