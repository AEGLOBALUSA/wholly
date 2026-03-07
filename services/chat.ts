/**
 * WHOLLY — Real-Time Chat Service
 *
 * Uses Supabase Realtime subscriptions for live messaging.
 * Conversations are automatically created when two users
 * express mutual interest (handled by database trigger).
 */

import { supabase } from '../lib/supabase';
import { Message, Conversation } from '../types/database';
import { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Get all conversations for a user
 */
export async function getConversations(profileId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      id,
      match_id,
      last_message_at,
      created_at,
      matches!inner (
        user_a,
        user_b,
        status
      )
    `)
    .or(
      `matches.user_a.eq.${profileId},matches.user_b.eq.${profileId}`,
    )
    .eq('matches.status', 'mutual')
    .order('last_message_at', { ascending: false, nullsFirst: false });

  if (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }

  return data || [];
}

/**
 * Get messages for a conversation
 */
export async function getMessages(
  conversationId: string,
  limit = 50,
  before?: string,
): Promise<Message[]> {
  let query = supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (before) {
    query = query.lt('created_at', before);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }

  return (data || []).reverse() as Message[];
}

/**
 * Send a message in a conversation
 */
export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string,
): Promise<Message | null> {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content: content.trim(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error sending message:', error);
    return null;
  }

  // Update conversation's last_message_at
  await supabase
    .from('conversations')
    .update({ last_message_at: new Date().toISOString() })
    .eq('id', conversationId);

  return data as Message;
}

/**
 * Mark messages as read
 */
export async function markMessagesRead(
  conversationId: string,
  readerId: string,
): Promise<void> {
  await supabase
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('conversation_id', conversationId)
    .neq('sender_id', readerId)
    .is('read_at', null);
}

/**
 * Subscribe to new messages in a conversation (real-time)
 */
export function subscribeToMessages(
  conversationId: string,
  onNewMessage: (message: Message) => void,
): RealtimeChannel {
  const channel = supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        onNewMessage(payload.new as Message);
      },
    )
    .subscribe();

  return channel;
}

/**
 * Subscribe to match status changes (for real-time mutual interest notifications)
 */
export function subscribeToMatches(
  profileId: string,
  onMatchUpdate: (match: any) => void,
): RealtimeChannel {
  const channel = supabase
    .channel(`matches:${profileId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'matches',
        filter: `user_b=eq.${profileId}`,
      },
      (payload) => {
        onMatchUpdate(payload.new);
      },
    )
    .subscribe();

  return channel;
}

/**
 * Unsubscribe from a channel
 */
export function unsubscribe(channel: RealtimeChannel): void {
  supabase.removeChannel(channel);
}

/**
 * Get unread message count for a user
 */
export async function getUnreadCount(profileId: string): Promise<number> {
  const { count, error } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .neq('sender_id', profileId)
    .is('read_at', null);

  if (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }

  return count || 0;
}
