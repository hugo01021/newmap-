"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { localizedBuildSteps, totalBuildDuration } from "@/lib/data/build-steps";
import { useT } from "@/lib/i18n/client";
import { runDeployment } from "@/lib/services/deploy";
import { useWizard } from "@/lib/wizard-store";
import { BuildList } from "@/components/ui/BuildList";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Tag } from "@/components/ui/Tag";
import { Logo } from "@/components/layout/Logo";

export default function ConstructionPage() {
  const t = useT();
  const items = localizedBuildSteps(t);
  const router = useRouter();
  const { state, hydrated, setServer } = useWizard();
  const [completed, setCompleted] = useState(0);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const started = useRef(false);
  const cleanup = useRef<{ stop?: () => void; raf: number; timer?: ReturnType<typeof setTimeout> }>({ raf: 0 });

  useEffect(() => {
    if (!hydrated) return;
    if (!state.spec || !state.paid) {
      router.replace(state.spec ? "/creer/offre" : "/creer");
      return;
    }
    // La construction a déjà démarré (ou s'est terminée) sur cet écran : on ne relance rien.
    if (started.current) return;
    if (state.built && state.server) {
      router.replace("/creer/mise-en-ligne");
      return;
    }
    started.current = true;

    const t0 = performance.now();
    const c = cleanup.current;
    const tick = () => {
      const p = Math.min(0.995, (performance.now() - t0) / totalBuildDuration);
      setProgress(p);
      if (p < 0.995) c.raf = requestAnimationFrame(tick);
    };
    c.raf = requestAnimationFrame(tick);

    c.stop = runDeployment(
      state.spec,
      (i) => setCompleted(i + 1),
      (result) => {
        cancelAnimationFrame(c.raf);
        setProgress(1);
        setDone(true);
        setServer(result);
        c.timer = setTimeout(() => router.push("/creer/mise-en-ligne"), 1400);
      },
    );
  }, [hydrated, state.spec, state.paid, state.built, state.server, router, setServer]);

  // Nettoyage uniquement quand on quitte l'écran.
  useEffect(() => {
    const c = cleanup.current;
    return () => {
      c.stop?.();
      cancelAnimationFrame(c.raf);
      if (c.timer) clearTimeout(c.timer);
    };
  }, []);

  const currentStep = items[Math.min(completed, items.length - 1)];

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-ink">
      <ProgressBar value={progress} height={3} className="fixed inset-x-0 top-0 z-50" label={t.construction.aria} />
      <header className="container-x flex h-16 items-center justify-between sm:h-[72px]">
        <Logo href="/creer/construction" />
        <span className="label text-muted">{t.construction.label}</span>
      </header>

      <main className="container-x grid flex-1 items-center gap-12 pb-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <Tag>{done ? t.construction.done : t.construction.inProgress}</Tag>
            <h1 className="display mt-6 text-4xl sm:text-6xl">
              {done ? (
                <>
                  {t.construction.readyLine1}
                  <br />
                  {t.construction.readyLine2}
                </>
              ) : (
                <>
                  {t.construction.building}
                  <br />
                  {state.spec?.name ?? t.construction.fallbackName}.
                </>
              )}
            </h1>
            <div className="mt-8 flex items-baseline gap-4">
              <span className="display text-6xl tabular-nums sm:text-7xl">{Math.round(progress * 100)}</span>
              <span className="text-2xl text-muted">%</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={done ? "done" : currentStep.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mt-4 text-muted"
              >
                {done ? t.construction.redirect : `${currentStep.label} · ${currentStep.detail}`}
              </motion.p>
            </AnimatePresence>
            <p className="mt-10 max-w-sm text-sm leading-relaxed text-muted-2">{t.construction.stay}</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="rounded-card border border-line bg-ink-2/60 p-6 sm:p-8 lg:col-span-7"
        >
          <BuildList items={items} completed={completed} active={!done} />
        </motion.div>
      </main>
    </div>
  );
}
