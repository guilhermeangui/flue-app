const ITEMS = ["a", "b", "c", "d"];

export function ChatListSkeleton() {
  return (
    <div className="flex flex-1 flex-col px-4">
      {ITEMS.map((key, i) => (
        <div key={key}>
          <div className="flex items-center gap-3.5 py-3.5">
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <div className="h-4 w-40 animate-pulse rounded bg-surface" />
                <div className="h-3 w-12 animate-pulse rounded bg-surface" />
              </div>
              <div className="h-3.5 w-64 animate-pulse rounded bg-surface" />
              <div className="mt-1 flex items-center gap-2">
                <div className="h-3 w-16 animate-pulse rounded bg-surface" />
                <div className="h-3 w-10 animate-pulse rounded bg-surface" />
                <div className="h-5 w-10 animate-pulse rounded-full bg-surface" />
              </div>
            </div>
          </div>
          {i < 3 && <div className="h-px bg-surface" />}
        </div>
      ))}
    </div>
  );
}
