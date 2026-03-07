-- Pastoral Verification System
-- Allows church leaders from any department (youth, young adults, kids, worship, etc.)
-- to verify members, giving them a blue tick on their profile.

-- Waitlist table for landing page signups
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on waitlist
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts to waitlist (from landing page)
CREATE POLICY "Anyone can join waitlist"
  ON public.waitlist FOR INSERT
  WITH CHECK (true);

-- Pastoral verification requests
CREATE TABLE IF NOT EXISTS public.pastoral_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'verified', 'declined')),
  department TEXT NOT NULL
    CHECK (department IN (
      'senior-pastor', 'youth', 'young-adults', 'kids',
      'worship', 'connect-groups', 'campus-pastor', 'other'
    )),
  pastor_name TEXT NOT NULL,
  pastor_email TEXT NOT NULL,
  church_name TEXT NOT NULL,
  requested_at TIMESTAMPTZ DEFAULT now(),
  verified_at TIMESTAMPTZ,
  declined_at TIMESTAMPTZ,
  decline_reason TEXT,
  verification_token UUID DEFAULT gen_random_uuid(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.pastoral_verifications ENABLE ROW LEVEL SECURITY;

-- Users can read their own verification status
CREATE POLICY "Users can view own verification"
  ON public.pastoral_verifications FOR SELECT
  USING (auth.uid() = user_id);

-- Users can request verification (insert)
CREATE POLICY "Users can request verification"
  ON public.pastoral_verifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Pastors verify via a token-based link (update via service role or edge function)
-- This would be handled by an edge function that validates the token

-- Index for quick lookups
CREATE INDEX idx_pastoral_user ON public.pastoral_verifications(user_id);
CREATE INDEX idx_pastoral_status ON public.pastoral_verifications(status);
CREATE INDEX idx_pastoral_token ON public.pastoral_verifications(verification_token);

-- View for profiles: adds pastoral_verified flag
CREATE OR REPLACE VIEW public.verified_profiles AS
SELECT
  u.id as user_id,
  pv.status = 'verified' as is_verified,
  pv.department,
  pv.pastor_name,
  pv.church_name,
  pv.verified_at
FROM auth.users u
LEFT JOIN public.pastoral_verifications pv ON pv.user_id = u.id;
