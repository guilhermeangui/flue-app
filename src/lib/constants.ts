import type { AIProvider, LanguageConfig } from "./types";

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

export const AI_PROVIDERS: AIProvider[] = [
  {
    id: "claude",
    name: "Claude",
    description: "Anthropic's AI assistant",
    connected: false,
  },
  {
    id: "openai",
    name: "OpenAI",
    description: "GPT-powered language models",
    connected: false,
  },
];

export const APP_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "pt-BR", name: "Portugu\u00EAs (Brasil)" },
] as const;
