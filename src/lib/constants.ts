import type { LanguageConfig } from "./types";

export const LANGUAGES: LanguageConfig[] = [
  {
    code: "pt",
    name: "Portuguese",
    flag: "\u{1F1E7}\u{1F1F7}",
    nativeName: "Portugu\u00EAs",
  },
  {
    code: "en",
    name: "English",
    flag: "\u{1F1FA}\u{1F1F8}",
    nativeName: "English",
  },
  {
    code: "es",
    name: "Spanish",
    flag: "\u{1F1EA}\u{1F1F8}",
    nativeName: "Espa\u00F1ol",
  },
  {
    code: "fr",
    name: "French",
    flag: "\u{1F1EB}\u{1F1F7}",
    nativeName: "Fran\u00E7ais",
  },
];

export const TIER_LIMITS = {
  free: 15,
  pro: 150,
} as const;

export const MAX_VOICE_SECONDS = 180;

export const APP_LANGUAGES = [
  { code: "en", name: "English", flag: "\uD83C\uDDFA\uD83C\uDDF8" },
  {
    code: "pt",
    name: "Portugu\u00EAs (Brasil)",
    flag: "\uD83C\uDDE7\uD83C\uDDF7",
  },
  { code: "es", name: "Espa\u00F1ol", flag: "\uD83C\uDDEA\uD83C\uDDF8" },
  { code: "fr", name: "Fran\u00E7ais", flag: "\uD83C\uDDEB\uD83C\uDDF7" },
] as const;
