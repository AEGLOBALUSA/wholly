import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../context/OnboardingContext';
import StepContainer from '../../components/onboarding/StepContainer';
import QuestionCard from '../../components/onboarding/QuestionCard';
import CheckboxList from '../../components/onboarding/CheckboxList';
import { INTELLECTUAL_QUESTIONS } from '../../data/questions/intellectual';
import { useTheme } from '../../context/ThemeContext';

export default function Step10() {
  const router = useRouter();
  const { state, dispatch } = useOnboarding();
  const { colors } = useTheme();
  const answers = state.answers.intellectual;

  const handleSelectAnswer = (questionId: string, answer: string | string[]) => {
    dispatch({
      type: 'UPDATE_INTELLECTUAL',
      payload: { ...answers, [questionId]: answer },
    });
  };

  const handleContinue = () => {
    router.push('/onboarding/step-11');
  };

  const handleBack = () => {
    router.back();
  };

  const isValid = INTELLECTUAL_QUESTIONS.every((q) => answers[q.id]);

  return (
    <StepContainer
      step={10}
      title="How You Think"
      subtitle="Explore your intellectual preferences"
      onContinue={handleContinue}
      onBack={handleBack}
      continueDisabled={!isValid}
      continueText="Continue"
    >
      <View style={{ gap: 24 }}>
        {INTELLECTUAL_QUESTIONS.map((question) => {
          if (question.type === 'single-choice') {
            return (
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
            );
          } else {
            const selectedValues = (answers[question.id] as unknown as string[]) || [];
            return (
              <QuestionCard
                key={question.id}
                question={question.text}
                type="multiple-choice"
                options={question.options?.map((opt) => ({
                  value: opt.value,
                  label: opt.label,
                }))}
                value={selectedValues}
                onValueChange={(value: any) => {
                  if (typeof value === 'string') {
                    const updated = selectedValues.includes(value)
                      ? selectedValues.filter((v) => v !== value)
                      : [...selectedValues, value];
                    handleSelectAnswer(question.id, updated);
                  }
                }}
              />
            );
          }
        })}
      </View>
    </StepContainer>
  );
}
