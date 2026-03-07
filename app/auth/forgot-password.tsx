import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, Pressable } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, BORDER_RADIUS } from '../../styles/tokens';
import ThemeToggle from '../../components/ui/ThemeToggle';
import Input from '../../components/ui/Input';

const isWeb = Platform.OS === 'web';

export default function ForgotPassword() {
  const router = useRouter();
  const { resetPassword } = useAuth();
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    setError('');

    const { error: resetError } = await resetPassword(email.trim());

    if (resetError) {
      setError(resetError.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.logo, { color: colors.accent }]}>WHOLLY</Text>
          <Text style={[styles.title, { color: colors.text }]}>Email Sent</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            If an account exists for {email}, you'll receive a password reset link shortly.
          </Text>
        </View>
        <Pressable
          onPress={() => router.replace('/auth/sign-in')}
          style={({ pressed }) => [styles.button, { backgroundColor: colors.text }, pressed && { opacity: 0.85 }]}
        >
          <Text style={styles.buttonText}>Back to Sign In</Text>
        </Pressable>
        <ThemeToggle />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={[styles.logo, { color: colors.accent }]}>WHOLLY</Text>
        <Text style={[styles.title, { color: colors.text }]}>Reset Password</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Enter your email and we'll send you a link to reset your password.
        </Text>
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

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <Pressable
          onPress={handleReset}
          disabled={loading}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: colors.text },
            loading && styles.buttonDisabled,
            pressed && { opacity: 0.85 },
          ]}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Text>
        </Pressable>

        <View style={styles.links}>
          <Link href="/auth/sign-in" asChild>
            <Pressable>
              <Text style={[styles.linkText, { color: colors.textSecondary }]}>
                Back to <Text style={[styles.linkBold, { color: colors.accent }]}>Sign In</Text>
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
