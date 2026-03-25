-- ═══════════════════════════════════════
-- WHOLLY — Photo Storage & Profile Enhancements
-- Migration 004
-- ═══════════════════════════════════════

-- Add photos array and push subscription to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS photos TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS push_subscription JSONB DEFAULT NULL;

-- Create storage bucket for profile photos (run via Supabase Dashboard or API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('profile-photos', 'profile-photos', true);

-- Storage RLS policies (apply via Supabase Dashboard > Storage > Policies)
-- Policy: Allow authenticated users to upload to their own folder
-- CREATE POLICY "Users can upload own photos"
--   ON storage.objects FOR INSERT
--   TO authenticated
--   WITH CHECK (bucket_id = 'profile-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Policy: Allow users to delete their own photos
-- CREATE POLICY "Users can delete own photos"
--   ON storage.objects FOR DELETE
--   TO authenticated
--   USING (bucket_id = 'profile-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Policy: Public read access for profile photos
-- CREATE POLICY "Public read access for photos"
--   ON storage.objects FOR SELECT
--   TO public
--   USING (bucket_id = 'profile-photos');
