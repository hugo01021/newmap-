"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { localizedPlans, formatEuro } from "@/lib/data/pricing";
import { fmt } from "@/lib/i18n/config";
import { useLocale } from "@/lib/i18n/client";
import { useWizard } from "@/lib/wizard-store";
import { checkout } from "@/lib/services/payments";
import type { PlanId } from "@/lib/types";
import { StepHeading } from "@/components/wizard/StepHeading";
import { PlanCard } from "@/components/home/Pricing";
import { PillButton } from "@/components/ui/PillButton";
import { Input, FieldLabel } from "@/components/ui/Field";
import { ArrowRight, Check, Loader, Shield } from "@/components/ui/Icons";

type Phase = "plan" | "payment";

const ease = [0.16, 1, 0.3, 1] as const;
const stripeEnabled = process.env.NEXT_PUBLIC_STRIPE_ENABLED === "1";

export default function OffrePage() {
  const { t, locale } = useLocale();
  const o = t.offre;
  const router = useRouter();
  const { state, hydrated, setPlan, setPaid } = useWizard();
  const [phase, setPhase] = useState<Phase>("plan");
  const [busy, setBusy] = useState<null | "pay">(null);
  const [card, setCard] = useState({ number: "", exp: "", cvc: "", name: "" });
  const [payError, setPayError] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    if (!state.spec) {
      router.replace(state.prompt ? "/creer/recap" : "/creer");
      return;
    }
    if (state.paid) router.replace("/creer/construction");
  }, [hydrated, state.spec, state.prompt, state.paid, router]);

  const plans = localizedPlans(t);
  const plan = plans.find((p) => p.id === state.plan) ?? null;

  const choosePlan = (id: PlanId) => {
    setPlan(id);
    setTimeout(() => setPhase("payment"), 200);
  };

  /** Paiement simulé (sans clé Stripe). */
  const pay = async () => {
    if (!plan || !state.account) return;
    setBusy("pay");
    const result = await checkout(plan.id, state.account.email);
    if (result.ok) {
      setPaid(true);
      router.push("/creer/construction");
    }
    setBusy(null);
  };

  /** Paiement réel : on ouvre la page de paiement hébergée par Stripe. */
  const payWithStripe = async () => {
    if (!plan || !state.account) return;
    setBusy("pay");
    setPayError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.id, email: state.account.email, serverName: state.spec?.name }),
      });
      const data = await res.json();
      if (data.mock) return pay();
      if (!res.ok || !data.url) throw new Error(data.error ?? o.unavailable);
      window.location.assign(data.url);
    } catch (e) {
      setPayError((e as Error).message);
      setBusy(null);
    }
  };

  const cardReady = card.number.replace(/\s/g, "").length >= 12 && card.exp.length >= 4 && card.cvc.length >= 3 && card.name.trim().length > 1;

  const phases: Array<{ id: Phase; label: string }> = [
    { id: "plan", label: o.phasePlan },
    { id: "payment", label: o.phasePayment },
  ];
  const phaseIndex = phases.findIndex((p) => p.id === phase);

  if (!hydrated || !state.spec || !state.account) return null;

  const price = plan ? formatEuro(plan.monthly, locale) : "";

  return (
    <div className="flex flex-1 flex-col items-center">
      <StepHeading
        tag={o.tag}
        title={phase === "plan" ? o.choose : o.last}
        text={
          phase === "plan"
            ? fmt(o.chooseText, { name: state.spec.name, players: state.spec.players, economy: t.labels.economyLower[state.spec.economy] })
            : o.lastText
        }
      />

      {/* Sous-étapes */}
      <ol className="mt-10 flex items-center gap-3">
        {phases.map((p, i) => {
          const done = i < phaseIndex;
          const active = i === phaseIndex;
          return (
            <li key={p.id} className="flex items-center gap-3">
              <button
                type="button"
                disabled={!done}
                onClick={() => setPhase(p.id)}
                className={cn("flex items-center gap-2 text-sm font-semibold transition-colors", active ? "text-white" : done ? "text-white/70 hover:text-white" : "text-muted-2")}
              >
                <span className={cn("flex h-6 w-6 items-center justify-center rounded-full border text-[11px]", active ? "border-white bg-white text-ink" : done ? "border-white text-white" : "border-line-2")}>
                  {done ? <Check width={11} height={11} strokeWidth={3} /> : i + 1}
                </span>
                {p.label}
              </button>
              {i < phases.length - 1 && <span className="h-px w-6 bg-line" />}
            </li>
          );
        })}
      </ol>

      <div className="mt-10 w-full max-w-5xl">
        <AnimatePresence mode="wait">
          {phase === "plan" && (
            <motion.div key="plan" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.45, ease }}>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {plans.map((p) => (
                  <PlanCard key={p.id} plan={p} selected={state.plan === p.id} onSelect={choosePlan} badge={p.players === state.spec?.players ? t.pricing.recommended : undefined} />
                ))}
              </div>
              {state.plan && (
                <div className="mt-8 flex justify-end">
                  <PillButton onClick={() => setPhase("payment")} iconRight={<ArrowRight width={16} height={16} />}>
                    {fmt(o.continueWith, { plan: plan?.name ?? "" })}
                  </PillButton>
                </div>
              )}
            </motion.div>
          )}

          {phase === "payment" && plan && (
            <motion.div key="payment" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.45, ease }} className="grid gap-6 lg:grid-cols-5">
              <div className="rounded-card border border-line bg-ink-2/60 p-6 sm:p-8 lg:col-span-3">
                <div className="flex items-center justify-between">
                  <span className="label text-muted">{stripeEnabled ? o.payment : o.card}</span>
                  <span className="flex items-center gap-1.5 text-xs text-muted">
                    <Shield width={13} height={13} /> {o.secure}
                  </span>
                </div>
                {stripeEnabled ? (
                  <div className="mt-6">
                    <p className="text-[15px] leading-relaxed text-muted">{o.stripeText}</p>
                    <PillButton size="lg" className="mt-6 w-full" onClick={payWithStripe} disabled={busy !== null} icon={busy === "pay" ? <Loader width={16} height={16} /> : undefined}>
                      {busy === "pay" ? o.opening : fmt(o.payMonthly, { price })}
                    </PillButton>
                    {payError && <p className="mt-3 text-sm text-white/80">{payError}</p>}
                    <p className="mt-4 text-center text-xs text-muted-2">{o.stripeNote}</p>
                  </div>
                ) : (
                  <>
                    <form
                      className="mt-6 space-y-4"
                      onSubmit={(e) => {
                        e.preventDefault();
                        pay();
                      }}
                    >
                      <label className="block">
                        <FieldLabel className="mb-2">{o.cardName}</FieldLabel>
                        <Input autoComplete="cc-name" placeholder={o.cardNamePlaceholder} value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} />
                      </label>
                      <label className="block">
                        <FieldLabel className="mb-2">{o.cardNumber}</FieldLabel>
                        <Input
                          inputMode="numeric"
                          autoComplete="cc-number"
                          placeholder="4242 4242 4242 4242"
                          value={card.number}
                          onChange={(e) => setCard({ ...card, number: e.target.value.replace(/[^\d]/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ") })}
                        />
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <label className="block">
                          <FieldLabel className="mb-2">{o.expiry}</FieldLabel>
                          <Input inputMode="numeric" autoComplete="cc-exp" placeholder="MM/AA" value={card.exp} onChange={(e) => setCard({ ...card, exp: e.target.value.replace(/[^\d]/g, "").slice(0, 4).replace(/(\d{2})(?=\d)/, "$1/") })} />
                        </label>
                        <label className="block">
                          <FieldLabel className="mb-2">{o.code}</FieldLabel>
                          <Input inputMode="numeric" autoComplete="cc-csc" placeholder="123" value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/[^\d]/g, "").slice(0, 4) })} />
                        </label>
                      </div>
                      <PillButton type="submit" size="lg" className="mt-2 w-full" disabled={!cardReady || busy !== null} icon={busy === "pay" ? <Loader width={16} height={16} /> : undefined}>
                        {busy === "pay" ? o.paying : fmt(o.payAndBuild, { price })}
                      </PillButton>
                    </form>
                    <p className="mt-4 text-center text-xs text-muted-2">{o.demoNote}</p>
                  </>
                )}
              </div>

              <aside className="rounded-card border border-line bg-ink-2/40 p-6 sm:p-8 lg:col-span-2">
                <span className="label text-muted">{o.summary}</span>
                <h3 className="mt-4 text-2xl font-bold tracking-tight">{state.spec.name}</h3>
                <p className="mt-1 text-sm text-muted">{fmt(o.offer, { name: plan.name })}</p>
                <dl className="mt-6 space-y-3 border-t border-line pt-6 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted">{o.monthly}</dt>
                    <dd className="font-semibold">{price}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted">{o.setup}</dt>
                    <dd className="font-semibold">{formatEuro(0, locale)}</dd>
                  </div>
                  <div className="flex justify-between border-t border-line pt-3 text-base">
                    <dt className="font-semibold">{o.today}</dt>
                    <dd className="font-bold">{price}</dd>
                  </div>
                </dl>
                <p className="mt-4 text-xs leading-relaxed text-muted-2">{o.renew}</p>
                <div className="mt-6 border-t border-line pt-5 text-sm">
                  <p className="label text-muted">{o.account}</p>
                  <p className="mt-2 font-medium">{state.account.displayName}</p>
                  <p className="text-muted">{state.account.email}</p>
                  <Link href="/connexion?next=%2Fcreer%2Foffre" className="link-inline mt-2 inline-block text-xs hover:opacity-70">
                    {o.changeAccount}
                  </Link>
                </div>
                <button type="button" onClick={() => setPhase("plan")} className="link-inline mt-4 block text-xs hover:opacity-70">
                  {o.changeOffer}
                </button>
              </aside>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
