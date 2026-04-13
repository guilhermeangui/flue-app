const STATS = ["streak", "sessions", "score"];
const LANGS = ["lang-1", "lang-2"];
const SETTINGS = ["notif", "audio", "lang"];

export function ProfileSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-4 px-5 pb-4">
      {/* Hero card */}
      <div className="flex flex-col gap-4 rounded-[20px] bg-surface p-5">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 animate-pulse rounded-full bg-border" />
          <div className="flex flex-col gap-2">
            <div className="h-5 w-32 animate-pulse rounded bg-border" />
            <div className="h-3.5 w-40 animate-pulse rounded bg-border" />
          </div>
        </div>
        <div className="flex justify-around py-3">
          {STATS.map((key) => (
            <div key={key} className="flex flex-col items-center gap-1">
              <div className="h-6 w-10 animate-pulse rounded bg-border" />
              <div className="h-3 w-14 animate-pulse rounded bg-border" />
            </div>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div className="flex flex-col gap-3">
        <div className="h-3 w-24 animate-pulse rounded bg-surface" />
        {LANGS.map((key) => (
          <div
            key={key}
            className="flex items-center gap-3 rounded-2xl border border-border bg-white p-3.5"
          >
            <div className="h-7 w-7 animate-pulse rounded bg-surface" />
            <div className="flex flex-1 flex-col gap-1">
              <div className="h-4 w-24 animate-pulse rounded bg-surface" />
              <div className="h-3 w-32 animate-pulse rounded bg-surface" />
            </div>
          </div>
        ))}
      </div>

      {/* Settings */}
      <div className="flex flex-col gap-3">
        <div className="h-3 w-16 animate-pulse rounded bg-surface" />
        <div className="rounded-2xl border border-border bg-white">
          {SETTINGS.map((key, i) => (
            <div key={key}>
              <div className="flex items-center gap-2.5 p-4">
                <div className="h-[18px] w-[18px] animate-pulse rounded bg-surface" />
                <div className="h-4 w-28 animate-pulse rounded bg-surface" />
              </div>
              {i < 2 && <div className="h-px bg-surface" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
