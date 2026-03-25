/**
 * WHOLLY Payment Service
 *
 * Handles Stripe (web) and RevenueCat (mobile) payment flows.
 * All payment processing happens server-side via Supabase Edge Functions.
 *
 * Setup required before launch:
 * 1. Create Stripe account and get API keys
 * 2. Create products/prices in Stripe Dashboard matching STRIPE_PRICES
 * 3. Deploy the create-checkout edge function
 * 4. Set STRIPE_SECRET_KEY in Supabase Edge Function secrets
 * 5. For mobile: Create RevenueCat account, configure offerings
 */

import { SubscriptionTier } from '../context/SubscriptionContext';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import { Platform } from 'react-native';

// ─── Stripe Price IDs (set these after creating products in Stripe Dashboard) ───
export const STRIPE_PRICES = {
  standard_monthly: 'price_standard_monthly',   // $19.99/month
  standard_annual: 'price_standard_annual',      // $179.88/year ($14.99/mo)
  premium_monthly: 'price_premium_monthly',      // $29.99/month
  premium_annual: 'price_premium_annual',        // $275.88/year ($22.99/mo)
};

// ─── RevenueCat Product IDs (set these after configuring in RevenueCat) ───
export const REVENUECAT_PRODUCTS = {
  standard_monthly: 'wholly_connect_monthly',
  standard_annual: 'wholly_connect_annual',
  premium_monthly: 'wholly_intentional_monthly',
  premium_annual: 'wholly_intentional_annual',
};

export type BillingPeriod = 'monthly' | 'annual';

/**
 * Get the correct price ID for a tier + billing period
 */
function getPriceId(tier: SubscriptionTier, period: BillingPeriod): string {
  if (tier === 'standard') {
    return period === 'monthly' ? STRIPE_PRICES.standard_monthly : STRIPE_PRICES.standard_annual;
  }
  if (tier === 'premium') {
    return period === 'monthly' ? STRIPE_PRICES.premium_monthly : STRIPE_PRICES.premium_annual;
  }
  throw new Error('Free tier does not have a price');
}

/**
 * Create a Stripe Checkout session (web only)
 * Calls a Supabase Edge Function that creates the session server-side
 */
export async function createCheckoutSession(
  userId: string,
  tier: SubscriptionTier,
  period: BillingPeriod,
): Promise<{ url: string } | { error: string }> {
  if (!isSupabaseConfigured()) {
    return { error: 'Supabase not configured' };
  }

  const supabase = getSupabaseClient();
  if (!supabase) return { error: 'Supabase client not available' };

  try {
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: {
        user_id: userId,
        price_id: getPriceId(tier, period),
        tier,
        period,
        success_url: `${typeof window !== 'undefined' ? window.location.origin : ''}/settings/subscription?success=true`,
        cancel_url: `${typeof window !== 'undefined' ? window.location.origin : ''}/settings/subscription?canceled=true`,
      },
    });

    if (error) return { error: error.message };
    return { url: data.url };
  } catch (err: any) {
    return { error: err.message || 'Failed to create checkout session' };
  }
}

/**
 * Create a Stripe Customer Portal session (manage subscription)
 */
export async function createPortalSession(
  userId: string,
): Promise<{ url: string } | { error: string }> {
  if (!isSupabaseConfigured()) {
    return { error: 'Supabase not configured' };
  }

  const supabase = getSupabaseClient();
  if (!supabase) return { error: 'Supabase client not available' };

  try {
    const { data, error } = await supabase.functions.invoke('create-portal', {
      body: {
        user_id: userId,
        return_url: `${typeof window !== 'undefined' ? window.location.origin : ''}/settings/subscription`,
      },
    });

    if (error) return { error: error.message };
    return { url: data.url };
  } catch (err: any) {
    return { error: err.message || 'Failed to create portal session' };
  }
}

/**
 * Get current subscription status from Supabase
 */
export async function getSubscriptionStatus(
  userId: string,
): Promise<{
  tier: SubscriptionTier;
  period: BillingPeriod | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId: string | null;
} | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) return null;

    return {
      tier: data.tier as SubscriptionTier,
      period: data.period as BillingPeriod | null,
      currentPeriodEnd: data.current_period_end,
      cancelAtPeriodEnd: data.cancel_at_period_end || false,
      stripeCustomerId: data.stripe_customer_id,
    };
  } catch {
    return null;
  }
}

/**
 * Handle payment on the correct platform
 */
export async function subscribe(
  userId: string,
  tier: SubscriptionTier,
  period: BillingPeriod,
): Promise<{ success: boolean; url?: string; error?: string }> {
  if (tier === 'free') {
    return { success: true };
  }

  if (Platform.OS === 'web') {
    const result = await createCheckoutSession(userId, tier, period);
    if ('error' in result) return { success: false, error: result.error };
    return { success: true, url: result.url };
  }

  // Mobile: Use RevenueCat (placeholder — requires native SDK setup)
  // RevenueCat handles iOS App Store / Google Play billing
  return {
    success: false,
    error: 'Mobile payments will use RevenueCat. Configure in app.json and install expo-purchases.',
  };
}

/**
 * Open subscription management portal
 */
export async function manageSubscription(
  userId: string,
): Promise<{ url?: string; error?: string }> {
  if (Platform.OS === 'web') {
    const result = await createPortalSession(userId);
    if ('error' in result) return { error: result.error };
    return { url: result.url };
  }

  // Mobile: Open native subscription management
  // iOS: Settings > Apple ID > Subscriptions
  // Android: Play Store > Subscriptions
  return { error: 'Open your device settings to manage subscriptions' };
}
