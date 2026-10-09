import { z } from "zod";

/**
 * Formes de réponse imposées à l'IA (sorties structurées).
 * Pas de contraintes de longueur ici : elles sont rappelées dans le prompt et appliquées après coup.
 */
export const specSchema = z.object({
  name: z.string(),
  tagline: z.string(),
  language: z.enum(["fr", "en", "es", "de"]),
  style: z.enum(["casual", "semi", "hardcore"]),
  players: z.enum(["32", "64", "128", "256"]),
  economy: z.enum(["rapide", "realiste", "hardcore"]),
  jobs: z.array(z.string()),
  gangs: z.array(z.string()),
  options: z.array(z.string()),
});
export type SpecOutput = z.infer<typeof specSchema>;

export const proposalSchema = z.object({
  area: z.enum(["jobs", "gameplay", "vehicles", "economy", "settings", "general"]),
  title: z.string(),
  summary: z.string(),
  changes: z.array(z.string()),
  impact: z.enum(["faible", "moyen", "important"]),
});
export type ProposalOutput = z.infer<typeof proposalSchema>;

/** Ce que le site envoie aux routes. */
export const specRequestSchema = z.object({
  prompt: z.string().trim().min(10).max(2000),
  answers: z
    .object({
      seriousness: z.enum(["casual", "semi", "hardcore"]).optional(),
      players: z.union([z.literal(32), z.literal(64), z.literal(128), z.literal(256)]).optional(),
      economy: z.enum(["rapide", "realiste", "hardcore"]).optional(),
      whitelist: z.boolean().optional(),
      discord: z.boolean().optional(),
    })
    .default({}),
});

export const proposalRequestSchema = z.object({
  request: z.string().trim().min(2).max(600),
  spec: z
    .object({
      name: z.string().max(60),
      style: z.enum(["casual", "semi", "hardcore"]),
      economy: z.enum(["rapide", "realiste", "hardcore"]),
      players: z.number(),
      jobs: z.array(z.string().max(40)).max(12),
      gangs: z.array(z.string().max(40)).max(8),
      options: z.array(z.string().max(80)).max(12),
    })
    .nullable()
    .default(null),
});
