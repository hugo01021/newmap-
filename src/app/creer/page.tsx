"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { examplePrompts } from "@/lib/data/prompts";
import { useWizard } from "@/lib/wizard-store";
import { isPlanId } from "@/lib/data/pricing";
import { StepHeading } from "@/components/wizard/StepHeading";
import { PillButton } from "@/components/ui/PillButton";
import { ArrowRight } from "@/components/ui/Icons";

const MIN = 20;

function DescribeStep() {
  const router = useRouter();
  const params = useSearchParams();
  const { state, hydrated, setPrompt, setPlan, newServer } = useWizard();
  const [draft, setValue] = useState<string | null>(null);
  // Tant que l'utilisateur n'a pas tapé, on affiche le prompt sauvegardé.
  const value = draft ?? (hydrated ? state.prompt : "");
  const ref = useRef<HTMLTextAreaElement>(null);

  // Offre pré-sélectionnée depuis la section tarifs.
  useEffect(() => {
    const offre = params.get("offre");
    if (isPlanId(offre)) setPlan(offre);
  }, [params, setPlan]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.max(el.scrollHeight, 160)}px`;
  }, [value]);

  const ready = value.trim().length >= MIN;

  const submit = () => {
    if (!ready) return;
    // Un serveur déjà payé ou construit : on démarre un nouveau parcours (le compte est conservé).
    if (state.paid || state.built) newServer();
    setPrompt(value.trim());
    router.push("/creer/questions");
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <StepHeading tag="Étape 1" title="Décris ton serveur." text="Comme si tu l'expliquais à un ami. L'ambiance, les métiers, les gangs, le niveau de sérieux. L'IA complète le reste." />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="mt-12 w-full max-w-3xl"
      >
        <div className="rounded-card border border-line bg-ink-2/60 p-2 transition-colors focus-within:border-white/40">
          <textarea
            ref={ref}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") submit();
            }}
            placeholder="Un serveur RP sérieux en français, ambiance Los Santos réaliste. Police, EMS, mécano…"
            className="block w-full resize-none bg-transparent px-5 py-4 text-lg leading-relaxed text-white placeholder:text-muted-2 focus:outline-none sm:text-2xl sm:leading-snug"
            rows={4}
            autoFocus
            aria-label="Description de ton serveur"
          />
          <div className="flex items-center justify-between gap-4 px-3 pb-2 pt-1">
            <span className={cn("text-xs tabular-nums", ready ? "text-muted" : "text-muted-2")}>
              {ready ? "Prêt." : `Encore ${Math.max(0, MIN - value.trim().length)} caractères`}
              <span className="hidden sm:inline"> · Ctrl + Entrée pour continuer</span>
            </span>
            <PillButton onClick={submit} disabled={!ready} iconRight={<ArrowRight width={16} height={16} />}>
              Continuer
            </PillButton>
          </div>
        </div>

        <p className="label mt-10 text-muted">Ou pars d&apos;un exemple</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {examplePrompts.map((ex) => (
            <button
              key={ex.title}
              type="button"
              onClick={() => {
                setValue(ex.prompt);
                ref.current?.focus();
              }}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300",
                value === ex.prompt ? "border-white bg-white text-ink" : "border-line text-white hover:border-white/40",
              )}
            >
              {ex.title}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default function CreerPage() {
  return (
    <Suspense fallback={null}>
      <DescribeStep />
    </Suspense>
  );
}
