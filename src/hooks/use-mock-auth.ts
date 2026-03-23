"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;
}

export const useMockAuth = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      userId: null,
      login: (_email: string, _password: string) => {
        set({ isAuthenticated: true, userId: "user-1" });
        return true;
      },
      signup: (_name: string, _email: string, _password: string) => {
        set({ isAuthenticated: true, userId: "user-1" });
        return true;
      },
      logout: () => {
        set({ isAuthenticated: false, userId: null });
      },
    }),
    { name: "flue-auth" },
  ),
);
