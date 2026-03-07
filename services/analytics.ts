import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Platform } from 'react-native';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// WHOLLY — Analytics Service
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Tracks user events across the app, with optional batching and GA4 integration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface AnalyticsEvent {
  event_name: string;
  properties?: Record<string, any>;
  user_id?: string;
  session_id?: string;
  platform?: string;
  screen_name?: string;
}

interface QueuedEvent extends AnalyticsEvent {
  timestamp: number;
}

const isWeb = Platform.OS === 'web';

class AnalyticsService {
  private sessionId: string = '';
  private eventQueue: QueuedEvent[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private userId: string | null = null;
  private isInitialized = false;

  // Configuration
  private readonly BATCH_SIZE = 10;
  private readonly BATCH_TIMEOUT_MS = 30 * 1000; // 30 seconds
  private readonly GA4_ID = process.env.EXPO_PUBLIC_GA4_ID || '';

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  /**
   * Initialize the analytics service
   */
  public init(userId?: string): void {
    if (this.isInitialized) return;

    this.userId = userId || null;
    this.isInitialized = true;

    // Inject GA4 script on web
    if (isWeb && this.GA4_ID) {
      this.injectGA4Script();
    }

    if (__DEV__) {
      console.log('[Analytics] Initialized', {
        sessionId: this.sessionId,
        userId: this.userId,
        platform: Platform.OS,
        ga4Enabled: isWeb && !!this.GA4_ID,
      });
    }
  }

  /**
   * Update user ID when auth state changes
   */
  public setUserId(userId: string | null): void {
    this.userId = userId;
  }

  /**
   * Track a custom event
   */
  public async track(
    eventName: string,
    properties?: Record<string, any>,
    screenName?: string,
  ): Promise<void> {
    const event: QueuedEvent = {
      event_name: eventName,
      properties: properties || {},
      user_id: this.userId || undefined,
      session_id: this.sessionId,
      platform: Platform.OS,
      screen_name: screenName,
      timestamp: Date.now(),
    };

    // Log in development
    if (__DEV__) {
      console.log('[Analytics Event]', eventName, properties);
    }

    // Add to queue
    this.eventQueue.push(event);

    // Send to GA4 immediately on web
    if (isWeb && this.GA4_ID) {
      this.sendToGA4(eventName, properties);
    }

    // Flush if batch size reached
    if (this.eventQueue.length >= this.BATCH_SIZE) {
      await this.flush();
    } else {
      // Reset timer for timeout-based flush
      this.scheduleFlush();
    }
  }

  /**
   * Flush all queued events to Supabase
   */
  public async flush(): Promise<void> {
    if (this.eventQueue.length === 0) {
      return;
    }

    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }

    const events = [...this.eventQueue];
    this.eventQueue = [];

    // Only send to Supabase if configured
    if (!isSupabaseConfigured) {
      if (__DEV__) {
        console.log('[Analytics] Supabase not configured, skipping batch flush', {
          eventCount: events.length,
        });
      }
      return;
    }

    try {
      // Map events to database schema (remove timestamp field and ensure proper types)
      const dbEvents = events.map(({ timestamp, ...event }) => ({
        event_name: event.event_name,
        properties: event.properties || {},
        user_id: event.user_id || null,
        session_id: event.session_id || null,
        platform: event.platform || 'web',
        screen_name: event.screen_name || null,
      })) as any;

      const { error } = await supabase.from('analytics_events').insert(dbEvents);

      if (error) {
        console.error('[Analytics] Failed to flush events:', error);
        // Re-queue events on failure
        this.eventQueue = [...events, ...this.eventQueue];
      } else if (__DEV__) {
        console.log('[Analytics] Flushed', events.length, 'events');
      }
    } catch (err) {
      console.error('[Analytics] Unexpected error during flush:', err);
      // Re-queue events on error
      this.eventQueue = [...events, ...this.eventQueue];
    }
  }

  /**
   * Schedule a flush after timeout
   */
  private scheduleFlush(): void {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
    }

