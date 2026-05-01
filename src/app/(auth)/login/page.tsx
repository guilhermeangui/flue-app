"use client";

import { Apple, Eye, EyeOff, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/i18n/context";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, loginWithGoogle, loginWithApple } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useI18n();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const success = await login(email, password);
    if (!success) {
      setError(t.invalidCredentials);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="flex flex-1 flex-col gap-[18px] px-6 pb-6 pt-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3.5">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary-light to-primary-dark">
            <span className="font-heading text-3xl font-extrabold text-white">
              F
            </span>
          </div>
          <h1 className="font-heading text-[34px] font-extrabold text-text-primary">
            Flu&ecirc;
          </h1>
          <p className="text-[15px] text-text-secondary">{t.appTagline}</p>
        </div>

        {/* Welcome */}
        <div className="flex flex-col gap-1.5">
          <h2 className="font-heading text-[28px] font-bold text-text-primary">
            {t.welcomeBack}
          </h2>
          <p className="text-[15px] text-text-secondary">{t.signInContinue}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="font-body text-sm font-medium text-text-primary">
              {t.email}
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
              {t.password}
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
              {t.forgotPassword}
            </Link>
          </div>

          {error && <p className="text-center text-sm text-error">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex h-14 items-center justify-center rounded-3xl bg-primary font-body text-base font-semibold text-white shadow-[0_6px_16px_#8B5CF650] disabled:opacity-60"
          >
            {loading ? t.signingIn : t.signIn}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[13px] text-text-muted">{t.or}</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Social buttons */}
        <button
          type="button"
          onClick={loginWithGoogle}
          className="flex h-[52px] items-center justify-center gap-2.5 rounded-3xl bg-surface text-[15px] font-medium text-text-primary"
        >
          <span className="font-heading text-lg font-extrabold text-[#4285F4]">
            G
          </span>
          {t.continueGoogle}
        </button>

        <button
          type="button"
          onClick={loginWithApple}
          className="flex h-[52px] items-center justify-center gap-2.5 rounded-3xl bg-text-primary text-[15px] font-medium text-white"
        >
          <Apple className="h-5 w-5" />
          {t.continueApple}
        </button>

        {/* Sign up link */}
        <div className="flex items-center justify-center gap-1">
          <span className="text-sm text-text-secondary">{t.noAccount}</span>
          <Link href="/signup" className="text-sm font-semibold text-primary">
            {t.signUp}
          </Link>
        </div>
      </div>
    </div>
  );
}
