import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  Platform,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { SUBSCRIPTION_CONFIG } from '../../services/subscription';
import Button from './Button';

const isWeb = Platform.OS === 'web';

interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectTier?: (tier: 'standard' | 'premium') => void;
}

export default function PaywallModal({ visible, onClose, onSelectTier }: PaywallModalProps) {
  const { colors } = useTheme();
  const { setTier } = useSubscription();
  const [billingMode, setBillingMode] = useState<'monthly' | 'annual'>('monthly');

  const handleChoosePlan = (tier: 'standard' | 'premium') => {
    setTier(tier);
    if (onSelectTier) {
      onSelectTier(tier);
    }
    onClose();
  };

  const getTierPrice = (tierId: 'standard' | 'premium'): number => {
    const tier = SUBSCRIPTION_CONFIG.tiers[tierId];
    return billingMode === 'monthly' ? tier.monthlyPrice : tier.annualPrice / 12;
  };

  const getAnnualSavings = (tierId: 'standard' | 'premium'): string => {
    const tier = SUBSCRIPTION_CONFIG.tiers[tierId];
    if (billingMode === 'annual') {
      const savings = (tier.monthlyPrice * 12 - tier.annualPrice).toFixed(0);
      return `Save $${savings}/yr`;
    }
    return '';
  };

  const renderFeature = (hasFeature: boolean, label: string, highlight?: boolean) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 }}>
      <Text
        style={{
          fontSize: 16,
          color: hasFeature ? (highlight ? '#C4973B' : colors.accent) : colors.textMuted,
          fontWeight: '700',
        }}
      >
        {hasFeature ? '✓' : '−'}
      </Text>
      <Text
        style={{
          fontSize: 13,
          color: hasFeature ? colors.text : colors.textMuted,
          flex: 1,
          fontWeight: highlight ? '600' : '400',
          ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
        }}
      >
        {label}
      </Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
        <View
          style={[
            styles.modal,
            {
              backgroundColor: colors.background,
              borderColor: colors.surfaceBorder,
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text
                style={[
                  styles.title,
                  { color: colors.text },
                  isWeb && styles.webFont,
                ]}
              >
                Unlock Your Matches
              </Text>
              <Text style={{
                fontSize: 13,
                color: colors.textSecondary,
                marginTop: 4,
                ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
              }}>
                Photos come last. Character comes first.
              </Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={{ fontSize: 24, color: colors.textSecondary }}>×</Text>
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Billing Toggle */}
            <View style={styles.billingToggle}>
              <TouchableOpacity
                onPress={() => setBillingMode('monthly')}
                style={[
                  styles.billingOption,
                  {
                    backgroundColor:
                      billingMode === 'monthly' ? colors.accent : colors.surface,
                    borderColor: colors.surfaceBorder,
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '600',
                    color:
                      billingMode === 'monthly' ? '#ffffff' : colors.textSecondary,
                    ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
                  }}
                >
                  Monthly
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setBillingMode('annual')}
                style={[
                  styles.billingOption,
                  {
                    backgroundColor:
                      billingMode === 'annual' ? colors.accent : colors.surface,
                    borderColor: colors.surfaceBorder,
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '600',
                    color:
                      billingMode === 'annual' ? '#ffffff' : colors.textSecondary,
                    ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
                  }}
                >
                  Annual
                </Text>
              </TouchableOpacity>
            </View>

            {/* Annual Savings Badge */}
            {billingMode === 'annual' && (
              <View
                style={[
                  styles.savingsBadge,
                  { backgroundColor: colors.accentSubtle },
                ]}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: colors.accent,
                    ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
                  }}
                >
                  Save up to 23% with annual billing
                </Text>
              </View>
            )}

            {/* Free Tier Info */}
            <View style={[styles.freeInfo, { borderColor: colors.surfaceBorder }]}>
              <Text style={{
                fontSize: 13,
                fontWeight: '600',
                color: colors.text,
                marginBottom: 4,
                ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
              }}>
                Free (Discover)
              </Text>
              <Text style={{
                fontSize: 12,
                color: colors.textMuted,
                lineHeight: 18,
                ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
              }}>
                Onboarding + blurred results • Tiny thumbnail photos • Blue Tick eligible (free, renews every 6 months)
              </Text>
            </View>

            {/* Tier Cards */}
            <View style={styles.tierContainer}>
              {/* Standard Tier */}
              <View
                style={[
                  styles.tierCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.surfaceBorder,
                  },
                ]}
              >
                <View style={{ marginBottom: 12 }}>
                  <Text
                    style={[
                      styles.tierName,
                      { color: colors.text },
                      isWeb && styles.webFont,
                    ]}
                  >
                    Connect
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      color: colors.textMuted,
                      marginTop: 2,
                      letterSpacing: 1,
                      ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
                    }}
                  >
                    STANDARD
                  </Text>
                </View>

                {/* Price */}
                <View style={{ marginBottom: 14 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                    <Text
                      style={[
                        styles.price,
                        { color: colors.accent },
                        isWeb && styles.webFont,
                      ]}
                    >
                      ${getTierPrice('standard').toFixed(2)}
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        color: colors.textSecondary,
                        marginLeft: 4,
                        ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
                      }}
                    >
                      /month
                    </Text>
                  </View>
                  {billingMode === 'annual' && (
                    <Text
                      style={{
                        fontSize: 12,
                        color: colors.accent,
                        fontWeight: '500',
                        marginTop: 4,
                        ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
                      }}
                    >
                      {getAnnualSavings('standard')}
                    </Text>
                  )}
                </View>

                {/* Features */}
                <View style={{ marginBottom: 14 }}>
                  {renderFeature(true, 'Full match profiles and bios')}
                  {renderFeature(true, 'Bigger profile photos')}
                  {renderFeature(true, 'Express interest')}
                  {renderFeature(true, 'Chat on mutual match')}
                  {renderFeature(true, 'Blue Tick verification')}
                  {renderFeature(false, 'Full photo reveal')}
                  {renderFeature(false, 'Gold Tick + Pastor\'s Note')}
                  {renderFeature(false, 'Threshold Selector')}
                  {renderFeature(false, 'Priority Discovery')}
                </View>

                <Button
                  title="Choose Connect"
                  onPress={() => handleChoosePlan('standard')}
                  variant="primary"
                />
              </View>

              {/* Premium Tier */}
              <View
                style={[
                  styles.tierCard,
                  styles.premiumCard,
                  {
                    backgroundColor: colors.accentSubtle,
                    borderColor: colors.accentBorder,
                  },
                ]}
              >
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    backgroundColor: '#C4973B',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderBottomLeftRadius: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '600',
                      color: '#ffffff',
                      letterSpacing: 0.3,
                      ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
                    }}
                  >
                    MOST POPULAR
                  </Text>
                </View>

                <View style={{ marginBottom: 12, marginTop: 20 }}>
                  <Text
                    style={[
                      styles.tierName,
                      { color: colors.text },
                      isWeb && styles.webFont,
                    ]}
                  >
                    Intentional
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      color: colors.textMuted,
                      marginTop: 2,
                      letterSpacing: 1,
                      ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
                    }}
                  >
                    PREMIUM
                  </Text>
                </View>

                {/* Price */}
                <View style={{ marginBottom: 14 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                    <Text
                      style={[
                        styles.price,
                        { color: '#C4973B' },
                        isWeb && styles.webFont,
                      ]}
                    >
                      ${getTierPrice('premium').toFixed(2)}
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        color: colors.textSecondary,
                        marginLeft: 4,
                        ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
                      }}
                    >
                      /month
                    </Text>
                  </View>
                  {billingMode === 'annual' && (
                    <Text
                      style={{
                        fontSize: 12,
                        color: '#C4973B',
                        fontWeight: '500',
                        marginTop: 4,
                        ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
                      }}
                    >
                      {getAnnualSavings('premium')}
                    </Text>
                  )}
                </View>

                {/* Features */}
                <View style={{ marginBottom: 14 }}>
                  {renderFeature(true, 'Everything in Connect')}
                  {renderFeature(true, 'Full photo reveal', true)}
                  {renderFeature(true, 'Gold Tick + Pastor\'s Note (150 chars)', true)}
                  {renderFeature(true, 'Threshold Selector (72%+ or 82%+)')}
                  {renderFeature(true, 'Weekly Interest Digest')}
                  {renderFeature(true, 'Priority Discovery')}
                  {renderFeature(true, 'Extended Compatibility Insights')}
                  {renderFeature(true, 'Curated Filters')}
                  {renderFeature(true, 'Active Status')}
                  {renderFeature(true, 'Monthly Open Door (24hr boost)')}
                </View>

                <Button
                  title="Choose Intentional"
                  onPress={() => handleChoosePlan('premium')}
                  variant="primary"
                />
              </View>
            </View>

            {/* Verification Info */}
            <View style={[styles.verificationInfo, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: colors.text,
                marginBottom: 8,
                ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
              }}>
                Pastoral Verification
              </Text>
              <View style={{ gap: 8 }}>
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
                  <Text style={{ fontSize: 16 }}>{'✓'}</Text>
                  <Text style={{
                    fontSize: 12,
                    color: colors.textSecondary,
                    flex: 1,
                    lineHeight: 18,
                    ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
                  }}>
                    <Text style={{ fontWeight: '600', color: '#6366f1' }}>Blue Tick</Text> — Free for all tiers. Your pastor confirms church membership. Renews every 6 months.
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
                  <Text style={{ fontSize: 16 }}>{'✓'}</Text>
                  <Text style={{
                    fontSize: 12,
                    color: colors.textSecondary,
                    flex: 1,
                    lineHeight: 18,
                    ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
                  }}>
                    <Text style={{ fontWeight: '600', color: '#C4973B' }}>Gold Tick</Text> — Premium only. Includes a 150-character endorsement from your pastor displayed on your profile.
                  </Text>
                </View>
              </View>
            </View>

            {/* Bottom Text */}
            <Text
              style={{
                fontSize: 12,
                color: colors.textMuted,
                textAlign: 'center',
                marginTop: 16,
                ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
              }}
            >
              Cancel anytime. No long-term commitments.
            </Text>
          </ScrollView>

          {/* Dismiss Button */}
          <View style={styles.footer}>
            <Button
              title="Maybe Later"
              onPress={onClose}
              variant="secondary"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  title: {
    fontSize: 24,
    fontWeight: '300',
    letterSpacing: -0.5,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    paddingBottom: 32,
  },
  billingToggle: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  billingOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  savingsBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 20,
  },
  freeInfo: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  tierContainer: {
    gap: 16,
    marginBottom: 20,
  },
  tierCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
  },
  premiumCard: {
    overflow: 'hidden',
  },
  tierName: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  price: {
    fontSize: 32,
    fontWeight: '300',
    letterSpacing: -0.5,
  },
  verificationInfo: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  webFont: {
    fontFamily: 'Inter, sans-serif',
  },
});
