/**
 * WHOLLY — Web Push Notifications Service
 *
 * Handles browser push notification permission, subscription storage,
 * and sending notifications for matches and messages.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

/**
 * Check if notifications are supported
 */
export function isNotificationSupported(): boolean {
  return isWeb && typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) return false;

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

/**
 * Get current notification permission status
 */
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

/**
 * Show a local browser notification
 */
export function showNotification(
  title: string,
  options?: NotificationOptions,
): void {
  if (!isNotificationSupported()) return;
  if (Notification.permission !== 'granted') return;

  new Notification(title, {
    icon: '/assets/assets/images/icon.png',
    badge: '/assets/assets/images/icon.png',
    ...options,
  });
}

/**
 * Notify on new mutual match
 */
export function notifyMutualMatch(matchName: string): void {
  showNotification('New Mutual Match!', {
    body: `You and ${matchName} are both interested. Start chatting!`,
    tag: 'mutual-match',
  });
}

/**
 * Notify on new message
 */
export function notifyNewMessage(senderName: string, preview: string): void {
  showNotification(`Message from ${senderName}`, {
    body: preview.substring(0, 100),
    tag: 'new-message',
  });
}

/**
 * Notify on high compatibility match
 */
export function notifyHighMatch(matchName: string, score: number): void {
  showNotification('Exceptional Match Found!', {
    body: `${matchName} has a ${score}% compatibility score with you.`,
    tag: 'high-match',
  });
}

/**
 * Save push subscription to user profile for future server-side notifications
 */
export async function savePushSubscription(
  profileId: string,
  subscription: PushSubscription,
): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  const { error } = await supabase
    .from('profiles')
    .update({ push_subscription: subscription.toJSON() })
    .eq('id', profileId);

  return !error;
}
