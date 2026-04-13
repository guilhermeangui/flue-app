-- =============================================
-- USER_LANGUAGES
-- =============================================
create table public.user_languages (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  language        text not null,
  is_active       boolean not null default true,
  sessions_count  integer not null default 0,
  created_at      timestamptz not null default now()
);

alter table public.user_languages
  add constraint user_languages_user_language_unique unique (user_id, language);

alter table public.user_languages enable row level security;

create policy "Users can view own languages"
  on public.user_languages for select using (auth.uid() = user_id);
create policy "Users can insert own languages"
  on public.user_languages for insert with check (auth.uid() = user_id);
create policy "Users can update own languages"
  on public.user_languages for update using (auth.uid() = user_id);
create policy "Users can delete own languages"
  on public.user_languages for delete using (auth.uid() = user_id);

-- =============================================
-- CHATS
-- =============================================
create table public.chats (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  language        text not null,
  title           text not null,
  last_message    text,
  score           integer,
  duration_seconds integer not null default 0,
  messages_count  integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index chats_user_updated_idx on public.chats (user_id, updated_at desc);

alter table public.chats enable row level security;

create policy "Users can view own chats"
  on public.chats for select using (auth.uid() = user_id);
create policy "Users can insert own chats"
  on public.chats for insert with check (auth.uid() = user_id);
create policy "Users can update own chats"
  on public.chats for update using (auth.uid() = user_id);
create policy "Users can delete own chats"
  on public.chats for delete using (auth.uid() = user_id);

-- =============================================
-- MESSAGES
-- =============================================
create table public.messages (
  id                    uuid primary key default gen_random_uuid(),
  chat_id               uuid not null references public.chats(id) on delete cascade,
  user_id               uuid not null references public.profiles(id) on delete cascade,
  sender                text not null check (sender in ('user', 'ai')),
  type                  text not null check (type in ('text', 'voice', 'analysis')),
  content               text,
  voice_url             text,
  voice_duration_seconds integer,
  analysis              jsonb,
  created_at            timestamptz not null default now()
);

create index messages_chat_created_idx on public.messages (chat_id, created_at);

alter table public.messages enable row level security;

create policy "Users can view own messages"
  on public.messages for select using (auth.uid() = user_id);
create policy "Users can insert own messages"
  on public.messages for insert with check (auth.uid() = user_id);
create policy "Users can update own messages"
  on public.messages for update using (auth.uid() = user_id);
create policy "Users can delete own messages"
  on public.messages for delete using (auth.uid() = user_id);

-- =============================================
-- DAILY_ACTIVITY
-- =============================================
create table public.daily_activity (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  date            date not null default current_date,
  sessions_count  integer not null default 0,
  avg_score       integer,
  total_issues    jsonb default '{"pronunciation": 0, "grammar": 0, "spelling": 0}'::jsonb
);

alter table public.daily_activity
  add constraint daily_activity_user_date_unique unique (user_id, date);

create index daily_activity_user_date_idx on public.daily_activity (user_id, date desc);

alter table public.daily_activity enable row level security;

create policy "Users can view own activity"
  on public.daily_activity for select using (auth.uid() = user_id);
create policy "Users can insert own activity"
  on public.daily_activity for insert with check (auth.uid() = user_id);
create policy "Users can update own activity"
  on public.daily_activity for update using (auth.uid() = user_id);

-- =============================================
-- USER_API_KEYS
-- =============================================
create table public.user_api_keys (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  provider        text not null,
  encrypted_key   text not null,
  key_hint        text,
  is_valid        boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.user_api_keys
  add constraint user_api_keys_user_provider_unique unique (user_id, provider);

alter table public.user_api_keys enable row level security;

create policy "Users can view own api keys"
  on public.user_api_keys for select using (auth.uid() = user_id);
create policy "Users can insert own api keys"
  on public.user_api_keys for insert with check (auth.uid() = user_id);
create policy "Users can update own api keys"
  on public.user_api_keys for update using (auth.uid() = user_id);
create policy "Users can delete own api keys"
  on public.user_api_keys for delete using (auth.uid() = user_id);
