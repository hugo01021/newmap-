import { NextResponse } from "next/server";
import { getI18n } from "@/lib/i18n/server";
import { aiEnabled, allow, askJson, clientIp } from "@/lib/ai/server";
import { proposalSchema, proposalRequestSchema } from "@/lib/ai/schemas";
import { proposalSystemPrompt, proposalUserPrompt } from "@/lib/ai/prompts";
import type { AiProposal } from "@/lib/types";

export const maxDuration = 60;

const clean = (s: string, max: number) => s.replace(/\s+/g, " ").trim().slice(0, max);

/**
 * Prépare une modification demandée en langage naturel depuis le panel.
 * Réponse : { proposal } ou { mock: true } quand aucune clé Anthropic n'est configurée.
 */
export async function POST(req: Request) {
  if (!aiEnabled) return NextResponse.json({ mock: true });
  if (!allow(clientIp(req))) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const parsed = proposalRequestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  const { request, spec } = parsed.data;
  const { locale, t } = await getI18n();

  try {
    const out = await askJson({ system: proposalSystemPrompt(locale, t), user: proposalUserPrompt(request, spec, t), schema: proposalSchema });
    const proposal: AiProposal = {
      id: `prop-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      request,
      area: t.services.proposals.areas[out.area],
      title: clean(out.title, 80),
      summary: clean(out.summary, 400),
      changes: out.changes.map((c) => clean(c, 160)).filter(Boolean).slice(0, 6),
      impact: out.impact,
    };
    return NextResponse.json({ proposal });
  } catch (error) {
    console.error("[ia] proposition impossible", error);
    return NextResponse.json({ error: "ai_unavailable" }, { status: 502 });
  }
}
