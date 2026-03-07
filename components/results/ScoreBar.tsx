import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { COLORS, FONTS, SPACING, FONT_SIZES } from '../../styles/tokens';

interface ScoreBarProps {
  label: string;
  score: number;
  weight?: string;
  style?: ViewStyle;
}

const ScoreBar: React.FC<ScoreBarProps> = ({
  label,
  score,
  weight,
  style,
}) => {
  const getBarColor = (): string => {
    if (score >= 80) return COLORS.green;
    if (score >= 60) return COLORS.gold;
    return COLORS.textMuted;
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.score}>{score}%</Text>
      </View>
      <View style={styles.barContainer}>
        <View
          style={[
            styles.barFill,
            {
              width: `${score}%`,
              backgroundColor: getBarColor(),
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 5,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  score: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
  },
  barContainer: {
    height: 6,
    backgroundColor: COLORS.secondary,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
});

export default ScoreBar;
