import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../context/OnboardingContext';
import { useTheme } from '../context/ThemeContext';
import { analytics } from '../context/AnalyticsContext';
import ThemeToggle from '../components/ui/ThemeToggle';
import { COVENANT_STATEMENTS, MARRIAGE_OPTIONS } from '../data/covenant';

const isWeb = Platform.OS === 'web';

export default function CovenantScreen() {
  const router = useRouter();
  const { dispatch, state } = useOnboarding();
  const { colors } = useTheme();
  const [checkedItems, setCheckedItems] = useState<Set<string>>(
    new Set(state.answers.covenant),
  );
  const [marriageChoice, setMarriageChoice] = useState<string | null>(null);

  const allItemsChecked = checkedItems.size === COVENANT_STATEMENTS.length && marriageChoice !== null;
  const totalRequired = COVENANT_STATEMENTS.length + 1; // +1 for marriage choice
  const totalDone = checkedItems.size + (marriageChoice ? 1 : 0);

  const toggleItem = (id: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);
  };

  const handleAccept = () => {
    const checkedArray = [...Array.from(checkedItems), marriageChoice!];
    dispatch({ type: 'SET_COVENANT', payload: checkedArray });
    // Track covenant acceptance
    analytics.covenantComplete();
    router.push('/onboarding/step-1');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Back Header */}
      <View style={[styles.backHeader, { borderBottomColor: colors.surfaceBorder }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={[styles.backArrow, { color: colors.textSecondary }]}>←</Text>
          <Text style={[styles.backLabel, { color: colors.text }]}>WHOLLY</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Kicker */}
        <Text style={[styles.kicker, { color: colors.accent }]}>THE COVENANT</Text>

        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Before we begin,{'\n'}a promise.</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            WHOLLY is built on mutual respect and shared intention. By joining, you commit to these values that honor every member of our community.
          </Text>
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: colors.surfaceBorder }]} />

        {/* Marriage Intent — Pick One */}
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>MY INTENTION</Text>
        <View style={styles.itemsContainer}>
          {MARRIAGE_OPTIONS.map((option) => {
            const isSelected = marriageChoice === option.id;
            return (
              <Pressable
                key={option.id}
                onPress={() => setMarriageChoice(option.id)}
                style={({ pressed }) => [
                  styles.itemWrapper,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.surfaceBorder,
                  },
                  isSelected && {
                    backgroundColor: colors.accentSubtle,
                    borderColor: colors.accentBorder,
                  },
                  pressed && !isSelected && { backgroundColor: 'rgba(255,255,255,0.03)' },
                ]}
              >
                <View style={[styles.radio, { borderColor: colors.textMuted }, isSelected && { borderColor: colors.accent }]}>
                  {isSelected && <View style={[styles.radioDot, { backgroundColor: colors.accent }]} />}
                </View>
                <Text style={[styles.itemText, { color: colors.textSecondary }, isSelected && { color: colors.text }]}>
                  {option.text}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Standard Covenant — Check All */}
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>MY COMMITMENT</Text>
        <View style={styles.itemsContainer}>
          {COVENANT_STATEMENTS.map((statement) => {
            const isChecked = checkedItems.has(statement.id);
            return (
              <Pressable
                key={statement.id}
                onPress={() => toggleItem(statement.id)}
                style={({ pressed }) => [
                  styles.itemWrapper,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.surfaceBorder,
                  },
                  isChecked && {
                    backgroundColor: colors.accentSubtle,
                    borderColor: colors.accentBorder,
                  },
                  pressed && !isChecked && { backgroundColor: 'rgba(255,255,255,0.03)' },
                ]}
              >
                <View style={[
                  styles.checkbox,
                  { borderColor: colors.textMuted },
                  isChecked && {
                    backgroundColor: colors.accent,
                    borderColor: colors.accent,
                  }
                ]}>
                  {isChecked && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={[styles.itemText, { color: colors.textSecondary }, isChecked && { color: colors.text }]}>
                  {statement.text}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Progress indicator */}
        <Text style={[styles.progressText, { color: colors.textMuted }]}>
          {totalDone} of {totalRequired} acknowledged
        </Text>

        {/* Action Button */}
        <Pressable
          onPress={handleAccept}
          disabled={!allItemsChecked}
          style={({ pressed }) => [
            styles.ctaButton,
            { backgroundColor: allItemsChecked ? colors.accent : 'rgba(255,255,255,0.05)' },
            pressed && allItemsChecked && styles.ctaPressed,
          ]}
        >
          <Text style={[styles.ctaLabel, { color: allItemsChecked ? '#ffffff' : colors.textMuted }]}>
            I Accept This Covenant
          </Text>
          <Text style={[styles.ctaArrow, { color: allItemsChecked ? '#ffffff' : colors.textMuted }]}>→</Text>
        </Pressable>

        {/* Help Text */}
        {!allItemsChecked && (
          <Text style={[styles.helpText, { color: colors.textMuted }]}>
            {!marriageChoice
              ? 'Select your intention above, then acknowledge all commitments'
              : 'Please acknowledge all statements to continue'}
          </Text>
        )}

        {/* Bottom spacer */}
        <View style={{ height: 60 }} />
      </ScrollView>
      <ThemeToggle />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backHeader: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    ...(isWeb ? { cursor: 'pointer' } : {}),
  },
  backArrow: {
    fontSize: 18,
  },
  backLabel: {
    fontSize: 13,
    letterSpacing: 4,
    fontWeight: '400',
    fontFamily: isWeb ? 'Playfair Display, serif' : 'PlayfairDisplay',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  kicker: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 3,
    marginBottom: 24,
    fontFamily: isWeb ? 'Inter, sans-serif' : undefined,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: '300',
    lineHeight: 44,
    letterSpacing: -0.5,
    marginBottom: 16,
    fontFamily: isWeb ? 'Inter, sans-serif' : undefined,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 26,
    fontFamily: isWeb ? 'Inter, sans-serif' : undefined,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: 14,
    fontFamily: isWeb ? 'Inter, sans-serif' : undefined,
  },
  itemsContainer: {
    gap: 12,
    marginBottom: 32,
  },
  itemWrapper: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    alignItems: 'flex-start',
    gap: 16,
    ...(isWeb ? { cursor: 'pointer', transition: 'all 0.2s ease' } as any : {}),
  },
  // Radio button (for pick-one)
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginTop: 1,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  // Checkbox (for check-all)
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginTop: 1,
  },
  checkmark: {
    fontWeight: '700',
    fontSize: 12,
    color: '#ffffff',
  },
  itemText: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 23,
    flex: 1,
    fontFamily: isWeb ? 'Inter, sans-serif' : undefined,
  },
  progressText: {
    fontSize: 12,
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: isWeb ? 'Inter, sans-serif' : undefined,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 9999,
    width: '100%',
    ...(isWeb ? {
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    } as any : {}),
  },
  ctaPressed: {
    opacity: 0.9,
    ...(isWeb ? { transform: [{ scale: 0.98 }] } : {}),
  },
  ctaLabel: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontFamily: isWeb ? 'Inter, sans-serif' : undefined,
  },
  ctaArrow: {
    fontSize: 15,
  },
  helpText: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 16,
    fontFamily: isWeb ? 'Inter, sans-serif' : undefined,
  },
});
