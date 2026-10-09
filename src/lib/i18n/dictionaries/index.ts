import type { Locale } from "../config";
import { fr, type Dictionary } from "./fr";
import { en } from "./en";
import { es } from "./es";
import { de } from "./de";

export type { Dictionary };

export const dictionaries: Record<Locale, Dictionary> = { fr, en, es, de };
