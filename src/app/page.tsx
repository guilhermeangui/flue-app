"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMockAuth } from "@/hooks/use-mock-auth";

export default function Home() {
  const { isAuthenticated } = useMockAuth();
  const router = useRouter();

  useEffect(() => {
    router.replace(isAuthenticated ? "/chats" : "/login");
  }, [isAuthenticated, router]);

  return null;
}
