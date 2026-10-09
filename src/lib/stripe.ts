import "server-only";
import Stripe from "stripe";
import { plans, type Plan } from "./data/pricing";

/** Vrai paiement activé dès qu'une clé secrète Stripe est fournie. Sinon, paiement simulé. */
export const stripeEnabled = Boolean(process.env.STRIPE_SECRET_KEY);

let client: Stripe | null = null;

export function stripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY manquante");
  if (!client) client = new Stripe(process.env.STRIPE_SECRET_KEY);
  return client;
}

/** Clé de recherche d'un tarif Stripe pour une offre (créé à la première utilisation). */
const lookupKey = (plan: Plan) => `servcraft_${plan.id}_v1`;

/**
 * Retrouve (ou crée) le produit et le tarif mensuel Stripe d'une offre.
 * Idempotent : le tarif est identifié par sa clé de recherche.
 */
export async function ensurePrice(plan: Plan): Promise<string> {
  const s = stripe();
  const existing = await s.prices.list({ lookup_keys: [lookupKey(plan)], active: true, limit: 1 });
  if (existing.data[0]) return existing.data[0].id;

  const product = await s.products.create({
    name: `ServCraft · ${plan.name}`,
    description: `Serveur GTA V RP jusqu'à ${plan.players} joueurs, création par IA, Discord, site web, panel et sauvegardes inclus.`,
    metadata: { servcraft_plan: plan.id, players: String(plan.players) },
  });
  const price = await s.prices.create({
    product: product.id,
    currency: "eur",
    unit_amount: plan.monthly * 100,
    recurring: { interval: "month" },
    lookup_key: lookupKey(plan),
    metadata: { servcraft_plan: plan.id },
  });
  return price.id;
}

export const planById = (id: string) => plans.find((p) => p.id === id);
