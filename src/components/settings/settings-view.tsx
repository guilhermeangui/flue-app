"use client";

import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Globe,
  Key,
  Mic,
  Trash2,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  updateAudioQuality,
  updateNotifications,
} from "@/lib/db/actions/profile-actions";

interface SettingsViewProps {
  notificationsEnabled: boolean;
  audioQuality: string;
  appLanguage: string;
}

export function SettingsView({
  notificationsEnabled: initialNotifications,
  audioQuality: initialAudioQuality,
  appLanguage,
}: SettingsViewProps) {
  const router = useRouter();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [audioQuality, setAudioQuality] = useState(initialAudioQuality);
  const handleToggleNotifications = async () => {
    const newValue = !notifications;
    setNotifications(newValue);
    await updateNotifications(newValue);
  };

  const cycleAudioQuality = async () => {
    const qualities = ["low", "medium", "high"];
    const currentIdx = qualities.indexOf(audioQuality);
    const next = qualities[(currentIdx + 1) % qualities.length];
    setAudioQuality(next);
    await updateAudioQuality(next);
  };

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Nav */}
      <div className="flex items-center justify-between px-4 py-3">
        <button type="button" onClick={() => router.back()}>
          <ChevronLeft className="h-7 w-7 text-text-primary" />
        </button>
        <span className="font-heading text-[17px] font-bold text-text-primary">
          Settings
        </span>
        <div className="w-7" />
      </div>

      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-5 pb-8 pt-2">
        {/* General */}
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-bold tracking-wider text-text-muted">
            GENERAL
          </span>
          <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_2px_6px_#00000008]">
            <div className="flex items-center gap-2.5 p-4">
              <Globe className="h-[18px] w-[18px] text-text-secondary" />
              <span className="flex-1 text-sm font-medium text-text-primary">
                App Language
              </span>
              <span className="text-[13px] text-text-secondary">
                {appLanguage === "en" ? "English" : "Português"}
              </span>
              <ChevronRight className="h-4 w-4 text-[#D4D4D8]" />
            </div>
            <div className="h-px bg-surface" />
            <div className="flex items-center gap-2.5 p-4">
              <Bell className="h-[18px] w-[18px] text-text-secondary" />
              <span className="flex-1 text-sm font-medium text-text-primary">
                Notifications
              </span>
              <button
                type="button"
                onClick={handleToggleNotifications}
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
            <button
              type="button"
              onClick={cycleAudioQuality}
              className="flex w-full items-center gap-2.5 p-4"
            >
              <Mic className="h-[18px] w-[18px] text-text-secondary" />
              <span className="flex-1 text-left text-sm font-medium text-text-primary">
                Audio Quality
              </span>
              <span className="text-[13px] capitalize text-text-secondary">
                {audioQuality}
              </span>
              <ChevronRight className="h-4 w-4 text-[#D4D4D8]" />
            </button>
          </div>
        </div>

        {/* Account */}
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-bold tracking-wider text-text-muted">
            ACCOUNT
          </span>
          <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_2px_6px_#00000008]">
            <div className="flex items-center gap-2.5 p-4">
              <User className="h-[18px] w-[18px] text-text-secondary" />
              <span className="flex-1 text-sm font-medium text-text-primary">
                Edit Profile
              </span>
              <ChevronRight className="h-4 w-4 text-[#D4D4D8]" />
            </div>
            <div className="h-px bg-surface" />
            <div className="flex items-center gap-2.5 p-4">
              <Key className="h-[18px] w-[18px] text-text-secondary" />
              <span className="flex-1 text-sm font-medium text-text-primary">
                Change Password
              </span>
              <ChevronRight className="h-4 w-4 text-[#D4D4D8]" />
            </div>
            <div className="h-px bg-surface" />
            <div className="flex items-center gap-2.5 p-4">
              <Trash2 className="h-[18px] w-[18px] text-error" />
              <span className="flex-1 text-sm font-medium text-error">
                Delete Account
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
