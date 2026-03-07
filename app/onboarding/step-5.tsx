import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../context/OnboardingContext';
import StepContainer from '../../components/onboarding/StepContainer';
import ForcedChoiceCard from '../../components/onboarding/ForcedChoiceCard';
import { FAITH_STYLE_PAIRS } from '../../data/questions/faithStyle';

export default function Step5() {
  const router = useRouter();
  const { state, dispatch } = useOnboarding();
  const answers = state.answers.faithStyle;

  const handleChoice = (pairId: string, choiceId: string) => {
    dispatch({
      type: 'UPDATE_FAITH_STYLE',
      payload: { ...answers, [pairId]: choiceId },
    });
  };

  const handleContinue = () => {
    router.push('/onboarding/step-6');
  };

  const handleBack = () => {
    router.back();
  };

  const isValid = FAITH_STYLE_PAIRS.every((pair) => answers[pair.id]);

  return (
    <StepContainer
      step={5}
      title="Faith Style"
      subtitle="Choose what resonates with your approach"
      onContinue={handleContinue}
      onBack={handleBack}
      continueDisabled={!isValid}
      continueText="Continue"
    >
      <View style={{ gap: 24 }}>
        {FAITH_STYLE_PAIRS.map((pair) => (
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
