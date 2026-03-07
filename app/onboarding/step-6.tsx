import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../context/OnboardingContext';
import StepContainer from '../../components/onboarding/StepContainer';
import ForcedChoiceCard from '../../components/onboarding/ForcedChoiceCard';
import { HONESTY_CHECK_PAIRS } from '../../data/questions/honestyCheck';

export default function Step6() {
  const router = useRouter();
  const { state, dispatch } = useOnboarding();
  const answers = state.answers.honesty;

  const handleChoice = (pairId: string, choiceId: string) => {
    dispatch({
      type: 'UPDATE_HONESTY',
      payload: { ...answers, [pairId]: choiceId },
    });
  };

  const handleContinue = () => {
    router.push('/onboarding/step-7');
  };

  const handleBack = () => {
    router.back();
  };

  const isValid = HONESTY_CHECK_PAIRS.every((pair) => answers[pair.id]);

  return (
    <StepContainer
      step={6}
      title="Honesty Check"
      subtitle="Be truthful about your preferences"
      onContinue={handleContinue}
      onBack={handleBack}
      continueDisabled={!isValid}
      continueText="Continue"
    >
      <View style={{ gap: 24 }}>
        {HONESTY_CHECK_PAIRS.map((pair) => (
          <ForcedChoiceCard
            key={pair.id}
            choices={[
              { id: pair.optionA.value, label: pair.optionA.label },
              { id: pair.optionB.value, label: pair.optionB.label },
            ]}
            selectedId={answers[pair.id] || null}
            onSelect={(id: string) => handleChoice(pair.id, id)}
          />
        ))}
      </View>
    </StepContainer>
  );
}
