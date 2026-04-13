export function ChatMessagesSkeleton() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3.5 bg-surface px-4 py-3">
      {/* Date label */}
      <div className="flex justify-center py-1">
        <div className="h-3.5 w-10 animate-pulse rounded bg-text-muted/20" />
      </div>

      {/* AI welcome bubble with language selector */}
      <div className="flex items-end gap-2">
        <div className="h-[30px] w-[30px] shrink-0 animate-pulse rounded-[15px] bg-primary/30" />
        <div className="flex w-[270px] flex-col gap-3 rounded-[20px] rounded-tl-[4px] bg-white px-4 py-3.5 shadow-[0_2px_8px_#00000012]">
          <div className="h-4 w-40 animate-pulse rounded bg-surface" />
          <div className="h-3.5 w-52 animate-pulse rounded bg-surface" />
          <div className="flex flex-wrap gap-2">
            <div className="h-8 w-24 animate-pulse rounded-xl bg-surface" />
            <div className="h-8 w-20 animate-pulse rounded-xl bg-surface" />
            <div className="h-8 w-20 animate-pulse rounded-xl bg-surface" />
            <div className="h-8 w-18 animate-pulse rounded-xl bg-surface" />
          </div>
        </div>
      </div>

      {/* AI confirmation bubble */}
      <div className="flex items-end gap-2">
        <div className="h-[30px] w-[30px] shrink-0 animate-pulse rounded-[15px] bg-primary/30" />
        <div className="flex w-[220px] flex-col gap-1.5 rounded-[20px] rounded-tl-[4px] bg-white px-4 py-3 shadow-[0_2px_8px_#00000012]">
          <div className="h-4 w-36 animate-pulse rounded bg-surface" />
          <div className="h-3.5 w-44 animate-pulse rounded bg-surface" />
        </div>
      </div>

      {/* User message */}
      <div className="flex justify-end">
        <div className="h-10 w-52 animate-pulse rounded-[20px] rounded-br-[4px] bg-primary/25" />
      </div>
    </div>
  );
}
