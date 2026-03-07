import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  StyleSheet,
} from 'react-native';
import ProgressBar from '../ui/ProgressBar';
import ThemeToggle from '../ui/ThemeToggle';
import { useTheme } from '../../context/ThemeContext';
import { analytics } from '../../context/AnalyticsContext';

interface StepContainerProps {
  step: number;
  totalSteps?: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onContinue: () => void;
  onBack?: () => void;
  continueDisabled?: boolean;
  continueText?: string;
}

const StepContainer: React.FC<StepContainerProps> = ({
  step,
  totalSteps = 11,
  title,
  subtitle,
  children,
  onContinue,
  onBack,
  continueDisabled = false,
  continueText = 'Continue',
}) => {
  const isWeb = Platform.OS === 'web';
  const { colors } = useTheme();

  const handleContinue = useCallback(() => {
    // Track step completion
    analytics.onboardingStepComplete(step);
    onContinue();
  }, [step, onContinue]);

  const dynamicStyles = {
    safeArea: { backgroundColor: colors.background },
    container: { backgroundColor: colors.background },
    title: { color: colors.text },
    subtitle: { color: colors.textSecondary },
    footer: {
      backgroundColor: colors.background,
      borderTopColor: colors.footerBorder,
    },
    backText: { color: colors.textMuted },
    continueButton: { backgroundColor: colors.accent },
  };

  return (
    <SafeAreaView style={[styles.safeArea, dynamicStyles.safeArea]}>
      <View style={[styles.container, dynamicStyles.container]}>
        <View style={styles.progressBarContainer}>
          <ProgressBar current={step} total={totalSteps} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.titleContainer}>
            <Text style={[styles.titleText, dynamicStyles.title, isWeb && styles.webFont]}>{title}</Text>
            {subtitle && <Text style={[styles.subtitleText, dynamicStyles.subtitle, isWeb && styles.webFont]}>{subtitle}</Text>}
          </View>
          <View style={styles.childrenContainer}>{children}</View>
        </ScrollView>

        <View style={[styles.footer, dynamicStyles.footer]}>
          <View style={styles.footerContent}>
            {onBack ? (
              <TouchableOpacity style={styles.backButton} onPress={onBack}>
                <Text style={[styles.backButtonText, dynamicStyles.backText, isWeb && styles.webFont]}>Back</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.backButton} />
            )}
            <TouchableOpacity
              style={[styles.continueBtn, dynamicStyles.continueButton, continueDisabled && styles.continueBtnDisabled]}
              onPress={handleContinue}
              disabled={continueDisabled}
              activeOpacity={0.8}
            >
              <Text style={[styles.continueBtnText, isWeb && styles.webFont]}>{continueText}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ThemeToggle />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    maxWidth: 640,
    width: '100%',
    alignSelf: 'center',
  },
  progressBarContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  titleContainer: {
    marginTop: 24,
    marginBottom: 32,
  },
  titleText: {
    fontSize: 32,
    fontWeight: '300',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitleText: {
    fontSize: 16,
    lineHeight: 24,
  },
  webFont: {
    fontFamily: 'Inter, sans-serif',
  },
  childrenContainer: {
    gap: 16,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 24,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: 14,
  },
  continueBtn: {
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 999,
    alignItems: 'center',
  },
  continueBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  continueBtnDisabled: {
    opacity: 0.3,
  },
});

export default StepContainer;
