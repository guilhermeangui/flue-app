-- ============================================================
-- Migration 004: Storage policies for voice-messages bucket
-- ============================================================
-- NOTE: The bucket must be created manually in Supabase Dashboard first.
-- This migration adds RLS policies so authenticated users can upload/read.

-- Allow authenticated users to upload voice messages to their own folder
CREATE POLICY "Users can upload own voice messages"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'voice-messages'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow anyone to read voice messages (public bucket)
CREATE POLICY "Public read access for voice messages"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'voice-messages');

-- Allow users to delete their own voice messages
CREATE POLICY "Users can delete own voice messages"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'voice-messages'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
