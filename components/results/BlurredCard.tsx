import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import PaywallModal from '../ui/PaywallModal';
import Button from '../ui/Button';

const isWeb = Platform.OS === 'web';

interface BlurredCardProps {
  profileId: string;
  name: string;
  age: number;
  city: string;
  tier: 'exceptional' | 'strong' | 'compatible' | 'below';
  overallScore: number;
  photoUrl: string;
  denomination: string;
  bio: string;
}

function getTierColor(tier: string): string {
  switch (tier) {
    case 'exceptional': return '#4CAF7D';
    case 'strong': return '#D4A853';
    case 'compatible': return '#9CA3AF';
    case 'below': return '#E25050';
    default: return '#9CA3AF';
  }
}

function getTierLabel(tier: string): string {
  switch (tier) {
    case 'exceptional': return 'Exceptional';
    case 'strong': return 'Strong';
    case 'compatible': return 'Compatible';
    case 'below': return 'Below Average';
    default: return tier;
  }
}

export default function BlurredCard({ profileId, name, age, city, tier, overallScore, photoUrl, denomination, bio }: BlurredCardProps) {
  const { colors } = useTheme();
  const [paywallVisible, setPaywallVisible] = useState(false);
  const tierColor = getTierColor(tier);

  return (
    <>
      <Pressable
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.surfaceBorder,
          },
        ]}
      >
        {/* Avatar + Name Row */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 16, marginBottom: 14 }}>
          {/* Tiny thumbnail photo for free tier */}
          <View style={{ alignItems: 'center', gap: 6 }}>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: colors.surfaceBorder,
                borderWidth: 2,
                borderColor: 'rgba(255,255,255,0.06)',
                overflow: 'hidden',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {/* Small thumbnail in center of circle */}
              <View style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                overflow: 'hidden',
                opacity: 0.8,
              }}>
                <Image
                  source={{ uri: photoUrl }}
                  style={{ width: 28, height: 28 }}
                />
              </View>
            </View>
          </View>

          {/* Name + Location + Tier */}
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: colors.text,
                    marginBottom: 2,
                    ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
                  }}
                >
                  {name}, {age}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: colors.textMuted,
                    ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
                  }}
                >
                  {city}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: tierColor + '18',
                  borderColor: tierColor + '40',
                  borderWidth: 1,
                  borderRadius: 9999,
                  paddingHorizontal: 12,
                  paddingVertical: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '600',
                    color: tierColor,
                    letterSpacing: 0.3,
                    ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
                  }}
                >
                  {getTierLabel(tier)}
                </Text>
              </View>
            </View>

            {/* Denomination tag */}
            <View
              style={{
                backgroundColor: 'rgba(255,255,255,0.04)',
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 9999,
                alignSelf: 'flex-start',
                marginTop: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '500',
                  color: colors.textSecondary,
                  ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
                }}
              >
                {denomination}
              </Text>
            </View>
          </View>
        </View>

        {/* Bio (Hidden) */}
        <Text
          style={{
            fontSize: 14,
            lineHeight: 22,
            color: colors.textMuted,
            marginBottom: 16,
            opacity: 0.5,
            fontStyle: 'italic',
            ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
          }}
        >
          Bio hidden — upgrade to see full profiles
        </Text>

        {/* Score (Shown but no breakdown) */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            paddingTop: 12,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: 'rgba(255,255,255,0.06)',
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: '500',
              color: colors.textSecondary,
              ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
            }}
          >
            Compatibility
          </Text>
          <Text
            style={{
              fontSize: 24,
              fontWeight: '300',
              color: colors.accent,
              letterSpacing: -0.5,
              ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
            }}
          >
            {overallScore}%
          </Text>
        </View>

        {/* Photo upgrade badge */}
        <View style={{
          backgroundColor: colors.accentSubtle || 'rgba(99,102,241,0.1)',
          borderRadius: 8,
          padding: 10,
          marginBottom: 14,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}>
          <Text style={{ fontSize: 14 }}>{'📷'}</Text>
          <Text style={{
            fontSize: 12,
            color: colors.textSecondary,
            flex: 1,
            ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
          }}>
            Upgrade for bigger photos and full profiles. Premium unlocks the full photo reveal.
          </Text>
        </View>

        {/* Upgrade Button */}
        <Button
          title="Unlock full profile"
          onPress={() => setPaywallVisible(true)}
          variant="primary"
        />

        <Text
          style={{
            fontSize: 11,
            color: colors.textMuted,
            marginTop: 8,
            textAlign: 'center',
            ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
          }}
        >
          Connect from $14.99/mo • Intentional from $22.99/mo
        </Text>
      </Pressable>

      <PaywallModal
        visible={paywallVisible}
        onClose={() => setPaywallVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
