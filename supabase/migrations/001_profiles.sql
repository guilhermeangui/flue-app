-- =============================================
-- PROFILES (extends auth.users)
-- =============================================
create table public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  name            text not null,
  avatar_url      text,
  native_language text not null default 'pt',
  app_language    text not null default 'en',
  notifications_enabled boolean not null default true,
  audio_quality   text not null default 'high',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', 'User'));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
