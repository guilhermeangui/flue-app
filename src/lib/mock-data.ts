import type { Chat, Message, ProgressData, User } from "./types";

export const mockUser: User = {
  id: "user-1",
  name: "Maria Silva",
  email: "maria@example.com",
  nativeLanguage: "pt",
  targetLanguages: ["en", "es"],
  dayStreak: 5,
  totalSessions: 23,
  avgScore: 87,
  createdAt: "2025-12-01T10:00:00Z",
};

export const mockChats: Chat[] = [
  {
    id: "chat-1",
    userId: "user-1",
    language: "en",
    title: "Daily English Practice",
    lastMessage: "Great job! Keep practicing those pronunciation patterns.",
    score: 92,
    duration: "12 min",
    date: "Today",
    messagesCount: 5,
  },
  {
    id: "chat-2",
    userId: "user-1",
    language: "es",
    title: "Spanish Conversation",
    lastMessage: "Tu conjugaci\u00F3n verbal est\u00E1 mejorando mucho.",
    score: 78,
    duration: "8 min",
    date: "Yesterday",
    messagesCount: 7,
  },
  {
    id: "chat-3",
    userId: "user-1",
    language: "en",
    title: "Business English",
    lastMessage: "Let's review some formal email phrases next time.",
    score: 85,
    duration: "15 min",
    date: "2 days ago",
    messagesCount: 10,
  },
  {
    id: "chat-4",
    userId: "user-1",
    language: "fr",
    title: "French Basics",
    lastMessage:
      "Bonne tentative! La prononciation du 'r' demande de la pratique.",
    score: 65,
    duration: "6 min",
    date: "3 days ago",
    messagesCount: 4,
  },
];

export const mockMessages: Message[] = [
  {
    id: "msg-1",
    chatId: "chat-1",
    sender: "ai",
    type: "text",
    content:
      "Hello Maria! Ready for today's English practice? Try telling me about something you enjoy doing, and I'll help you improve your pronunciation and grammar.",
    timestamp: "2026-03-21T14:00:00Z",
  },
  {
    id: "msg-2",
    chatId: "chat-1",
    sender: "user",
    type: "voice",
    voiceDuration: "0:03",
    timestamp: "2026-03-21T14:01:12Z",
  },
  {
    id: "msg-3",
    chatId: "chat-1",
    sender: "ai",
    type: "analysis",
    analysis: {
      transcription:
        "Eu gosto de aprender ingl\u00EAs porque me ajuda no trabalho",
      wordsToReview: [
        { word: "because", type: "pronunciation" },
        { word: "helps me", type: "grammar" },
      ],
      accuracyScore: 85,
      issuesCount: 3,
      details: [
        {
          type: "pronunciation",
          original: "because",
          corrected: "because /b\u026A\u02C8k\u0254\u02D0z/",
          explanation:
            "The vowel sound in the first syllable should be a short 'i' sound, not 'eh'. Try saying 'bih-KAWZ' with emphasis on the second syllable.",
        },
        {
          type: "grammar",
          original: "helps me",
          corrected: "it helps me",
          explanation:
            "In English, the subject pronoun 'it' is required before the verb. Unlike Portuguese, English doesn't allow subject omission.",
        },
        {
          type: "spelling",
          original: "trabalho",
          corrected: "work",
          explanation:
            "Remember to use the English word 'work' instead of the Portuguese 'trabalho' when speaking in English.",
        },
      ],
    },
    timestamp: "2026-03-21T14:01:18Z",
  },
  {
    id: "msg-4",
    chatId: "chat-1",
    sender: "user",
    type: "text",
    content: "Thanks! I'll practice more",
    timestamp: "2026-03-21T14:02:30Z",
  },
  {
    id: "msg-5",
    chatId: "chat-1",
    sender: "ai",
    type: "text",
    content:
      "Great job! Keep practicing those pronunciation patterns. You're making excellent progress — your accuracy has been improving steadily over the past few weeks!",
    timestamp: "2026-03-21T14:02:45Z",
  },
];

export const mockProgress: ProgressData = {
  weekStreak: [true, true, true, true, true, false, false],
  bestStreak: 12,
  currentStreak: 5,
  accuracyTrend: [
    { label: "Week 1", value: 75 },
    { label: "Week 2", value: 80 },
    { label: "Week 3", value: 82 },
    { label: "Week 4", value: 87 },
  ],
  errorBreakdown: {
    pronunciation: 45,
    grammar: 35,
    spelling: 20,
  },
};
