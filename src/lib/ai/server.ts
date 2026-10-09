import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import type { z } from "zod";

/** L'IA réelle est active dès qu'une clé Anthropic est fournie. Sinon, le site simule. */
export const aiEnabled = Boolean(process.env.ANTHROPIC_API_KEY);

/** Modèle utilisé (modifiable dans Vercel sans toucher au code). */
export const aiModel = process.env.ANTHROPIC_MODEL || "claude-opus-5-5";

type Effort = "low" | "medium" | "high" | "xhigh" | "max";
const EFFORTS: Effort[] = ["low", "medium", "high", "xhigh", "max"];
/** Tâches courtes et cadrées : un effort faible suffit et garde la réponse rapide. */
const effort: Effort = EFFORTS.includes(process.env.ANTHROPIC_EFFORT as Effort) ? (process.env.ANTHROPIC_EFFORT as Effort) : "low";

/** Repli automatique côté serveur si le modèle décline une demande (Opus 5+, Sonnet 5.5, Fable). */
const supportsFallback = /^claude-(opus-5|sonnet-5-5|fable)/.test(aiModel);

let client: Anthropic | null = null;

export function anthropic(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY manquante");
  if (!client) client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, timeout: 50_000, maxRetries: 1 });
  return client;
}

export class AiRefusal extends Error {
  constructor(explanation?: string | null) {
    super(explanation || "Demande refusée par l'IA");
    this.name = "AiRefusal";
  }
}

/** Pose une question à l'IA et récupère une réponse dans la forme demandée. */
export async function askJson<S extends z.ZodType>(opts: { system: string; user: string; schema: S; maxTokens?: number }): Promise<z.infer<S>> {
  const res = await anthropic().beta.messages.parse({
    model: aiModel,
    max_tokens: opts.maxTokens ?? 8000,
    ...(supportsFallback ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const } : {}),
    system: opts.system,
    messages: [{ role: "user", content: opts.user }],
    output_config: { format: betaZodOutputFormat(opts.schema), effort },
  });
  if (res.stop_reason === "refusal") throw new AiRefusal(res.stop_details?.explanation);
  if (res.stop_reason === "max_tokens") throw new Error("Réponse de l'IA tronquée");
  if (!res.parsed_output) throw new Error("Réponse de l'IA illisible");
  return res.parsed_output;
}

/** Garde-fou minimal contre les abus : N appels par adresse et par fenêtre (mémoire du processus). */
const buckets = new Map<string, { count: number; reset: number }>();
export function allow(ip: string, limit = 30, windowMs = 10 * 60_000): boolean {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || b.reset < now) {
    buckets.set(ip, { count: 1, reset: now + windowMs });
    return true;
  }
  b.count += 1;
  return b.count <= limit;
}

export const clientIp = (req: Request) => req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
