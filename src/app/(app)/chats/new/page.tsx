"use client";

import { ChevronLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChatInput } from "@/components/chat/chat-input";
import { LanguageSelector } from "@/components/chat/language-selector";
import { LANGUAGES } from "@/lib/constants";
import type { LanguageCode } from "@/lib/types";

export default function NewChatPage() {
  const [selectedLang, setSelectedLang] = useState<LanguageCode | null>(null);
  const router = useRouter();
  const langName = LANGUAGES.find((l) => l.code === selectedLang)?.name;

  const handleSend = (_text: string) => {
    // Mock: redirect to existing chat
    router.push("/chats/chat-1");
  };

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Status bar spacer */}
      <div className="h-[62px]" />

      {/* Nav */}
      <div className="flex h-[52px] items-center justify-between px-2">
        <button type="button" onClick={() => router.back()}>
          <ChevronLeft className="h-7 w-7 text-text-primary" />
        </button>
        <span className="font-heading text-[17px] font-bold text-text-primary">
          New Chat
        </span>
        <button type="button" onClick={() => router.back()}>
          <X className="h-6 w-6 text-text-secondary" />
        </button>
      </div>

      {/* Messages area */}
      <div className="flex flex-1 flex-col gap-4 px-5 py-4">
        {/* AI bubble with language picker */}
        <div className="flex items-end gap-2">
          <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[15px] bg-primary">
            <span className="text-[11px] font-bold text-white">AI</span>
          </div>
          <div className="flex max-w-[270px] flex-col gap-3 rounded-[20px] rounded-tl-[4px] bg-white px-4 py-3.5 shadow-[0_2px_8px_#00000012]">
            <span className="font-heading text-sm font-semibold text-text-primary">
              Hi! I&apos;m your Fluê coach. 👋
            </span>
            <p className="text-[13px] text-[#52525B]">
              Choose a language to practice today and we&apos;ll get started!
            </p>
            <LanguageSelector
              selected={selectedLang}
              onSelect={setSelectedLang}
            />
          </div>
        </div>

        {/* Confirmation bubble */}
        {selectedLang && (
          <div className="flex items-end gap-2">
            <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[15px] bg-primary">
              <span className="text-[11px] font-bold text-white">AI</span>
            </div>
            <div className="flex max-w-[220px] flex-col gap-1.5 rounded-[20px] rounded-tl-[4px] bg-white px-4 py-3 shadow-[0_2px_8px_#00000012]">
              <span className="text-sm font-semibold text-text-primary">
                {langName}! Great choice! 🎉
              </span>
              <p className="text-[13px] text-[#52525B]">
                Send me a voice or text message to start practicing.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput
        disabled={!selectedLang}
        placeholder={
          selectedLang ? "Type a message…" : "Select a language above to start…"
        }
        onSend={handleSend}
      />
    </div>
  );
}
