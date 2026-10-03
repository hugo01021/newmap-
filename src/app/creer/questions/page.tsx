"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useWizard } from "@/lib/wizard-store";
import type { WizardAnswers } from "@/lib/types";
import { StepHeading } from "@/components/wizard/StepHeading";
import { ChoiceCard } from "@/components/ui/ChoiceCard";
import { PillButton } from "@/components/ui/PillButton";
import { ArrowLeft, ArrowRight } from "@/components/ui/Icons";
import { cn } from "@/lib/cn";

type AnswerValue = NonNullable<WizardAnswers[keyof WizardAnswers]>;

interface Question {
  key: keyof WizardAnswers;
  title: string;
  text: string;
  options: Array<{ value: AnswerValue; label: string; description: string }>;
  cols: 2 | 3 | 4;
}

const questions: Question[] = [
  {
    key: "seriousness",
    title: "Quel niveau de sérieux ?",
    text: "Ça change les règles, le ton du Discord et la façon dont l'IA équilibre le jeu.",
    cols: 3,
    options: [
      { value: "casual", label: "Casual", description: "On joue pour s'amuser. Règles légères, accès rapide, beaucoup d'action." },
      { value: "semi", label: "Semi-RP", description: "Un bon équilibre : on respecte le RP, mais on reste accessible." },
      { value: "hardcore", label: "Hardcore RP", description: "Immersion totale. Règles strictes, conséquences réelles, whitelist conseillée." },
    ],
  },
  {
    key: "players",
    title: "Combien de joueurs ?",
    text: "Tu pourras augmenter plus tard. Commence avec ce qui te semble réaliste pour ton lancement.",
    cols: 4,
    options: [
      { value: 32, label: "32", description: "Une communauté intime." },
      { value: 64, label: "64", description: "Le format classique." },
      { value: 128, label: "128", description: "Une vraie ville animée." },
      { value: 256, label: "256", description: "Grande échelle." },
    ],
  },
  {
    key: "economy",
    title: "Quelle économie ?",
    text: "La vitesse à laquelle on gagne de l'argent et le prix des choses.",
    cols: 3,
    options: [
      { value: "rapide", label: "Rapide", description: "Les joueurs achètent une voiture le premier soir." },
      { value: "realiste", label: "Réaliste", description: "Il faut travailler quelques jours pour s'installer." },
      { value: "hardcore", label: "Hardcore", description: "Chaque euro compte. Posséder une maison est un accomplissement." },
    ],
  },
  {
    key: "whitelist",
    title: "Whitelist ?",
    text: "Avec une whitelist, les joueurs candidatent sur Discord avant de pouvoir se connecter.",
    cols: 2,
    options: [
      { value: true, label: "Oui", description: "Une communauté filtrée, un RP plus propre." },
      { value: false, label: "Non", description: "Tout le monde peut rejoindre immédiatement." },
    ],
  },
  {
    key: "discord",
    title: "Discord automatique ?",
    text: "On génère ton Discord complet : salons, rôles, règlement, candidatures. Il reste synchronisé avec le serveur.",
    cols: 2,
    options: [
      { value: true, label: "Oui", description: "Tout prêt, en même temps que le serveur." },
      { value: false, label: "Non", description: "Tu as déjà ton Discord ou tu préfères sans." },
    ],
  },
];

export default function QuestionsPage() {
  const router = useRouter();
  const { state, hydrated, answer } = useWizard();
  const [manualIndex, setI] = useState<number | null>(null);
  const [dir, setDir] = useState(1);
  // Sans navigation manuelle, on reprend à la première question sans réponse.
  const firstUnanswered = questions.findIndex((q) => state.answers[q.key] === undefined);
  const i = manualIndex ?? (firstUnanswered === -1 ? questions.length - 1 : firstUnanswered);

  useEffect(() => {
    if (hydrated && !state.prompt) router.replace("/creer");
  }, [hydrated, state.prompt, router]);

  const q = questions[i];
  const current = state.answers[q.key];
  const isLast = i === questions.length - 1;
  const answered = useMemo(() => questions.filter((qq) => state.answers[qq.key] !== undefined).length, [state.answers]);

  const goTo = (k: number) => {
    setDir(k < i ? -1 : 1);
    setI(k);
  };

  const choose = (value: AnswerValue) => {
    setI(i); // fige la question le temps de l'animation de sélection
    answer({ [q.key]: value } as Partial<WizardAnswers>);
    setTimeout(() => {
      if (isLast) router.push("/creer/recap");
      else goTo(i + 1);
    }, 260);
  };

  const back = () => {
    if (i === 0) router.push("/creer");
    else goTo(i - 1);
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="mb-8 flex items-center gap-2" aria-label={`Question ${i + 1} sur ${questions.length}`}>
        {questions.map((qq, k) => (
          <button
            key={qq.key}
            type="button"
            onClick={() => goTo(k)}
            disabled={k > answered}
            aria-label={`Question ${k + 1}`}
            className={cn(
              "h-1.5 rounded-full transition-all duration-500",
              k === i ? "w-8 bg-white" : state.answers[qq.key] !== undefined ? "w-3 bg-white/60" : "w-3 bg-white/15",
            )}
          />
        ))}
      </div>

      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={q.key}
          custom={dir}
          initial={{ opacity: 0, x: dir * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: dir * -40 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-5xl"
        >
          <StepHeading tag={`Question ${i + 1} / ${questions.length}`} title={q.title} text={q.text} />
          <div
            className={cn(
              "mt-12 grid gap-3 sm:gap-4",
              q.cols === 2 && "sm:grid-cols-2",
              q.cols === 3 && "sm:grid-cols-3",
              q.cols === 4 && "grid-cols-2 lg:grid-cols-4",
            )}
          >
            {q.options.map((opt) => (
              <ChoiceCard
                key={String(opt.value)}
                title={opt.label}
                description={opt.description}
                selected={current === opt.value}
                onSelect={() => choose(opt.value)}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-10 flex w-full max-w-5xl items-center justify-between">
        <PillButton variant="ghost" onClick={back} icon={<ArrowLeft width={16} height={16} />}>
          Retour
        </PillButton>
        {current !== undefined && (
          <PillButton
            variant="secondary"
            onClick={() => (isLast ? router.push("/creer/recap") : goTo(i + 1))}
            iconRight={<ArrowRight width={16} height={16} />}
          >
            {isLast ? "Voir le récapitulatif" : "Suivant"}
          </PillButton>
        )}
      </div>
    </div>
  );
}
