"use client";

import { Apple, Eye, EyeOff, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMockAuth } from "@/hooks/use-mock-auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useMockAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      router.push("/chats");
    }
  };

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Status bar spacer */}
      <div className="h-[62px]" />

      <div className="flex flex-1 flex-col gap-[18px] px-6 pb-6 pt-5">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3.5">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary-light to-primary-dark">
            <span className="font-heading text-3xl font-extrabold text-white">
              F
            </span>
          </div>
          <h1 className="font-heading text-[34px] font-extrabold text-text-primary">
            Fluê
          </h1>
          <p className="text-[15px] text-text-secondary">
            Your AI Language Coach
          </p>
        </div>

        {/* Welcome */}
        <div className="flex flex-col gap-1.5">
          <h2 className="font-heading text-[28px] font-bold text-text-primary">
            Welcome back
          </h2>
          <p className="text-[15px] text-text-secondary">
            Sign in to continue your journey
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="font-body text-sm font-medium text-text-primary">
              Email
            </span>
            <div className="flex h-11 items-center gap-2 rounded-[22px] bg-surface px-4">
              <Mail className="h-[18px] w-[18px] text-text-muted" />
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
              />
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="font-body text-sm font-medium text-text-primary">
              Password
            </span>
            <div className="flex h-11 items-center gap-2 rounded-[22px] bg-surface px-4">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-[18px] w-[18px] text-text-muted" />
                ) : (
                  <Eye className="h-[18px] w-[18px] text-text-muted" />
                )}
              </button>
            </div>
          </label>

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-primary"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="flex h-14 items-center justify-center rounded-3xl bg-primary font-body text-base font-semibold text-white shadow-[0_6px_16px_#8B5CF650]"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[13px] text-text-muted">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Social buttons */}
        <button
          type="button"
          className="flex h-[52px] items-center justify-center gap-2.5 rounded-3xl bg-surface text-[15px] font-medium text-text-primary"
        >
          <span className="font-heading text-lg font-extrabold text-[#4285F4]">
            G
          </span>
          Continue with Google
        </button>

        <button
          type="button"
          className="flex h-[52px] items-center justify-center gap-2.5 rounded-3xl bg-text-primary text-[15px] font-medium text-white"
        >
          <Apple className="h-5 w-5" />
          Continue with Apple
        </button>

        {/* Sign up link */}
        <div className="flex items-center justify-center gap-1">
          <span className="text-sm text-text-secondary">
            Don&apos;t have an account?
          </span>
          <Link href="/signup" className="text-sm font-semibold text-primary">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
