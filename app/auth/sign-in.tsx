import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, Pressable } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { analytics } from '../../context/AnalyticsContext';
import { FONTS, BORDER_RADIUS } from '../../styles/tokens';
import ThemeToggle from '../../components/ui/ThemeToggle';
import Input from '../../components/ui/Input';

const isWeb = Platform.OS === 'web';

export default function SignIn() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      // Track sign-in completion
      analytics.signinComplete(email.trim());
      router.replace('/');
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={[styles.logo, { color: colors.accent }]}>WHOLLY</Text>
        <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Sign in to continue your journey</Text>
      </View>

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
            { backgroundColor: colors.text },
            loading && styles.buttonDisabled,
            pressed && { opacity: 0.85 },
          ]}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Text>
        </Pressable>

        <View style={styles.links}>
          <Link href="/auth/sign-up" asChild>
            <Pressable>
              <Text style={[styles.linkText, { color: colors.textSecondary }]}>
                Don't have an account? <Text style={[styles.linkBold, { color: colors.accent }]}>Sign up</Text>
              </Text>
            </Pressable>
          </Link>

          <Link href="/auth/forgot-password" asChild>
            <Pressable>
              <Text style={[styles.linkText, { color: colors.textSecondary }]}>Forgot password?</Text>
            </Pressable>
          </Link>
        </View>
      </View>
      <ThemeToggle />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 80,
    maxWidth: 440,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    letterSpacing: 6,
    marginBottom: 24,
  },
  title: {
    fontFamily: FONTS.heading,
    fontSize: 28,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: FONTS.body,
    fontSize: 15,
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
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  links: {
    alignItems: 'center',
    gap: 16,
    marginTop: 16,
  },
  linkText: {
    fontFamily: FONTS.body,
    fontSize: 14,
  },
  linkBold: {
    fontFamily: FONTS.bodySemiBold,
  },
});
