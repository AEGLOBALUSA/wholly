import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Share,
  Alert,
  Clipboard,
} from 'react-native';
import * as Crypto from 'expo-crypto';
import { useTheme } from '../../context/ThemeContext';
import { useSubscription } from '../../context/SubscriptionContext';
import {
  VerificationRecord,
  VERIFIER_ROLES,
  VerifierRoleInfo,
} from '../../data/verification';

const isWeb = Platform.OS === 'web';

interface RequestVerificationProps {
  userName: string;
  userChurch: string;
  existingVerification?: VerificationRecord | null;
  isPremium?: boolean;
  onVerificationRequested?: (token: string, link: string) => void;
}

const RequestVerification: React.FC<RequestVerificationProps> = ({
  userName,
  userChurch,
  existingVerification,
  isPremium = false,
  onVerificationRequested,
}) => {
  const { colors } = useTheme();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);

  /**
   * Generate a unique token and create shareable link
   */
  const handleGenerateLink = async () => {
    setIsGenerating(true);
    try {
      // Generate UUID token
      const token = await Crypto.randomUUID();

      // Create shareable link
      const link = `https://whollydate.com/verify.html?name=${encodeURIComponent(
        userName
      )}&church=${encodeURIComponent(userChurch)}&premium=${
        isPremium ? '1' : '0'
      }&token=${token}`;

      setGeneratedToken(token);
      setGeneratedLink(link);

      // Notify parent component
      if (onVerificationRequested) {
        onVerificationRequested(token, link);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to generate verification link');
      console.error('Token generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Copy link to clipboard
   */
  const handleCopyLink = async () => {
    if (generatedLink) {
      try {
        await Clipboard.setString(generatedLink);
        Alert.alert('Copied', 'Verification link copied to clipboard');
      } catch (error) {
        Alert.alert('Error', 'Failed to copy link');
      }
    }
  };

  /**
   * Open native share sheet
   */
  const handleShareLink = async () => {
    if (generatedLink) {
      try {
        await Share.share({
          message: `I'm using WHOLLY to find meaningful relationships. Verify me on the app: ${generatedLink}`,
          url: generatedLink, // iOS specific
          title: 'Verify on WHOLLY',
        });
      } catch (error) {
        Alert.alert('Error', 'Failed to share link');
      }
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.contentPadding}>
        {/* Header section */}
        <View style={styles.headerSection}>
          <Text style={[styles.heading, { color: colors.text }]}>
            Get Verified
          </Text>
          <Text
            style={[styles.description, { color: colors.textSecondary }]}
          >
            A pastoral verification tick shows that a church leader has personally vouched for you. This helps you build trust with matches who are looking for intentional relationships.
          </Text>
        </View>

        {/* Existing verification status */}
        {existingVerification && existingVerification.status === 'completed' && (
          <View
            style={[
              styles.statusCard,
              {
                backgroundColor: colors.accentSubtle,
                borderColor: colors.accentBorder,
              },
            ]}
          >
            <Text style={[styles.statusTitle, { color: colors.accent }]}>
              ✓ You're Verified
            </Text>
            <Text
              style={[styles.statusText, { color: colors.textSecondary }]}
            >
              Verified by {existingVerification.verifier_name}
            </Text>
            {existingVerification.expires_at && (
              <Text
                style={[styles.expiryText, { color: colors.textMuted }]}
              >
                Expires {formatDate(existingVerification.expires_at)}
              </Text>
            )}
          </View>
        )}

        {existingVerification && existingVerification.status === 'pending' && (
          <View
            style={[
              styles.statusCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.surfaceBorder,
              },
            ]}
          >
            <Text style={[styles.statusTitle, { color: colors.text }]}>
              ⏳ Verification Pending
            </Text>
            <Text
              style={[styles.statusText, { color: colors.textSecondary }]}
            >
              Waiting for pastoral response. Share the link below with your church leader.
            </Text>
          </View>
        )}

        {/* Verifier tiers section */}
        <View style={styles.tiersSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Verification Levels
          </Text>
          <Text
            style={[
              styles.tierDescription,
              { color: colors.textSecondary },
            ]}
          >
            Each level of verifier can speak to different strengths:
          </Text>

          {VERIFIER_ROLES.map((role, index) => (
            <TierCard
              key={role.id}
              role={role}
              weight={role.weight}
              colors={colors}
              isHighest={role.weight === 5}
            />
          ))}
        </View>

        {/* Link generation section */}
        {!existingVerification || existingVerification.status !== 'completed' ? (
          <View style={styles.linkSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Share Your Link
            </Text>
            <Text
              style={[
                styles.linkDescription,
                { color: colors.textSecondary },
              ]}
            >
              Generate a unique link to send to your church leader. They'll use it to verify you on the app.
            </Text>

            {!generatedLink ? (
              <TouchableOpacity
                style={[
                  styles.generateButton,
                  { backgroundColor: colors.accent },
                  isGenerating && styles.buttonDisabled,
                ]}
                onPress={handleGenerateLink}
                disabled={isGenerating}
                activeOpacity={0.8}
              >
                <Text style={styles.generateButtonText}>
                  {isGenerating
                    ? 'Generating...'
                    : 'Generate Verification Link'}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.linkGenerated}>
                <View
                  style={[
                    styles.linkBox,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.surfaceBorder,
                    },
                  ]}
                >
                  <Text
                    style={[styles.linkText, { color: colors.textSecondary }]}
                    numberOfLines={3}
                  >
                    {generatedLink}
                  </Text>
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.surfaceBorder,
                      },
                    ]}
                    onPress={handleCopyLink}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.actionButtonText,
                        { color: colors.accent },
                      ]}
                    >
                      Copy Link
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      { backgroundColor: colors.accent },
                    ]}
                    onPress={handleShareLink}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.shareButtonText}>
                      Share via App
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text
                  style={[
                    styles.linkNote,
                    { color: colors.textMuted },
                  ]}
                >
                  Share this link directly with your church leader or pastor. The link expires in 30 days.
                </Text>
              </View>
            )}
          </View>
        ) : null}

        {/* Premium note */}
        {isPremium && (
          <View
            style={[
              styles.premiumCard,
              {
                backgroundColor: colors.accentSubtle,
                borderColor: colors.accentBorder,
              },
            ]}
          >
            <Text style={[styles.premiumLabel, { color: colors.accent }]}>
              ✨ Premium Feature
            </Text>
            <Text
              style={[styles.premiumText, { color: colors.textSecondary }]}
            >
              Your verifier can add a personal 150-character note about you, visible only to matches who view your profile.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

/**
 * Individual tier card component
 */
interface TierCardProps {
  role: VerifierRoleInfo;
  weight: number;
  colors: any;
  isHighest?: boolean;
}

const TierCard: React.FC<TierCardProps> = ({
  role,
  weight,
  colors,
  isHighest,
}) => {
  const getTierColor = (w: number) => {
    if (w === 1) return 'rgba(59, 130, 246, 0.1)'; // Blue
    if (w === 2) return 'rgba(139, 92, 246, 0.1)'; // Purple
    if (w === 3) return 'rgba(236, 72, 153, 0.1)'; // Pink
    if (w === 4) return 'rgba(249, 115, 22, 0.1)'; // Orange
    return 'rgba(220, 38, 38, 0.1)'; // Red (highest)
  };

  const getTierBorderColor = (w: number) => {
    if (w === 1) return 'rgba(59, 130, 246, 0.3)';
    if (w === 2) return 'rgba(139, 92, 246, 0.3)';
    if (w === 3) return 'rgba(236, 72, 153, 0.3)';
    if (w === 4) return 'rgba(249, 115, 22, 0.3)';
    return 'rgba(220, 38, 38, 0.3)';
  };

  const getTierLabel = (w: number) => {
    if (w === 1) return 'TIER 1';
    if (w === 2) return 'TIER 2';
    if (w === 3) return 'TIER 3';
    if (w === 4) return 'TIER 4';
    return 'TIER 5 — HIGHEST';
  };

  return (
    <View
      style={[
        styles.tierCard,
        {
          backgroundColor: getTierColor(weight),
          borderColor: getTierBorderColor(weight),
        },
      ]}
    >
      <View style={styles.tierHeader}>
        <Text style={[styles.tierLabel, { color: colors.accent }]}>
          {getTierLabel(weight)}
        </Text>
        {isHighest && (
          <Text style={[styles.tierBadge, { color: colors.accent }]}>
            ★
          </Text>
        )}
      </View>
      <Text style={[styles.tierName, { color: colors.text }]}>
        {role.label}
      </Text>
      <Text
        style={[styles.tierExplanation, { color: colors.textSecondary }]}
      >
        {role.description}
      </Text>
    </View>
  );
};

/**
 * Format ISO date string to readable format
 */
function formatDate(dateString: string | null): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentPadding: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 24,
  },

  // Header
  headerSection: {
    gap: 12,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },

  // Status card
  statusCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  statusText: {
    fontSize: 13,
    lineHeight: 18,
  },
  expiryText: {
    fontSize: 12,
    marginTop: 4,
  },

  // Tiers section
  tiersSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  tierDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  tierCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 8,
  },
  tierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tierLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  tierBadge: {
    fontSize: 14,
  },
  tierName: {
    fontSize: 13,
    fontWeight: '600',
  },
  tierExplanation: {
    fontSize: 12,
    lineHeight: 16,
  },

  // Link section
  linkSection: {
    gap: 12,
  },
  linkDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  generateButton: {
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  generateButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },

  // Generated link section
  linkGenerated: {
    gap: 12,
  },
  linkBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  linkText: {
    fontSize: 11,
    lineHeight: 14,
    fontFamily: isWeb ? 'monospace' : 'Courier New',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  shareButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  linkNote: {
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
  },

  // Premium card
  premiumCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 8,
  },
  premiumLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  premiumText: {
    fontSize: 12,
    lineHeight: 16,
  },
});

export default RequestVerification;
