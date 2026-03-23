"use client";

import { ChevronLeft, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Status bar spacer */}
      <div className="h-[62px]" />

      <div className="flex flex-1 flex-col gap-5 px-6 pb-8 pt-4">
        {/* Top row */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-surface"
          >
            <ChevronLeft className="h-5 w-5 text-text-primary" />
          </button>
          <span className="font-heading text-lg font-bold text-primary">
            Fluê
          </span>
          <div className="h-9 w-9" />
        </div>

        {/* Headline */}
        <div className="flex flex-col gap-1.5">
          <h1 className="font-heading text-[26px] font-bold text-text-primary">
            Forgot password?
          </h1>
          <p className="text-[15px] text-text-secondary">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        {sent ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-surface p-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
              <Mail className="h-7 w-7 text-success" />
            </div>
            <h2 className="font-heading text-lg font-bold text-text-primary">
              Email sent!
            </h2>
            <p className="text-sm text-text-secondary">
              Check your inbox for a password reset link.
            </p>
            <Link
              href="/login"
              className="mt-2 text-sm font-semibold text-primary"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
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

            <button
              type="submit"
              className="flex h-14 items-center justify-center rounded-3xl bg-primary font-body text-base font-semibold text-white shadow-[0_6px_16px_#8B5CF650]"
            >
              Send Reset Link
            </button>
          </form>
        )}

        {!sent && (
          <div className="flex items-center justify-center gap-1">
            <span className="text-sm text-text-secondary">
              Remember your password?
            </span>
            <Link href="/login" className="text-sm font-semibold text-primary">
              Sign in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
