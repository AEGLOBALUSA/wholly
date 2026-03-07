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

export default function SignUp() {
  const router = useRouter();
  const { signUp } = useAuth();
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignUp = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords don\'t match');
      return;
    }

    setLoading(true);
    setError('');

    const { error: signUpError } = await signUp(email.trim(), password);

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
    } else {
      // Track sign-up completion
      analytics.signupComplete(email.trim());
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.logo, { color: colors.accent }]}>WHOLLY</Text>
          <Text style={[styles.title, { color: colors.text }]}>Check Your Email</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            We've sent a confirmation link to {email}. Click it to activate your account, then come back and sign in.
          </Text>
        </View>
        <Pressable
          onPress={() => router.replace('/auth/sign-in')}
          style={({ pressed }) => [styles.button, { backgroundColor: colors.text }, pressed && { opacity: 0.85 }]}
        >
          <Text style={styles.buttonText}>Go to Sign In</Text>
        </Pressable>
        <ThemeToggle />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={[styles.logo, { color: colors.accent }]}>WHOLLY</Text>
        <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Begin your journey to meaningful connection</Text>
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
          placeholder="At least 8 characters"
          secureTextEntry
        />
        <Input
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm your password"
          secureTextEntry
        />

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <Pressable
          onPress={handleSignUp}
          disabled={loading}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: colors.text },
            loading && styles.buttonDisabled,
            pressed && { opacity: 0.85 },
          ]}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Creating account...' : 'Create Account'}
          </Text>
        </Pressable>

        <View style={styles.links}>
          <Link href="/auth/sign-in" asChild>
            <Pressable>
              <Text style={[styles.linkText, { color: colors.textSecondary }]}>
                Already have an account? <Text style={[styles.linkBold, { color: colors.accent }]}>Sign in</Text>
              </Text>
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
    textAlign: 'center',
    lineHeight: 22,
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
