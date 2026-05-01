import type { Translations } from "./locales/en";
import { en } from "./locales/en";
import { es } from "./locales/es";
import { fr } from "./locales/fr";
import { pt } from "./locales/pt";

export type { TranslationKeys, Translations } from "./locales/en";

export type AppLocale = "en" | "pt" | "es" | "fr";

export const DEFAULT_LOCALE: AppLocale = "en";

const dictionaries: Record<AppLocale, Translations> = { en, pt, es, fr };

export function getDictionary(locale: string): Translations {
  const key = locale as AppLocale;
  return dictionaries[key] ?? dictionaries[DEFAULT_LOCALE];
}

/** Map from locale code to its own native name. */
export const APP_LOCALE_NAMES: Record<AppLocale, string> = {
  en: "English",
  pt: "Portugu\u00EAs (Brasil)",
  es: "Espa\u00F1ol",
  fr: "Fran\u00E7ais",
};

/** Map from locale code to HTML lang attribute value. */
export const LOCALE_HTML_LANG: Record<AppLocale, string> = {
  en: "en",
  pt: "pt-BR",
  es: "es",
  fr: "fr",
};

/** Simple template interpolation: replaces {key} tokens. */
export function t(
  template: string,
  params?: Record<string, string | number>,
): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    params[key] !== undefined ? String(params[key]) : `{${key}}`,
  );
}
