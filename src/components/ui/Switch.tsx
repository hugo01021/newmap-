"use client";

import { cn } from "@/lib/cn";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

/** Interrupteur ON/OFF. */
export function Switch({ checked, onChange, label, disabled }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors duration-300 disabled:opacity-40",
        checked ? "border-white bg-white" : "border-line-2 bg-ink-3",
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 rounded-full transition-transform duration-300 ease-out-expo",
          checked ? "translate-x-6 bg-ink" : "translate-x-1 bg-muted",
        )}
      />
    </button>
  );
}
