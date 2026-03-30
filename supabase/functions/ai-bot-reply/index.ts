/**
 * WHOLLY — AI Bot Reply Edge Function
 *
 * Generates in-character responses for demo profiles during beta testing.
 * Uses Anthropic Claude API to create natural, personality-driven replies
 * that match each demo profile's bio, faith background, and personality.
 *
 * Deploy with: supabase functions deploy ai-bot-reply
 *
 * Required secrets:
 *   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') ?? '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

interface BotReplyRequest {
  conversation_id: string;
  bot_profile_id: string;
  bot_name: string;
  bot_bio: string;
  bot_age: number;
  bot_city: string;
  bot_denomination: string;
  bot_gender: string;
  bot_personality?: string;
  recent_messages: { role: 'user' | 'bot'; content: string }[];
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (!ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }),
        { status: 500, headers: corsHeaders }
      );
    }

    const payload: BotReplyRequest = await req.json();

    const {
      conversation_id,
      bot_profile_id,
      bot_name,
      bot_bio,
      bot_age,
      bot_city,
      bot_denomination,
      bot_gender,
      bot_personality,
      recent_messages,
    } = payload;

    if (!conversation_id || !bot_profile_id || !recent_messages?.length) {
      return new Response(
        JSON.stringify({ error: 'conversation_id, bot_profile_id, and recent_messages are required' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Build the system prompt to create an in-character persona
    const churchName = bot_denomination === 'futures-church' ? 'Futures Church' : 'Planetshakers';
    const pronouns = bot_gender === 'female' ? 'she/her' : 'he/him';

    const systemPrompt = `You are ${bot_name}, a ${bot_age}-year-old ${bot_gender === 'female' ? 'woman' : 'man'} from ${bot_city}, Australia. You attend ${churchName} and are a Spirit-filled Christian.

Your bio: "${bot_bio}"

${bot_personality ? `Personality traits: ${bot_personality}` : ''}

You are chatting on WHOLLY, a faith-based dating app for Pentecostal/Charismatic Christians. You matched with this person and you're both getting to know each other.

IMPORTANT RULES:
- Stay fully in character as ${bot_name}. Never break character or mention being an AI.
- Write casually and naturally like a real person texting — use lowercase sometimes, occasional abbreviations, natural pauses.
- Keep replies SHORT (1-3 sentences typically). Real people don't write essays in dating app chats.
- Be warm, genuine, and faith-grounded but not preachy. Reference your faith naturally, not in every message.
- Ask questions back to show interest. Be curious about the other person.
- Show personality! Be playful, witty, or thoughtful based on your character.
- Use emojis sparingly and naturally (1-2 max per message, not every message).
- Sometimes take a beat before diving deep — small talk is natural.
- Reference things from your bio naturally (your job, hobbies, church involvement).
- Never share phone numbers, social media, or suggest meeting outside the app.
- Never be inappropriate, flirtatious beyond what's appropriate for a Christian dating context, or pressure the other person.
- If someone is rude or inappropriate, respond gracefully but set boundaries.
- Vary your response length. Some messages can be just a few words ("haha that's so good" or "100% agree").`;

    // Convert message history to Claude format
    const messages = recent_messages.map((msg) => ({
      role: msg.role === 'bot' ? 'assistant' as const : 'user' as const,
      content: msg.content,
    }));

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system: systemPrompt,
        messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'AI generation failed', details: errorText }),
        { status: 500, headers: corsHeaders }
      );
    }

    const aiResult = await response.json();
    const botReply = aiResult.content?.[0]?.text?.trim();

    if (!botReply) {
      return new Response(
        JSON.stringify({ error: 'Empty AI response' }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Insert the bot's reply into the messages table using service role
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const { data: message, error: insertError } = await supabase
      .from('messages')
      .insert({
        conversation_id,
        sender_id: bot_profile_id,
        content: botReply,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Message insert error:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to insert bot reply', details: insertError }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Update conversation timestamp
    await supabase
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', conversation_id);

    return new Response(
      JSON.stringify({ success: true, message: botReply, message_id: message.id }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Bot reply error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
