"use client";

import { Bell, ChevronRight, Globe, LogOut, Mic } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { updateNotifications } from "@/lib/db/actions/profile-actions";

interface ProfileActionsProps {
  notificationsEnabled: boolean;
  audioQuality: string;
  appLanguage: string;
}

export function ProfileActions({
  notificationsEnabled: initialNotifications,
  audioQuality,
  appLanguage,
}: ProfileActionsProps) {
  const { logout } = useAuth();
  const [notifications, setNotifications] = useState(initialNotifications);

  const handleToggleNotifications = async () => {
    const newValue = !notifications;
    setNotifications(newValue);
    await updateNotifications(newValue);
  };

  const handleSignOut = async () => {
    await logout();
  };

  return (
    <>
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

          {/* Audio Quality */}
          <div className="flex items-center gap-2.5 p-4">
            <Mic className="h-[18px] w-[18px] text-text-secondary" />
            <span className="flex-1 text-sm font-medium text-text-primary">
              Audio Quality
            </span>
            <span className="text-[13px] capitalize text-text-secondary">
              {audioQuality}
            </span>
            <ChevronRight className="h-4 w-4 text-[#D4D4D8]" />
          </div>

          <div className="h-px bg-surface" />

          {/* App Language */}
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
    </>
  );
}
