-- ═══════════════════════════════════════════════════════════════
-- Migration 005: Subscriptions, Safety (report/block), Account Deletion
-- ═══════════════════════════════════════════════════════════════

-- ─── Subscriptions Table ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'standard', 'premium')),
  period TEXT CHECK (period IN ('monthly', 'annual')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'canceled', 'pending')),
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid()::text = (SELECT auth_id FROM profiles WHERE id = user_id));

CREATE POLICY "Service role can manage subscriptions"
  ON subscriptions FOR ALL
  USING (auth.role() = 'service_role');

-- ─── Reports Table ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  reported_id UUID REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN (
    'inappropriate-content',
    'harassment',
    'fake-profile',
    'spiritual-manipulation',
    'underage',
    'spam',
    'other'
  )),
  details TEXT,                    -- optional free-text explanation
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'actioned', 'dismissed')),
  admin_notes TEXT,                -- internal notes from review
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  CONSTRAINT no_self_report CHECK (reporter_id != reported_id)
);

-- RLS for reports
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create reports"
  ON reports FOR INSERT
  WITH CHECK (auth.uid()::text = (SELECT auth_id FROM profiles WHERE id = reporter_id));

CREATE POLICY "Users can read own reports"
  ON reports FOR SELECT
  USING (auth.uid()::text = (SELECT auth_id FROM profiles WHERE id = reporter_id));

-- ─── Blocks Table ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  blocker_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  blocked_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT no_self_block CHECK (blocker_id != blocked_id),
  UNIQUE(blocker_id, blocked_id)
);

-- RLS for blocks
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own blocks"
  ON blocks FOR ALL
  USING (auth.uid()::text = (SELECT auth_id FROM profiles WHERE id = blocker_id));

-- ─── Account Deletion Requests ───────────────────────────────────
-- Soft delete: mark account for deletion, actually delete after 30 days
-- This gives users a grace period to change their mind
CREATE TABLE IF NOT EXISTS deletion_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  reason TEXT,
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  scheduled_deletion_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  canceled_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'canceled'))
);

ALTER TABLE deletion_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own deletion request"
  ON deletion_requests FOR ALL
  USING (auth.uid()::text = (SELECT auth_id FROM profiles WHERE id = user_id));

-- ─── Add subscription tier to profiles for quick access ──────────
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- ─── Function: Filter blocked users from matches ─────────────────
CREATE OR REPLACE FUNCTION get_visible_matches(requesting_user_id UUID)
RETURNS SETOF compatibility_scores AS $$
BEGIN
  RETURN QUERY
  SELECT cs.*
  FROM compatibility_scores cs
  WHERE cs.user_id = requesting_user_id
    AND cs.match_id NOT IN (
      SELECT blocked_id FROM blocks WHERE blocker_id = requesting_user_id
      UNION
      SELECT blocker_id FROM blocks WHERE blocked_id = requesting_user_id
    )
    AND cs.match_id NOT IN (
      SELECT id FROM profiles WHERE deleted_at IS NOT NULL OR is_blocked = TRUE
    )
  ORDER BY cs.overall DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── Indexes ─────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_reports_reported ON reports(reported_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_blocks_blocker ON blocks(blocker_id);
CREATE INDEX IF NOT EXISTS idx_blocks_blocked ON blocks(blocked_id);
CREATE INDEX IF NOT EXISTS idx_deletion_status ON deletion_requests(status, scheduled_deletion_at);
