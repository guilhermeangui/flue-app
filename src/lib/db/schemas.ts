import { z } from "zod";

export const createChatSchema = z.object({
  language: z.enum(["pt", "en", "es", "fr"]),
  title: z.string().min(1).max(200),
});

export const sendMessageSchema = z.object({
  chatId: z.string().uuid(),
  content: z.string().min(1).max(10000),
  type: z.enum(["text", "voice", "analysis"]),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  nativeLanguage: z.enum(["pt", "en", "es", "fr"]).optional(),
  appLanguage: z.string().min(1).max(10).optional(),
  audioQuality: z.enum(["low", "medium", "high"]).optional(),
  notificationsEnabled: z.boolean().optional(),
});

export const addLanguageSchema = z.object({
  language: z.enum(["pt", "en", "es", "fr"]),
});
