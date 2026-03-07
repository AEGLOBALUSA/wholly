import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { SUBSCRIPTION_CONFIG, FEATURE_DESCRIPTIONS } from '../../services/subscription';
import Button from '../../components/ui/Button';
import PaywallModal from '../../components/ui/PaywallModal';

const isWeb = Platform.OS === 'web';

export default function SubscriptionPage() {
  const router = useRouter();
  const { colors } = useTheme();
  const { tier, setTier } = useSubscription();
  const [billingMode, setBillingMode] = useState<'monthly' | 'annual'>('monthly');
  const [paywallVisible, setPaywallVisible] = useState(false);

  const currentTier = SUBSCRIPTION_CONFIG.tiers[tier];

  const getTierPrice = (tierId: 'free' | 'standard' | 'premium'): number => {
    const tierData = SUBSCRIPTION_CONFIG.tiers[tierId];
    return billingMode === 'monthly' ? tierData.monthlyPrice : tierData.annualPrice / 12;
  };

  const getTierFeatures = (tierId: 'free' | 'standard' | 'premium'): (keyof typeof FEATURE_DESCRIPTIONS)[] => {
    const featureGates: Record<string, (keyof typeof FEATURE_DESCRIPTIONS)[]> = {
      free: [
        'viewFullProfiles' as any,
        'expressInterest' as any,
        'chat' as any,
        'seeBlueVerifiedTick' as any,
      ],
      standard: [
        'viewFullProfiles' as any,
        'expressInterest' as any,
        'chat' as any,
        'seeBlueVerifiedTick' as any,
      ],
      premium: [
        'viewFullProfiles' as any,
        'expressInterest' as any,
        'chat' as any,
        'seeBlueVerifiedTick' as any,
        'seeGoldVerifiedTick' as any,
        'pastorNote' as any,
        'thresholdSelector' as any,
        'weeklyInterestDigest' as any,
        'priorityDiscovery' as any,
        'extendedInsights' as any,
        'curatedFilters' as any,
        'monthlyOpenDoor' as any,
      ],
    };
    return featureGates[tierId] || [];
  };

  const featureHasAccess = (feature: keyof typeof FEATURE_DESCRIPTIONS, tierId: 'free' | 'standard' | 'premium'): boolean => {
    return getTierFeatures(tierId).includes(feature);
  };

  const renderTierCard = (tierId: 'free' | 'standard' | 'premium') => {
    const tierData = SUBSCRIPTION_CONFIG.tiers[tierId];
    const isCurrentTier = tier === tierId;
    const isPremium = tierId === 'premium';

    return (
      <View
        key={tierId}
        style={[
          styles.tierCard,
          {
            backgroundColor: isCurrentTier ? colors.accentSubtle : colors.surface,
            borderColor: isCurrentTier ? colors.accentBorder : colors.surfaceBorder,
            borderWidth: 2,
          },
        ]}
      >
        {/* Header */}
        <View style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: colors.text,
                  ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
                }}
              >
                {tierData.name}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.textMuted,
                  marginTop: 2,
                  ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
                }}
              >
                {tierData.subtitle}
              </Text>
            </View>
            {isCurrentTier && (
              <View
                style={{
                  backgroundColor: colors.accent,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 6,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '600',
                    color: '#ffffff',
                    ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
                  }}
                >
                  CURRENT PLAN
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Price */}
        {tierId !== 'free' && (
          <View style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: '300',
                  color: colors.accent,
                  letterSpacing: -0.5,
                  ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
                }}
              >
                ${getTierPrice(tierId).toFixed(2)}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: colors.textSecondary,
                  marginLeft: 4,
                  ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
                }}
              >
                /{billingMode === 'monthly' ? 'month' : 'month'}
              </Text>
            </View>
          </View>
        )}

        {/* Features */}
        <View style={{ gap: 10, marginBottom: 16 }}>
          {Object.entries(FEATURE_DESCRIPTIONS).map(([featureKey, { label }]) => {
            const hasAccess = featureHasAccess(featureKey as any, tierId);
            return (
              <View key={featureKey} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: hasAccess ? colors.accent : colors.textMuted,
                    fontWeight: '700',
                  }}
                >
                  {hasAccess ? '✓' : '−'}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: hasAccess ? colors.text : colors.textMuted,
                    flex: 1,
                    ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
                  }}
                >
                  {label}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Action Button */}
        {isCurrentTier ? (
          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 16,
              borderRadius: 9999,
              alignItems: 'center',
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.surfaceBorder,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: colors.textSecondary,
                ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
              }}
            >
              Active Plan
            </Text>
          </View>
        ) : (
          <Button
            title={`Upgrade to ${tierData.name}`}
            onPress={() => setPaywallVisible(true)}
            variant="primary"
          />
        )}
      </View>
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text
            style={{
              fontSize: 28,
              color: colors.textSecondary,
              marginRight: 8,
            }}
          >
            ←
          </Text>
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 24,
            fontWeight: '300',
            color: colors.text,
            flex: 1,
            letterSpacing: -0.5,
            ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
          }}
        >
          Subscription
        </Text>
      </View>

      {/* Billing Toggle */}
      <View style={{ marginBottom: 24 }}>
        <Text
          style={{
            fontSize: 13,
            fontWeight: '600',
            color: colors.textSecondary,
            marginBottom: 8,
            ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
          }}
        >
          Billing Period
        </Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            onPress={() => setBillingMode('monthly')}
            style={[
              styles.billingButton,
              {
                backgroundColor: billingMode === 'monthly' ? colors.accent : colors.surface,
                borderColor: colors.surfaceBorder,
              },
            ]}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: '600',
                color: billingMode === 'monthly' ? '#ffffff' : colors.textSecondary,
                ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
              }}
            >
              Monthly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setBillingMode('annual')}
            style={[
              styles.billingButton,
              {
                backgroundColor: billingMode === 'annual' ? colors.accent : colors.surface,
                borderColor: colors.surfaceBorder,
              },
            ]}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: '600',
                color: billingMode === 'annual' ? '#ffffff' : colors.textSecondary,
                ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
              }}
            >
              Annual (Save 25%)
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tier Cards */}
      <View style={{ gap: 16, marginBottom: 32 }}>
        {renderTierCard('free')}
        {renderTierCard('standard')}
        {renderTierCard('premium')}
      </View>

      {/* Info Text */}
      <View style={[styles.infoBox, { backgroundColor: colors.accentSubtle, borderColor: colors.accentBorder }]}>
        <Text
          style={{
            fontSize: 13,
            color: colors.textSecondary,
            lineHeight: 20,
            ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
          }}
        >
          You can change your subscription plan at any time. Changes will take effect at the start of your next billing cycle.
        </Text>
      </View>

      <PaywallModal
        visible={paywallVisible}
        onClose={() => setPaywallVisible(false)}
        onSelectTier={(selectedTier) => {
          setTier(selectedTier);
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 48,
    maxWidth: 640,
    width: '100%',
    alignSelf: 'center',
  },
  tierCard: {
    borderRadius: 16,
    padding: 20,
  },
  billingButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  infoBox: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
});
