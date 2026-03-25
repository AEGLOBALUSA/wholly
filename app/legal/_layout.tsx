import { Stack } from 'expo-router';
import { COLORS, FONTS, FONT_SIZES } from '../../styles/tokens';

export default function LegalLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.background },
        headerTintColor: COLORS.text,
        headerTitleStyle: { fontFamily: FONTS.headingMedium, fontSize: FONT_SIZES.lg },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="terms" options={{ title: 'Terms of Service' }} />
      <Stack.Screen name="privacy" options={{ title: 'Privacy Policy' }} />
    </Stack>
  );
}
