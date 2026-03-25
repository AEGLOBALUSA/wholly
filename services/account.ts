/**
 * WHOLLY Account Management Service
 *
 * Handles account deletion with 30-day grace period.
 * Required by Apple App Store and Google Play Store policies.
 */

import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';

/**
 * Request account deletion — starts 30-day countdown
 * User can cancel during this period
 */
export async function requestAccountDeletion(
  userId: string,
  reason?: string,
): Promise<{ success: boolean; scheduledDate?: string; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Not connected to server' };
  }

  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, error: 'Connection unavailable' };

  try {
    // Check for existing pending request
    const { data: existing } = await supabase
      .from('deletion_requests')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .single();

    if (existing) {
      return {
        success: true,
        scheduledDate: existing.scheduled_deletion_at,
      };
    }

    // Create deletion request
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + 30);

    const { data, error } = await supabase
      .from('deletion_requests')
      .insert({
        user_id: userId,
        reason: reason?.trim().slice(0, 500),
      })
      .select()
      .single();

    if (error) return { success: false, error: error.message };

    // Mark profile as pending deletion
    await supabase
      .from('profiles')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', userId);

    return {
      success: true,
      scheduledDate: data.scheduled_deletion_at,
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Cancel a pending account deletion
 */
export async function cancelAccountDeletion(
  userId: string,
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Not connected to server' };
  }

  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, error: 'Connection unavailable' };

  try {
    const { error } = await supabase
      .from('deletion_requests')
      .update({
        status: 'canceled',
        canceled_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('status', 'pending');

    if (error) return { success: false, error: error.message };

    // Remove deletion marker from profile
    await supabase
      .from('profiles')
      .update({ deleted_at: null })
      .eq('id', userId);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Get deletion request status
 */
export async function getDeletionStatus(
  userId: string,
): Promise<{ pending: boolean; scheduledDate?: string } | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data } = await supabase
      .from('deletion_requests')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .single();

    if (!data) return { pending: false };

    return {
      pending: true,
      scheduledDate: data.scheduled_deletion_at,
    };
  } catch {
    return { pending: false };
  }
}
