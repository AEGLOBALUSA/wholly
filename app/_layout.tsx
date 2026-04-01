import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import Head from 'expo-router/head';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform } from 'react-native';
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
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#6366f1" />
        <meta name="description" content="WHOLLY is a premium faith-first dating platform that matches Spirit-filled Christians on emotional health, values, life vision, and intellectual compatibility — before you ever see a photo." />
        <meta property="og:site_name" content="WHOLLY" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://whollydate.com/wholly-og-share.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://whollydate.com/wholly-og-share.png" />
        <link rel="icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Head>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="covenant" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="chat" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="about" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
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

  useEffect(() => {
    if (Platform.OS === 'web' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

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
