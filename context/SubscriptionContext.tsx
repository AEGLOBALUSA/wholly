import React, { createContext, useContext, useState, useCallback } from 'react';

export type SubscriptionTier = 'free' | 'standard' | 'premium';

export type PhotoAccess = 'none' | 'thumbnail' | 'full';

export interface SubscriptionFeatures {
  viewFullProfiles: boolean;
  expressInterest: boolean;
  chat: boolean;
  photoAccess: PhotoAccess;           // none=free, thumbnail=standard, full=premium
  seeBlueVerifiedTick: boolean;       // free — available to all, 6-month renewal
  seeGoldVerifiedTick: boolean;       // premium only
  pastorNote: boolean;                // premium — 150-char pastor endorsement
  thresholdSelector: boolean;
  weeklyInterestDigest: boolean;
  priorityDiscovery: boolean;
  extendedInsights: boolean;
  curatedFilters: boolean;
  monthlyOpenDoor: boolean;
  activeStatus: boolean;
}

const FEATURE_GATES: Record<SubscriptionTier, SubscriptionFeatures> = {
  free: {
    viewFullProfiles: false,
    expressInterest: false,
    chat: false,
    photoAccess: 'none',
    seeBlueVerifiedTick: true,       // Blue Tick is free for everyone
    seeGoldVerifiedTick: false,
    pastorNote: false,
    thresholdSelector: false,
    weeklyInterestDigest: false,
    priorityDiscovery: false,
    extendedInsights: false,
    curatedFilters: false,
    monthlyOpenDoor: false,
    activeStatus: false,
  },
  standard: {
    viewFullProfiles: true,
    expressInterest: true,
    chat: true,
    photoAccess: 'thumbnail',         // Standard = tiny thumbnails
    seeBlueVerifiedTick: true,
    seeGoldVerifiedTick: false,
    pastorNote: false,
    thresholdSelector: false,
    weeklyInterestDigest: false,
    priorityDiscovery: false,
    extendedInsights: false,
    curatedFilters: false,
    monthlyOpenDoor: false,
    activeStatus: false,
  },
  premium: {
    viewFullProfiles: true,
    expressInterest: true,
    chat: true,
    photoAccess: 'full',              // Premium = full photo reveal
    seeBlueVerifiedTick: true,
    seeGoldVerifiedTick: true,        // Gold Tick + Pastor's Note
    pastorNote: true,                 // 150-char pastor endorsement
    thresholdSelector: true,
    weeklyInterestDigest: true,
    priorityDiscovery: true,
    extendedInsights: true,
    curatedFilters: true,
    monthlyOpenDoor: true,
    activeStatus: true,
  },
};

interface SubscriptionContextType {
  tier: SubscriptionTier;
  isLoading: boolean;
  setTier: (tier: SubscriptionTier) => void;
  canAccess: (feature: keyof SubscriptionFeatures) => boolean;
  getFeatures: () => SubscriptionFeatures;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  tier: 'free',
  isLoading: false,
  setTier: () => {},
  canAccess: () => false,
  getFeatures: () => FEATURE_GATES.free,
});

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tier, setTierState] = useState<SubscriptionTier>('free');
  const [isLoading, setIsLoading] = useState(false);

  const setTier = useCallback((newTier: SubscriptionTier) => {
    // In the future, this will integrate with Stripe/RevenueCat
    // For now, just set locally
    setTierState(newTier);
  }, []);

  const canAccess = useCallback((feature: keyof SubscriptionFeatures): boolean => {
    return FEATURE_GATES[tier][feature];
  }, [tier]);

  const getFeatures = useCallback((): SubscriptionFeatures => {
    return FEATURE_GATES[tier];
  }, [tier]);

  const value: SubscriptionContextType = {
    tier,
    isLoading,
    setTier,
    canAccess,
    getFeatures,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);
