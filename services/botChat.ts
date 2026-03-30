/**
 * WHOLLY — AI Bot Chat Service
 *
 * Handles triggering AI-powered responses from demo profiles during beta testing.
 * When a user sends a message to a demo profile, this service detects it and
 * calls the ai-bot-reply edge function to generate an in-character response.
 *
 * The bot replies appear via Supabase real-time subscriptions, so they show up
 * naturally in the chat UI with no special rendering needed.
 */

import { supabase } from '../lib/supabase';
import { DEMO_PROFILES } from '../data/demoProfiles';
import { DemoProfile } from '../types';
import { Message } from '../types/database';

// ─── Personality Traits for Demo Profiles ───────────────────────────
// Maps profile IDs to personality descriptions that enrich AI responses

const BOT_PERSONALITIES: Record<string, string> = {
  profile1: 'Creative, warm, fashion-forward. Uses style metaphors. Loves worship nights and always brings friends to church events. Expressive and encouraging.',
  profile2: 'Enthusiastic leader type. Big-picture thinker who gets excited about kingdom projects. Coffee snob who rates every cafe. Warm but sometimes talks a lot.',
  profile3: 'Gentle, contemplative, deeply prayerful. Nurse who cares deeply about people. Quiet strength. Prefers deep conversation over small talk. Dry humor.',
  profile4: 'Young, energetic, passionate about youth ministry. Musician who quotes worship lyrics naturally. Adventurous but sometimes idealistic. Very encouraging.',
  profile5: 'Artsy, social, mission-minded. Designs graphics for church. Instagram-savvy but genuine. Loves iced coffee and group hangs. Asks lots of questions.',
  profile6: 'Steady, reliable teacher type. Thoughtful and measured in responses. Loves hiking and nature analogies. Patient and wise beyond his years.',
  profile7: 'Passionate worshipper with healthcare compassion. Values vulnerability deeply. Will ask hard questions lovingly. Morning person who journals.',
  profile8: 'Analytical but warm. Loves theology discussions but keeps them accessible. Outdoorsy — references camping and nature. Quietly funny.',
  profile9: 'Bubbly, social butterfly. Event planner energy. Always organizing something at church. Loves food and suggests restaurant meetups. Very affirming.',
  profile10: 'Thoughtful introvert who opens up gradually. Loves books and always has a recommendation. Deep thinker who processes before responding. Gentle humor.',
};

// ─── Bot Detection ──────────────────────────────────────────────────

/**
 * Check if a profile ID belongs to a demo bot profile
 */
export function isDemoProfile(profileId: string): boolean {
  return DEMO_PROFILES.some((p) => p.id === profileId);
}

/**
 * Get the demo profile data for a given profile ID
 */
export function getDemoProfile(profileId: string): DemoProfile | undefined {
  return DEMO_PROFILES.find((p) => p.id === profileId);
}

// ─── Message History ────────────────────────────────────────────────

/**
 * Fetch recent messages for a conversation and format them for the AI
 */
async function getRecentMessageHistory(
  conversationId: string,
  botProfileId: string,
  limit = 20,
): Promise<{ role: 'user' | 'bot'; content: string }[]> {
  const { data: messages, error } = await supabase
    .from('messages')
    .select('sender_id, content')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error || !messages) return [];

  return messages.map((msg) => ({
    role: msg.sender_id === botProfileId ? ('bot' as const) : ('user' as const),
    content: msg.content,
  }));
}

// ─── Bot Reply Trigger ──────────────────────────────────────────────

/**
 * Trigger an AI bot reply for a demo profile conversation.
 * Call this after a user sends a message to a demo profile.
 *
 * The response is inserted server-side by the edge function and appears
 * via the real-time subscription automatically.
 *
 * @param conversationId - The conversation to reply in
 * @param botProfileId - The demo profile that should reply
 * @returns true if reply was triggered successfully
 */
export async function triggerBotReply(
  conversationId: string,
  botProfileId: string,
): Promise<boolean> {
  const profile = getDemoProfile(botProfileId);
  if (!profile) {
    console.warn('triggerBotReply: profile not found:', botProfileId);
    return false;
  }

  // Get conversation history for context
  const recentMessages = await getRecentMessageHistory(conversationId, botProfileId);
  if (recentMessages.length === 0) return false;

  // Don't reply if the last message was from the bot (avoid double replies)
  const lastMessage = recentMessages[recentMessages.length - 1];
  if (lastMessage.role === 'bot') return false;

  try {
    const { data, error } = await supabase.functions.invoke('ai-bot-reply', {
      body: {
        conversation_id: conversationId,
        bot_profile_id: botProfileId,
        bot_name: profile.name,
        bot_bio: profile.bio,
        bot_age: profile.age,
        bot_city: profile.city,
        bot_denomination: profile.denomination,
        bot_gender: profile.gender,
        bot_personality: BOT_PERSONALITIES[botProfileId] || '',
        recent_messages: recentMessages,
      },
    });

    if (error) {
      console.error('Bot reply edge function error:', error);
      return false;
    }

    return data?.success === true;
  } catch (err) {
    console.error('Failed to trigger bot reply:', err);
    return false;
  }
}

/**
 * Trigger a bot reply with a natural typing delay.
 * Adds a random delay (1-4 seconds) to simulate the bot "typing" before responding.
 *
 * @param conversationId - The conversation to reply in
 * @param botProfileId - The demo profile that should reply
 */
export function triggerBotReplyWithDelay(
  conversationId: string,
  botProfileId: string,
): void {
  // Random delay between 1.5-4 seconds to feel natural
  const delay = 1500 + Math.random() * 2500;

  setTimeout(() => {
    triggerBotReply(conversationId, botProfileId);
  }, delay);
}
