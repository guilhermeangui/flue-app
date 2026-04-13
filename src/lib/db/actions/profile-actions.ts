"use server";

import { revalidatePath } from "next/cache";
import { addLanguageSchema, updateProfileSchema } from "@/lib/db/schemas";
import { createClient } from "@/lib/supabase/server";

export async function updateProfile(data: {
  name?: string;
  nativeLanguage?: string;
  appLanguage?: string;
  audioQuality?: string;
  notificationsEnabled?: boolean;
}) {
  const parsed = updateProfileSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid input");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (parsed.data.name !== undefined) updates.name = parsed.data.name;
  if (parsed.data.nativeLanguage !== undefined)
    updates.native_language = parsed.data.nativeLanguage;
  if (parsed.data.appLanguage !== undefined)
    updates.app_language = parsed.data.appLanguage;
  if (parsed.data.audioQuality !== undefined)
    updates.audio_quality = parsed.data.audioQuality;
  if (parsed.data.notificationsEnabled !== undefined)
    updates.notifications_enabled = parsed.data.notificationsEnabled;

  await supabase.from("profiles").update(updates).eq("id", user.id);

  revalidatePath("/profile");
  revalidatePath("/profile/settings");
}

export async function addLanguage(language: string) {
  const parsed = addLanguageSchema.safeParse({ language });
  if (!parsed.success) throw new Error("Invalid input");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  await supabase
    .from("user_languages")
    .upsert(
      { user_id: user.id, language: parsed.data.language, is_active: false },
      { onConflict: "user_id,language" },
    );

  revalidatePath("/profile");
}

export async function removeLanguage(languageId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  await supabase
    .from("user_languages")
    .delete()
    .eq("id", languageId)
    .eq("user_id", user.id);

  revalidatePath("/profile");
}

export async function setActiveLanguage(languageId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Deactivate all
  await supabase
    .from("user_languages")
    .update({ is_active: false })
    .eq("user_id", user.id);

  // Activate selected
  await supabase
    .from("user_languages")
    .update({ is_active: true })
    .eq("id", languageId)
    .eq("user_id", user.id);

  revalidatePath("/profile");
}

export async function updateNotifications(enabled: boolean) {
  await updateProfile({ notificationsEnabled: enabled });
}

export async function updateAudioQuality(quality: string) {
  await updateProfile({ audioQuality: quality });
}
