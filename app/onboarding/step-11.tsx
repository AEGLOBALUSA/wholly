import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../context/OnboardingContext';
import StepContainer from '../../components/onboarding/StepContainer';
import QuestionCard from '../../components/onboarding/QuestionCard';
import { LIFE_VISION_QUESTIONS } from '../../data/questions/lifeVision';

export default function Step11() {
  const router = useRouter();
  const { state, dispatch } = useOnboarding();
  const answers = state.answers.lifeVision;

  const handleSelectAnswer = (questionId: string, answer: string) => {
    dispatch({
      type: 'UPDATE_LIFE_VISION',
      payload: { ...answers, [questionId]: answer },
    });
  };

  const handleContinue = () => {
    dispatch({ type: 'SET_COMPLETE', payload: true });
    router.push('/onboarding/results');
  };

  const handleBack = () => {
    router.back();
  };

  const isValid = LIFE_VISION_QUESTIONS.every((q) => answers[q.id]);

  return (
    <StepContainer
      step={11}
      title="Life Vision"
      subtitle="What does your ideal future look like?"
      onContinue={handleContinue}
      onBack={handleBack}
      continueDisabled={!isValid}
      continueText="Complete"
    >
      <View style={{ gap: 24 }}>
        {LIFE_VISION_QUESTIONS.map((question) => (
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
