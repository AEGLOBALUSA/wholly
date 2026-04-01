-- WHOLLY — Migration 008: Notifications, Email Log, Contact Messages, Email Preferences
--
-- Creates the infrastructure for in-app notifications, email delivery tracking,
-- contact form storage, and user email preference management.

-- ═══════════════════════════════════════════════════════════════
-- 1. In-App Notifications Table
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'mutual_match',
    'new_message',
    'high_compatibility',
    'profile_view',
    'covenant_reminder',
    'system',
    'welcome'
  )),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id) WHERE read = FALSE;
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can mark their own notifications as read"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (TRUE);

-- Enable Realtime for live notification delivery
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- ═══════════════════════════════════════════════════════════════
-- 2. Email Log Table (service-role only)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE public.email_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email_type TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'bounced')),
  provider_response JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_email_log_user_id ON public.email_log(user_id);
CREATE INDEX idx_email_log_status ON public.email_log(status);
CREATE INDEX idx_email_log_created_at ON public.email_log(created_at DESC);

ALTER TABLE public.email_log ENABLE ROW LEVEL SECURITY;
-- No user-facing policies — only service role can read/write email_log

-- ═══════════════════════════════════════════════════════════════
-- 3. Contact Messages Table
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_contact_messages_status ON public.contact_messages(status);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a contact message (no auth required)
CREATE POLICY "Anyone can submit a contact message"
  ON public.contact_messages FOR INSERT
  WITH CHECK (TRUE);

-- ═══════════════════════════════════════════════════════════════
-- 4. Email Preferences on Profiles
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email_preferences JSONB DEFAULT '{
  "match_notifications": true,
  "message_alerts": true,
  "high_compatibility": true,
  "weekly_digest": true,
  "system_updates": true
}'::jsonb;

-- ═══════════════════════════════════════════════════════════════
-- 5. Database Functions for Notification Dispatch
-- ═══════════════════════════════════════════════════════════════

-- Function: Create in-app notification on mutual match
CREATE OR REPLACE FUNCTION notify_mutual_match()
RETURNS TRIGGER AS $$
DECLARE
  user_a_profile RECORD;
  user_b_profile RECORD;
BEGIN
  -- Only fire when status changes to 'mutual'
  IF NEW.status = 'mutual' AND (OLD IS NULL OR OLD.status != 'mutual') THEN
    -- Look up both profiles
    SELECT first_name, email INTO user_a_profile
      FROM public.profiles WHERE auth_id = NEW.user_a;
    SELECT first_name, email INTO user_b_profile
      FROM public.profiles WHERE auth_id = NEW.user_b;

    -- Notify user A
    INSERT INTO public.notifications (user_id, type, title, body, metadata)
    VALUES (
      NEW.user_a,
      'mutual_match',
      'New Mutual Match!',
      'You and ' || COALESCE(user_b_profile.first_name, 'someone') || ' are both interested. Start chatting!',
      jsonb_build_object('match_id', NEW.id, 'match_name', user_b_profile.first_name)
    );

    -- Notify user B
    INSERT INTO public.notifications (user_id, type, title, body, metadata)
    VALUES (
      NEW.user_b,
      'mutual_match',
      'New Mutual Match!',
      'You and ' || COALESCE(user_a_profile.first_name, 'someone') || ' are both interested. Start chatting!',
      jsonb_build_object('match_id', NEW.id, 'match_name', user_a_profile.first_name)
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_notify_mutual_match
  AFTER UPDATE ON public.matches
  FOR EACH ROW
  EXECUTE FUNCTION notify_mutual_match();

-- Function: Create in-app notification on new message
CREATE OR REPLACE FUNCTION notify_new_message()
RETURNS TRIGGER AS $$
DECLARE
  sender_name TEXT;
  recipient_id UUID;
  conv_match RECORD;
BEGIN
  -- Get sender name
  SELECT first_name INTO sender_name
    FROM public.profiles WHERE auth_id = NEW.sender_id;

  -- Get match to find recipient
  SELECT m.user_a, m.user_b INTO conv_match
    FROM public.conversations c
    JOIN public.matches m ON m.id = c.match_id
    WHERE c.id = NEW.conversation_id;

  -- Recipient is the other user in the match
  IF conv_match.user_a = NEW.sender_id THEN
    recipient_id := conv_match.user_b;
  ELSE
    recipient_id := conv_match.user_a;
  END IF;

  -- Create notification for recipient
  INSERT INTO public.notifications (user_id, type, title, body, metadata)
  VALUES (
    recipient_id,
    'new_message',
    'Message from ' || COALESCE(sender_name, 'someone'),
    LEFT(NEW.content, 100),
    jsonb_build_object('conversation_id', NEW.conversation_id, 'sender_name', sender_name)
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_notify_new_message
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_message();

-- Function: Create in-app notification on high compatibility score
CREATE OR REPLACE FUNCTION notify_high_compatibility()
RETURNS TRIGGER AS $$
DECLARE
  match_name TEXT;
BEGIN
  -- Only notify for exceptional or strong matches
  IF NEW.tier IN ('exceptional', 'strong') THEN
    SELECT first_name INTO match_name
      FROM public.profiles WHERE auth_id = NEW.match_id;

    INSERT INTO public.notifications (user_id, type, title, body, metadata)
    VALUES (
      NEW.user_id,
      'high_compatibility',
      CASE WHEN NEW.tier = 'exceptional' THEN 'Exceptional Match Found!' ELSE 'Strong Match Found!' END,
      COALESCE(match_name, 'Someone') || ' has a ' || ROUND(NEW.overall) || '% compatibility score with you.',
      jsonb_build_object('match_id', NEW.match_id, 'match_name', match_name, 'score', NEW.overall, 'tier', NEW.tier)
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_notify_high_compatibility
  AFTER INSERT ON public.compatibility_scores
  FOR EACH ROW
  EXECUTE FUNCTION notify_high_compatibility();
