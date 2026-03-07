import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { COLORS, FONTS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../styles/tokens';
import { DemoProfile } from '../../types';
import Card from '../ui/Card';
import TierBadge from './TierBadge';
import ScoreBar from './ScoreBar';
import VerifiedBadge from '../ui/VerifiedBadge';

interface MatchCardProps {
  profile: DemoProfile;
  style?: StyleProp<ViewStyle>;
}

const MatchCard: React.FC<MatchCardProps> = ({ profile, style }) => {
  const cardStyle = StyleSheet.flatten([styles.card, style]);
  return (
    <Card style={cardStyle} bordered>
      <View style={styles.topRow}>
        <View style={styles.nameBlock}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>
              {profile.name}, {profile.age}
            </Text>
            {profile.pastoralVerified && (
              <VerifiedBadge
                department={profile.pastoralDepartment}
                size="sm"
              />
            )}
          </View>
          <Text style={styles.location}>{profile.city}</Text>
        </View>
        <TierBadge tier={profile.tier} score={profile.overallScore} />
      </View>

      <View style={styles.tag}>
        <Text style={styles.tagText}>{profile.denomination}</Text>
      </View>

      <Text style={styles.bio}>{profile.bio}</Text>

      <View style={styles.scoreSection}>
        <View style={styles.overallRow}>
          <Text style={styles.overallLabel}>Compatibility</Text>
          <Text style={styles.overallScore}>{profile.overallScore}%</Text>
        </View>

        <View style={styles.bars}>
          <ScoreBar label="Values" score={profile.scores.spiritual} />
          <ScoreBar label="Emotional" score={profile.scores.emotional} />
          <ScoreBar label="Intellectual" score={profile.scores.intellectual} />
          <ScoreBar label="Life Vision" score={profile.scores.lifeVision} />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  nameBlock: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontFamily: FONTS.heading,
    fontSize: FONT_SIZES.xl,
    color: COLORS.text,
    marginBottom: 2,
  },
  location: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
  },
  tag: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BORDER_RADIUS.full,
    alignSelf: 'flex-start',
    marginBottom: SPACING.md,
  },
  tagText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  bio: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 21,
    marginBottom: SPACING.lg,
  },
  scoreSection: {
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  overallRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: SPACING.md,
  },
  overallLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  overallScore: {
    fontFamily: FONTS.heading,
    fontSize: FONT_SIZES.xxl,
    color: COLORS.primary,
  },
  bars: {
    gap: 14,
  },
});

export default MatchCard;
