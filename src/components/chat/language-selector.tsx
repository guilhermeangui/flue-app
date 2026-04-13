"use client";

import { LANGUAGES } from "@/lib/constants";
import type { LanguageCode } from "@/lib/types";

interface LanguageSelectorProps {
  selected: LanguageCode | null;
  onSelect: (code: LanguageCode) => void;
}

export function LanguageSelector({
  selected,
  onSelect,
}: LanguageSelectorProps) {
  return (
    <div className="flex flex-col gap-2 py-3">
      <div className="flex gap-2">
        {LANGUAGES.slice(0, 2).map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => onSelect(lang.code)}
            className={`flex flex-1 items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold ${
              selected === lang.code
                ? "border-2 border-primary bg-primary/10 text-primary-dark"
                : "bg-surface text-text-primary"
            }`}
          >
            <span className="text-xl">{lang.flag}</span>
            {lang.name}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        {LANGUAGES.slice(2, 4).map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => onSelect(lang.code)}
            className={`flex flex-1 items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold ${
              selected === lang.code
                ? "border-2 border-primary bg-primary/10 text-primary-dark"
                : "bg-surface text-text-primary"
            }`}
          >
            <span className="text-xl">{lang.flag}</span>
            {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
}
