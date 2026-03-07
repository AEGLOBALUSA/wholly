-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- WHOLLY — Initial Database Schema
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── CHURCHES ───────────────────────────────────────────────────────
CREATE TABLE churches (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  city        TEXT NOT NULL,
  state       TEXT NOT NULL DEFAULT '',
  country     TEXT NOT NULL DEFAULT 'Australia',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO churches (name, slug, city, state, country) VALUES
  ('Futures Church', 'futures-church', 'Adelaide', 'SA', 'Australia'),
  ('Planetshakers', 'planetshakers', 'Melbourne', 'VIC', 'Australia');

-- ─── PROFILES ───────────────────────────────────────────────────────
CREATE TABLE profiles (
  id                          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id                     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email                       TEXT NOT NULL,
  first_name                  TEXT NOT NULL,
  age                         INTEGER NOT NULL CHECK (age >= 18 AND age <= 100),
  city                        TEXT NOT NULL,
  denomination                TEXT NOT NULL,
  gender                      TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  bio                         TEXT,
  photo_url                   TEXT,
  community_familiarity_score INTEGER DEFAULT 0 CHECK (community_familiarity_score >= 0 AND community_familiarity_score <= 100),
  is_demo                     BOOLEAN DEFAULT FALSE,
  onboarding_complete         BOOLEAN DEFAULT FALSE,
  created_at                  TIMESTAMPTZ DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_auth_id ON profiles(auth_id);
CREATE INDEX idx_profiles_gender ON profiles(gender);
CREATE INDEX idx_profiles_denomination ON profiles(denomination);
CREATE INDEX idx_profiles_is_demo ON profiles(is_demo);

-- ─── ONBOARDING ANSWERS ─────────────────────────────────────────────
-- Stores each section of the onboarding as a JSONB blob
CREATE TABLE onboarding_answers (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  section     TEXT NOT NULL,
  answers     JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, section)
);

CREATE INDEX idx_onboarding_profile ON onboarding_answers(profile_id);

-- ─── COMPATIBILITY SCORES ───────────────────────────────────────────
-- Pre-calculated scores between user pairs
CREATE TABLE compatibility_scores (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  match_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  spiritual     INTEGER NOT NULL CHECK (spiritual >= 0 AND spiritual <= 100),
  emotional     INTEGER NOT NULL CHECK (emotional >= 0 AND emotional <= 100),
  intellectual  INTEGER NOT NULL CHECK (intellectual >= 0 AND intellectual <= 100),
  life_vision   INTEGER NOT NULL CHECK (life_vision >= 0 AND life_vision <= 100),
  overall       INTEGER NOT NULL CHECK (overall >= 0 AND overall <= 100),
  tier          TEXT NOT NULL CHECK (tier IN ('exceptional', 'strong', 'compatible', 'below')),
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, match_id)
);

CREATE INDEX idx_compat_user ON compatibility_scores(user_id);
CREATE INDEX idx_compat_match ON compatibility_scores(match_id);
CREATE INDEX idx_compat_tier ON compatibility_scores(tier);
CREATE INDEX idx_compat_overall ON compatibility_scores(overall DESC);

-- ─── MATCHES ────────────────────────────────────────────────────────
-- Mutual interest tracking
CREATE TABLE matches (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_a            UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_b            UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_a_interested BOOLEAN,
  user_b_interested BOOLEAN,
  status            TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'mutual', 'declined')),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_a, user_b)
);

CREATE INDEX idx_matches_user_a ON matches(user_a);
CREATE INDEX idx_matches_user_b ON matches(user_b);
CREATE INDEX idx_matches_status ON matches(status);

-- ─── CONVERSATIONS ──────────────────────────────────────────────────
CREATE TABLE conversations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id        UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE UNIQUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ
);

-- ─── MESSAGES ───────────────────────────────────────────────────────
CREATE TABLE messages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content         TEXT NOT NULL,
  read_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at);
CREATE INDEX idx_messages_sender ON messages(sender_id);

-- ─── UPDATED_AT TRIGGER ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_onboarding_updated_at
  BEFORE UPDATE ON onboarding_answers FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_matches_updated_at
  BEFORE UPDATE ON matches FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── AUTO-CREATE CONVERSATION ON MUTUAL MATCH ───────────────────────
CREATE OR REPLACE FUNCTION auto_create_conversation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'mutual' AND OLD.status != 'mutual' THEN
    INSERT INTO conversations (match_id)
    VALUES (NEW.id)
    ON CONFLICT (match_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_mutual_match
  AFTER UPDATE ON matches FOR EACH ROW EXECUTE FUNCTION auto_create_conversation();

-- ─── HELPER: GET MATCHES FOR A USER ─────────────────────────────────
CREATE OR REPLACE FUNCTION get_user_matches(p_user_id UUID, p_gender_filter TEXT DEFAULT NULL)
RETURNS TABLE (
  profile_id UUID,
  first_name TEXT,
  age INTEGER,
  city TEXT,
  denomination TEXT,
  gender TEXT,
  bio TEXT,
  photo_url TEXT,
  community_familiarity_score INTEGER,
  spiritual INTEGER,
  emotional INTEGER,
  intellectual INTEGER,
  life_vision INTEGER,
  overall INTEGER,
  tier TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id AS profile_id,
    p.first_name,
    p.age,
    p.city,
    p.denomination,
    p.gender,
    p.bio,
    p.photo_url,
    p.community_familiarity_score,
    cs.spiritual,
    cs.emotional,
    cs.intellectual,
    cs.life_vision,
    cs.overall,
    cs.tier
  FROM compatibility_scores cs
  JOIN profiles p ON p.id = cs.match_id
  WHERE cs.user_id = p_user_id
    AND (p_gender_filter IS NULL OR p.gender = p_gender_filter)
    AND cs.tier != 'below'
  ORDER BY cs.overall DESC;
END;
$$ LANGUAGE plpgsql;
