export interface ProfileRow {
  id: string;
  name: string;
  avatar_url: string | null;
  native_language: string;
  app_language: string;
  notifications_enabled: boolean;
  audio_quality: string;
  created_at: string;
  tier: string;
  daily_messages_used: number;
  daily_messages_reset_at: string;
  updated_at: string;
}

export interface UserLanguageRow {
  id: string;
  user_id: string;
  language: string;
  is_active: boolean;
  sessions_count: number;
  created_at: string;
}

export interface ChatRow {
  id: string;
  user_id: string;
  language: string;
  title: string;
  last_message: string | null;
  score: number | null;
  duration_seconds: number;
  messages_count: number;
  created_at: string;
  updated_at: string;
}

export interface MessageRow {
  id: string;
  chat_id: string;
  user_id: string;
  sender: "user" | "ai";
  type: "text" | "voice" | "analysis";
  content: string | null;
  voice_url: string | null;
  voice_duration_seconds: number | null;
  analysis: unknown;
  created_at: string;
}

export interface DailyActivityRow {
  id: string;
  user_id: string;
  date: string;
  sessions_count: number;
  avg_score: number | null;
  total_issues: {
    pronunciation: number;
    grammar: number;
    spelling: number;
  } | null;
}

export interface UsageLogRow {
  id: string;
  user_id: string;
  chat_id: string | null;
  model: string;
  input_tokens: number;
  output_tokens: number;
  cached_tokens: number;
  cost_cents: number;
  created_at: string;
}