    this.flushTimer = setTimeout(() => {
      this.flush();
    }, this.BATCH_TIMEOUT_MS);
  }

  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Inject GA4 script (web only)
   */
  private injectGA4Script(): void {
    if (!isWeb || !this.GA4_ID) return;

    try {
      // Create gtag script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.GA4_ID}`;
      document.head.appendChild(script);

      // Initialize gtag
      (window as any).dataLayer = (window as any).dataLayer || [];

      function gtag(...args: any[]) {
        (window as any).dataLayer.push(arguments);
      }

      (window as any).gtag = gtag;
      gtag('js', new Date());
      gtag('config', this.GA4_ID, {
        session_id: this.sessionId,
      });

      if (__DEV__) {
        console.log('[Analytics] GA4 script injected:', this.GA4_ID);
      }
    } catch (err) {
      console.error('[Analytics] Failed to inject GA4 script:', err);
    }
  }

  /**
   * Send event to GA4 (web only)
   */
  private sendToGA4(eventName: string, properties?: Record<string, any>): void {
    if (!isWeb) return;

    try {
      const gtag = (window as any).gtag;
      if (!gtag) {
        if (__DEV__) {
          console.warn('[Analytics] gtag not available');
        }
        return;
      }

      // Map custom event properties to GA4 event parameters
      const eventData = {
        session_id: this.sessionId,
        ...(this.userId && { user_id: this.userId }),
        ...(properties || {}),
      };

      gtag('event', eventName, eventData);
    } catch (err) {
      console.error('[Analytics] Failed to send to GA4:', err);
    }
  }

  /**
   * Cleanup on unmount
   */
  public destroy(): void {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
    }
    // Final flush attempt
    this.flush().catch(err => {
      console.error('[Analytics] Error during destroy:', err);
    });
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Convenience Methods for Common Events
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const analytics = {
  /**
   * Page navigation
   */
  pageView: async (screenName: string) => {
    await analyticsService.track('page_view', { screen_name: screenName }, screenName);
  },

  /**
   * Onboarding: Started
   */
  onboardingStart: async () => {
    await analyticsService.track('onboarding_start', {}, 'onboarding_step_1');
  },

  /**
   * Onboarding: Step completed
   */
  onboardingStepComplete: async (stepNumber: number) => {
    await analyticsService.track(
      'onboarding_step_complete',
      { step_number: stepNumber },
      `onboarding_step_${stepNumber}`,
    );
  },

  /**
   * Onboarding: All steps completed
   */
  onboardingComplete: async () => {
    await analyticsService.track('onboarding_complete', {}, 'onboarding_results');
  },

  /**
   * Onboarding: User abandoned mid-flow
   */
  onboardingAbandon: async (stepNumber: number) => {
    await analyticsService.track(
      'onboarding_abandon',
      { abandoned_at_step: stepNumber },
      `onboarding_step_${stepNumber}`,
    );
  },

  /**
   * Match Results: Page viewed
   */
  matchView: async (matchCounts?: Record<string, number>) => {
    await analyticsService.track(
      'match_view',
      { match_counts: matchCounts || {} },
      'results',
    );
  },

  /**
   * Match Card: Expanded/clicked
   */
  matchExpand: async (matchId: string, tier?: string) => {
    await analyticsService.track(
      'match_expand',
      { match_id: matchId, tier: tier },
      'results',
    );
  },

  /**
   * Interest: "I'm Interested" button tapped
   */
  interestExpress: async (matchId: string, tier?: string) => {
    await analyticsService.track(
      'interest_express',
      { match_id: matchId, tier: tier },
      'results',
    );
  },

  /**
   * Paywall: Modal shown
   */
  paywallView: async () => {
    await analyticsService.track('paywall_view', {}, 'paywall');
  },

  /**
   * Paywall: Tier selected
   */
  paywallTierSelect: async (tier: string, price?: number) => {
    await analyticsService.track(
      'paywall_tier_select',
      { tier, price },
      'paywall',
    );
  },

  /**
   * Paywall: Conversion (subscription activated)
   */
  paywallConvert: async (tier: string, price?: number) => {
    await analyticsService.track(
      'paywall_convert',
      { tier, price, converted_at: new Date().toISOString() },
      'paywall',
    );
  },

  /**
   * Theme: Toggled
   */
  themeToggle: async (newMode: 'dark' | 'light') => {
    await analyticsService.track('theme_toggle', { new_mode: newMode }, 'settings');
  },

  /**
   * Covenant: Signed/accepted
   */
  covenantComplete: async () => {
    await analyticsService.track('covenant_complete', {}, 'covenant');
  },

  /**
   * Auth: Sign-up completed
   */
  signupComplete: async (email?: string) => {
    await analyticsService.track(
      'signup_complete',
      { email: email },
      'auth_signup',
    );
  },

  /**
   * Auth: Sign-in completed
   */
  signinComplete: async (email?: string) => {
    await analyticsService.track(
      'signin_complete',
      { email: email },
      'auth_signin',
    );
  },

  /**
   * Flush queued events
   */
  flush: async () => {
    await analyticsService.flush();
  },
};

export default analytics;
