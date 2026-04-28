export type LanguageCode = "pt" | "en" | "es" | "fr";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  nativeLanguage: LanguageCode;
  targetLanguages: LanguageCode[];
  dayStreak: number;
  totalSessions: number;
  avgScore: number;
  notificationsEnabled: boolean;
  audioQuality: string;
  appLanguage: string;
  tier: "free" | "pro";
  dailyMessagesUsed: number;
  dailyMessageLimit: number;
  createdAt: string;
}

export interface Chat {
  id: string;
  userId: string;
  language: LanguageCode;
  title: string;
  lastMessage: string;
  score: number;
  durationSeconds: number;
  messagesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface WordReview {
  word: string;
  type: "pronunciation" | "grammar" | "spelling";
}

export interface CorrectionDetail {
  type: "pronunciation" | "grammar" | "spelling";
  original: string;
  corrected: string;
  explanation: string;
}

export interface AnalysisData {
  transcription: string;
  wordsToReview: WordReview[];
  accuracyScore: number;
  issuesCount: number;
  details: CorrectionDetail[];
  languageMismatch?: boolean;
  detectedLanguage?: string;
}

export interface Message {
  id: string;
  chatId: string;
  sender: "user" | "ai";
  type: "text" | "voice" | "analysis";
  content?: string;
  voiceLocalId?: string;
  voiceDurationSeconds?: number;
  analysis?: AnalysisData;
  createdAt: string;
}

export interface ProgressData {
  weekStreak: boolean[];
  bestStreak: number;
  currentStreak: number;
  accuracyTrend: { label: string; value: number }[];
  errorBreakdown: {
    pronunciation: number;
    grammar: number;
    spelling: number;
  };
}

export interface LanguageConfig {
  code: LanguageCode;
  name: string;
  flag: string;
  nativeName: string;
}
