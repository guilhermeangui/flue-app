"use client";

import { usePathname } from "next/navigation";
import { TabBar } from "@/components/layout/tab-bar";

const TAB_BAR_ROUTES = ["/chats", "/progress", "/profile"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showTabBar = TAB_BAR_ROUTES.includes(pathname);

  if (!showTabBar) {
    return (
      <div className="mx-auto flex h-dvh w-full max-w-3xl flex-col">
        {children}
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-dvh w-full max-w-3xl flex-col">
      <main className="flex flex-1 flex-col overflow-y-auto">{children}</main>
      <TabBar />
    </div>
  );
}
