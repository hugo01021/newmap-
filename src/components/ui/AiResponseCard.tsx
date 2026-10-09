"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { fmt } from "@/lib/i18n/config";
import { useT } from "@/lib/i18n/client";
import type { AiProposal } from "@/lib/types";
import { PillButton } from "./PillButton";
import { Check, Spark } from "./Icons";

interface AiResponseCardProps {
  proposal: AiProposal;
  state?: "idle" | "publishing" | "published" | "cancelled";
  onPublish?: () => void;
  onCancel?: () => void;
  className?: string;
}

/** Carte de réponse de l'IA : résumé du changement + Publier / Annuler. */
export function AiResponseCard({ proposal, state = "idle", onPublish, onCancel, className }: AiResponseCardProps) {
  const t = useT();
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn("rounded-card border border-line bg-ink-2/80 p-5 sm:p-6", className)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-ink">
            <Spark width={14} height={14} />
          </span>
          <span className="label text-muted">
            {t.aiCard.by} · {proposal.area}
          </span>
        </div>
        <span
          className={cn(
            "label rounded-[3px] border px-2 py-1.5",
            proposal.impact === "important" ? "border-white/40 text-white" : "border-line text-muted",
          )}
        >
          {fmt(t.aiCard.impact, { level: t.aiCard.impacts[proposal.impact] })}
        </span>
      </div>

      <h3 className="mt-5 text-2xl font-bold tracking-tight">{proposal.title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-muted">{proposal.summary}</p>

      <ul className="mt-5 space-y-2.5 border-t border-line pt-5">
        {proposal.changes.map((c) => (
          <li key={c} className="flex items-start gap-3 text-sm text-white/90">
            <Check width={14} height={14} className="mt-1 shrink-0 text-muted" />
            {c}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {state === "published" ? (
          <span className="inline-flex items-center gap-2 text-sm font-semibold">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-ink">
              <Check width={11} height={11} strokeWidth={3} />
            </span>
            {t.aiCard.published}
          </span>
        ) : state === "cancelled" ? (
          <span className="text-sm text-muted">{t.aiCard.cancelled}</span>
        ) : (
          <>
            <PillButton onClick={onPublish} disabled={state === "publishing"}>
              {state === "publishing" ? t.aiCard.publishing : t.common.publish}
            </PillButton>
            <PillButton variant="secondary" onClick={onCancel} disabled={state === "publishing"}>
              {t.common.cancel}
            </PillButton>
          </>
        )}
      </div>
    </motion.div>
  );
}
