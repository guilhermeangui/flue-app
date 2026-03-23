"use client";

import { Check, ChevronLeft, Eye, EyeOff, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMockAuth } from "@/hooks/use-mock-auth";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const { signup } = useMockAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return;
    if (!agreedTerms) return;
    if (signup(name, email, password)) {
      router.push("/chats");
    }
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
            Create your account
          </h1>
          <p className="text-[15px] text-text-secondary">
            Join Fluê and start practicing today
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <label className="flex flex-col gap-1.5">
            <span className="font-body text-sm font-medium text-text-primary">
              Full Name
            </span>
            <div className="flex h-11 items-center gap-2 rounded-[22px] bg-surface px-4">
              <User className="h-[18px] w-[18px] text-text-muted" />
              <input
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
              />
            </div>
          </label>

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
                placeholder="Create a password"
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

          <label className="flex flex-col gap-1.5">
            <span className="font-body text-sm font-medium text-text-primary">
              Confirm Password
            </span>
            <div className="flex h-11 items-center gap-2 rounded-[22px] bg-surface px-4">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? (
                  <EyeOff className="h-[18px] w-[18px] text-text-muted" />
                ) : (
                  <Eye className="h-[18px] w-[18px] text-text-muted" />
                )}
              </button>
            </div>
          </label>

          {/* Terms checkbox */}
          <div className="flex items-start gap-2.5">
            <button
              type="button"
              onClick={() => setAgreedTerms(!agreedTerms)}
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] ${
                agreedTerms ? "bg-primary" : "border border-border bg-white"
              }`}
            >
              {agreedTerms && <Check className="h-3.5 w-3.5 text-white" />}
            </button>
            <span className="text-[13px] leading-relaxed text-[#52525B]">
              I agree to the Terms of Service and Privacy Policy
            </span>
          </div>

          <button
            type="submit"
            className="flex h-14 items-center justify-center rounded-3xl bg-primary font-body text-base font-semibold text-white shadow-[0_6px_16px_#8B5CF650]"
          >
            Create Account
          </button>
        </form>

        {/* Sign in link */}
        <div className="flex items-center justify-center gap-1">
          <span className="text-sm text-text-secondary">
            Already have an account?
          </span>
          <Link href="/login" className="text-sm font-semibold text-primary">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
