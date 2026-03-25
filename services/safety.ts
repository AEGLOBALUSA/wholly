/**
 * WHOLLY Safety Service
 *
 * Report and block functionality to protect users.
 * "spiritual-manipulation" is unique to WHOLLY — prevents people from
 * using prophecy, dreams, or spiritual authority to pressure others.
 */

import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';

export type ReportReason =
  | 'inappropriate-content'
  | 'harassment'
  | 'fake-profile'
  | 'spiritual-manipulation'
  | 'underage'
  | 'spam'
  | 'other';

export const REPORT_REASONS: { value: ReportReason; label: string; description: string }[] = [
  { value: 'inappropriate-content', label: 'Inappropriate Content', description: 'Sexually explicit or offensive messages/photos' },
  { value: 'harassment', label: 'Harassment', description: 'Unwanted persistent contact, threats, or intimidation' },
  { value: 'fake-profile', label: 'Fake Profile', description: 'Profile appears to be fraudulent or misleading' },
  { value: 'spiritual-manipulation', label: 'Spiritual Manipulation', description: 'Using prophecy, dreams, or spiritual authority to pressure someone' },
  { value: 'underage', label: 'Underage User', description: 'Person appears to be under 18' },
  { value: 'spam', label: 'Spam', description: 'Promotional content or scam attempts' },
  { value: 'other', label: 'Other', description: 'Something else that concerns you' },
];

/**
 * Report a user
 */
export async function reportUser(
  reporterId: string,
  reportedId: string,
  reason: ReportReason,
  details?: string,
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Not connected to server' };
  }

  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, error: 'Connection unavailable' };

  try {
    const { error } = await supabase.from('reports').insert({
      reporter_id: reporterId,
      reported_id: reportedId,
      reason,
      details: details?.trim().slice(0, 500), // Cap at 500 chars
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Block a user — hides them from your matches and prevents messaging
 */
export async function blockUser(
  blockerId: string,
  blockedId: string,
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Not connected to server' };
  }

  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, error: 'Connection unavailable' };

  try {
    const { error } = await supabase.from('blocks').insert({
      blocker_id: blockerId,
      blocked_id: blockedId,
    });

    if (error) {
      if (error.code === '23505') return { success: true }; // Already blocked
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Unblock a user
 */
export async function unblockUser(
  blockerId: string,
  blockedId: string,
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Not connected to server' };
  }

  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, error: 'Connection unavailable' };

  try {
    const { error } = await supabase
      .from('blocks')
      .delete()
      .eq('blocker_id', blockerId)
      .eq('blocked_id', blockedId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Get list of blocked user IDs
 */
export async function getBlockedUsers(userId: string): Promise<string[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = getSupabaseClient();
  if (!supabase) return [];

  try {
    const { data } = await supabase
      .from('blocks')
      .select('blocked_id')
      .eq('blocker_id', userId);

    return (data || []).map((b: any) => b.blocked_id);
  } catch {
    return [];
  }
}

/**
 * Check if a user is blocked
 */
export async function isUserBlocked(
  blockerId: string,
  blockedId: string,
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { data } = await supabase
      .from('blocks')
      .select('id')
      .eq('blocker_id', blockerId)
      .eq('blocked_id', blockedId)
      .single();

    return !!data;
  } catch {
    return false;
  }
}
