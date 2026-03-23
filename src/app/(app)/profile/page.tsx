"use client";

import {
  Bell,
  ChevronRight,
  Globe,
  LogOut,
  Mic,
  Plus,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Header } from "@/components/layout/header";
import { useMockAuth } from "@/hooks/use-mock-auth";
import { mockUser } from "@/lib/mock-data";

export default function ProfilePage() {
  const { logout } = useMockAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);

  const handleSignOut = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex flex-1 flex-col">
      <Header
        title="Profile"
        rightIcon={Settings}
        onRightClick={() => router.push("/profile/settings")}
      />

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 pb-4">
        {/* Hero card */}
        <div className="flex flex-col gap-4 rounded-[20px] bg-surface p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-light to-primary-dark">
              <span className="font-heading text-[22px] font-bold text-white">
                {mockUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-heading text-lg font-bold text-text-primary">
                {mockUser.name}
              </span>
              <span className="text-[13px] text-text-secondary">
                {mockUser.email}
              </span>
            </div>
          </div>
          <div className="flex justify-around px-0 py-3">
            <div className="flex flex-col items-center gap-0.5">
              <span className="font-heading text-xl font-bold text-text-primary">
                {mockUser.dayStreak} 🔥
              </span>
              <span className="text-[11px] text-text-secondary">
                Day Streak
              </span>
            </div>
            <div className="h-9 w-px bg-border" />
            <div className="flex flex-col items-center gap-0.5">
              <span className="font-heading text-xl font-bold text-text-primary">
                {mockUser.totalSessions}
              </span>
              <span className="text-[11px] text-text-secondary">Sessions</span>
            </div>
            <div className="h-9 w-px bg-border" />
            <div className="flex flex-col items-center gap-0.5">
              <span className="font-heading text-xl font-bold text-primary">
                {mockUser.avgScore}%
              </span>
              <span className="text-[11px] text-text-secondary">Avg Score</span>
            </div>
          </div>
        </div>

        {/* Languages */}
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-bold tracking-wider text-text-muted">
            MY LANGUAGES
          </span>

          {/* Portuguese - active */}
          <div className="flex items-center gap-3 rounded-2xl border-[1.5px] border-primary bg-white p-3.5 shadow-[0_2px_8px_#00000010]">
            <span className="text-[28px]">🇧🇷</span>
            <div className="flex flex-1 flex-col gap-0.5">
              <span className="font-heading text-[15px] font-semibold text-text-primary">
                Portuguese
              </span>
              <span className="text-xs text-text-secondary">
                47 sessions · Native target
              </span>
            </div>
            <span className="rounded-xl bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary-dark">
              Active
            </span>
          </div>

          {/* English */}
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-white p-3.5 shadow-[0_2px_6px_#00000008]">
            <span className="text-[28px]">🇺🇸</span>
            <div className="flex flex-1 flex-col gap-0.5">
              <span className="font-heading text-[15px] font-semibold text-text-primary">
                English
              </span>
              <span className="text-xs text-text-secondary">12 sessions</span>
            </div>
          </div>

          {/* Add language */}
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-2xl border-[1.5px] border-border bg-[#FAFAFA] p-3.5"
          >
            <Plus className="h-[18px] w-[18px] text-primary" />
            <span className="text-sm font-semibold text-primary">
              Add Language
            </span>
          </button>
        </div>

        {/* Settings */}
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-bold tracking-wider text-text-muted">
            SETTINGS
          </span>
          <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_2px_6px_#00000008]">
            {/* Notifications */}
            <div className="flex items-center gap-2.5 p-4">
              <Bell className="h-[18px] w-[18px] text-text-secondary" />
              <span className="flex-1 text-sm font-medium text-text-primary">
                Notifications
              </span>
              <button
                type="button"
                onClick={() => setNotifications(!notifications)}
                className={`h-[26px] w-11 rounded-[13px] transition-colors ${
                  notifications ? "bg-primary" : "bg-surface"
                }`}
              >
                <div
                  className={`h-5 w-5 rounded-full bg-white transition-transform ${
                    notifications ? "translate-x-[21px]" : "translate-x-[3px]"
                  }`}
                />
              </button>
            </div>

            <div className="h-px bg-surface" />

            {/* Audio Quality */}
            <div className="flex items-center gap-2.5 p-4">
              <Mic className="h-[18px] w-[18px] text-text-secondary" />
              <span className="flex-1 text-sm font-medium text-text-primary">
                Audio Quality
              </span>
              <span className="text-[13px] text-text-secondary">High</span>
              <ChevronRight className="h-4 w-4 text-[#D4D4D8]" />
            </div>

            <div className="h-px bg-surface" />

            {/* App Language */}
            <div className="flex items-center gap-2.5 p-4">
              <Globe className="h-[18px] w-[18px] text-text-secondary" />
              <span className="flex-1 text-sm font-medium text-text-primary">
                App Language
              </span>
              <span className="text-[13px] text-text-secondary">English</span>
              <ChevronRight className="h-4 w-4 text-[#D4D4D8]" />
            </div>
          </div>
        </div>

        {/* Account */}
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-bold tracking-wider text-text-muted">
            ACCOUNT
          </span>
          <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_2px_6px_#00000008]">
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 p-4"
            >
              <LogOut className="h-[18px] w-[18px] text-error" />
              <span className="text-sm font-medium text-error">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
