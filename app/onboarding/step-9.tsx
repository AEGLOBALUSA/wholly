import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../context/OnboardingContext';
import StepContainer from '../../components/onboarding/StepContainer';
import QuestionCard from '../../components/onboarding/QuestionCard';
import { CONFLICT_STYLE_QUESTIONS } from '../../data/questions/conflictStyle';

export default function Step9() {
  const router = useRouter();
  const { state, dispatch } = useOnboarding();
  const answers = state.answers.conflict;

  const handleSelectAnswer = (questionId: string, answer: string) => {
    dispatch({
      type: 'UPDATE_CONFLICT',
      payload: { ...answers, [questionId]: answer },
    });
  };

  const handleContinue = () => {
    router.push('/onboarding/step-10');
  };

  const handleBack = () => {
    router.back();
  };

  const isValid = CONFLICT_STYLE_QUESTIONS.every((q) => answers[q.id]);

  return (
    <StepContainer
      step={9}
      title="Conflict Style"
      subtitle="How do you handle disagreements?"
      onContinue={handleContinue}
      onBack={handleBack}
      continueDisabled={!isValid}
      continueText="Continue"
    >
      <View style={{ gap: 24 }}>
        {CONFLICT_STYLE_QUESTIONS.map((question) => (
          <QuestionCard
            key={question.id}
            question={question.text}
            type="radio"
            options={question.options?.map((opt) => ({
              value: opt.value,
              label: opt.label,
            }))}
            value={answers[question.id] || null}
            onValueChange={(value: any) => handleSelectAnswer(question.id, value)}
          />
        ))}
      </View>
    </StepContainer>
  );
}
