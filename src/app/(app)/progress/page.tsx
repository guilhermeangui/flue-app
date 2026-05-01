import { ChevronDown } from "lucide-react";
import { redirect } from "next/navigation";
import { getDictionary, t } from "@/i18n";
import { getCurrentUser, getProgressData } from "@/lib/db/queries";

const DAYS = [
  { id: "mon", label: "M" },
  { id: "tue", label: "T" },
  { id: "wed", label: "W" },
  { id: "thu", label: "T" },
  { id: "fri", label: "F" },
  { id: "sat", label: "S" },
  { id: "sun", label: "S" },
];

export default async function ProgressPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const dict = getDictionary(user.appLanguage);
  const progress = await getProgressData(user.id);

  const hasData =
    progress.currentStreak > 0 || progress.accuracyTrend.length > 0;

  const chartData =
    progress.accuracyTrend.length > 0
      ? progress.accuracyTrend.map((tr, i) => ({
          id: DAYS[i]?.id ?? `trend-${i}`,
          label: tr.label,
          height: Math.max(10, tr.value),
        }))
      : DAYS.map((d) => ({ id: d.id, label: d.label, height: 10 }));

  const avgScore =
    progress.accuracyTrend.length > 0
      ? Math.round(
          progress.accuracyTrend.reduce((s, tr) => s + tr.value, 0) /
            progress.accuracyTrend.length,
        )
      : 0;

  const errorBars = [
    {
      label: dict.pronunciation,
      pct: progress.errorBreakdown.pronunciation,
      color: "text-red-500",
      gradient: "from-red-300 to-red-500",
    },
    {
      label: dict.grammar,
      pct: progress.errorBreakdown.grammar,
      color: "text-orange-500",
      gradient: "from-orange-200 to-orange-500",
    },
    {
      label: dict.spelling,
      pct: progress.errorBreakdown.spelling,
      color: "text-yellow-500",
      gradient: "from-yellow-200 to-yellow-500",
    },
  ];

  return (
    <div className="flex flex-1 flex-col">
      {/* Header with filter */}
      <div className="flex items-center justify-between px-5 pb-3 pt-5">
        <h1 className="font-heading text-[26px] font-extrabold text-text-primary">
          {dict.progress}
        </h1>
        <div className="flex items-center gap-1 rounded-[20px] bg-surface px-3 py-1.5">
          <span className="text-xs font-semibold text-text-secondary">
            {dict.thisMonth}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-text-secondary" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 pb-4">
        {/* Streak card */}
        <div className="flex flex-col gap-4 rounded-[20px] border border-border bg-white p-5 shadow-[0_2px_10px_#00000010]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[22px]">🔥</span>
              <div className="flex flex-col gap-0.5">
                <span className="font-heading text-base font-bold text-text-primary">
                  {t(dict.dayStreakLabel, { count: progress.currentStreak })}
                </span>
                <span className="text-xs text-text-secondary">
                  {progress.currentStreak > 0
                    ? dict.keepItUp
                    : dict.startPracticing}
                </span>
              </div>
            </div>
            <span className="rounded-xl bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
              {t(dict.best, { count: progress.bestStreak })}
            </span>
          </div>

          <div className="flex justify-between">
            {DAYS.map((day, i) => {
              const active = progress.weekStreak[i];
              return (
                <div key={day.id} className="flex flex-col items-center gap-1">
                  <div
                    className={`flex h-[34px] w-[34px] items-center justify-center rounded-full ${
                      active
                        ? i < 4
                          ? "bg-primary"
                          : "bg-primary/20"
                        : "bg-surface"
                    }`}
                  />
                  <span
                    className={`text-[11px] font-semibold ${
                      active ? "text-text-secondary" : "text-[#D4D4D8]"
                    }`}
                  >
                    {day.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Accuracy Trend */}
        <div className="flex flex-col gap-4 rounded-[20px] border border-border bg-white p-5 shadow-[0_2px_10px_#00000010]">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="font-heading text-base font-bold text-text-primary">
                {dict.accuracyTrend}
              </span>
              <span className="text-xs text-text-secondary">
                {hasData ? dict.lastSessions : dict.noDataYet}
              </span>
            </div>
            {avgScore > 0 && (
              <span className="rounded-xl bg-primary/10 px-2.5 py-1.5 text-xs font-semibold text-primary-dark">
                {t(dict.avg, { score: avgScore })}
              </span>
            )}
          </div>

          <div className="flex h-[100px] items-end justify-between">
            {chartData.map((bar) => (
              <div
                key={bar.id}
                className="w-7 rounded-t bg-gradient-to-t from-purple-200 to-primary"
                style={{ height: bar.height }}
              />
            ))}
          </div>

          <div className="flex justify-between">
            {chartData.map((bar, i) => (
              <span
                key={bar.id}
                className={`w-7 text-center text-[10px] ${
                  i === chartData.length - 1
                    ? "font-bold text-primary"
                    : "text-text-muted"
                }`}
              >
                {bar.label}
              </span>
            ))}
          </div>
        </div>

        {/* Error Breakdown */}
        <div className="flex flex-col gap-4 rounded-[20px] border border-border bg-white p-5 shadow-[0_2px_10px_#00000010]">
          <span className="font-heading text-base font-bold text-text-primary">
            {dict.errorBreakdown}
          </span>

          {errorBars.map((bar) => (
            <div key={bar.label} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-text-primary">
                  {bar.label}
                </span>
                <span className={`text-[13px] font-bold ${bar.color}`}>
                  {bar.pct}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded bg-surface">
                <div
                  className={`h-full rounded bg-gradient-to-r ${bar.gradient}`}
                  style={{ width: `${bar.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
