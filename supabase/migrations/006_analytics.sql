-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- WHOLLY — Analytics Table
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- ─── ANALYTICS EVENTS ────────────────────────────────────────────────
CREATE TABLE analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name TEXT NOT NULL,
  properties JSONB DEFAULT '{}',
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_id TEXT,
  platform TEXT DEFAULT 'web',
  screen_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── INDEXES ────────────────────────────────────────────────────────
-- Fast lookups by event name
CREATE INDEX idx_analytics_event_name ON analytics_events(event_name);

-- Fast time-range queries
CREATE INDEX idx_analytics_created ON analytics_events(created_at DESC);

-- User-based queries
CREATE INDEX idx_analytics_user ON analytics_events(user_id);

-- Session-based queries
CREATE INDEX idx_analytics_session ON analytics_events(session_id);

-- Combined indexes for common queries
CREATE INDEX idx_analytics_user_event ON analytics_events(user_id, event_name);
CREATE INDEX idx_analytics_event_created ON analytics_events(event_name, created_at DESC);

-- ─── ROW LEVEL SECURITY ─────────────────────────────────────────────
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert analytics events (no auth needed for tracking)
CREATE POLICY "Anyone can insert analytics events"
  ON analytics_events
  FOR INSERT
  WITH CHECK (true);

-- Allow users to read their own analytics events
CREATE POLICY "Users can read own events"
  ON analytics_events
  FOR SELECT
  USING (user_id = auth.uid() OR user_id IS NULL);

-- Allow service role to read all events (for admin dashboards)
CREATE POLICY "Service role can read all events"
  ON analytics_events
  FOR SELECT
  USING (auth.role() = 'service_role');

-- ─── COMMENTS ────────────────────────────────────────────────────────
COMMENT ON TABLE analytics_events IS 'Tracks user events and interactions across the WHOLLY app';
COMMENT ON COLUMN analytics_events.event_name IS 'Name of the event (page_view, onboarding_complete, etc.)';
COMMENT ON COLUMN analytics_events.properties IS 'Event properties as JSON (flexible schema)';
COMMENT ON COLUMN analytics_events.user_id IS 'User ID if authenticated, NULL for anonymous';
COMMENT ON COLUMN analytics_events.session_id IS 'Session identifier for grouping events';
COMMENT ON COLUMN analytics_events.platform IS 'Platform OS (web, android, ios)';
COMMENT ON COLUMN analytics_events.screen_name IS 'Current screen/page name';
COMMENT ON COLUMN analytics_events.created_at IS 'Event timestamp (server time)';
