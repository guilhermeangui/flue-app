import { MessageCircle, Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/header";
import { getDictionary } from "@/i18n";
import { LANGUAGES } from "@/lib/constants";
import { getChats, getCurrentUser } from "@/lib/db/queries";
import { formatDuration, formatRelativeDate } from "@/lib/format";

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

export default async function ChatsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const dict = getDictionary(user.appLanguage);
  const chats = await getChats(user.id);

  return (
    <div className="flex flex-1 flex-col">
      <Header title={dict.tabChats} rightIcon="search" />

      {chats.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-surface">
            <MessageCircle className="h-10 w-10 text-text-muted" />
          </div>
          <h2 className="font-heading text-lg font-bold text-text-primary">
            {dict.noChatsYet}
          </h2>
          <p className="text-center text-sm text-text-secondary">
            {dict.noChatsDesc}
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
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate font-heading text-[15px] font-bold text-text-primary">
                        {chat.title}
                      </span>
                      <span className="shrink-0 text-xs text-text-muted">
                        {formatRelativeDate(chat.updatedAt)}
                      </span>
                    </div>
                    <p className="truncate text-sm text-text-secondary">
                      {chat.lastMessage}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xs text-text-muted">
                        {lang?.flag} {lang?.name}
                      </span>
                      <span className="text-xs text-text-muted">&middot;</span>
                      <span className="text-xs text-text-muted">
                        {formatDuration(chat.durationSeconds)}
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
      <div className="flex justify-end px-5 pb-4 pt-2">
        <Link
          href="/chats/new"
          className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-primary shadow-[0_4px_16px_#8B5CF640]"
        >
          <Plus className="h-[26px] w-[26px] text-white" />
        </Link>
      </div>
    </div>
  );
}
