import { View, Text, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../context/OnboardingContext';
import { useTheme } from '../../context/ThemeContext';
import StepContainer from '../../components/onboarding/StepContainer';
import Input from '../../components/ui/Input';
import RadioGroup from '../../components/ui/RadioGroup';

const isWeb = Platform.OS === 'web';

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

export default function Step1() {
  const router = useRouter();
  const { state, dispatch } = useOnboarding();
  const { colors } = useTheme();
  const info = state.answers.basicInfo;

  const handleContinue = () => {
    router.push('/onboarding/step-2');
  };

  const isValid =
    info.firstName.trim().length > 0 &&
    info.age.trim().length > 0 &&
    info.city.trim().length > 0 &&
    info.gender.length > 0;

  return (
    <StepContainer
      step={1}
      title="Basic Information"
      subtitle="Let's start with the essentials"
      onContinue={handleContinue}
      continueDisabled={!isValid}
      continueText="Continue"
    >
      <View style={{ gap: 24 }}>
        <Input
          label="First Name"
          value={info.firstName}
          onChangeText={(text: string) =>
            dispatch({
              type: 'UPDATE_BASIC_INFO',
              payload: { firstName: text },
            })
          }
          placeholder="Enter your first name"
        />
        <Input
          label="Age"
          value={info.age}
          onChangeText={(text: string) =>
            dispatch({
              type: 'UPDATE_BASIC_INFO',
              payload: { age: text },
            })
          }
          placeholder="Enter your age"
        />
        <Input
          label="City"
          value={info.city}
          onChangeText={(text: string) =>
            dispatch({
              type: 'UPDATE_BASIC_INFO',
              payload: { city: text },
            })
          }
          placeholder="Enter your city"
        />

        <View style={{ gap: 8 }}>
          <Text style={{
            fontSize: 14,
            fontWeight: '500',
            color: colors.text,
            ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
          }}>
            I am
          </Text>
          <RadioGroup
            options={genderOptions}
            selectedValue={info.gender}
            onSelect={(value) =>
              dispatch({
                type: 'UPDATE_BASIC_INFO',
                payload: { gender: value },
              })
            }
          />
        </View>
      </View>
    </StepContainer>
  );
}
