import { ChatMessagesSkeleton } from "@/components/skeletons/chat-messages-skeleton";

export default function ChatLoading() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Header skeleton — matches ChatView header */}
      <div className="flex shrink-0 items-center gap-3 border-b border-surface bg-white px-4 py-3">
        <div className="h-[26px] w-[26px] animate-pulse rounded bg-surface" />
        <div className="h-[42px] w-[42px] animate-pulse rounded-full bg-primary/30" />
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="h-4 w-36 animate-pulse rounded bg-surface" />
          <div className="h-3 w-24 animate-pulse rounded bg-surface" />
        </div>
        <div className="h-[22px] w-[22px] animate-pulse rounded bg-surface" />
      </div>
      <ChatMessagesSkeleton />
      {/* Input skeleton */}
      <div className="flex shrink-0 items-center gap-2.5 border-t border-surface bg-white px-4 py-4">
        <div className="h-11 flex-1 animate-pulse rounded-[22px] bg-surface" />
        <div className="h-[52px] w-[52px] animate-pulse rounded-[26px] bg-primary/25" />
      </div>
    </div>
  );
}
