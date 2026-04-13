-- ============================================================
-- Migration 003: Drop BYOK infrastructure, add tier & usage tracking
-- ============================================================

-- 1. Drop BYOK table
DROP TABLE IF EXISTS public.user_api_keys;

-- 2. Add tier and usage fields to profiles
ALTER TABLE public.profiles
  ADD COLUMN tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro')),
  ADD COLUMN daily_messages_used INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN daily_messages_reset_at DATE NOT NULL DEFAULT CURRENT_DATE;

-- 3. Usage logs for analytics and cost tracking
CREATE TABLE public.usage_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  chat_id         UUID REFERENCES public.chats(id) ON DELETE SET NULL,
  model           TEXT NOT NULL,
  input_tokens    INTEGER NOT NULL DEFAULT 0,
  output_tokens   INTEGER NOT NULL DEFAULT 0,
  cached_tokens   INTEGER NOT NULL DEFAULT 0,
  cost_cents      NUMERIC(10,4) NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX usage_logs_user_date_idx ON public.usage_logs(user_id, created_at DESC);

-- RLS
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own usage logs"
  ON public.usage_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Only server (service role) inserts usage logs — no user INSERT policy needed
