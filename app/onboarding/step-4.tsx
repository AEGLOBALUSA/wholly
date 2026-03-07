import { View, Text, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../context/OnboardingContext';
import StepContainer from '../../components/onboarding/StepContainer';
import QuestionCard from '../../components/onboarding/QuestionCard';
import CheckboxList from '../../components/onboarding/CheckboxList';
import { THEOLOGY_QUESTIONS } from '../../data/questions/theology';

export default function Step4() {
  const router = useRouter();
  const { state, dispatch } = useOnboarding();
  const answers = state.answers.theology;

  const handleSelectAnswer = (questionId: string, answer: string | string[]) => {
    dispatch({
      type: 'UPDATE_THEOLOGY',
      payload: { ...answers, [questionId]: answer },
    });
  };

  const handleContinue = () => {
    router.push('/onboarding/step-5');
  };

  const handleBack = () => {
    router.back();
  };

  const isValid = THEOLOGY_QUESTIONS.every((q) => answers[q.id]);

  return (
    <StepContainer
      step={4}
      title="Theology"
      subtitle="What beliefs shape your faith?"
      onContinue={handleContinue}
      onBack={handleBack}
      continueDisabled={!isValid}
      continueText="Continue"
    >
      <View style={{ gap: 24 }}>
        {THEOLOGY_QUESTIONS.map((question) => {
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
              <View key={question.id}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  marginBottom: 12,
                  color: '#f0f0f0',
                  ...(Platform.OS === 'web' ? { fontFamily: 'Inter, sans-serif' } : {}),
                }}>
                  {question.text}
                </Text>
                <CheckboxList
                  options={question.options?.map((opt) => ({
                    value: opt.value,
                    label: opt.label,
                  })) || []}
                  selectedValues={selectedValues}
                  onToggle={(value: string) => {
                    const updated = selectedValues.includes(value)
                      ? selectedValues.filter((v) => v !== value)
                      : [...selectedValues, value];
                    handleSelectAnswer(question.id, updated);
                  }}
                />
              </View>
            );
          }
        })}
      </View>
    </StepContainer>
  );
}
