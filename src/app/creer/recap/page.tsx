"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useWizard } from "@/lib/wizard-store";
import { useLocale } from "@/lib/i18n/client";
import { generateSpec } from "@/lib/services/ai";
import { serverLanguages, type EconomyMode, type PlayerCount, type Seriousness } from "@/lib/types";
import { StepHeading } from "@/components/wizard/StepHeading";
import { EditableText, OptionPicker, TagList } from "@/components/wizard/EditableField";
import { PillButton } from "@/components/ui/PillButton";
import { ArrowRight, Loader, Spark } from "@/components/ui/Icons";

export default function RecapPage() {
  const { t, locale } = useLocale();
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
    generateSpec(state.prompt, state.answers, locale, t).then((spec) => {
      setSpec(spec);
      inflight.current = false;
    });
  }, [hydrated, state.prompt, state.answers, state.spec, setSpec, router, locale, t]);

  const spec = state.spec;

  if (!hydrated || !spec) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-ink">
            <Loader width={22} height={22} />
          </span>
          <p className="display mt-8 text-3xl sm:text-4xl">{t.recap.loadingTitle}</p>
          <p className="mt-3 text-muted">{t.recap.loadingText}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center">
      <StepHeading tag={t.recap.tag} title={t.recap.title} text={t.recap.text} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="mt-12 w-full max-w-4xl"
      >
        <div className="overflow-hidden rounded-card border border-line bg-ink-2/60">
          <div className="flex items-center gap-2.5 border-b border-line px-6 py-4 text-muted sm:px-8">
            <Spark width={14} height={14} />
            <span className="label">{t.recap.generated}</span>
          </div>

          <div className="grid divide-y divide-line px-6 sm:px-8 md:grid-cols-2 md:gap-x-10 md:divide-y-0">
            <div className="divide-y divide-line">
              <EditableText label={t.recap.name} value={spec.name} onChange={(name) => patchSpec({ name })} large />
              <EditableText label={t.recap.tagline} value={spec.tagline} onChange={(tagline) => patchSpec({ tagline })} />
              <OptionPicker
                label={t.recap.language}
                value={spec.language}
                options={serverLanguages.map((v) => ({ value: v, label: t.recap.languages[v] }))}
                onChange={(language) => patchSpec({ language })}
              />
              <OptionPicker<Seriousness>
                label={t.recap.style}
                value={spec.style}
                options={(["casual", "semi", "hardcore"] as Seriousness[]).map((v) => ({ value: v, label: t.labels.seriousness[v] }))}
                onChange={(style) => patchSpec({ style })}
              />
              <OptionPicker<PlayerCount>
                label={t.recap.players}
                value={spec.players}
                options={([32, 64, 128, 256] as PlayerCount[]).map((v) => ({ value: v, label: String(v) }))}
                onChange={(players) => patchSpec({ players })}
              />
              <OptionPicker<EconomyMode>
                label={t.recap.economy}
                value={spec.economy}
                options={(["rapide", "realiste", "hardcore"] as EconomyMode[]).map((v) => ({ value: v, label: t.labels.economy[v] }))}
                onChange={(economy) => patchSpec({ economy })}
              />
            </div>
            <div className="divide-y divide-line">
              <TagList label={t.recap.jobs} items={spec.jobs} onChange={(jobs) => patchSpec({ jobs })} placeholder={t.recap.addJob} />
              <TagList label={t.recap.gangs} items={spec.gangs} onChange={(gangs) => patchSpec({ gangs })} placeholder={t.recap.addGang} />
              <TagList label={t.recap.options} items={spec.options} onChange={(options) => patchSpec({ options })} placeholder={t.recap.addOption} />
            </div>
          </div>

          <div className="border-t border-line px-6 py-5 sm:px-8">
            <p className="label text-muted">{t.recap.description}</p>
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
            {t.recap.regenerate}
          </button>
          <PillButton size="lg" href="/creer/offre" iconRight={<ArrowRight width={16} height={16} />}>
            {t.recap.build}
          </PillButton>
        </div>
      </motion.div>
    </div>
  );
}
