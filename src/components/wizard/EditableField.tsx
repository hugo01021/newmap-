"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { Check, Pencil } from "@/components/ui/Icons";

interface EditableTextProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  large?: boolean;
}

/** Valeur affichée, modifiable au clic sur le crayon. */
export function EditableText({ label, value, onChange, large }: EditableTextProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const commit = () => {
    const v = draft.trim();
    if (v) onChange(v);
    else setDraft(value);
    setEditing(false);
  };

  return (
    <div className="group flex items-start justify-between gap-4 py-4">
      <div className="min-w-0 flex-1">
        <p className="label text-muted">{label}</p>
        {editing ? (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") {
                setDraft(value);
                setEditing(false);
              }
            }}
            className={cn("mt-2 w-full border-b border-white bg-transparent pb-1 text-white focus:outline-none", large ? "text-3xl font-bold tracking-tight" : "text-lg font-semibold")}
            aria-label={label}
          />
        ) : (
          <p className={cn("mt-2 text-white", large ? "display text-3xl sm:text-4xl" : "text-lg font-semibold tracking-tight")}>{value}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => (editing ? commit() : (setDraft(value), setEditing(true)))}
        aria-label={editing ? `Valider ${label}` : `Modifier ${label}`}
        className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-white/50 hover:text-white"
      >
        {editing ? <Check width={14} height={14} /> : <Pencil width={14} height={14} />}
      </button>
    </div>
  );
}

interface OptionPickerProps<T extends string | number> {
  label: string;
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (v: T) => void;
}

/** Valeur à choix, modifiable via une rangée de pilules. */
export function OptionPicker<T extends string | number>({ label, value, options, onChange }: OptionPickerProps<T>) {
  return (
    <div className="py-4">
      <p className="label text-muted">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={String(o.value)}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={o.value === value}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300",
              o.value === value ? "border-white bg-white text-ink" : "border-line text-white hover:border-white/40",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

interface TagListProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}

/** Liste de valeurs (jobs, gangs, options) avec ajout et suppression. */
export function TagList({ label, items, onChange, placeholder = "Ajouter…" }: TagListProps) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const v = draft.trim();
    if (v && !items.includes(v)) onChange([...items, v]);
    setDraft("");
  };
  return (
    <div className="py-4">
      <p className="label text-muted">{label}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {items.map((it) => (
          <span key={it} className="group inline-flex items-center gap-2 rounded-full border border-line-2 py-1.5 pl-3.5 pr-2 text-sm font-semibold text-white">
            {it}
            <button
              type="button"
              onClick={() => onChange(items.filter((x) => x !== it))}
              aria-label={`Retirer ${it}`}
              className="flex h-5 w-5 items-center justify-center rounded-full text-muted transition-colors hover:bg-white hover:text-ink"
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          onBlur={add}
          placeholder={placeholder}
          aria-label={`Ajouter à ${label}`}
          className="h-8 min-w-28 flex-1 rounded-full border border-dashed border-line bg-transparent px-3.5 text-sm text-white placeholder:text-muted-2 focus:border-white/50 focus:outline-none"
        />
      </div>
    </div>
  );
}
