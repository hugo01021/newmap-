"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { Check, Loader } from "./Icons";

export interface BuildListItem {
  id: string;
  label: string;
  detail?: string;
}

interface BuildListProps {
  items: BuildListItem[];
  /** Nombre d'éléments terminés. */
  completed: number;
  /** Affiche la ligne en cours comme active (avec spinner). */
  active?: boolean;
  compact?: boolean;
  className?: string;
}

/** Liste de construction qui se coche ligne par ligne. */
export function BuildList({ items, completed, active = true, compact, className }: BuildListProps) {
  return (
    <ul className={cn("divide-y divide-line", className)}>
      {items.map((item, i) => {
        const done = i < completed;
        const current = active && i === completed;
        const pending = i > completed || (!active && i === completed);
        return (
          <li
            key={item.id}
            className={cn(
              "flex items-center gap-4 transition-colors duration-500",
              compact ? "py-2.5" : "py-3.5 sm:py-4",
              pending ? "text-muted-2" : "text-white",
            )}
          >
            <span
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-500",
                done ? "border-white bg-white text-ink" : current ? "border-white text-white" : "border-line-2 text-transparent",
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                {done ? (
                  <motion.span key="done" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex">
                    <Check width={12} height={12} strokeWidth={3} />
                  </motion.span>
                ) : current ? (
                  <motion.span key="cur" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex">
                    <Loader width={12} height={12} strokeWidth={2.5} />
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </span>
            <div className="flex min-w-0 flex-1 items-baseline justify-between gap-4">
              <span className={cn("font-semibold tracking-tight", compact ? "text-sm" : "text-base sm:text-lg")}>{item.label}</span>
              {item.detail && !compact && (
                <span className="hidden truncate text-sm text-muted sm:block">{item.detail}</span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
