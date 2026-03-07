import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { OnboardingProvider } from '../context/OnboardingContext';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { AnalyticsProvider } from '../context/AnalyticsContext';
import { SubscriptionProvider } from '../context/SubscriptionContext';

export {
  ErrorBoundary,
} from 'expo-router';

SplashScreen.preventAutoHideAsync();

function InnerLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="covenant" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    PlayfairDisplay: require('../assets/fonts/PlayfairDisplay-Regular.ttf'),
    DMSans: require('../assets/fonts/DMSans-Regular.ttf'),
    DMSansMedium: require('../assets/fonts/DMSans-Medium.ttf'),
    DMSansSemiBold: require('../assets/fonts/DMSans-SemiBold.ttf'),
    DMSansBold: require('../assets/fonts/DMSans-Bold.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <AnalyticsProvider>
        <ThemeProvider>
          <SubscriptionProvider>
            <OnboardingProvider>
              <InnerLayout />
            </OnboardingProvider>
          </SubscriptionProvider>
        </ThemeProvider>
      </AnalyticsProvider>
    </AuthProvider>
  );
}
