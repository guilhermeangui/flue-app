import { redirect } from "next/navigation";
import { SettingsView } from "@/components/settings/settings-view";
import { getCurrentUser } from "@/lib/db/queries";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <SettingsView
      notificationsEnabled={user.notificationsEnabled}
      audioQuality={user.audioQuality}
      appLanguage={user.appLanguage}
    />
  );
}
