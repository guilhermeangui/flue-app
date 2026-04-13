"use client";

import { usePathname } from "next/navigation";
import { TabBar } from "@/components/layout/tab-bar";
import { useAuth } from "@/hooks/use-auth";

const TAB_BAR_ROUTES = ["/chats", "/progress", "/profile"];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();

  if (isLoading) return null;
  if (!isAuthenticated) return null;

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
