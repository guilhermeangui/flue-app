import { createClient } from "@/lib/supabase/server";
import type { Chat, Message, ProgressData, User } from "@/lib/types";
import { toChatFromRow, toMessageFromRow, toUserFromRow } from "./mappers";
import type {
  ChatRow,
  DailyActivityRow,
  MessageRow,
  ProfileRow,
  UserLanguageRow,
} from "./types";

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) return null;

  const [profileResult, languagesResult, statsResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .single<ProfileRow>(),
    supabase
      .from("user_languages")
      .select("*")
      .eq("user_id", authUser.id)
      .order("created_at")
      .returns<UserLanguageRow[]>(),
    getUserStats(authUser.id),
  ]);

  if (!profileResult.data) return null;

  return toUserFromRow(
    profileResult.data,
    authUser.email ?? "",
    languagesResult.data ?? [],
    statsResult,
  );
}

async function getUserStats(
  userId: string,
): Promise<{ dayStreak: number; totalSessions: number; avgScore: number }> {
  const supabase = await createClient();

  const { data: activities } = await supabase
    .from("daily_activity")
    .select("date, sessions_count, avg_score")
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .limit(365)
    .returns<
      Pick<DailyActivityRow, "date" | "sessions_count" | "avg_score">[]
    >();

  if (!activities || activities.length === 0) {
    return { dayStreak: 0, totalSessions: 0, avgScore: 0 };
  }

  // Calculate streak
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const activity of activities) {
    const actDate = new Date(activity.date);
    actDate.setHours(0, 0, 0, 0);
    const diffDays = Math.floor(
      (today.getTime() - actDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays === streak || (streak === 0 && diffDays <= 1)) {
      streak++;
    } else {
      break;
    }
  }

  const totalSessions = activities.reduce(
    (sum, a) => sum + a.sessions_count,
    0,
  );
  const scoresWithValues = activities.filter((a) => a.avg_score != null);
  const avgScore =
    scoresWithValues.length > 0
      ? Math.round(
          scoresWithValues.reduce((sum, a) => sum + (a.avg_score ?? 0), 0) /
            scoresWithValues.length,
        )
      : 0;

  return { dayStreak: streak, totalSessions, avgScore };
}

export async function getChats(userId: string): Promise<Chat[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("chats")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .returns<ChatRow[]>();

  return (data ?? []).map(toChatFromRow);
}

export async function getChat(chatId: string): Promise<Chat | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("chats")
    .select("*")
    .eq("id", chatId)
    .single<ChatRow>();

  return data ? toChatFromRow(data) : null;
}

export async function getMessages(chatId: string): Promise<Message[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("messages")
    .select("*")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true })
    .returns<MessageRow[]>();

  return (data ?? []).map(toMessageFromRow);
}

export async function getProgressData(userId: string): Promise<ProgressData> {
  const supabase = await createClient();

  const { data: activities } = await supabase
    .from("daily_activity")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .limit(30)
    .returns<DailyActivityRow[]>();

  if (!activities || activities.length === 0) {
    return {
      weekStreak: [false, false, false, false, false, false, false],
      bestStreak: 0,
      currentStreak: 0,
      accuracyTrend: [],
      errorBreakdown: { pronunciation: 0, grammar: 0, spelling: 0 },
    };
  }

  // Week streak (Mon-Sun of current week)
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  const weekStreak: boolean[] = [];
  for (let i = 0; i < 7; i++) {
    const checkDate = new Date(monday);
    checkDate.setDate(monday.getDate() + i);
    const dateStr = checkDate.toISOString().split("T")[0];
    weekStreak.push(activities.some((a) => a.date === dateStr));
  }

  // Streak calculation
  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;
  const todayStr = today.toISOString().split("T")[0];
  const yesterdayDate = new Date(today);
  yesterdayDate.setDate(today.getDate() - 1);
  const yesterdayStr = yesterdayDate.toISOString().split("T")[0];

  const dateSet = new Set(activities.map((a) => a.date));
  const sortedDates = [...dateSet].sort().reverse();

  if (sortedDates[0] === todayStr || sortedDates[0] === yesterdayStr) {
    for (const dateStr of sortedDates) {
      const d = new Date(dateStr);
      const expected = new Date(today);
      expected.setDate(today.getDate() - currentStreak);
      expected.setHours(0, 0, 0, 0);
      d.setHours(0, 0, 0, 0);

      if (
        d.getTime() === expected.getTime() ||
        (currentStreak === 0 && sortedDates[0] === yesterdayStr)
      ) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Best streak from all activities
  const allDates = [...dateSet].sort();
  for (const dateStr of allDates) {
    const d = new Date(dateStr);
    if (tempStreak === 0) {
      tempStreak = 1;
    } else {
      const prevDate = new Date(allDates[allDates.indexOf(dateStr) - 1]);
      const diff = Math.floor(
        (d.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      tempStreak = diff === 1 ? tempStreak + 1 : 1;
    }
    bestStreak = Math.max(bestStreak, tempStreak);
  }

  // Accuracy trend (last 4 weeks)
  const weeklyScores: { label: string; total: number; count: number }[] = [];
  for (let w = 3; w >= 0; w--) {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - (w * 7 + today.getDay()));
    weeklyScores.push({ label: `Week ${4 - w}`, total: 0, count: 0 });
  }
  for (const a of activities) {
    if (a.avg_score == null) continue;
    const d = new Date(a.date);
    const weeksAgo = Math.floor(
      (today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24 * 7),
    );
    const idx = 3 - Math.min(weeksAgo, 3);
    weeklyScores[idx].total += a.avg_score;
    weeklyScores[idx].count++;
  }
  const accuracyTrend = weeklyScores
    .filter((w) => w.count > 0)
    .map((w) => ({ label: w.label, value: Math.round(w.total / w.count) }));

  // Error breakdown
  const totals = { pronunciation: 0, grammar: 0, spelling: 0 };
  for (const a of activities) {
    if (!a.total_issues) continue;
    totals.pronunciation += a.total_issues.pronunciation;
    totals.grammar += a.total_issues.grammar;
    totals.spelling += a.total_issues.spelling;
  }
  const totalIssues = totals.pronunciation + totals.grammar + totals.spelling;
  const errorBreakdown =
    totalIssues > 0
      ? {
          pronunciation: Math.round((totals.pronunciation / totalIssues) * 100),
          grammar: Math.round((totals.grammar / totalIssues) * 100),
          spelling: Math.round((totals.spelling / totalIssues) * 100),
        }
      : { pronunciation: 0, grammar: 0, spelling: 0 };

  return {
    weekStreak,
    bestStreak,
    currentStreak,
    accuracyTrend,
    errorBreakdown,
  };
}

export async function getUserLanguages(
  userId: string,
): Promise<UserLanguageRow[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("user_languages")
    .select("*")
    .eq("user_id", userId)
    .order("created_at")
    .returns<UserLanguageRow[]>();

  return data ?? [];
}
