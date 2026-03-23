"use client";

import { ChevronLeft, EllipsisVertical } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { AnalysisCard } from "@/components/chat/analysis-card";
import { ChatInput } from "@/components/chat/chat-input";
import { MessageBubble } from "@/components/chat/message-bubble";
import { VoiceMessage } from "@/components/chat/voice-message";
import { useMockChat } from "@/hooks/use-mock-chat";
import { LANGUAGES } from "@/lib/constants";

export default function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const { getChat, getMessages } = useMockChat();
  const router = useRouter();

  const chat = getChat(chatId);
  const messages = getMessages(chatId);
  const lang = LANGUAGES.find((l) => l.code === chat?.language);

  if (!chat) return null;

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Status bar spacer */}
      <div className="h-[62px]" />

      {/* Chat header */}
      <div className="flex h-[68px] items-center gap-3 bg-white px-4">
        <button type="button" onClick={() => router.push("/chats")}>
          <ChevronLeft className="h-[26px] w-[26px] text-text-primary" />
        </button>
        <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-primary">
          <span className="text-[13px] font-bold text-white">AI</span>
        </div>
        <div className="flex flex-1 flex-col gap-0.5">
          <span className="font-heading text-base font-bold text-text-primary">
            AI Language Coach
          </span>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-success" />
            <span className="text-xs text-text-secondary">
              Online · {lang?.flag} {lang?.name}
            </span>
          </div>
        </div>
        <button type="button">
          <EllipsisVertical className="h-[22px] w-[22px] text-text-secondary" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex flex-1 flex-col gap-3.5 bg-surface px-4 py-3">
        {/* Today label */}
        <div className="flex justify-center py-1">
          <span className="text-xs font-medium text-text-muted">Today</span>
        </div>

        {messages.map((msg) => {
          if (msg.type === "voice") {
            return (
              <VoiceMessage
                key={msg.id}
                duration={msg.voiceDuration ?? "0:03"}
              />
            );
          }
          if (msg.type === "analysis" && msg.analysis) {
            return <AnalysisCard key={msg.id} analysis={msg.analysis} />;
          }
          return <MessageBubble key={msg.id} message={msg} />;
        })}
      </div>

      {/* Input */}
      <ChatInput onSend={() => {}} />
    </div>
  );
}
