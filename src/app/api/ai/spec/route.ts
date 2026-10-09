import { NextResponse } from "next/server";
import { getI18n } from "@/lib/i18n/server";
import { aiEnabled, allow, askJson, clientIp } from "@/lib/ai/server";
import { specSchema, specRequestSchema } from "@/lib/ai/schemas";
import { specSystemPrompt, specUserPrompt } from "@/lib/ai/prompts";
import type { ServerSpec } from "@/lib/types";

/** L'IA peut prendre quelques secondes : on laisse la fonction tourner jusqu'à une minute. */
export const maxDuration = 60;

const clean = (s: string, max: number) => s.replace(/\s+/g, " ").trim().slice(0, max);
const list = (items: string[], max: number, maxLen: number) => Array.from(new Set(items.map((i) => clean(i, maxLen)).filter(Boolean))).slice(0, max);

/**
 * Génère la fiche du serveur avec l'IA.
 * Réponse : { spec } ou { mock: true } quand aucune clé Anthropic n'est configurée.
 */
export async function POST(req: Request) {
  if (!aiEnabled) return NextResponse.json({ mock: true });
  if (!allow(clientIp(req))) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const parsed = specRequestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  const { prompt, answers } = parsed.data;
  const { locale, t } = await getI18n();

  try {
    const out = await askJson({ system: specSystemPrompt(locale, t), user: specUserPrompt(prompt, answers, t), schema: specSchema });
    const spec: ServerSpec = {
      name: clean(out.name, 40) || "Los Santos Legacy",
      tagline: clean(out.tagline, 80),
      language: out.language,
      style: answers.seriousness ?? out.style,
      players: answers.players ?? (Number(out.players) as ServerSpec["players"]),
      economy: answers.economy ?? out.economy,
      jobs: list(out.jobs, 8, 30),
      gangs: list(out.gangs, 6, 30),
      options: list(out.options, 10, 60),
    };
    return NextResponse.json({ spec });
  } catch (error) {
    console.error("[ia] fiche impossible", error);
    return NextResponse.json({ error: "ai_unavailable" }, { status: 502 });
  }
}
