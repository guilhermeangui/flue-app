"use client";

import { ChevronLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChatInput } from "@/components/chat/chat-input";
import { LanguageSelector } from "@/components/chat/language-selector";
import { t as tFn } from "@/i18n";
import { useI18n } from "@/i18n/context";
import { LANGUAGES } from "@/lib/constants";
import { createChat } from "@/lib/db/actions/chat-actions";
import type { LanguageCode } from "@/lib/types";

export default function NewChatPage() {
  const [selectedLang, setSelectedLang] = useState<LanguageCode | null>(null);
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();
  const { t } = useI18n();
  const langName = LANGUAGES.find((l) => l.code === selectedLang)?.name;

  const handleSend = async (text: string) => {
    if (!selectedLang || isSending) return;
    setIsSending(true);
    const title = `${langName ?? selectedLang} Practice`;
    const { chatId } = await createChat(selectedLang, title, text);
    router.push(`/chats/${chatId}`);
  };

  return (
    <>
      {/* Transition overlay */}
      {isSending && (
        <div className="transition-overlay absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-white">
          <div className="transition-spinner h-10 w-10 rounded-full border-[3px] border-surface border-t-primary" />
          <span className="text-sm font-medium text-text-secondary">
            {tFn(t.startingSession, { lang: langName ?? "" })}
          </span>
        </div>
      )}

      {/* Nav */}
      <div className="flex shrink-0 items-center justify-between border-b border-surface bg-white px-4 py-3">
        <button type="button" onClick={() => router.back()}>
          <ChevronLeft className="h-7 w-7 text-text-primary" />
        </button>
        <span className="font-heading text-[17px] font-bold text-text-primary">
          {t.newChat}
        </span>
        <button type="button" onClick={() => router.back()}>
          <X className="h-6 w-6 text-text-secondary" />
        </button>
      </div>

      {/* Messages area */}
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto bg-surface px-5 py-4">
        {/* AI bubble with language picker */}
        <div className="flex items-end gap-2">
          <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[15px] bg-primary">
            <span className="text-[11px] font-bold text-white">AI</span>
          </div>
          <div className="flex max-w-[270px] flex-col gap-3 rounded-[20px] rounded-tl-[4px] bg-white px-4 py-3.5 shadow-[0_2px_8px_#00000012]">
            <span className="font-heading text-sm font-semibold text-text-primary">
              {t.hiCoach}
            </span>
            <p className="text-[13px] text-[#52525B]">{t.chooseLang}</p>
            <LanguageSelector
              selected={selectedLang}
              onSelect={setSelectedLang}
            />
          </div>
        </div>

        {/* Confirmation bubble */}
        {selectedLang && (
          <div className="msg-in-left flex items-end gap-2">
            <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[15px] bg-primary">
              <span className="text-[11px] font-bold text-white">AI</span>
            </div>
            <div className="flex max-w-[220px] flex-col gap-1.5 rounded-[20px] rounded-tl-[4px] bg-white px-4 py-3 shadow-[0_2px_8px_#00000012]">
              <span className="text-sm font-semibold text-text-primary">
                {langName}! {t.greatChoice}
              </span>
              <p className="text-[13px] text-[#52525B]">{t.sendToStart}</p>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 bg-white">
        <ChatInput
          disabled={!selectedLang || isSending}
          placeholder={selectedLang ? t.typeMessage : t.selectLangFirst}
          onSend={handleSend}
        />
      </div>
    </>
  );
}
