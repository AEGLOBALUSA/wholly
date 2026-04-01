import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import Head from 'expo-router/head';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { analytics } from '../context/AnalyticsContext';
import { COLORS, FONTS, BORDER_RADIUS } from '../styles/tokens';
import Input from '../components/ui/Input';

const isWeb = Platform.OS === 'web';

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isDesktop = width >= 768;

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    const { error: signInError } = await signIn(email.trim(), password);

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      analytics.signinComplete(email.trim());
      router.replace('/');
    }
  };

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Head>
        <title>Log In — WHOLLY</title>
        <meta name="description" content="Sign in to your WHOLLY account. Continue your faith-first dating journey." />
        <meta property="og:title" content="Log In — WHOLLY" />
        <meta property="og:url" content="https://whollydate.com/login" />
      </Head>

      <View style={[styles.container, isDesktop && { maxWidth: 420 }]}>
        {/* Brand */}
        <Pressable onPress={() => router.push('/')} style={styles.brandLink}>
          <Text style={[styles.brand, { color: colors.accent }]}>WHOLLY</Text>
        </Pressable>

        <Text style={[styles.heading, { color: colors.text }]}>Welcome back</Text>
        <Text style={[styles.subheading, { color: colors.textSecondary }]}>
          Sign in to continue your journey
        </Text>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Your password"
            secureTextEntry
          />

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Pressable
            onPress={handleSignIn}
            disabled={loading}
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: colors.accent },
              loading && { opacity: 0.5 },
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Text>
          </Pressable>
        </View>

        {/* Links */}
        <View style={styles.links}>
          <Link href="/auth/forgot-password" asChild>
            <Pressable>
              <Text style={[styles.linkText, { color: colors.textSecondary }]}>
                Forgot your password?
              </Text>
            </Pressable>
          </Link>

          <View style={styles.divider} />

          <Text style={[styles.linkText, { color: colors.textSecondary }]}>
            New to WHOLLY?
          </Text>
          <Link href="/covenant" asChild>
            <Pressable>
              <Text style={[styles.linkAccent, { color: colors.accent }]}>
                Create an account
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  container: {
    width: '100%',
    alignSelf: 'center',
  },
  brandLink: {
    alignSelf: 'center',
    marginBottom: 40,
    ...(isWeb ? { cursor: 'pointer' } : {}),
  },
  brand: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
    letterSpacing: 6,
  },
  heading: {
    fontFamily: FONTS.heading,
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 8,
  },
  subheading: {
    fontFamily: FONTS.body,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 40,
  },
  form: {
    gap: 20,
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 12,
  },
  errorText: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.error,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 16,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    marginTop: 8,
    ...(isWeb ? { cursor: 'pointer' } : {}),
  },
  buttonText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  links: {
    alignItems: 'center',
    marginTop: 32,
    gap: 12,
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
  },
  linkText: {
    fontFamily: FONTS.body,
    fontSize: 14,
    ...(isWeb ? { cursor: 'pointer' } : {}),
  },
  linkAccent: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 15,
    ...(isWeb ? { cursor: 'pointer' } : {}),
  },
});
