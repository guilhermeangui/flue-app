"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { TabBar } from "@/components/layout/tab-bar";
import { useMockAuth } from "@/hooks/use-mock-auth";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useMockAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="mx-auto flex min-h-dvh max-w-[402px] flex-col bg-white">
      <div className="flex-1 overflow-y-auto">{children}</div>
      <TabBar />
    </div>
  );
}
