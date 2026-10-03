"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { buildSteps, totalBuildDuration } from "@/lib/data/build-steps";
import { runDeployment } from "@/lib/services/deploy";
import { useWizard } from "@/lib/wizard-store";
import { BuildList } from "@/components/ui/BuildList";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Tag } from "@/components/ui/Tag";
import { Logo } from "@/components/layout/Logo";

const items = buildSteps.map((s) => ({ id: s.id, label: s.label, detail: s.detail }));

export default function ConstructionPage() {
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
      router.replace("/creer/pret");
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
        c.timer = setTimeout(() => router.push("/creer/pret"), 1400);
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

  const currentStep = buildSteps[Math.min(completed, buildSteps.length - 1)];

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-ink">
      <ProgressBar value={progress} height={3} className="fixed inset-x-0 top-0 z-50" label="Construction du serveur" />
      <header className="container-x flex h-16 items-center justify-between sm:h-[72px]">
        <Logo href="/creer/construction" />
        <span className="label text-muted">Étape 5/7 · Construction</span>
      </header>

      <main className="container-x grid flex-1 items-center gap-12 pb-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <Tag>{done ? "Terminé" : "En cours"}</Tag>
            <h1 className="display mt-6 text-4xl sm:text-6xl">
              {done ? (
                <>
                  Serveur
                  <br />
                  prêt.
                </>
              ) : (
                <>
                  L&apos;IA construit
                  <br />
                  {state.spec?.name ?? "ton serveur"}.
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
                {done ? "Redirection vers ton serveur…" : `${currentStep.label} · ${currentStep.detail}`}
              </motion.p>
            </AnimatePresence>
            <p className="mt-10 max-w-sm text-sm leading-relaxed text-muted-2">
              Tu peux rester sur cette page. Une fois la construction terminée, tu recevras l&apos;adresse de connexion et l&apos;invitation Discord.
            </p>
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
