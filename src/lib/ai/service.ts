import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";
import type { AnalysisData, LanguageCode } from "@/lib/types";
import { buildContext } from "./context";
import {
  getAnalysisSystemPrompt,
  getConversationSystemPrompt,
} from "./prompts";

const anthropic = new Anthropic();

/** Lazy-initialized OpenAI client (only needed for Whisper transcription). */
let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) _openai = new OpenAI();
  return _openai;
}

const MODEL_CONVERSATION = "claude-haiku-4-5-20251001";
const MODEL_ANALYSIS = "claude-sonnet-4-5-20250929";

/** Strip markdown code fences that LLMs sometimes add around JSON. */
function extractJson(raw: string): string {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();
  return raw.trim();
}

interface UsageInfo {
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
}

export interface AIResult {
  analysis: AnalysisData;
  coachResponse: string;
  usage: UsageInfo;
  model: string;
}

/**
 * Generate analysis + coach response for any user message (text or voice transcription).
 */
export async function generateResponse(
  chatId: string,
  userMessage: string,
  language: LanguageCode,
  tier: "free" | "pro",
): Promise<AIResult> {
  const systemPrompt = getConversationSystemPrompt(language);
  const context = await buildContext(chatId, tier);

  // Use context if available, otherwise just the current message
  const messages: Anthropic.MessageParam[] =
    context.length > 0 ? context : [{ role: "user", content: userMessage }];

  const model = MODEL_CONVERSATION;

  const response = await anthropic.messages.create({
    model,
    max_tokens: 600,
    system: [
      {
        type: "text",
        text: systemPrompt,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages,
  });

  const rawText =
    response.content[0].type === "text" ? response.content[0].text : "{}";

  const usage: UsageInfo = {
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
    cacheReadTokens: response.usage.cache_read_input_tokens ?? 0,
  };

  let parsed: { analysis?: AnalysisData; coachResponse?: string };
  try {
    parsed = JSON.parse(extractJson(rawText));
  } catch {
    // AI didn't return valid JSON — treat entire response as coach feedback
    return {
      analysis: {
        transcription: userMessage,
        wordsToReview: [],
        accuracyScore: 100,
        issuesCount: 0,
        details: [],
      },
      coachResponse: rawText,
      usage,
      model,
    };
  }

  return {
    analysis: parsed.analysis ?? {
      transcription: userMessage,
      wordsToReview: [],
      accuracyScore: 100,
      issuesCount: 0,
      details: [],
    },
    coachResponse: parsed.coachResponse ?? "",
    usage,
    model,
  };
}

/**
 * Generate analysis for voice transcription (uses Sonnet for Pro).
 */
export async function generateVoiceAnalysis(
  transcription: string,
  language: LanguageCode,
  tier: "free" | "pro",
): Promise<AIResult> {
  const systemPrompt = getAnalysisSystemPrompt(language);
  const model = tier === "pro" ? MODEL_ANALYSIS : MODEL_CONVERSATION;

  const response = await anthropic.messages.create({
    model,
    max_tokens: 800,
    system: [
      {
        type: "text",
        text: systemPrompt,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: `Transcription of the user's voice message: "${transcription}"`,
      },
    ],
  });

  const rawText =
    response.content[0].type === "text" ? response.content[0].text : "{}";

  const usage: UsageInfo = {
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
    cacheReadTokens: response.usage.cache_read_input_tokens ?? 0,
  };

  let parsed: AnalysisData & { coachResponse?: string };
  try {
    parsed = JSON.parse(extractJson(rawText));
  } catch {
    return {
      analysis: {
        transcription,
        wordsToReview: [],
        accuracyScore: 0,
        issuesCount: 0,
        details: [],
      },
      coachResponse: rawText,
      usage,
      model,
    };
  }

  const { coachResponse, ...analysis } = parsed;

  return {
    analysis,
    coachResponse: coachResponse ?? "",
    usage,
    model,
  };
}

/** ISO 639-1 codes that Whisper accepts. */
const WHISPER_LANG: Record<string, string> = {
  pt: "pt",
  en: "en",
  es: "es",
  fr: "fr",
};

/**
 * Transcribe an audio file using OpenAI Whisper.
 */
export async function transcribeAudio(
  audioFile: File,
  language: LanguageCode,
): Promise<string> {
  const response = await getOpenAI().audio.transcriptions.create({
    model: "whisper-1",
    file: audioFile,
    language: WHISPER_LANG[language] ?? language,
  });

  return response.text.trim();
}

/**
 * Log usage to the database for cost tracking.
 */
export async function logUsage(
  userId: string,
  chatId: string,
  model: string,
  usage: UsageInfo,
): Promise<void> {
  const supabase = await createClient();

  const costs: Record<string, { input: number; output: number }> = {
    [MODEL_CONVERSATION]: { input: 100, output: 500 },
    [MODEL_ANALYSIS]: { input: 300, output: 1500 },
  };

  const rate = costs[model] ?? costs[MODEL_CONVERSATION];
  const costCents =
    (usage.inputTokens * rate.input) / 1_000_000 +
    (usage.outputTokens * rate.output) / 1_000_000;

  await supabase.from("usage_logs").insert({
    user_id: userId,
    chat_id: chatId,
    model,
    input_tokens: usage.inputTokens,
    output_tokens: usage.outputTokens,
    cached_tokens: usage.cacheReadTokens,
    cost_cents: costCents,
  });
}
