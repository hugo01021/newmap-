/**
 * Paiement (simulé).
 * À brancher sur Stripe : créer une session Checkout côté serveur
 * (/api/checkout) et rediriger vers son URL. Garder la même signature.
 */
import type { PlanId } from "../types";

export interface CheckoutResult {
  ok: boolean;
  reference: string;
}

export async function checkout(plan: PlanId, email: string): Promise<CheckoutResult> {
  await new Promise((r) => setTimeout(r, 1400));
  const ref = `SC-${plan.toUpperCase().slice(0, 3)}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  void email;
  return { ok: true, reference: ref };
}
