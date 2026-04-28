"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkAndIncrementUsage } from "@/lib/ai/rate-limiter";
import {
  generateResponse,
  generateVoiceAnalysis,
  logUsage,
  transcribeAudio,
} from "@/lib/ai/service";
import { createChatSchema, sendMessageSchema } from "@/lib/db/schemas";
import { createClient } from "@/lib/supabase/server";
import type { LanguageCode } from "@/lib/types";

export async function createChat(
  language: string,
  title: string,
  firstMessage?: string,
) {
  const parsed = createChatSchema.safeParse({ language, title });
  if (!parsed.success) throw new Error("Invalid input");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: chat, error } = await supabase
    .from("chats")
    .insert({
      user_id: user.id,
      language: parsed.data.language,
      title: parsed.data.title,
      last_message: firstMessage ?? null,
    })
    .select("id")
    .single();

  if (error || !chat) throw new Error("Failed to create chat");

  // Save first message if provided
  if (firstMessage) {
    await supabase.from("messages").insert({
      chat_id: chat.id,
      user_id: user.id,
      sender: "user",
      type: "text",
      content: firstMessage,
    });

    // Generate AI response for the first message
    await generateAndSaveAIResponse(
      user.id,
      chat.id,
      parsed.data.language as LanguageCode,
      firstMessage,
    );
  }

  // Upsert language
  await supabase
    .from("user_languages")
    .upsert(
      { user_id: user.id, language: parsed.data.language },
      { onConflict: "user_id,language" },
    );

  revalidatePath("/chats");
  return { chatId: chat.id };
}

export async function sendMessage(
  chatId: string,
  content: string,
  type: "text" | "voice" | "analysis" = "text",
) {
  const parsed = sendMessageSchema.safeParse({ chatId, content, type });
  if (!parsed.success) throw new Error("Invalid input");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: message, error } = await supabase
    .from("messages")
    .insert({
      chat_id: parsed.data.chatId,
      user_id: user.id,
      sender: "user",
      type: parsed.data.type,
      content: parsed.data.content,
    })
    .select("id, created_at")
    .single();

  if (error || !message) throw new Error("Failed to send message");

  // Update chat metadata
  await supabase
    .from("chats")
    .update({
      last_message: parsed.data.content,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.chatId);

  // Get chat language for AI response
  const { data: chat } = await supabase
    .from("chats")
    .select("language")
    .eq("id", parsed.data.chatId)
    .single();

  if (chat) {
    await generateAndSaveAIResponse(
      user.id,
      parsed.data.chatId,
      chat.language as LanguageCode,
      parsed.data.content,
    );
  }

  revalidatePath(`/chats/${parsed.data.chatId}`);
  revalidatePath("/chats");

  return { id: message.id, createdAt: message.created_at };
}

export async function sendVoiceMessage(
  chatId: string,
  formData: FormData,
  durationSeconds: number,
) {
  const file = formData.get("audio") as File | null;
  const localAudioId = formData.get("localAudioId") as string | null;
  if (!file) throw new Error("No audio file");
  if (!localAudioId) throw new Error("Missing localAudioId");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Save message with a reference to the device-local blob.
  // The audio itself lives in the client's IndexedDB — not persisted server-side.
  const { data: message, error } = await supabase
    .from("messages")
    .insert({
      chat_id: chatId,
      user_id: user.id,
      sender: "user",
      type: "voice",
      voice_local_id: localAudioId,
      voice_duration_seconds: durationSeconds,
    })
    .select("id, created_at")
    .single();

  if (error || !message) throw new Error("Failed to save voice message");

  // Update chat metadata
  await supabase
    .from("chats")
    .update({
      last_message: "🎤 Voice message",
      updated_at: new Date().toISOString(),
    })
    .eq("id", chatId);

  // Get chat language for AI response with voice transcription
  const { data: chat } = await supabase
    .from("chats")
    .select("language")
    .eq("id", chatId)
    .single();

  if (chat) {
    // `file` is used only for Whisper transcription; not persisted.
    await generateAndSaveVoiceResponse(
      user.id,
      chatId,
      chat.language as LanguageCode,
      file,
    );
  }

  revalidatePath(`/chats/${chatId}`);
  revalidatePath("/chats");

  return {
    id: message.id,
    createdAt: message.created_at,
    localAudioId,
  };
}

