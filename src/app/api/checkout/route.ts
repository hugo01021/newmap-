import { NextResponse } from "next/server";
import { isPlanId, planBaseById } from "@/lib/data/pricing";
import { ensurePrice, stripe, stripeEnabled } from "@/lib/stripe";
import { getI18n } from "@/lib/i18n/server";

/**
 * Crée une session de paiement Stripe (page hébergée par Stripe) pour une offre.
 * Réponse : { url } à ouvrir, ou { mock: true } si Stripe n'est pas configuré.
 */
export async function POST(req: Request) {
  // Messages d'erreur et page de paiement Stripe dans la langue choisie sur le site.
  const { locale, t } = await getI18n();
  let body: { planId?: string; email?: string; serverName?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: t.api.invalidRequest }, { status: 400 });
  }
  const { planId, email, serverName } = body;
  if (!isPlanId(planId)) return NextResponse.json({ error: t.api.unknownPlan }, { status: 400 });
  if (!stripeEnabled) return NextResponse.json({ mock: true });

  const plan = planBaseById(planId)!;
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? req.headers.get("origin") ?? new URL(req.url).origin;

  try {
    const price = await ensurePrice(plan);
    const session = await stripe().checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price, quantity: 1 }],
      locale,
      customer_email: email || undefined,
      allow_promotion_codes: true,
      success_url: `${origin}/creer/paiement?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/creer/offre`,
      metadata: { servcraft_plan: plan.id, server_name: serverName ?? "" },
      subscription_data: { metadata: { servcraft_plan: plan.id, server_name: serverName ?? "" } },
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[stripe] création de session impossible", error);
    return NextResponse.json({ error: t.api.unavailable }, { status: 502 });
  }
}
