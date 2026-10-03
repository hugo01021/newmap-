"use client";

import { cn } from "@/lib/cn";
import { Check } from "./Icons";

interface ChoiceCardProps {
  title: string;
  description?: string;
  selected?: boolean;
  onSelect: () => void;
  size?: "md" | "lg";
}

/** Grande carte cliquable pour une réponse. */
export function ChoiceCard({ title, description, selected, onSelect, size = "lg" }: ChoiceCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "group relative flex w-full flex-col items-start justify-between rounded-card border text-left transition-all duration-300 ease-out-expo",
        size === "lg" ? "min-h-40 p-6 sm:min-h-52 sm:p-7" : "min-h-28 p-5",
        selected
          ? "border-white bg-white text-ink"
          : "border-line bg-ink-2/60 text-white hover:border-white/40 hover:bg-ink-3",
      )}
    >
      <span
        className={cn(
          "absolute right-5 top-5 flex h-6 w-6 items-center justify-center rounded-full border transition-colors",
          selected ? "border-ink bg-ink text-white" : "border-line-2 text-transparent group-hover:border-white/50",
        )}
      >
        <Check width={13} height={13} strokeWidth={2.5} />
      </span>
      <span className={cn("display", size === "lg" ? "text-3xl sm:text-4xl" : "text-xl")}>{title}</span>
      {description && (
        <span className={cn("mt-4 text-sm leading-relaxed", selected ? "text-ink/70" : "text-muted")}>{description}</span>
      )}
    </button>
  );
}
