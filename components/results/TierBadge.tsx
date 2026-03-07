import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { MatchTier } from '../../types';
import { COLORS, FONTS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../styles/tokens';

interface TierBadgeProps {
  tier: MatchTier;
  score: number;
  style?: ViewStyle;
}

const TierBadge: React.FC<TierBadgeProps> = ({ tier, score, style }) => {
  const getTierColor = (): string => {
    switch (tier) {
      case 'exceptional':
        return COLORS.green;
      case 'strong':
        return COLORS.gold;
      case 'compatible':
        return COLORS.textMuted;
      case 'below':
      default:
        return COLORS.textMuted;
    }
  };

  const getTierLabel = (): string => {
    switch (tier) {
      case 'exceptional':
        return 'Exceptional';
      case 'strong':
        return 'Strong';
      case 'compatible':
        return 'Compatible';
      case 'below':
      default:
        return 'Below Average';
    }
  };

  const tierColor = getTierColor();

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: tierColor + '18', borderColor: tierColor + '40' },
        style,
      ]}
    >
      <Text style={[styles.label, { color: tierColor }]}>{getTierLabel()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: FONT_SIZES.xs,
    letterSpacing: 0.3,
  },
});

export default TierBadge;
