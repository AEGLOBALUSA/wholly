-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- WHOLLY — Web Push Subscription Storage
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth_key TEXT NOT NULL,
  platform TEXT DEFAULT 'web',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(profile_id, endpoint)
);

-- Index for looking up subscriptions by profile
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_profile
  ON push_subscriptions(profile_id);

-- RLS: users can only manage their own subscriptions
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own push subscriptions"
  ON push_subscriptions FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert their own push subscriptions"
  ON push_subscriptions FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can delete their own push subscriptions"
  ON push_subscriptions FOR DELETE
  USING (auth.uid() = profile_id);

-- Service role can read all subscriptions (for sending notifications)
CREATE POLICY "Service role can read all push subscriptions"
  ON push_subscriptions FOR SELECT
  USING (auth.role() = 'service_role');
