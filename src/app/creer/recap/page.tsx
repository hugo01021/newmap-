"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useWizard, labels } from "@/lib/wizard-store";
import { generateSpec } from "@/lib/services/ai";
import type { EconomyMode, PlayerCount, Seriousness } from "@/lib/types";
import { StepHeading } from "@/components/wizard/StepHeading";
import { EditableText, OptionPicker, TagList } from "@/components/wizard/EditableField";
import { PillButton } from "@/components/ui/PillButton";
import { ArrowRight, Loader, Spark } from "@/components/ui/Icons";

export default function RecapPage() {
  const router = useRouter();
  const { state, hydrated, setSpec, patchSpec } = useWizard();
  const inflight = useRef(false);

  useEffect(() => {
    if (!hydrated) return;
    if (!state.prompt) {
      router.replace("/creer");
      return;
    }
    if (state.spec || inflight.current) return;
    inflight.current = true;
    generateSpec(state.prompt, state.answers).then((spec) => {
      setSpec(spec);
      inflight.current = false;
    });
  }, [hydrated, state.prompt, state.answers, state.spec, setSpec, router]);

  const spec = state.spec;

  if (!hydrated || !spec) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-ink">
            <Loader width={22} height={22} />
          </span>
          <p className="display mt-8 text-3xl sm:text-4xl">L&apos;IA prépare ta fiche…</p>
          <p className="mt-3 text-muted">Elle lit ta description et tes réponses.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center">
      <StepHeading tag="Étape 3" title="Voici ton serveur." text="Vérifie, ajuste ce que tu veux. Tout reste modifiable plus tard depuis ton panel." />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="mt-12 w-full max-w-4xl"
      >
        <div className="overflow-hidden rounded-card border border-line bg-ink-2/60">
          <div className="flex items-center gap-2.5 border-b border-line px-6 py-4 text-muted sm:px-8">
            <Spark width={14} height={14} />
            <span className="label">Fiche générée par l&apos;IA</span>
          </div>

          <div className="grid divide-y divide-line px-6 sm:px-8 md:grid-cols-2 md:gap-x-10 md:divide-y-0">
            <div className="divide-y divide-line">
              <EditableText label="Nom du serveur" value={spec.name} onChange={(name) => patchSpec({ name })} large />
              <EditableText label="Accroche" value={spec.tagline} onChange={(tagline) => patchSpec({ tagline })} />
              <OptionPicker
                label="Langue"
                value={spec.language}
                options={[
                  { value: "Français", label: "Français" },
                  { value: "Anglais", label: "Anglais" },
                ]}
                onChange={(language) => patchSpec({ language })}
              />
              <OptionPicker<Seriousness>
                label="Niveau de sérieux"
                value={spec.style}
                options={(["casual", "semi", "hardcore"] as Seriousness[]).map((v) => ({ value: v, label: labels.seriousness[v] }))}
                onChange={(style) => patchSpec({ style })}
              />
              <OptionPicker<PlayerCount>
                label="Joueurs"
                value={spec.players}
                options={([32, 64, 128, 256] as PlayerCount[]).map((v) => ({ value: v, label: String(v) }))}
                onChange={(players) => patchSpec({ players })}
              />
              <OptionPicker<EconomyMode>
                label="Économie"
                value={spec.economy}
                options={(["rapide", "realiste", "hardcore"] as EconomyMode[]).map((v) => ({ value: v, label: labels.economy[v] }))}
                onChange={(economy) => patchSpec({ economy })}
              />
            </div>
            <div className="divide-y divide-line">
              <TagList label="Jobs" items={spec.jobs} onChange={(jobs) => patchSpec({ jobs })} placeholder="Ajouter un job…" />
              <TagList label="Gangs" items={spec.gangs} onChange={(gangs) => patchSpec({ gangs })} placeholder="Ajouter un gang…" />
              <TagList label="Options" items={spec.options} onChange={(options) => patchSpec({ options })} placeholder="Ajouter une option…" />
            </div>
          </div>

          <div className="border-t border-line px-6 py-5 sm:px-8">
            <p className="label text-muted">Ta description</p>
            <p className="mt-2 text-sm leading-relaxed text-white/80">{state.prompt}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              setSpec(null);
            }}
            className="link-inline text-sm hover:opacity-70"
          >
            Régénérer la fiche
          </button>
          <PillButton size="lg" href="/creer/offre" iconRight={<ArrowRight width={16} height={16} />}>
            Construire mon serveur
          </PillButton>
        </div>
      </motion.div>
    </div>
  );
}
