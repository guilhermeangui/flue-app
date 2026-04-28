-- ============================================================
-- Migration 005: Voice messages moved to device-local storage
-- ============================================================
-- Áudios agora são guardados no IndexedDB do dispositivo que gravou.
-- O banco guarda apenas uma referência (voice_local_id) para o blob local.
-- O bucket "voice-messages" do Storage fica obsoleto e pode ser removido
-- manualmente no Supabase Dashboard.

alter table public.messages
  drop column if exists voice_url;

alter table public.messages
  add column voice_local_id text;

-- Policies do bucket voice-messages ficam obsoletas. Remover.
drop policy if exists "Users can upload own voice messages" on storage.objects;
drop policy if exists "Public read access for voice messages" on storage.objects;
drop policy if exists "Users can delete own voice messages" on storage.objects;
