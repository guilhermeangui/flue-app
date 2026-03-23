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
  createdAt: string;
}

export interface Chat {
  id: string;
  userId: string;
  language: LanguageCode;
  title: string;
  lastMessage: string;
  score: number;
  duration: string;
  date: string;
  messagesCount: number;
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
}

export interface Message {
  id: string;
  chatId: string;
  sender: "user" | "ai";
  type: "text" | "voice" | "analysis";
  content?: string;
  voiceDuration?: string;
  analysis?: AnalysisData;
  timestamp: string;
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

export interface AIProvider {
  id: string;
  name: string;
  description: string;
  connected: boolean;
}
