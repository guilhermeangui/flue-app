"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { LANGUAGES } from "@/lib/constants";
import {
  addLanguage,
  setActiveLanguage,
} from "@/lib/db/actions/profile-actions";
import type { LanguageCode } from "@/lib/types";

interface UserLanguage {
  id: string;
  language: LanguageCode;
  isActive: boolean;
  sessionsCount: number;
}

interface LanguageListProps {
  languages: UserLanguage[];
  nativeLanguage: LanguageCode;
}

export function LanguageList({ languages, nativeLanguage }: LanguageListProps) {
  const [showPicker, setShowPicker] = useState(false);

  const availableLanguages = LANGUAGES.filter(
    (l) => !languages.some((ul) => ul.language === l.code),
  );

  const handleAddLanguage = async (code: LanguageCode) => {
    await addLanguage(code);
    setShowPicker(false);
  };

  const handleSetActive = async (id: string) => {
    await setActiveLanguage(id);
  };

  return (
    <div className="flex flex-col gap-3">
      <span className="text-[11px] font-bold tracking-wider text-text-muted">
        MY LANGUAGES
      </span>

      {languages.map((lang) => {
        const config = LANGUAGES.find((l) => l.code === lang.language);
        const isActive = lang.isActive;
        const isNative = lang.language === nativeLanguage;

        return (
          <button
            key={lang.id}
            type="button"
            onClick={() => !isActive && handleSetActive(lang.id)}
            className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left shadow-[0_2px_8px_#00000010] ${
              isActive
                ? "border-[1.5px] border-primary bg-white"
                : "border-border bg-white shadow-[0_2px_6px_#00000008]"
            }`}
          >
            <span className="text-[28px]">{config?.flag}</span>
            <div className="flex flex-1 flex-col gap-0.5">
              <span className="font-heading text-[15px] font-semibold text-text-primary">
                {config?.name}
              </span>
              <span className="text-xs text-text-secondary">
                {lang.sessionsCount} sessions
                {isNative ? " · Native target" : ""}
              </span>
            </div>
            {isActive && (
              <span className="rounded-xl bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary-dark">
                Active
              </span>
            )}
          </button>
        );
      })}

      {showPicker ? (
        <div className="flex flex-col gap-2 rounded-2xl border border-border bg-white p-3">
          {availableLanguages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleAddLanguage(lang.code)}
              className="flex items-center gap-3 rounded-xl p-2 hover:bg-surface"
            >
              <span className="text-xl">{lang.flag}</span>
              <span className="text-sm font-medium text-text-primary">
                {lang.name}
              </span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShowPicker(false)}
            className="mt-1 text-sm text-text-muted"
          >
            Cancel
          </button>
        </div>
      ) : (
        availableLanguages.length > 0 && (
          <button
            type="button"
            onClick={() => setShowPicker(true)}
            className="flex items-center justify-center gap-2 rounded-2xl border-[1.5px] border-border bg-[#FAFAFA] p-3.5"
          >
            <Plus className="h-[18px] w-[18px] text-primary" />
            <span className="text-sm font-semibold text-primary">
              Add Language
            </span>
          </button>
        )
      )}
    </div>
  );
}
