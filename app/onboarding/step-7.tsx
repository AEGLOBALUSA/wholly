import { View, Text, Platform, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../context/OnboardingContext';
import { useTheme } from '../../context/ThemeContext';
import StepContainer from '../../components/onboarding/StepContainer';
import Input from '../../components/ui/Input';
import { SHORT_ANSWER_QUESTIONS } from '../../data/questions/shortAnswers';

const MIN_CHARS = 20;
const MAX_CHARS = 500;
const isWeb = Platform.OS === 'web';

export default function Step7() {
  const router = useRouter();
  const { state, dispatch } = useOnboarding();
  const { colors } = useTheme();
  const answers = state.answers.shortAnswers;

  const handleChange = (questionId: string, text: string) => {
    dispatch({
      type: 'UPDATE_SHORT_ANSWERS',
      payload: { ...answers, [questionId]: text },
    });
  };

  const handleContinue = () => {
    router.push('/onboarding/step-8');
  };

  const handleBack = () => {
    router.back();
  };

  const isValid = SHORT_ANSWER_QUESTIONS.every(
    (q) => (answers[q.id] || '').length >= MIN_CHARS
  );

  return (
    <StepContainer
      step={7}
      title="In Your Words"
      subtitle="Share your personal reflections"
      onContinue={handleContinue}
      onBack={handleBack}
      continueDisabled={!isValid}
      continueText="Continue"
    >
      <View style={{ gap: 28 }}>
        {SHORT_ANSWER_QUESTIONS.map((question) => {
          const charCount = (answers[question.id] || '').length;
          const remaining = MIN_CHARS - charCount;
          return (
            <View key={question.id}>
              <Input
                label={question.text}
                value={answers[question.id] || ''}
                onChangeText={(text: string) => handleChange(question.id, text)}
                placeholder="Share your thoughts..."
                multiline={true}
                numberOfLines={4}
                maxLength={MAX_CHARS}
                style={{ minHeight: 100, textAlignVertical: 'top' }}
              />
              <Text style={[styles.charCount, { color: colors.textMuted }, isWeb && styles.webFont]}>
                {remaining > 0
                  ? `${remaining} more character${remaining !== 1 ? 's' : ''} needed`
                  : `${charCount}/${MAX_CHARS}`}
              </Text>
            </View>
          );
        })}
      </View>
    </StepContainer>
  );
}

const styles = StyleSheet.create({
  charCount: {
    fontSize: 12,
    marginTop: 6,
    textAlign: 'right',
  },
  webFont: {
    fontFamily: 'Inter, sans-serif',
  },
});
