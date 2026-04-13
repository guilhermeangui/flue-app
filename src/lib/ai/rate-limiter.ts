import { TIER_LIMITS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";

export interface UsageStatus {
  allowed: boolean;
  remaining: number;
  limit: number;
  used: number;
}

/**
 * Check if user can send a message and atomically increment usage.
 * Auto-resets counter if the day has changed.
 */
export async function checkAndIncrementUsage(
  userId: string,
): Promise<UsageStatus> {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  // Fetch current profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("tier, daily_messages_used, daily_messages_reset_at")
    .eq("id", userId)
    .single();

  if (!profile) throw new Error("Profile not found");

  const tier = profile.tier as "free" | "pro";
  const limit = TIER_LIMITS[tier];

  // Reset counter if day changed
  let used = profile.daily_messages_used;
  if (profile.daily_messages_reset_at !== today) {
    used = 0;
  }

  if (used >= limit) {
    return { allowed: false, remaining: 0, limit, used };
  }

  // Increment atomically
  const newUsed = used + 1;
  await supabase
    .from("profiles")
    .update({
      daily_messages_used: newUsed,
      daily_messages_reset_at: today,
    })
    .eq("id", userId);

  return {
    allowed: true,
    remaining: limit - newUsed,
    limit,
    used: newUsed,
  };
}

/**
 * Get current usage without incrementing (for UI display).
 */
export async function getUsageStatus(userId: string): Promise<UsageStatus> {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  const { data: profile } = await supabase
    .from("profiles")
    .select("tier, daily_messages_used, daily_messages_reset_at")
    .eq("id", userId)
    .single();

  if (!profile) throw new Error("Profile not found");

  const tier = profile.tier as "free" | "pro";
  const limit = TIER_LIMITS[tier];
  const used =
    profile.daily_messages_reset_at !== today ? 0 : profile.daily_messages_used;

  return {
    allowed: used < limit,
    remaining: Math.max(0, limit - used),
    limit,
    used,
  };
}
