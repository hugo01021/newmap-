"use client";

import { createContext, useCallback, useContext, useMemo, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { LOCALE_COOKIE, type Locale } from "./config";
import type { Dictionary } from "./dictionaries";

interface LocaleContextValue {
  locale: Locale;
  t: Dictionary;
  /** Change la langue : cookie + rechargement des composants serveur. */
  setLocale: (locale: Locale) => void;
  /** Vrai pendant le changement de langue. */
  switching: boolean;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ locale, dictionary, children }: { locale: Locale; dictionary: Dictionary; children: ReactNode }) {
  const router = useRouter();
  const [switching, startTransition] = useTransition();

  const setLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return;
      document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
      document.documentElement.lang = next;
      startTransition(() => router.refresh());
    },
    [locale, router],
  );

  const value = useMemo<LocaleContextValue>(() => ({ locale, t: dictionary, setLocale, switching }), [locale, dictionary, setLocale, switching]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale doit être utilisé dans LocaleProvider");
  return ctx;
}

/** Le dictionnaire de la langue courante. */
export function useT(): Dictionary {
  return useLocale().t;
}
