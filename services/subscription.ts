import { SubscriptionTier, SubscriptionFeatures } from '../context/SubscriptionContext';

export interface PricingTier {
  id: SubscriptionTier;
  name: string;
  subtitle: string;
  monthlyPrice: number;
  annualPrice: number;
  savingsPercentage: number;
  description: string;
}

export interface SubscriptionConfig {
  tiers: Record<SubscriptionTier, PricingTier>;
}

export const SUBSCRIPTION_CONFIG: SubscriptionConfig = {
  tiers: {
    free: {
      id: 'free',
      name: 'Discover',
      subtitle: 'FREE',
      monthlyPrice: 0,
      annualPrice: 0,
      savingsPercentage: 0,
      description: 'Explore matches with limited features',
    },
    standard: {
      id: 'standard',
      name: 'Connect',
      subtitle: 'STANDARD',
      monthlyPrice: 19.99,
      annualPrice: 14.99 * 12, // $14.99/month annual = $179.88/year
      savingsPercentage: 25,
      description: 'Full profiles and messaging',
    },
    premium: {
      id: 'premium',
      name: 'Intentional',
      subtitle: 'PREMIUM',
      monthlyPrice: 29.99,
      annualPrice: 22.99 * 12, // $22.99/month annual = $275.88/year
      savingsPercentage: 23,
      description: 'Verified status and advanced features',
    },
  },
};

// Feature descriptions for comparison
export const FEATURE_DESCRIPTIONS: Record<keyof SubscriptionFeatures, { label: string; description: string }> = {
  viewFullProfiles: {
    label: 'Full profiles',
    description: 'See full match profiles and bios',
  },
  expressInterest: {
    label: 'Express Interest',
    description: 'Show interest in matches',
  },
  chat: {
    label: 'Chat (on mutual match)',
    description: 'Message matches after mutual interest',
  },
  photoAccess: {
    label: 'Photo Access',
    description: 'See match photos (thumbnail or full)',
  },
  seeBlueVerifiedTick: {
    label: 'Blue Tick Verification',
    description: 'Pastor-verified membership (free, renews every 6 months)',
  },
  seeGoldVerifiedTick: {
    label: 'Gold Tick + Pastor\'s Note',
    description: 'Premium verification with 150-character pastor endorsement',
  },
  pastorNote: {
    label: "Pastor's Note",
    description: '150-character pastoral endorsement on your profile',
  },
  thresholdSelector: {
    label: 'Threshold Selector',
    description: 'Filter matches by 72%+ or 82%+ compatibility',
  },
  weeklyInterestDigest: {
    label: 'Weekly Interest Digest',
    description: 'Email summary of who expressed interest',
  },
  priorityDiscovery: {
    label: 'Priority Discovery',
    description: 'Your profile shown first to new users',
  },
  extendedInsights: {
    label: 'Extended Insights',
    description: 'Deeper 4-layer compatibility breakdown',
  },
  curatedFilters: {
    label: 'Curated Filters',
    description: 'Filter by campus, age range, life stage',
  },
  monthlyOpenDoor: {
    label: 'Monthly Open Door',
    description: '24hr visibility boost once per month',
  },
  activeStatus: {
    label: 'Active Status',
    description: 'Show when you were last active',
  },
};

// Placeholder Stripe/RevenueCat integration stubs
export const createStripeCheckoutSession = async (tier: SubscriptionTier): Promise<string> => {
  // TODO: Integrate with Stripe API
  console.log(`Creating checkout session for tier: ${tier}`);
  return '';
};

export const initializeRevenueCat = async (): Promise<void> => {
  // TODO: Initialize RevenueCat SDK
  console.log('Initializing RevenueCat');
};

export const getPurchaseHistory = async (userId: string): Promise<any[]> => {
  // TODO: Fetch purchase history from backend
  console.log(`Fetching purchase history for user: ${userId}`);
  return [];
};

export const cancelSubscription = async (userId: string): Promise<void> => {
  // TODO: Cancel subscription via Stripe/RevenueCat
  console.log(`Canceling subscription for user: ${userId}`);
};

// Verification system
export interface VerificationStatus {
  blueTick: boolean;
  blueTickExpiry: Date | null;        // expires every 6 months
  goldTick: boolean;                  // premium only
  pastorNote: string | null;          // 150-char max, premium only
  pastorName: string | null;
  pastorChurch: string | null;
}

export const VERIFICATION_RULES = {
  blueTickDurationMonths: 6,          // Blue Tick expires every 6 months
  pastorNoteMaxChars: 150,            // Gold Tick includes 150-char pastor endorsement
  blueTickRequirements: 'Pastor verifies church membership',
  goldTickRequirements: 'Premium tier + pastor endorsement',
};

export const isBlueTickExpired = (expiry: Date | null): boolean => {
  if (!expiry) return true;
  return new Date() > expiry;
};

export const getPhotoAccessLevel = (tier: SubscriptionTier): 'none' | 'thumbnail' | 'full' => {
  switch (tier) {
    case 'free': return 'none';
    case 'standard': return 'thumbnail';
    case 'premium': return 'full';
  }
};
