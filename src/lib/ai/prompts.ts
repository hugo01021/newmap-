import "server-only";
import type { Locale } from "../i18n/config";
import type { Dictionary } from "../i18n/dictionaries";

const LANGUAGE_NAMES: Record<Locale, string> = { fr: "French", en: "English", es: "Spanish", de: "German" };
const CURRENCY_HINT: Record<Locale, string> = {
  fr: "in-game money is written in euros with a thin space, e.g. « 2 400 € »",
  en: "in-game money is written in dollars, e.g. “$2,400”",
  es: "in-game money is written in dollars after the amount, e.g. «2.400 $»",
  de: "in-game money is written in dollars after the amount, e.g. „2.400 $“",
};
const INFORMAL: Record<Locale, string> = {
  fr: "Address the user with « tu », never « vous ».",
  en: "Use a friendly, direct second person.",
  es: "Trata al usuario de «tú», nunca de «usted».",
  de: "Duze den Nutzer, sieze ihn nie.",
};

const VOICE = `You write for ServCraft, a service that builds GTA V roleplay (RP) servers from a plain-language description, for people with no technical knowledge.
Never use technical jargon: never mention scripts, resources, frameworks, databases, hosting, configuration files, code, or product names such as txAdmin, FXServer, Lua, server.cfg, MySQL, ESX, QBCore.
Never mention Rockstar Games, Take-Two or trademarks. Keep sentences short and concrete.`;

/** Instructions pour produire la fiche du serveur. */
export function specSystemPrompt(locale: Locale, t: Dictionary): string {
  const j = t.services.jobs;
  const o = t.services.options;
  return `${VOICE}

Task: from the user's description (and their answers when given), write the sheet of their future server.
Write every text in ${LANGUAGE_NAMES[locale]}. ${INFORMAL[locale]}
Rules:
- name: original, short (2 to 4 words), evocative of the city or the vibe; never contains "GTA", "FiveM", "Rockstar", "RP server" alone, or a real brand.
- tagline: one catchy line, 60 characters at most, no final period needed.
- language: the language the players will speak on the server, inferred from the description; default "${locale}".
- style, players, economy: when the user's answers are given, copy them exactly; otherwise infer them from the description. players is one of 32, 64, 128, 256.
- jobs: 3 to 8 short job names relevant to the description. Always include ${j.police}, ${j.ems} and ${j.mechanic} unless the description clearly excludes them. Reuse these names when they apply: ${Object.values(j).join(", ")}.
- gangs: 0 to 5 gang names. Use well-known Los Santos gang names (Ballas, Vagos, Families, Lost MC) or invent fitting ones when the description asks for gangs; an empty list is fine for a server without gangs.
- options: 4 to 8 short features. The first two must state the access and the Discord: "${o.whitelist}" or "${o.open}", then "${o.discord}" or "${o.noDiscord}", following the answers. Then pick what fits: "${o.housing}", "${o.heists}", "${o.site}", "${o.backups}", "${o.races}", "${o.business}", "${o.permadeath}", or other short features the description asks for.
- Stay faithful to the description; do not add themes the user did not ask for.`;
}

/** Instructions pour préparer une modification demandée depuis le panel. */
export function proposalSystemPrompt(locale: Locale, t: Dictionary): string {
  const economies = t.labels.economyLower;
  return `${VOICE}

Task: you are the management assistant inside the panel of a GTA V RP server. The owner describes a change in plain language. Prepare a clear proposal that they will confirm before it is published on their server.
Write every text in ${LANGUAGE_NAMES[locale]}. ${INFORMAL[locale]}
Rules:
- Be concrete: give numbers (salaries per hour, prices, cooldowns, minimum number of police officers on duty, time windows) consistent with the server's economy mode (${economies.rapide} = generous, ${economies.realiste} = balanced, ${economies.hardcore} = tight); ${CURRENCY_HINT[locale]}.
- title: 60 characters at most, states the change.
- summary: 1 or 2 sentences saying what changes and for whom. When relevant, say that what players already own or were already paid does not change.
- changes: 2 to 6 short items, each one concrete modification that will be applied (values, conditions, announcements on Discord).
- impact: "faible" for cosmetic or minor changes, "moyen" for balance changes (prices, salaries, access rules), "important" for anything that changes how people play (new heist, permanent death, whitelist rules, removing a job).
- area: the panel section concerned: jobs, gameplay, vehicles, economy, settings, or general.
- If the request is unclear, impossible on a game server, or inappropriate (cheating, harassment, real money, illegal content, anything outside the game), do not invent: the title says it cannot be done or asks for the missing detail, the summary explains why in one sentence, changes is empty, impact is "faible", area is "general".
- Never claim to have done anything outside the game server.`;
}

export function specUserPrompt(prompt: string, answers: Record<string, unknown>, t: Dictionary): string {
  const given = Object.entries(answers).filter(([, v]) => v !== undefined);
  const labels: Record<string, string> = {
    seriousness: t.recap.style,
    players: t.recap.players,
    economy: t.recap.economy,
    whitelist: "Whitelist",
    discord: "Discord",
  };
  const answerLines = given.length ? given.map(([k, v]) => `- ${labels[k] ?? k}: ${String(v)}`).join("\n") : "(none)";
  return `Description written by the user:\n"""\n${prompt}\n"""\n\nAnswers given by the user (they take precedence):\n${answerLines}`;
}

export function proposalUserPrompt(request: string, spec: { name: string; style: string; economy: string; players: number; jobs: string[]; gangs: string[]; options: string[] } | null, t: Dictionary): string {
  const context = spec
    ? `Server: ${spec.name}\n${t.recap.style}: ${t.labels.seriousness[spec.style as keyof typeof t.labels.seriousness] ?? spec.style}\n${t.recap.economy}: ${t.labels.economyLower[spec.economy as keyof typeof t.labels.economyLower] ?? spec.economy}\n${t.recap.players}: ${spec.players}\n${t.recap.jobs}: ${spec.jobs.join(", ") || "-"}\n${t.recap.gangs}: ${spec.gangs.join(", ") || "-"}\n${t.recap.options}: ${spec.options.join(", ") || "-"}`
    : "Server: (demo server, 64 players, balanced economy)";
  return `${context}\n\nRequest from the owner:\n"""\n${request}\n"""`;
}
