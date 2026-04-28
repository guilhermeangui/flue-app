import type Anthropic from "@anthropic-ai/sdk";
import type { MessageRow } from "@/lib/db/types";
import { createClient } from "@/lib/supabase/server";

const CONTEXT_WINDOW = {
  free: 8,
  pro: 15,
} as const;

/**
 * Build conversation history for the AI from recent messages.
 * Applies context windowing based on user tier.
 */
export async function buildContext(
  chatId: string,
  tier: "free" | "pro",
): Promise<Anthropic.MessageParam[]> {
  const supabase = await createClient();
  const limit = CONTEXT_WINDOW[tier];

  const { data: rows } = await supabase
    .from("messages")
    .select("sender, type, content")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: false })
    .limit(limit)
    .returns<Pick<MessageRow, "sender" | "type" | "content">[]>();

  if (!rows || rows.length === 0) return [];

  // Reverse to chronological order
  const messages = rows.reverse();

  const result: Anthropic.MessageParam[] = [];

  for (const msg of messages) {
    const role = msg.sender === "user" ? "user" : "assistant";
    const content =
      msg.content ?? (msg.type === "voice" ? "[voice message]" : "");

    if (!content) continue;

    // Merge consecutive same-role messages
    const last = result[result.length - 1];
    if (last && last.role === role && typeof last.content === "string") {
      last.content = `${last.content}\n${content}`;
    } else {
      result.push({ role, content });
    }
  }

  // Ensure conversation starts with user message (API requirement)
  if (result.length > 0 && result[0].role === "assistant") {
    result.shift();
  }

  return result;
}
