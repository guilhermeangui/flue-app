"use client";

import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  user: User | null;
  isLoading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    userId: null,
    user: null,
    isLoading: true,
  });
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setState({
        isAuthenticated: !!user,
        userId: user?.id ?? null,
        user,
        isLoading: false,
      });
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      setState({
        isAuthenticated: !!user,
        userId: user?.id ?? null,
        user,
        isLoading: false,
      });
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return false;
      router.push("/chats");
      router.refresh();
      return true;
    },
    [supabase.auth, router],
  );

  const signup = useCallback(
    async (name: string, email: string, password: string): Promise<boolean> => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) return false;
      router.push("/chats");
      router.refresh();
      return true;
    },
    [supabase.auth, router],
  );

  const loginWithGoogle = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/chats` },
    });
  }, [supabase.auth]);

  const loginWithApple = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: { redirectTo: `${window.location.origin}/chats` },
    });
  }, [supabase.auth]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }, [supabase.auth, router]);

  return {
    ...state,
    login,
    signup,
    loginWithGoogle,
    loginWithApple,
    logout,
  };
}
