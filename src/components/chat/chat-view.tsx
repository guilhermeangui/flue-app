"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnalysisCard } from "@/components/chat/analysis-card";
import { ChatInput } from "@/components/chat/chat-input";
import { MessageBubble } from "@/components/chat/message-bubble";
import { VoiceMessage } from "@/components/chat/voice-message";
import type { UsageStatus } from "@/lib/ai/rate-limiter";
import { saveAudio } from "@/lib/audio-storage";
import { LANGUAGES } from "@/lib/constants";
import { sendMessage, sendVoiceMessage } from "@/lib/db/actions/chat-actions";
import { formatRelativeDate } from "@/lib/format";
import type { Chat, Message } from "@/lib/types";

interface ChatViewProps {
  chat: Chat;
  initialMessages: Message[];
  initialUsage: UsageStatus;
}

export function ChatView({
  chat,
  initialMessages,
  initialUsage,
}: ChatViewProps) {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState(initialMessages);
  const [animatedIds, setAnimatedIds] = useState<Set<string>>(new Set());
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [usage, setUsage] = useState(initialUsage);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lang = LANGUAGES.find((l) => l.code === chat.language);

  // Sync messages and usage when server data changes (after revalidation)
  useEffect(() => {
    setMessages(initialMessages);
    setIsAiTyping(false);
  }, [initialMessages]);

  useEffect(() => {
    setUsage(initialUsage);
  }, [initialUsage]);

  // Start typing indicator with 30s auto-timeout
  const startTyping = useCallback(() => {
    setIsAiTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => setIsAiTyping(false), 30_000);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, []);

  const scrollToBottom = useCallback(() => {
    setTimeout(
      () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
      50,
    );
  }, []);

  const handleSend = useCallback(
    async (content: string) => {
      const tempId = `temp-${Date.now()}`;
      const tempMsg: Message = {
        id: tempId,
        chatId: chat.id,
        sender: "user",
        type: "text",
        content,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, tempMsg]);
      setAnimatedIds((prev) => new Set(prev).add(tempId));
      startTyping();
      setUsage((prev) => ({
        ...prev,
        used: prev.used + 1,
        remaining: Math.max(0, prev.remaining - 1),
        allowed: prev.used + 1 < prev.limit,
      }));
      scrollToBottom();
      await sendMessage(chat.id, content, "text");
      // revalidation will trigger useEffect above to update messages
    },
    [chat.id, startTyping, scrollToBottom],
  );

  const handleSendVoice = useCallback(
    async (rawBlob: Blob, aiBlob: Blob, durationSeconds: number) => {
      const localAudioId = crypto.randomUUID();
      // Persist raw audio locally — this is what the user will replay.
      try {
        await saveAudio(localAudioId, rawBlob);
      } catch (err) {
        console.error("Failed to save audio locally:", err);
      }

      const tempId = `temp-voice-${Date.now()}`;
      const tempMsg: Message = {
        id: tempId,
        chatId: chat.id,
        sender: "user",
        type: "voice",
        voiceLocalId: localAudioId,
        voiceDurationSeconds: durationSeconds,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, tempMsg]);
      setAnimatedIds((prev) => new Set(prev).add(tempId));
      startTyping();
      scrollToBottom();

      // Send AI-optimized blob (mono 16kHz WAV) for Whisper transcription.
      // The server persists only the localAudioId reference, not the audio.
      const formData = new FormData();
      const fileName = aiBlob.type.includes("wav") ? "voice.wav" : "voice.webm";
      formData.append("audio", aiBlob, fileName);
      formData.append("localAudioId", localAudioId);
      try {
        await sendVoiceMessage(chat.id, formData, durationSeconds);
      } catch (err) {
        console.error("Voice message failed:", err);
        setIsAiTyping(false);
      }
    },
    [chat.id, startTyping, scrollToBottom],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col animate-fade-in">
      {/* Chat header */}
      <div className="flex shrink-0 items-center gap-3 border-b border-surface bg-white px-4 py-3">
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
      </div>

      {/* Messages — scrollable area */}
      <div className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto bg-surface px-4 py-3">
        {/* Date label */}
        <div className="flex justify-center py-1">
          <span className="text-xs font-medium text-text-muted">
            {formatRelativeDate(chat.createdAt)}
          </span>
        </div>

        {/* Welcome bubbles */}
        <div className="flex items-end gap-2">
          <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[15px] bg-primary">
            <span className="text-[11px] font-bold text-white">AI</span>
          </div>
          <div className="flex max-w-[270px] flex-col gap-3 rounded-[20px] rounded-tl-[4px] bg-white px-4 py-3.5 shadow-[0_2px_8px_#00000012]">
            <span className="font-heading text-sm font-semibold text-text-primary">
              Hi! I&apos;m your Flue coach.
            </span>
            <p className="text-[13px] text-[#52525B]">
              Choose a language to practice today and we&apos;ll get started!
            </p>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((l) => (
                <span
                  key={l.code}
                  className={`rounded-xl px-3 py-1.5 text-sm ${
                    l.code === chat.language
                      ? "border-2 border-primary bg-primary/5 font-semibold text-primary"
                      : "bg-[#F4F4F5] text-text-secondary"
                  }`}
                >
                  {l.flag} {l.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-end gap-2">
          <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[15px] bg-primary">
            <span className="text-[11px] font-bold text-white">AI</span>
          </div>
          <div className="flex max-w-[220px] flex-col gap-1.5 rounded-[20px] rounded-tl-[4px] bg-white px-4 py-3 shadow-[0_2px_8px_#00000012]">
            <span className="text-sm font-semibold text-text-primary">
              {lang?.name}! Great choice!
            </span>
            <p className="text-[13px] text-[#52525B]">
              Send me a voice or text message to start practicing.
            </p>
          </div>
        </div>

        {messages.map((msg) => {
          const shouldAnimate = animatedIds.has(msg.id);
          if (msg.type === "voice") {
            return (
              <div key={msg.id} className={shouldAnimate ? "msg-in-right" : ""}>
                <VoiceMessage
                  voiceLocalId={msg.voiceLocalId}
                  durationSeconds={msg.voiceDurationSeconds ?? 3}
                />
              </div>
            );
          }
          if (msg.type === "analysis" && msg.analysis) {
            return <AnalysisCard key={msg.id} analysis={msg.analysis} />;
          }
          return (
            <MessageBubble key={msg.id} message={msg} animate={shouldAnimate} />
          );
        })}
        {/* Typing indicator */}
        {isAiTyping && (
          <div className="msg-in-left flex items-end gap-2">
            <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[15px] bg-primary">
              <span className="text-[11px] font-bold text-white">AI</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-[20px] rounded-tl-[4px] bg-white px-4 py-3 shadow-[0_2px_8px_#00000012]">
              <span className="typing-dot h-2 w-2 rounded-full bg-text-muted" />
              <span className="typing-dot h-2 w-2 rounded-full bg-text-muted [animation-delay:0.15s]" />
              <span className="typing-dot h-2 w-2 rounded-full bg-text-muted [animation-delay:0.3s]" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 bg-white">
        {usage.allowed ? (
          <ChatInput
            onSend={handleSend}
            onSendVoice={handleSendVoice}
            remaining={usage.remaining}
            limit={usage.limit}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 border-t border-surface px-4 py-4">
            <p className="text-sm text-text-secondary">
              You&apos;ve used all {usage.limit} messages for today
            </p>
            <button
              type="button"
              className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-[0_4px_12px_#8B5CF640]"
            >
              Upgrade to Pro — 150 msgs/day
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
