"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { locales, localeNames, type Locale } from "@/lib/i18n/config";
import { useLocale } from "@/lib/i18n/client";
import { Check, Globe } from "@/components/ui/Icons";

interface LanguageSwitcherProps {
  /** Variante : bouton compact (navbar) ou liste à plat (menu mobile). */
  variant?: "menu" | "inline";
  className?: string;
}

/** Petite planète + code de langue ; au clic, la liste des langues disponibles. */
export function LanguageSwitcher({ variant = "menu", className }: LanguageSwitcherProps) {
  const { locale, t, setLocale, switching } = useLocale();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const choose = (next: Locale) => {
    setOpen(false);
    setLocale(next);
  };

  if (variant === "inline") {
    return (
      <div className={cn("flex flex-wrap items-center gap-2", className)} role="group" aria-label={t.common.changeLanguage}>
        <Globe width={15} height={15} className="text-muted" />
        {locales.map((l) => (
          <button
            key={l}
            type="button"
            lang={l}
            onClick={() => choose(l)}
            aria-pressed={l === locale}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
              l === locale ? "border-white bg-white text-ink" : "border-line text-white/80 hover:border-white/40",
            )}
          >
            {localeNames[l]}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${t.common.changeLanguage} : ${localeNames[locale]}`}
        className={cn("label flex items-center gap-1.5 text-white/90 transition-opacity hover:opacity-70", switching && "opacity-50")}
      >
        <Globe width={15} height={15} />
        {locale.toUpperCase()}
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label={t.common.changeLanguage}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full z-50 mt-3 min-w-44 overflow-hidden rounded-md border border-line bg-ink-2 py-1.5 shadow-2xl"
          >
            {locales.map((l) => (
              <li key={l} role="option" aria-selected={l === locale}>
                <button
                  type="button"
                  lang={l}
                  onClick={() => choose(l)}
                  className={cn(
                    "flex w-full items-center justify-between gap-6 px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/5",
                    l === locale ? "text-white" : "text-white/80",
                  )}
                >
                  <span>
                    <span className="mr-2 text-xs font-semibold uppercase text-muted">{l}</span>
                    {localeNames[l]}
                  </span>
                  {l === locale && <Check width={13} height={13} />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
