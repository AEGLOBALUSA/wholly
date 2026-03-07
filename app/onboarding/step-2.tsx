import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../context/OnboardingContext';
import StepContainer from '../../components/onboarding/StepContainer';
import RadioGroup from '../../components/ui/RadioGroup';

const DENOMINATION_OPTIONS = [
  { value: 'futures-church', label: 'Futures Church' },
  { value: 'planetshakers', label: 'Planetshakers' },
];

export default function Step2() {
  const router = useRouter();
  const { state, dispatch } = useOnboarding();

  const handleSelect = (value: string) => {
    dispatch({
      type: 'UPDATE_BASIC_INFO',
      payload: { denomination: value },
    });
  };

  const handleContinue = () => {
    router.push('/onboarding/step-3');
  };

  const handleBack = () => {
    router.back();
  };

  const isValid = state.answers.basicInfo.denomination.length > 0;

  return (
    <StepContainer
      step={2}
      title="Your Church"
      subtitle="Which denomination resonates with you?"
      onContinue={handleContinue}
      onBack={handleBack}
      continueDisabled={!isValid}
      continueText="Continue"
    >
      <View style={{ gap: 24 }}>
        <RadioGroup
          options={DENOMINATION_OPTIONS}
          selectedValue={state.answers.basicInfo.denomination || null}
          onSelect={handleSelect}
        />
      </View>
    </StepContainer>
  );
}
