const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const BARS = ["b1", "b2", "b3", "b4", "b5", "b6", "b7"];
const ERRORS = ["pronunciation", "grammar", "spelling"];
const BAR_HEIGHTS = [55, 72, 40, 85, 60, 48, 68];

export function ProgressSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-4 px-5 pb-4">
      {/* Streak card */}
      <div className="flex flex-col gap-4 rounded-[20px] border border-border bg-white p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 animate-pulse rounded bg-surface" />
            <div className="flex flex-col gap-1">
              <div className="h-4 w-28 animate-pulse rounded bg-surface" />
              <div className="h-3 w-16 animate-pulse rounded bg-surface" />
            </div>
          </div>
          <div className="h-6 w-16 animate-pulse rounded-xl bg-surface" />
        </div>
        <div className="flex justify-between">
          {DAYS.map((key) => (
            <div key={key} className="flex flex-col items-center gap-1">
              <div className="h-[34px] w-[34px] animate-pulse rounded-full bg-surface" />
              <div className="h-3 w-3 animate-pulse rounded bg-surface" />
            </div>
          ))}
        </div>
      </div>

      {/* Accuracy card */}
      <div className="flex flex-col gap-4 rounded-[20px] border border-border bg-white p-5">
        <div className="h-4 w-32 animate-pulse rounded bg-surface" />
        <div className="flex h-[100px] items-end justify-between">
          {BARS.map((key, i) => (
            <div
              key={key}
              className="w-7 animate-pulse rounded-t bg-surface"
              style={{ height: BAR_HEIGHTS[i] }}
            />
          ))}
        </div>
      </div>

      {/* Error breakdown */}
      <div className="flex flex-col gap-4 rounded-[20px] border border-border bg-white p-5">
        <div className="h-4 w-36 animate-pulse rounded bg-surface" />
        {ERRORS.map((key) => (
          <div key={key} className="flex flex-col gap-2">
            <div className="flex justify-between">
              <div className="h-3.5 w-24 animate-pulse rounded bg-surface" />
              <div className="h-3.5 w-8 animate-pulse rounded bg-surface" />
            </div>
            <div className="h-2 animate-pulse rounded bg-surface" />
          </div>
        ))}
      </div>
    </div>
  );
}
