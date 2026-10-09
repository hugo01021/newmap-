import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe, stripeEnabled } from "@/lib/stripe";

/**
 * Réception des événements Stripe (paiement réussi, abonnement résilié…).
 * À compléter quand la base de données existera : mettre à jour le statut du client
 * et du serveur. Configurer l'adresse de ce point d'entrée dans Stripe, puis
 * STRIPE_WEBHOOK_SECRET avec le secret de signature fourni.
 */
export async function POST(req: Request) {
  if (!stripeEnabled) return NextResponse.json({ error: "Stripe n'est pas configuré." }, { status: 400 });
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get("stripe-signature");
  const payload = await req.text();

  let event: Stripe.Event;
  try {
    if (!secret || !signature) throw new Error("Signature ou secret de webhook manquant");
    event = stripe().webhooks.constructEvent(payload, signature, secret);
  } catch (error) {
    console.error("[stripe] webhook refusé", error);
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "invoice.paid":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      // TODO base de données : enregistrer client, abonnement et statut du serveur.
      console.log(`[stripe] ${event.type}`, event.id);
      break;
    default:
      break;
  }
  return NextResponse.json({ received: true });
}
