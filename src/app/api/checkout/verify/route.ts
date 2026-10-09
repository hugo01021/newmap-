import { NextResponse } from "next/server";
import { stripe, stripeEnabled } from "@/lib/stripe";

/** Vérifie côté serveur qu'une session de paiement Stripe est bien réglée. */
export async function GET(req: Request) {
  const sessionId = new URL(req.url).searchParams.get("session_id");
  if (!sessionId) return NextResponse.json({ error: "Session manquante." }, { status: 400 });
  if (!stripeEnabled) return NextResponse.json({ error: "Stripe n'est pas configuré." }, { status: 400 });

  try {
    const session = await stripe().checkout.sessions.retrieve(sessionId, { expand: ["subscription"] });
    const subscription = typeof session.subscription === "object" ? session.subscription : null;
    const paid = session.status === "complete" && (session.payment_status === "paid" || session.payment_status === "no_payment_required");
    return NextResponse.json({
      paid,
      planId: session.metadata?.servcraft_plan ?? null,
      email: session.customer_details?.email ?? null,
      customerId: typeof session.customer === "string" ? session.customer : session.customer?.id ?? null,
      subscriptionId: subscription?.id ?? (typeof session.subscription === "string" ? session.subscription : null),
      reference: session.id,
    });
  } catch (error) {
    console.error("[stripe] vérification impossible", error);
    return NextResponse.json({ error: "Impossible de vérifier le paiement." }, { status: 502 });
  }
}
