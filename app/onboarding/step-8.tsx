import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../context/OnboardingContext';
import StepContainer from '../../components/onboarding/StepContainer';
import QuestionCard from '../../components/onboarding/QuestionCard';
import { EMOTIONAL_HEALTH_QUESTIONS } from '../../data/questions/emotionalHealth';

export default function Step8() {
  const router = useRouter();
  const { state, dispatch } = useOnboarding();
  const answers = state.answers.emotional;

  const handleSelectAnswer = (questionId: string, answer: string) => {
    dispatch({
      type: 'UPDATE_EMOTIONAL',
      payload: { ...answers, [questionId]: answer },
    });
  };

  const handleContinue = () => {
    router.push('/onboarding/step-9');
  };

  const handleBack = () => {
    router.back();
  };

  const isValid = EMOTIONAL_HEALTH_QUESTIONS.every((q) => answers[q.id]);

  return (
    <StepContainer
      step={8}
      title="Emotional Health"
      subtitle="Understand your attachment style"
      onContinue={handleContinue}
      onBack={handleBack}
      continueDisabled={!isValid}
      continueText="Continue"
    >
      <View style={{ gap: 24 }}>
        {EMOTIONAL_HEALTH_QUESTIONS.map((question) => (
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
