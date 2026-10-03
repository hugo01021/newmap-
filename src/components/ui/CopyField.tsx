"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { PillButton } from "./PillButton";
import { Check, Copy } from "./Icons";

interface CopyFieldProps {
  label?: string;
  value: string;
  className?: string;
  /** Version compacte, sans carte autour. */
  inline?: boolean;
}

/** Valeur à copier en un clic (adresse de connexion, clé, lien). */
export function CopyField({ label, value, className, inline }: CopyFieldProps) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* presse-papiers indisponible */
    }
  };
  const button = (
    <PillButton size="sm" variant="secondary" onClick={copy} icon={copied ? <Check width={14} height={14} /> : <Copy width={14} height={14} />}>
      {copied ? "Copié" : "Copier"}
    </PillButton>
  );
  if (inline) {
    return (
      <div className={cn("flex items-center justify-between gap-3 rounded-md border border-line bg-ink-2 py-2 pl-4 pr-2", className)}>
        <code className="truncate text-sm font-semibold tracking-tight sm:text-base">{value}</code>
        {button}
      </div>
    );
  }
  return (
    <div className={cn("rounded-card border border-line bg-ink-2/60 p-5 sm:p-6", className)}>
      {label && <p className="label text-muted">{label}</p>}
      <div className="mt-3 flex items-center justify-between gap-4">
        <code className="truncate text-base font-semibold tracking-tight sm:text-lg">{value}</code>
        {button}
      </div>
    </div>
  );
}
