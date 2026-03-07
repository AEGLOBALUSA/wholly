import { View, Text, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../context/OnboardingContext';
import { useTheme } from '../../context/ThemeContext';
import StepContainer from '../../components/onboarding/StepContainer';
import JargonGrid from '../../components/onboarding/JargonGrid';
import { JARGON_TERMS, JARGON_DESCRIPTION } from '../../data/questions/jargon';

const isWeb = Platform.OS === 'web';

export default function Step3() {
  const router = useRouter();
  const { state, dispatch } = useOnboarding();
  const { colors } = useTheme();
  const selected = state.answers.jargon;

  const jargonItems = JARGON_TERMS.map((term) => ({
    id: term.id,
    label: term.term,
  }));

  // Calculate score
  const authenticSelected = selected.filter((id) => {
    const term = JARGON_TERMS.find((t) => t.id === id);
    return term?.isAuthentic;
  }).length;
  const decoySelected = selected.filter((id) => {
    const term = JARGON_TERMS.find((t) => t.id === id);
    return term && !term.isAuthentic;
  }).length;
  const totalAuthentic = JARGON_TERMS.filter((t) => t.isAuthentic).length;
  const familiarityScore = Math.max(0, Math.round(((authenticSelected - decoySelected) / totalAuthentic) * 100));

  const handleToggle = (id: string) => {
    const updated = selected.includes(id)
      ? selected.filter((item) => item !== id)
      : [...selected, id];
    dispatch({ type: 'UPDATE_JARGON', payload: updated });
  };

  const handleContinue = () => {
    router.push('/onboarding/step-4');
  };

  const handleBack = () => {
    router.back();
  };

  const isValid = selected.length > 0;

  return (
    <StepContainer
      step={3}
      title="Spirit Check"
      subtitle="Which spiritual experiences resonate with you?"
      onContinue={handleContinue}
      onBack={handleBack}
      continueDisabled={!isValid}
      continueText="Continue"
    >
      <View style={{ gap: 20 }}>
        <Text style={{
          fontSize: 13,
          lineHeight: 20,
          color: colors.textSecondary,
          ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
        }}>
          {JARGON_DESCRIPTION}
        </Text>

        <View style={{
          backgroundColor: colors.surface,
          borderRadius: 12,
          padding: 16,
          borderWidth: 1,
          borderColor: colors.surfaceBorder,
        }}>
          <Text style={{
            fontSize: 12,
            fontWeight: '500',
            color: colors.accent,
            letterSpacing: 0.5,
            marginBottom: 6,
            textTransform: 'uppercase',
            ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
          }}>
            Answer Honestly
          </Text>
          <Text style={{
            fontSize: 13,
            lineHeight: 19,
            color: colors.textMuted,
            ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
          }}>
            Your responses here generate a Community Familiarity score that is displayed on your profile for potential matches to see. Selecting terms you're not genuinely familiar with will lower your score — so be honest, and let your real experience speak for itself.
          </Text>
        </View>

        <JargonGrid
          items={jargonItems}
          selectedIds={selected}
          onToggle={handleToggle}
        />
      </View>
    </StepContainer>
  );
}
