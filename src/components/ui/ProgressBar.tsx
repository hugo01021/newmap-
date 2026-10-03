"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface ProgressBarProps {
  /** De 0 à 1. */
  value: number;
  className?: string;
  height?: number;
  label?: string;
}

/** Barre de progression fine. */
export function ProgressBar({ value, className, height = 2, label }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(1, value));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct * 100)}
      aria-label={label}
      className={cn("w-full overflow-hidden bg-white/10", className)}
      style={{ height }}
    >
      <motion.div
        className="h-full bg-white"
        initial={false}
        animate={{ width: `${pct * 100}%` }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}
