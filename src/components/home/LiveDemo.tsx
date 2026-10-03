"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { buildSteps } from "@/lib/data/build-steps";
import { BuildList } from "@/components/ui/BuildList";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";
import { PillButton } from "@/components/ui/PillButton";

const DEMO_PROMPT =
  "Un serveur RP sérieux en français, ambiance Los Santos réaliste. Police, EMS, mécano. Économie réaliste, whitelist, 64 joueurs.";

const items = buildSteps.map((s) => ({ id: s.id, label: s.label, detail: s.detail }));

/** Démo animée : le prompt se tape tout seul, puis la liste se coche jusqu'à « Serveur prêt ». */
export function LiveDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<"idle" | "typing" | "building" | "ready">("idle");
  const [completed, setCompleted] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const t = (fn: () => void, ms: number) => timers.push(setTimeout(fn, ms));

    // Frappe caractère par caractère
    let i = 0;
    const type = () => {
      if (cancelled) return;
      i += 1;
      setTyped(DEMO_PROMPT.slice(0, i));
      if (i < DEMO_PROMPT.length) t(type, 18 + Math.random() * 30);
      else t(startBuild, 600);
    };

    const startBuild = () => {
      if (cancelled) return;
      setPhase("building");
      let k = 0;
      const tick = () => {
        if (cancelled) return;
        k += 1;
        setCompleted(k);
        if (k < items.length) t(tick, 420 + Math.random() * 380);
        else t(() => setPhase("ready"), 500);
      };
      t(tick, 700);
    };

    t(() => {
      setTyped("");
      setCompleted(0);
      setPhase("typing");
      type();
    }, 400);
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [inView, cycle]);

  return (
    <section className="border-t border-line bg-ink" id="demo">
      <div className="container-x py-24 sm:py-32">
        <Reveal>
          <SectionHeading tag="Démo" title="Regarde-la construire." text="De la phrase à l'adresse de connexion. En vrai, ça prend à peu près le temps de cette animation." />
        </Reveal>

        <div ref={ref} className="mt-16 grid gap-6 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-5">
            <div className="flex h-full flex-col rounded-card border border-line bg-ink-2/60 p-6 sm:p-8">
              <span className="label text-muted">Ta description</span>
              <div className="mt-5 min-h-40 flex-1 text-xl font-medium leading-snug tracking-tight text-white sm:text-2xl">
                <span className={phase === "typing" ? "caret" : ""}>{typed || (phase === "idle" ? " " : "")}</span>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
                <span className="text-sm text-muted">{phase === "typing" ? "Saisie…" : phase === "idle" ? "" : "Envoyé à l'IA"}</span>
                <span className={`h-9 rounded-full px-5 text-sm font-semibold leading-9 transition-colors ${phase === "typing" || phase === "idle" ? "bg-white/10 text-white/50" : "bg-white text-ink"}`}>
                  Construire
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-7">
            <div className="rounded-card border border-line bg-ink-2/60 p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <span className="label text-muted">Construction</span>
                <span className="text-sm tabular-nums text-muted">{Math.round((completed / items.length) * 100)}&nbsp;%</span>
              </div>
              <ProgressBar value={completed / items.length} className="mt-4 rounded-full" label="Avancement de la construction" />
              <BuildList items={items} completed={completed} active={phase === "building"} compact className="mt-4" />
              <div className="mt-5 flex min-h-11 items-center justify-between gap-4 border-t border-line pt-5">
                {phase === "ready" ? (
                  <>
                    <div className="flex items-center gap-3">
                      <Tag>Serveur prêt</Tag>
                      <span className="hidden text-sm text-muted sm:inline">connect los-santos-legacy.servcraft.gg</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PillButton size="sm" variant="ghost" onClick={() => setCycle((c) => c + 1)}>
                        Rejouer
                      </PillButton>
                      <PillButton size="sm" href="/creer">
                        Créer le mien
                      </PillButton>
                    </div>
                  </>
                ) : (
                  <span className="text-sm text-muted">{phase === "building" ? "L'IA assemble ton serveur…" : "En attente de ta description"}</span>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
