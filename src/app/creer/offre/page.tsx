"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { plans, formatEuro } from "@/lib/data/pricing";
import { useWizard } from "@/lib/wizard-store";
import { signInWithDiscord, signInWithEmail } from "@/lib/services/auth";
import { checkout } from "@/lib/services/payments";
import type { PlanId } from "@/lib/types";
import { StepHeading } from "@/components/wizard/StepHeading";
import { PlanCard } from "@/components/home/Pricing";
import { PillButton } from "@/components/ui/PillButton";
import { Input, FieldLabel } from "@/components/ui/Field";
import { ArrowRight, Check, Discord, Loader, Mail, Shield } from "@/components/ui/Icons";

type Phase = "plan" | "account" | "payment";

const ease = [0.16, 1, 0.3, 1] as const;

export default function OffrePage() {
  const router = useRouter();
  const { state, hydrated, setPlan, setAccount, setPaid } = useWizard();
  const [phaseOverride, setPhase] = useState<Phase | null>(null);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState<null | "email" | "discord" | "pay">(null);
  const [card, setCard] = useState({ number: "", exp: "", cvc: "", name: "" });

  useEffect(() => {
    if (!hydrated) return;
    if (!state.spec) {
      router.replace(state.prompt ? "/creer/recap" : "/creer");
      return;
    }
    if (state.paid) router.replace("/creer/construction");
  }, [hydrated, state.spec, state.prompt, state.paid, router]);

  // Sous-étape dérivée du parcours sauvegardé, sauf si l'utilisateur navigue manuellement.
  const phase: Phase = phaseOverride ?? (state.plan && state.account ? "payment" : state.plan ? "account" : "plan");

  const plan = plans.find((p) => p.id === state.plan) ?? null;

  const choosePlan = (id: PlanId) => {
    setPlan(id);
    setTimeout(() => setPhase(state.account ? "payment" : "account"), 200);
  };

  const loginEmail = async () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) return;
    setBusy("email");
    const account = await signInWithEmail(email);
    setAccount(account);
    setBusy(null);
    setPhase("payment");
  };

  const loginDiscord = async () => {
    setBusy("discord");
    const account = await signInWithDiscord();
    setAccount(account);
    setBusy(null);
    setPhase("payment");
  };

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

  const cardReady = card.number.replace(/\s/g, "").length >= 12 && card.exp.length >= 4 && card.cvc.length >= 3 && card.name.trim().length > 1;

  const phases: Array<{ id: Phase; label: string }> = [
    { id: "plan", label: "Offre" },
    { id: "account", label: "Compte" },
    { id: "payment", label: "Paiement" },
  ];
  const phaseIndex = phases.findIndex((p) => p.id === phase);

  if (!hydrated || !state.spec) return null;

  return (
    <div className="flex flex-1 flex-col items-center">
      <StepHeading
        tag="Étape 4"
        title={phase === "plan" ? "Choisis ton offre." : phase === "account" ? "Crée ton compte." : "Dernière étape."}
        text={
          phase === "plan"
            ? `Pour ${state.spec.name} : ${state.spec.players} joueurs, économie ${state.spec.economy === "realiste" ? "réaliste" : state.spec.economy}. Tu pourras changer d'offre plus tard.`
            : phase === "account"
              ? "Pour retrouver ton serveur et ton panel. Trente secondes."
              : "Paiement sécurisé. La construction démarre immédiatement après."
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
                  <PlanCard key={p.id} plan={p} selected={state.plan === p.id} onSelect={choosePlan} badge={p.players === state.spec?.players ? "Recommandé" : undefined} />
                ))}
              </div>
              {state.plan && (
                <div className="mt-8 flex justify-end">
                  <PillButton onClick={() => setPhase(state.account ? "payment" : "account")} iconRight={<ArrowRight width={16} height={16} />}>
                    Continuer avec {plan?.name}
                  </PillButton>
                </div>
              )}
            </motion.div>
          )}

          {phase === "account" && (
            <motion.div key="account" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.45, ease }} className="mx-auto max-w-md">
              <div className="rounded-card border border-line bg-ink-2/60 p-6 sm:p-8">
                <PillButton variant="secondary" className="w-full" onClick={loginDiscord} disabled={busy !== null} icon={busy === "discord" ? <Loader width={16} height={16} /> : <Discord width={18} height={18} />}>
                  Continuer avec Discord
                </PillButton>
                <div className="my-6 flex items-center gap-4 text-xs text-muted-2">
                  <span className="h-px flex-1 bg-line" />
                  ou par e-mail
                  <span className="h-px flex-1 bg-line" />
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    loginEmail();
                  }}
                  className="space-y-3"
                >
                  <label className="block">
                    <FieldLabel className="mb-2">Adresse e-mail</FieldLabel>
                    <Input type="email" required autoComplete="email" placeholder="toi@exemple.fr" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </label>
                  <PillButton type="submit" className="w-full" disabled={busy !== null || !/^\S+@\S+\.\S+$/.test(email)} icon={busy === "email" ? <Loader width={16} height={16} /> : <Mail width={16} height={16} />}>
                    Créer mon compte
                  </PillButton>
                </form>
                <p className="mt-5 text-center text-xs leading-relaxed text-muted-2">
                  En continuant, tu acceptes nos{" "}
                  <Link href="/legal/cgv" className="link-inline">
                    conditions
                  </Link>{" "}
                  et notre{" "}
                  <Link href="/legal/confidentialite" className="link-inline">
                    politique de confidentialité
                  </Link>
                  .
                </p>
              </div>
            </motion.div>
          )}

          {phase === "payment" && plan && state.account && (
            <motion.div key="payment" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.45, ease }} className="grid gap-6 lg:grid-cols-5">
              <div className="rounded-card border border-line bg-ink-2/60 p-6 sm:p-8 lg:col-span-3">
                <div className="flex items-center justify-between">
                  <span className="label text-muted">Carte bancaire</span>
                  <span className="flex items-center gap-1.5 text-xs text-muted">
                    <Shield width={13} height={13} /> Paiement sécurisé
                  </span>
                </div>
                <form
                  className="mt-6 space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    pay();
                  }}
                >
                  <label className="block">
                    <FieldLabel className="mb-2">Nom sur la carte</FieldLabel>
                    <Input autoComplete="cc-name" placeholder="Prénom Nom" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} />
                  </label>
                  <label className="block">
                    <FieldLabel className="mb-2">Numéro de carte</FieldLabel>
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
                      <FieldLabel className="mb-2">Expiration</FieldLabel>
                      <Input inputMode="numeric" autoComplete="cc-exp" placeholder="MM/AA" value={card.exp} onChange={(e) => setCard({ ...card, exp: e.target.value.replace(/[^\d]/g, "").slice(0, 4).replace(/(\d{2})(?=\d)/, "$1/") })} />
                    </label>
                    <label className="block">
                      <FieldLabel className="mb-2">Code</FieldLabel>
                      <Input inputMode="numeric" autoComplete="cc-csc" placeholder="123" value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/[^\d]/g, "").slice(0, 4) })} />
                    </label>
                  </div>
                  <PillButton type="submit" size="lg" className="mt-2 w-full" disabled={!cardReady || busy !== null} icon={busy === "pay" ? <Loader width={16} height={16} /> : undefined}>
                    {busy === "pay" ? "Paiement en cours…" : `Payer ${formatEuro(plan.monthly)} et construire`}
                  </PillButton>
                </form>
                <p className="mt-4 text-center text-xs text-muted-2">Démonstration : aucun paiement réel n&apos;est effectué.</p>
              </div>

              <aside className="rounded-card border border-line bg-ink-2/40 p-6 sm:p-8 lg:col-span-2">
                <span className="label text-muted">Récapitulatif</span>
                <h3 className="mt-4 text-2xl font-bold tracking-tight">{state.spec.name}</h3>
                <p className="mt-1 text-sm text-muted">Offre {plan.name}</p>
                <dl className="mt-6 space-y-3 border-t border-line pt-6 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted">Abonnement mensuel</dt>
                    <dd className="font-semibold">{formatEuro(plan.monthly)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted">Frais de mise en place</dt>
                    <dd className="font-semibold">0 €</dd>
                  </div>
                  <div className="flex justify-between border-t border-line pt-3 text-base">
                    <dt className="font-semibold">Aujourd&apos;hui</dt>
                    <dd className="font-bold">{formatEuro(plan.monthly)}</dd>
                  </div>
                </dl>
                <p className="mt-4 text-xs leading-relaxed text-muted-2">Renouvelé chaque mois, sans engagement. Résiliable en un clic.</p>
                <div className="mt-6 border-t border-line pt-5 text-sm">
                  <p className="label text-muted">Compte</p>
                  <p className="mt-2 font-medium">{state.account.displayName}</p>
                  <p className="text-muted">{state.account.email}</p>
                  <button type="button" onClick={() => (setAccount(null), setPhase("account"))} className="link-inline mt-2 text-xs hover:opacity-70">
                    Changer de compte
                  </button>
                </div>
                <button type="button" onClick={() => setPhase("plan")} className="link-inline mt-4 block text-xs hover:opacity-70">
                  Changer d&apos;offre
                </button>
              </aside>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
