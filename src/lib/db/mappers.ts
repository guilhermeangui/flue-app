import type {
  AnalysisData,
  Chat,
  LanguageCode,
  Message,
  User,
} from "@/lib/types";
import type { ChatRow, MessageRow, ProfileRow, UserLanguageRow } from "./types";

export function toChatFromRow(row: ChatRow): Chat {
  return {
    id: row.id,
    userId: row.user_id,
    language: row.language as LanguageCode,
    title: row.title,
    lastMessage: row.last_message ?? "",
    score: row.score ?? 0,
    durationSeconds: row.duration_seconds,
    messagesCount: row.messages_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toMessageFromRow(row: MessageRow): Message {
  return {
    id: row.id,
    chatId: row.chat_id,
    sender: row.sender,
    type: row.type,
    content: row.content ?? undefined,
    voiceUrl: row.voice_url ?? undefined,
    voiceDurationSeconds: row.voice_duration_seconds ?? undefined,
    analysis: (row.analysis as AnalysisData) ?? undefined,
    createdAt: row.created_at,
  };
}

export function toUserFromRow(
  profile: ProfileRow,
  email: string,
  languages: UserLanguageRow[],
  stats: { dayStreak: number; totalSessions: number; avgScore: number },
): User {
  return {
    id: profile.id,
    name: profile.name,
    email,
    avatarUrl: profile.avatar_url ?? undefined,
    nativeLanguage: profile.native_language as LanguageCode,
    targetLanguages: languages.map((l) => l.language as LanguageCode),
    dayStreak: stats.dayStreak,
    totalSessions: stats.totalSessions,
    avgScore: stats.avgScore,
    notificationsEnabled: profile.notifications_enabled,
    audioQuality: profile.audio_quality,
    appLanguage: profile.app_language,
    tier: profile.tier as "free" | "pro",
    dailyMessagesUsed: profile.daily_messages_used,
    dailyMessageLimit: profile.tier === "pro" ? 150 : 15,
    createdAt: profile.created_at,
  };
}
