"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useWizard } from "@/lib/wizard-store";
import { isPlanId } from "@/lib/data/pricing";
import { StepHeading } from "@/components/wizard/StepHeading";
import { PillButton } from "@/components/ui/PillButton";
import { Loader } from "@/components/ui/Icons";

/** Retour de la page de paiement Stripe : on vérifie côté serveur, puis on lance la construction. */
function PaymentReturn() {
  const router = useRouter();
  const params = useSearchParams();
  const { hydrated, setPaid, setPlan, setBilling } = useWizard();
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!hydrated || started.current) return;
    started.current = true;
    const sessionId = params.get("session_id");
    if (!sessionId) {
      router.replace("/creer/offre");
      return;
    }
    fetch(`/api/checkout/verify?session_id=${encodeURIComponent(sessionId)}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.paid) throw new Error(data.error ?? "Le paiement n'a pas été confirmé.");
        if (isPlanId(data.planId)) setPlan(data.planId);
        setBilling({ customerId: data.customerId ?? "", subscriptionId: data.subscriptionId ?? "", reference: data.reference ?? sessionId });
        setPaid(true);
        router.replace("/creer/construction");
      })
      .catch((e: Error) => setError(e.message));
  }, [hydrated, params, router, setPaid, setPlan, setBilling]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      {error ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
          <StepHeading tag="Paiement" title="Un problème avec le paiement." text={error} />
          <div className="mt-8">
            <PillButton href="/creer/offre">Revenir à l&apos;offre</PillButton>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-ink">
            <Loader width={22} height={22} />
          </span>
          <p className="display mt-8 text-3xl sm:text-4xl">Paiement en cours de confirmation…</p>
          <p className="mt-3 text-muted">Quelques secondes, puis la construction démarre.</p>
        </motion.div>
      )}
    </div>
  );
}

export default function PaiementPage() {
  return (
    <Suspense fallback={null}>
      <PaymentReturn />
    </Suspense>
  );
}
