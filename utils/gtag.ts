import { Platform } from 'react-native';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// WHOLLY — GA4 Integration Utilities
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Helper functions for Google Analytics 4 integration
// Used by the analytics service for web-based event tracking
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const isWeb = Platform.OS === 'web';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

/**
 * Get the gtag function from window
 * Returns undefined if not on web or gtag not loaded
 */
export function getGtag(): ((...args: any[]) => void) | undefined {
  if (!isWeb) {
    return undefined;
  }

  return typeof window !== 'undefined' && (window as any).gtag;
}

/**
 * Check if GA4 is properly initialized
 */
export function isGA4Ready(): boolean {
  if (!isWeb) {
    return false;
  }

  const gtag = getGtag();
  return !!gtag;
}

/**
 * Send an event to GA4
 * Safe to call even if gtag is not loaded
 */
export function sendEvent(
  eventName: string,
  eventParams?: Record<string, any>,
): void {
  if (!isWeb) {
    return;
  }

  try {
    const gtag = getGtag();
    if (!gtag) {
      if (__DEV__) {
        console.warn('[GA4] gtag function not available');
      }
      return;
    }

    gtag('event', eventName, eventParams || {});
  } catch (err) {
    console.error('[GA4] Error sending event:', err);
  }
}

/**
 * Set user ID in GA4
 */
export function setGA4UserId(userId: string): void {
  if (!isWeb) {
    return;
  }

  try {
    const gtag = getGtag();
    if (!gtag) {
      return;
    }

    gtag('config', {
      'user_id': userId,
    });
  } catch (err) {
    console.error('[GA4] Error setting user ID:', err);
  }
}

/**
 * Set custom user properties in GA4
 */
export function setGA4UserProperties(properties: Record<string, any>): void {
  if (!isWeb) {
    return;
  }

  try {
    const gtag = getGtag();
    if (!gtag) {
      return;
    }

    gtag('set', { 'user_properties': properties });
  } catch (err) {
    console.error('[GA4] Error setting user properties:', err);
  }
}

/**
 * Map internal event names to GA4 event names (GA4 has limitations on event names)
 * Converts underscores to underscores, max 40 chars, alphanumeric + underscore only
 */
export function normalizeEventName(eventName: string): string {
  return eventName
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')
    .substring(0, 40);
}

/**
 * Sanitize event parameters for GA4
 * GA4 event parameters have restrictions
 */
export function sanitizeEventParams(
  params: Record<string, any>,
): Record<string, string | number | boolean> {
  const sanitized: Record<string, string | number | boolean> = {};

  for (const [key, value] of Object.entries(params)) {
    // Skip null/undefined
    if (value == null) {
      continue;
    }

    // Keep primitives
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      sanitized[key] = value;
    } else if (typeof value === 'object') {
      // Convert objects to JSON string if they're not too large
      try {
        const jsonStr = JSON.stringify(value);
        if (jsonStr.length <= 1000) {
          sanitized[key] = jsonStr;
        }
      } catch {
        // Skip if serialization fails
      }
    }
  }

  return sanitized;
}

/**
 * Send a purchase event to GA4
 * Special handling for ecommerce/purchase events
 */
export function sendPurchaseEvent(params: {
  transaction_id: string;
  value: number;
  currency?: string;
  items?: Array<{
    item_id: string;
    item_name: string;
    price: number;
    quantity?: number;
  }>;
  [key: string]: any;
}): void {
  if (!isWeb) {
    return;
  }

  try {
    const gtag = getGtag();
    if (!gtag) {
      return;
    }

    gtag('event', 'purchase', {
      currency: params.currency || 'USD',
      items: params.items || [],
      ...params,
    });
  } catch (err) {
    console.error('[GA4] Error sending purchase event:', err);
  }
}

export default {
  getGtag,
  isGA4Ready,
  sendEvent,
  setGA4UserId,
  setGA4UserProperties,
  normalizeEventName,
  sanitizeEventParams,
  sendPurchaseEvent,
};
