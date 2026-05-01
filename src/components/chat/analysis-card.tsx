"use client";

import { ChevronDown, ChevronUp, Languages } from "lucide-react";
import { useState } from "react";
import type { TranslationKeys } from "@/i18n";
import { t as tFn } from "@/i18n";
import { useI18n } from "@/i18n/context";
import type { AnalysisData } from "@/lib/types";

const TYPE_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  pronunciation: {
    bg: "bg-red-100",
    text: "text-red-500",
    dot: "bg-red-500",
  },
  grammar: {
    bg: "bg-orange-100",
    text: "text-orange-500",
    dot: "bg-orange-500",
  },
  spelling: {
    bg: "bg-yellow-50",
    text: "text-yellow-600",
    dot: "bg-yellow-500",
  },
};

const LANG_NAME_KEYS: Record<string, TranslationKeys> = {
  pt: "langNamePt",
  en: "langNameEn",
  es: "langNameEs",
  fr: "langNameFr",
  it: "langNameIt",
  de: "langNameDe",
  ja: "langNameJa",
  zh: "langNameZh",
  ko: "langNameKo",
  ru: "langNameRu",
};

export function AnalysisCard({ analysis }: { analysis: AnalysisData }) {
  const [showDetails, setShowDetails] = useState(false);
  const isMismatch = analysis.languageMismatch === true;
  const { t } = useI18n();

  const langLabel = analysis.detectedLanguage
    ? (t[LANG_NAME_KEYS[analysis.detectedLanguage]] ??
      analysis.detectedLanguage.toUpperCase())
    : "";

  return (
    <div className="flex items-end gap-2">
      <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[15px] bg-primary">
        <span className="text-[11px] font-bold text-white">AI</span>
      </div>
      <div className="flex max-w-[270px] flex-col gap-2.5 rounded-[20px] rounded-tl-[4px] bg-white px-4 py-3.5 shadow-[0_2px_8px_#00000012]">
        {/* Label */}
        <span className="text-[11px] font-semibold text-primary">
          {t.aiCoachAnalysis}
        </span>

        {/* Transcription */}
        <p className="text-sm italic leading-relaxed text-[#52525B]">
          &ldquo;{analysis.transcription}&rdquo;
        </p>

        {isMismatch ? (
          <div className="flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2.5">
            <Languages className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <span className="text-xs leading-snug text-amber-700">
              {tFn(t.langMismatchMsg, { lang: langLabel })}
            </span>
          </div>
        ) : (
          <>
            {/* Words to review */}
            {analysis.wordsToReview.length > 0 && (
              <>
                <span className="text-[11px] font-semibold text-text-secondary">
                  {t.wordsToReview}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.wordsToReview.map((w) => {
                    const c = TYPE_COLORS[w.type] ?? TYPE_COLORS.spelling;
                    return (
                      <span
                        key={w.word}
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${c.bg} ${c.text}`}
                      >
                        {w.word}
                      </span>
                    );
                  })}
                </div>
              </>
            )}

            {/* Divider */}
            <div className="h-px bg-surface" />

            {/* Summary */}
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-teal-500/10 px-2.5 py-1 text-[11px] font-semibold text-teal-500">
                {analysis.accuracyScore}% {t.accuracy}
              </span>
              <span className="text-xs text-text-muted">
                {analysis.issuesCount} {t.issues}
              </span>
            </div>

            {/* Details toggle */}
            {analysis.details.length > 0 && (
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-1"
              >
                <span className="text-[13px] font-semibold text-primary">
                  {t.details}
                </span>
                {showDetails ? (
                  <ChevronUp className="h-4 w-4 text-primary" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-primary" />
                )}
              </button>
            )}

            {/* Details */}
            {showDetails && (
              <div className="flex flex-col gap-2">
                {analysis.details.map((d) => {
                  const c = TYPE_COLORS[d.type] ?? TYPE_COLORS.spelling;
                  return (
                    <div key={d.original} className="flex gap-2">
                      <div
                        className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-sm ${c.dot}`}
                      />
                      <span className="text-xs leading-snug text-[#52525B]">
                        &ldquo;{d.original}&rdquo; &rarr; &ldquo;{d.corrected}
                        &rdquo; &mdash; {d.explanation}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
