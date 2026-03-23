"use client";

import { MessageCircle, Plus, Search } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { useMockChat } from "@/hooks/use-mock-chat";
import { LANGUAGES } from "@/lib/constants";

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 85
      ? "bg-green-100 text-green-700"
      : score >= 70
        ? "bg-yellow-100 text-yellow-700"
        : "bg-red-100 text-red-700";

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${color}`}>
      {score}%
    </span>
  );
}

export default function ChatsPage() {
  const { chats } = useMockChat();

  return (
    <div className="relative flex flex-1 flex-col">
      <Header title="Chats" rightIcon={Search} />

      {chats.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-surface">
            <MessageCircle className="h-10 w-10 text-text-muted" />
          </div>
          <h2 className="font-heading text-lg font-bold text-text-primary">
            No chats yet
          </h2>
          <p className="text-center text-sm text-text-secondary">
            Start a new conversation to practice your language skills!
          </p>
        </div>
      ) : (
        <div className="flex flex-1 flex-col px-4">
          {chats.map((chat, i) => {
            const lang = LANGUAGES.find((l) => l.code === chat.language);
            return (
              <div key={chat.id}>
                <Link
                  href={`/chats/${chat.id}`}
                  className="flex items-center gap-3.5 py-3.5"
                >
                  <div className="flex flex-1 flex-col gap-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-[15px] font-bold text-text-primary">
                        {chat.title}
                      </span>
                      <span className="text-xs text-text-muted">
                        {chat.date}
                      </span>
                    </div>
                    <p className="truncate text-sm text-text-secondary">
                      {chat.lastMessage}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xs text-text-muted">
                        {lang?.flag} {lang?.name}
                      </span>
                      <span className="text-xs text-text-muted">·</span>
                      <span className="text-xs text-text-muted">
                        {chat.duration}
                      </span>
                      <ScoreBadge score={chat.score} />
                    </div>
                  </div>
                </Link>
                {i < chats.length - 1 && <div className="h-px bg-surface" />}
              </div>
            );
          })}
        </div>
      )}

      {/* FAB */}
      <Link
        href="/chats/new"
        className="absolute bottom-4 right-5 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-primary shadow-[0_4px_16px_#8B5CF640]"
      >
        <Plus className="h-[26px] w-[26px] text-white" />
      </Link>
    </div>
  );
}
