-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- WHOLLY — Row Level Security Policies
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Run AFTER 001_initial_schema.sql
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE compatibility_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE churches ENABLE ROW LEVEL SECURITY;

-- ─── CHURCHES (public read) ─────────────────────────────────────────
CREATE POLICY "Churches are publicly readable"
  ON churches FOR SELECT
  USING (true);

-- ─── PROFILES ───────────────────────────────────────────────────────
-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = auth_id);

-- Users can read demo profiles (for matching display)
CREATE POLICY "Anyone can read demo profiles"
  ON profiles FOR SELECT
  USING (is_demo = true);

-- Users can read profiles they have compatibility scores with
CREATE POLICY "Users can read matched profiles"
  ON profiles FOR SELECT
  USING (
    id IN (
      SELECT match_id FROM compatibility_scores
      WHERE user_id = (SELECT id FROM profiles WHERE auth_id = auth.uid() LIMIT 1)
    )
  );

-- Users can insert their own profile
CREATE POLICY "Users can create own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = auth_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = auth_id);

-- ─── ONBOARDING ANSWERS ─────────────────────────────────────────────
-- Users can only access their own answers
CREATE POLICY "Users can read own answers"
  ON onboarding_answers FOR SELECT
  USING (
    profile_id = (SELECT id FROM profiles WHERE auth_id = auth.uid() LIMIT 1)
  );

CREATE POLICY "Users can insert own answers"
  ON onboarding_answers FOR INSERT
  WITH CHECK (
    profile_id = (SELECT id FROM profiles WHERE auth_id = auth.uid() LIMIT 1)
  );

CREATE POLICY "Users can update own answers"
  ON onboarding_answers FOR UPDATE
  USING (
    profile_id = (SELECT id FROM profiles WHERE auth_id = auth.uid() LIMIT 1)
  );

-- ─── COMPATIBILITY SCORES ───────────────────────────────────────────
-- Users can read scores where they are the user
CREATE POLICY "Users can read own compatibility scores"
  ON compatibility_scores FOR SELECT
  USING (
    user_id = (SELECT id FROM profiles WHERE auth_id = auth.uid() LIMIT 1)
  );

-- ─── MATCHES ────────────────────────────────────────────────────────
CREATE POLICY "Users can read own matches"
  ON matches FOR SELECT
  USING (
    user_a = (SELECT id FROM profiles WHERE auth_id = auth.uid() LIMIT 1)
    OR user_b = (SELECT id FROM profiles WHERE auth_id = auth.uid() LIMIT 1)
  );

CREATE POLICY "Users can update own match interest"
  ON matches FOR UPDATE
  USING (
    user_a = (SELECT id FROM profiles WHERE auth_id = auth.uid() LIMIT 1)
    OR user_b = (SELECT id FROM profiles WHERE auth_id = auth.uid() LIMIT 1)
  );

-- ─── CONVERSATIONS ──────────────────────────────────────────────────
CREATE POLICY "Users can read own conversations"
  ON conversations FOR SELECT
  USING (
    match_id IN (
      SELECT id FROM matches
      WHERE user_a = (SELECT id FROM profiles WHERE auth_id = auth.uid() LIMIT 1)
         OR user_b = (SELECT id FROM profiles WHERE auth_id = auth.uid() LIMIT 1)
    )
  );

-- ─── MESSAGES ───────────────────────────────────────────────────────
CREATE POLICY "Users can read messages in their conversations"
  ON messages FOR SELECT
  USING (
    conversation_id IN (
      SELECT c.id FROM conversations c
      JOIN matches m ON m.id = c.match_id
      WHERE m.user_a = (SELECT id FROM profiles WHERE auth_id = auth.uid() LIMIT 1)
         OR m.user_b = (SELECT id FROM profiles WHERE auth_id = auth.uid() LIMIT 1)
    )
  );

CREATE POLICY "Users can send messages in their conversations"
  ON messages FOR INSERT
  WITH CHECK (
    sender_id = (SELECT id FROM profiles WHERE auth_id = auth.uid() LIMIT 1)
    AND conversation_id IN (
      SELECT c.id FROM conversations c
      JOIN matches m ON m.id = c.match_id
      WHERE m.user_a = (SELECT id FROM profiles WHERE auth_id = auth.uid() LIMIT 1)
         OR m.user_b = (SELECT id FROM profiles WHERE auth_id = auth.uid() LIMIT 1)
    )
  );

-- ─── REALTIME ───────────────────────────────────────────────────────
-- Enable realtime for messages table (for live chat)
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE matches;