export async function deleteChat(chatId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  await supabase.from("chats").delete().eq("id", chatId).eq("user_id", user.id);

  revalidatePath("/chats");
  redirect("/chats");
}

// ─── Internal helper ────────────────────────────────────────

async function generateAndSaveAIResponse(
  userId: string,
  chatId: string,
  language: LanguageCode,
  userMessage?: string,
): Promise<void> {
  // Check rate limit
  const usageCheck = await checkAndIncrementUsage(userId);
  if (!usageCheck.allowed) return;

  const supabase = await createClient();

  // Get user tier
  const { data: profile } = await supabase
    .from("profiles")
    .select("tier")
    .eq("id", userId)
    .single();

  const tier = (profile?.tier as "free" | "pro") ?? "free";

  try {
    const result = await generateResponse(
      chatId,
      userMessage ?? "",
      language,
      tier,
    );

    // 1. Save analysis message (if there are issues or score < 100)
    const hasAnalysis =
      result.analysis.issuesCount > 0 || result.analysis.accuracyScore < 100;

    if (hasAnalysis) {
      await supabase.from("messages").insert({
        chat_id: chatId,
        user_id: userId,
        sender: "ai",
        type: "analysis",
        analysis: result.analysis,
      });
    }

    // 2. Save coach response as text message
    if (result.coachResponse) {
      await supabase.from("messages").insert({
        chat_id: chatId,
        user_id: userId,
        sender: "ai",
        type: "text",
        content: result.coachResponse,
      });
    }

    // Update chat last_message
    const lastMsg = result.coachResponse || "AI Coach · Analysis";
    await supabase
      .from("chats")
      .update({
        last_message: lastMsg,
        updated_at: new Date().toISOString(),
      })
      .eq("id", chatId);

    // Log usage
    await logUsage(userId, chatId, result.model, result.usage);
  } catch (err) {
    console.error("AI response failed:", err);
  }
}

async function generateAndSaveVoiceResponse(
  userId: string,
  chatId: string,
  language: LanguageCode,
  audioFile: File,
): Promise<void> {
  const usageCheck = await checkAndIncrementUsage(userId);
  if (!usageCheck.allowed) return;

  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("tier")
    .eq("id", userId)
    .single();

  const tier = (profile?.tier as "free" | "pro") ?? "free";

  try {
    // 1. Transcribe the audio (Whisper auto-detects the spoken language)
    const { text: transcription, detectedLanguage } =
      await transcribeAudio(audioFile);

    // 2. Analyze the transcription with awareness of what was actually spoken
    const result = await generateVoiceAnalysis(
      transcription,
      language,
      detectedLanguage,
      tier,
    );

    // Override transcription with the actual one
    result.analysis.transcription = transcription;

    // 3. Save analysis message
    await supabase.from("messages").insert({
      chat_id: chatId,
      user_id: userId,
      sender: "ai",
      type: "analysis",
      analysis: result.analysis,
    });

    // 4. Save coach response
    if (result.coachResponse) {
      await supabase.from("messages").insert({
        chat_id: chatId,
        user_id: userId,
        sender: "ai",
        type: "text",
        content: result.coachResponse,
      });
    }

    const lastMsg = result.coachResponse || "AI Coach · Analysis";
    await supabase
      .from("chats")
      .update({
        last_message: lastMsg,
        updated_at: new Date().toISOString(),
      })
      .eq("id", chatId);

    await logUsage(userId, chatId, result.model, result.usage);
  } catch (err) {
    console.error("Voice AI response failed:", err);
  }
}
