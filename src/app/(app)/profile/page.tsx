import { redirect } from "next/navigation";
import { Header } from "@/components/layout/header";
import { LanguageList } from "@/components/profile/language-list";
import { ProfileActions } from "@/components/profile/profile-actions";
import { getCurrentUser, getUserLanguages } from "@/lib/db/queries";
import type { LanguageCode } from "@/lib/types";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const languageRows = await getUserLanguages(user.id);
  const languages = languageRows.map((l) => ({
    id: l.id,
    language: l.language as LanguageCode,
    isActive: l.is_active,
    sessionsCount: l.sessions_count,
  }));

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="flex flex-1 flex-col">
      <Header title="Profile" rightIcon="settings" />

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 pb-4">
        {/* Hero card */}
        <div className="flex flex-col gap-4 rounded-[20px] bg-surface p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-light to-primary-dark">
              <span className="font-heading text-[22px] font-bold text-white">
                {initials}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-heading text-lg font-bold text-text-primary">
                {user.name}
              </span>
              <span className="text-[13px] text-text-secondary">
                {user.email}
              </span>
            </div>
          </div>
          <div className="flex justify-around px-0 py-3">
            <div className="flex flex-col items-center gap-0.5">
              <span className="font-heading text-xl font-bold text-text-primary">
                {user.dayStreak} 🔥
              </span>
              <span className="text-[11px] text-text-secondary">
                Day Streak
              </span>
            </div>
            <div className="h-9 w-px bg-border" />
            <div className="flex flex-col items-center gap-0.5">
              <span className="font-heading text-xl font-bold text-text-primary">
                {user.totalSessions}
              </span>
              <span className="text-[11px] text-text-secondary">Sessions</span>
            </div>
            <div className="h-9 w-px bg-border" />
            <div className="flex flex-col items-center gap-0.5">
              <span className="font-heading text-xl font-bold text-primary">
                {user.avgScore}%
              </span>
              <span className="text-[11px] text-text-secondary">Avg Score</span>
            </div>
          </div>
        </div>

        <LanguageList
          languages={languages}
          nativeLanguage={user.nativeLanguage}
        />

        <ProfileActions
          notificationsEnabled={user.notificationsEnabled}
          audioQuality={user.audioQuality}
          appLanguage={user.appLanguage}
        />
      </div>
    </div>
  );
}
