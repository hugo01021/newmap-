"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useWizard } from "@/lib/wizard-store";
import { fmt } from "@/lib/i18n/config";
import { useLocale } from "@/lib/i18n/client";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import type { PlayerCount, WizardAnswers } from "@/lib/types";
import { StepHeading } from "@/components/wizard/StepHeading";
import { ChoiceCard } from "@/components/ui/ChoiceCard";
import { PillButton } from "@/components/ui/PillButton";
import { ArrowLeft, ArrowRight } from "@/components/ui/Icons";
import { cn } from "@/lib/cn";
import { formatEuro, planForPlayers } from "@/lib/data/pricing";

type AnswerValue = NonNullable<WizardAnswers[keyof WizardAnswers]>;

interface Question {
  key: keyof WizardAnswers;
  title: string;
  text: string;
  options: Array<{ value: AnswerValue; label: string; description: string }>;
  cols: 2 | 3 | 4;
}

function buildQuestions(t: Dictionary, locale: Locale): Question[] {
  const q = t.questions;
  const players = ([32, 64, 128, 256] as PlayerCount[]).map((n) => ({
    value: n,
    label: String(n),
    description: `${q.players[`p${n}` as "p32" | "p64" | "p128" | "p256"]} · ${formatEuro(planForPlayers(n).monthly, locale)} ${t.common.perMonth}`,
  }));
  return [
    {
      key: "seriousness",
      title: q.seriousness.title,
      text: q.seriousness.text,
      cols: 3,
      options: [
        { value: "casual", label: t.labels.seriousness.casual, description: q.seriousness.casual },
        { value: "semi", label: t.labels.seriousness.semi, description: q.seriousness.semi },
        { value: "hardcore", label: t.labels.seriousness.hardcore, description: q.seriousness.hardcore },
      ],
    },
    { key: "players", title: q.players.title, text: q.players.text, cols: 4, options: players },
    {
      key: "economy",
      title: q.economy.title,
      text: q.economy.text,
      cols: 3,
      options: [
        { value: "rapide", label: t.labels.economy.rapide, description: q.economy.rapide },
        { value: "realiste", label: t.labels.economy.realiste, description: q.economy.realiste },
        { value: "hardcore", label: t.labels.economy.hardcore, description: q.economy.hardcore },
      ],
    },
    {
      key: "whitelist",
      title: q.whitelist.title,
      text: q.whitelist.text,
      cols: 2,
      options: [
        { value: true, label: q.yes, description: q.whitelist.yes },
        { value: false, label: q.no, description: q.whitelist.no },
      ],
    },
    {
      key: "discord",
      title: q.discord.title,
      text: q.discord.text,
      cols: 2,
      options: [
        { value: true, label: q.yes, description: q.discord.yes },
        { value: false, label: q.no, description: q.discord.no },
      ],
    },
  ];
}

export default function QuestionsPage() {
  const { t, locale } = useLocale();
  const router = useRouter();
  const { state, hydrated, answer } = useWizard();
  const questions = useMemo(() => buildQuestions(t, locale), [t, locale]);
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
  const answered = useMemo(() => questions.filter((qq) => state.answers[qq.key] !== undefined).length, [questions, state.answers]);

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
      <div className="mb-8 flex items-center gap-2" aria-label={fmt(t.questions.aria, { i: i + 1, n: questions.length })}>
        {questions.map((qq, k) => (
          <button
            key={qq.key}
            type="button"
            onClick={() => goTo(k)}
            disabled={k > answered}
            aria-label={fmt(t.questions.one, { i: k + 1 })}
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
          <StepHeading tag={fmt(t.questions.tag, { i: i + 1, n: questions.length })} title={q.title} text={q.text} />
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
          {t.common.back}
        </PillButton>
        {current !== undefined && (
          <PillButton
            variant="secondary"
            onClick={() => (isLast ? router.push("/creer/recap") : goTo(i + 1))}
            iconRight={<ArrowRight width={16} height={16} />}
          >
            {isLast ? t.questions.seeRecap : t.common.next}
          </PillButton>
        )}
      </div>
    </div>
  );
}
