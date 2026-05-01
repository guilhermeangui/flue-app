"use client";

import {
  Bell,
  Check,
  ChevronRight,
  Globe,
  Key,
  LogOut,
  Mic,
  Trash2,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { APP_LOCALE_NAMES, type AppLocale } from "@/i18n";
import { useI18n } from "@/i18n/context";
import { APP_LANGUAGES } from "@/lib/constants";
import {
  updateAppLanguage,
  updateAudioQuality,
  updateNotifications,
} from "@/lib/db/actions/profile-actions";

interface ProfileActionsProps {
  notificationsEnabled: boolean;
  audioQuality: string;
  appLanguage: string;
}

export function ProfileActions({
  notificationsEnabled: initialNotifications,
  audioQuality: initialAudioQuality,
  appLanguage: initialAppLanguage,
}: ProfileActionsProps) {
  const { logout } = useAuth();
  const router = useRouter();
  const { t } = useI18n();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [audioQuality, setAudioQuality] = useState(initialAudioQuality);
  const [currentLang, setCurrentLang] = useState(initialAppLanguage);
  const [showLangPicker, setShowLangPicker] = useState(false);

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

  const handleSelectLanguage = async (code: string) => {
    setCurrentLang(code);
    setShowLangPicker(false);
    await updateAppLanguage(code);
    router.refresh();
  };

  const handleSignOut = async () => {
    await logout();
  };

  const qualityLabel =
    audioQuality === "low"
      ? t.qualityLow
      : audioQuality === "medium"
        ? t.qualityMedium
        : t.qualityHigh;

  return (
    <>
      {/* Settings */}
      <div className="flex flex-col gap-3">
        <span className="text-[11px] font-bold tracking-wider text-text-muted">
          {t.settingsSection}
        </span>
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_2px_6px_#00000008]">
          {/* App Language */}
          <button
            type="button"
            onClick={() => setShowLangPicker(true)}
            className="flex w-full items-center gap-2.5 p-4"
          >
            <Globe className="h-[18px] w-[18px] text-text-secondary" />
            <span className="flex-1 text-left text-sm font-medium text-text-primary">
              {t.appLanguage}
            </span>
            <span className="text-[13px] text-text-secondary">
              {APP_LOCALE_NAMES[currentLang as AppLocale] ?? currentLang}
            </span>
            <ChevronRight className="h-4 w-4 text-[#D4D4D8]" />
          </button>

          <div className="h-px bg-surface" />

          {/* Notifications */}
          <div className="flex items-center gap-2.5 p-4">
            <Bell className="h-[18px] w-[18px] text-text-secondary" />
            <span className="flex-1 text-sm font-medium text-text-primary">
              {t.notifications}
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
          <button
            type="button"
            onClick={cycleAudioQuality}
            className="flex w-full items-center gap-2.5 p-4"
          >
            <Mic className="h-[18px] w-[18px] text-text-secondary" />
            <span className="flex-1 text-left text-sm font-medium text-text-primary">
              {t.audioQuality}
            </span>
            <span className="text-[13px] capitalize text-text-secondary">
              {qualityLabel}
            </span>
            <ChevronRight className="h-4 w-4 text-[#D4D4D8]" />
          </button>
        </div>
      </div>

      {/* Account */}
      <div className="flex flex-col gap-3">
        <span className="text-[11px] font-bold tracking-wider text-text-muted">
          {t.accountSection}
        </span>
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_2px_6px_#00000008]">
          <div className="flex items-center gap-2.5 p-4">
            <User className="h-[18px] w-[18px] text-text-secondary" />
            <span className="flex-1 text-sm font-medium text-text-primary">
              {t.editProfile}
            </span>
            <ChevronRight className="h-4 w-4 text-[#D4D4D8]" />
          </div>
          <div className="h-px bg-surface" />
          <div className="flex items-center gap-2.5 p-4">
            <Key className="h-[18px] w-[18px] text-text-secondary" />
            <span className="flex-1 text-sm font-medium text-text-primary">
              {t.changePassword}
            </span>
            <ChevronRight className="h-4 w-4 text-[#D4D4D8]" />
          </div>
          <div className="h-px bg-surface" />
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 p-4"
          >
            <LogOut className="h-[18px] w-[18px] text-error" />
            <span className="text-sm font-medium text-error">{t.signOut}</span>
          </button>
          <div className="h-px bg-surface" />
          <div className="flex items-center gap-2.5 p-4">
            <Trash2 className="h-[18px] w-[18px] text-error" />
            <span className="flex-1 text-sm font-medium text-error">
              {t.deleteAccount}
            </span>
          </div>
        </div>
      </div>

      {/* Language picker overlay */}
      {showLangPicker && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
          <div className="w-full max-w-3xl animate-slide-up rounded-t-3xl bg-white px-5 pb-8 pt-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-heading text-lg font-bold text-text-primary">
                {t.appLanguage}
              </span>
              <button
                type="button"
                onClick={() => setShowLangPicker(false)}
                className="text-sm font-medium text-text-secondary"
              >
                {t.cancel}
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {APP_LANGUAGES.map((lang) => {
                const isSelected = lang.code === currentLang;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`flex items-center gap-3 rounded-xl p-3.5 ${
                      isSelected ? "bg-primary/5" : "hover:bg-surface"
                    }`}
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <span
                      className={`flex-1 text-left text-sm font-medium ${
                        isSelected ? "text-primary" : "text-text-primary"
                      }`}
                    >
                      {lang.name}
                    </span>
                    {isSelected && <Check className="h-5 w-5 text-primary" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
