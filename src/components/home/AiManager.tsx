"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";
import type { AiProposal } from "@/lib/types";
import { AiResponseCard } from "@/components/ui/AiResponseCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PillButton } from "@/components/ui/PillButton";

const examples: AiProposal[] = [
  {
    id: "ex-1",
    request: "Divise le salaire des policiers par 2",
    area: "Jobs",
    title: "Salaire Police divisé par 2",
    summary: "Le salaire des membres du job Police sera divisé par 2 pour tous les grades. Les paies déjà versées ne changent pas.",
    changes: ["Salaire de base Police : 2 400 € → 1 200 € par heure", "Grades intermédiaires et supérieurs recalculés", "Annonce automatique dans le salon Discord de la police"],
    impact: "moyen",
  },
  {
    id: "ex-2",
    request: "Ajoute un braquage de banque avec 4 policiers minimum",
    area: "Gameplay",
    title: "Nouveau braquage de banque",
    summary: "Un braquage de banque sera disponible, uniquement quand au moins 4 policiers sont en service. Butin et recharge équilibrés selon ton économie.",
    changes: ["Braquage de banque activé", "Condition : 4 policiers minimum en service", "Butin : 45 000 à 80 000 €", "Recharge : 2 heures", "Alerte envoyée à la police"],
    impact: "important",
  },
  {
    id: "ex-3",
    request: "Rends la whitelist obligatoire à partir de 20h",
    area: "Paramètres",
    title: "Whitelist horaire activée",
    summary: "De 20h à 6h, seuls les joueurs whitelistés pourront se connecter. Le reste du temps, l'accès reste libre.",
    changes: ["Plage whitelist : 20h → 6h", "Message d'accueil expliquant la règle", "Lien de candidature Discord affiché aux refusés"],
    impact: "moyen",
  },
];

export function AiManager() {
  const [active, setActive] = useState(0);
  const [states, setStates] = useState<Record<string, "idle" | "publishing" | "published" | "cancelled">>({});

  const setState = (id: string, s: "idle" | "publishing" | "published" | "cancelled") => setStates((prev) => ({ ...prev, [id]: s }));

  const publish = (id: string) => {
    setState(id, "publishing");
    setTimeout(() => setState(id, "published"), 1300);
  };

  const proposal = examples[active];

  return (
    <section className="border-t border-line bg-ink" id="ia">
      <div className="container-x py-24 sm:py-32">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionHeading tag="Ton IA de gestion" title="Tu parles. Elle modifie." text="Plus de menus interminables. Tu dis ce que tu veux changer, l'IA te montre exactement ce qu'elle va faire, et tu publies quand tu es d'accord." />
            </Reveal>
            <Reveal delay={0.1}>
              <ul className="mt-10 space-y-2">
                {examples.map((ex, i) => (
                  <li key={ex.id}>
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      className={cn(
                        "w-full rounded-md border px-4 py-3.5 text-left text-[15px] font-medium transition-all duration-300",
                        i === active ? "border-white bg-white text-ink" : "border-line text-white hover:border-white/40",
                      )}
                    >
                      «&nbsp;{ex.request}&nbsp;»
                    </button>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-8">
                <PillButton href="/panel" variant="secondary">
                  Découvrir le panel
                </PillButton>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={0.1}>
              <div className="rounded-card border border-line bg-ink-2/40 p-4 sm:p-6">
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-br-md bg-white px-4 py-3 text-[15px] font-medium text-ink">{proposal.request}</div>
                </div>
                <div className="mt-4">
                  <AnimatePresence mode="wait">
                    <motion.div key={proposal.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                      <AiResponseCard
                        proposal={proposal}
                        state={states[proposal.id] ?? "idle"}
                        onPublish={() => publish(proposal.id)}
                        onCancel={() => setState(proposal.id, "cancelled")}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
