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

export default function SettingsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [claudeConnected, setClaudeConnected] = useState(false);
  const [openaiConnected, setOpenaiConnected] = useState(false);

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Status bar spacer */}
      <div className="h-[62px]" />

      {/* Nav */}
      <div className="flex h-[52px] items-center justify-between px-2">
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
              <span className="text-[13px] text-text-secondary">English</span>
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
            <div className="flex items-center gap-2.5 p-4">
              <Mic className="h-[18px] w-[18px] text-text-secondary" />
              <span className="flex-1 text-sm font-medium text-text-primary">
                Audio Quality
              </span>
              <span className="text-[13px] text-text-secondary">High</span>
              <ChevronRight className="h-4 w-4 text-[#D4D4D8]" />
            </div>
          </div>
        </div>

        {/* AI Provider */}
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-bold tracking-wider text-text-muted">
            AI PROVIDER
          </span>

          <div className="flex flex-col gap-3">
            {/* Claude */}
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-white p-4 shadow-[0_2px_6px_#00000008]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-light to-primary-dark">
                <Key className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-1 flex-col gap-0.5">
                <span className="text-sm font-semibold text-text-primary">
                  Claude
                </span>
                <span className="text-xs text-text-secondary">
                  Anthropic&apos;s AI assistant
                </span>
              </div>
              <button
                type="button"
                onClick={() => setClaudeConnected(!claudeConnected)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold ${
                  claudeConnected
                    ? "bg-success/10 text-success"
                    : "bg-primary text-white"
                }`}
              >
                {claudeConnected ? "Connected" : "Connect"}
              </button>
            </div>

            {/* OpenAI */}
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-white p-4 shadow-[0_2px_6px_#00000008]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-text-primary">
                <Key className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-1 flex-col gap-0.5">
                <span className="text-sm font-semibold text-text-primary">
                  OpenAI
                </span>
                <span className="text-xs text-text-secondary">
                  GPT-powered language models
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpenaiConnected(!openaiConnected)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold ${
                  openaiConnected
                    ? "bg-success/10 text-success"
                    : "bg-primary text-white"
                }`}
              >
                {openaiConnected ? "Connected" : "Connect"}
              </button>
            </div>
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
