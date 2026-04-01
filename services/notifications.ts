/**
 * WHOLLY — Push Notifications Service
 *
 * Handles browser push notification permission, service worker push
 * subscription, and local notification fallbacks.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';
const VAPID_PUBLIC_KEY = process.env.EXPO_PUBLIC_VAPID_KEY || '';

/**
 * Check if notifications are supported
 */
export function isNotificationSupported(): boolean {
  return isWeb && typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Check if service worker push is supported
 */
export function isPushSupported(): boolean {
  return (
    isNotificationSupported() &&
    'serviceWorker' in navigator &&
    'PushManager' in window
  );
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
 * Subscribe to push notifications via service worker.
 * Registers the subscription with the backend so server-side
 * notifications can be sent.
 */
export async function subscribeToPush(profileId: string): Promise<boolean> {
  if (!isPushSupported() || !VAPID_PUBLIC_KEY || !isSupabaseConfigured) return false;

  try {
    const permission = await requestNotificationPermission();
    if (!permission) return false;

    const registration = await navigator.serviceWorker.ready;

    // Check for existing subscription
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      // Convert VAPID key to Uint8Array
      const vapidKeyBytes = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);

      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKeyBytes,
      });
    }

    // Register with backend
    const { error } = await supabase.functions.invoke('register-push', {
      body: { subscription: subscription.toJSON() },
    });

    return !error;
  } catch {
    return false;
  }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribePush(): Promise<boolean> {
  if (!isPushSupported()) return false;

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      // Remove from backend
      await supabase.functions.invoke('register-push', {
        method: 'DELETE',
        body: { endpoint: subscription.endpoint },
      });

      // Unsubscribe locally
      await subscription.unsubscribe();
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Show a local browser notification (foreground fallback)
 */
export function showNotification(
  title: string,
  options?: NotificationOptions,
): void {
  if (!isNotificationSupported()) return;
  if (Notification.permission !== 'granted') return;

  new Notification(title, {
    icon: '/icon-192.png',
    badge: '/icon-192.png',
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
 * Convert a base64url-encoded VAPID key to Uint8Array
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
}
