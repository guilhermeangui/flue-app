"use client";

import { BarChart2, MessageCircle, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { TranslationKeys } from "@/i18n";
import { useI18n } from "@/i18n/context";

const tabs: {
  href: string;
  icon: typeof MessageCircle;
  labelKey: TranslationKeys;
}[] = [
  { href: "/chats", icon: MessageCircle, labelKey: "tabChats" },
  { href: "/progress", icon: BarChart2, labelKey: "tabProgress" },
  { href: "/profile", icon: User, labelKey: "tabProfile" },
];

export function TabBar() {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <div className="px-[21px] pb-[21px] pt-3">
      <nav className="flex h-[62px] rounded-[36px] border border-border bg-white p-1">
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-[26px] text-xs font-medium transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span className="font-body text-[11px]">{t[tab.labelKey]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
