import type { Locale } from "./i18n/config";

const tags: Record<Locale, string> = { fr: "fr-FR", en: "en-US", es: "es-ES", de: "de-DE" };

/** Prix en euros, sans centimes, selon les usages de la langue (22 €, €22…). */
export function formatEuro(n: number, locale: Locale = "fr") {
  return new Intl.NumberFormat(tags[locale], { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

/** Argent du jeu : euros dans la version française, dollars de Los Santos ailleurs. */
export function formatGameMoney(n: number, locale: Locale = "fr") {
  const num = new Intl.NumberFormat(tags[locale], { maximumFractionDigits: 0 }).format(n);
  if (locale === "fr") return `${num} €`;
  if (locale === "en") return `$${num}`;
  return `${num} $`;
}
