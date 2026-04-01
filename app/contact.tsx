import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Platform,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { COLORS, FONTS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../styles/tokens';

const isWeb = Platform.OS === 'web';

export default function ContactPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const canSubmit = name.trim() && email.trim() && message.trim() && status !== 'sending';

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setStatus('sending');

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('contact_messages').insert({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        });
        if (error) throw error;
      }
      setStatus('sent');
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Head>
        <title>Contact — WHOLLY</title>
        <meta name="description" content="Get in touch with the WHOLLY team. Questions, feedback, or partnership inquiries." />
        <meta property="og:title" content="Contact — WHOLLY" />
        <meta property="og:url" content="https://whollydate.com/contact" />
      </Head>

      <View style={styles.inner}>
        <Pressable onPress={() => router.push('/')} style={styles.backLink}>
          <Text style={styles.backText}>← WHOLLY</Text>
        </Pressable>

        <Text style={styles.title}>Get in Touch</Text>
        <Text style={styles.subtitle}>
          Questions about WHOLLY? Feedback on your experience? Partnership inquiries? We'd love to hear from you.
        </Text>

        {status === 'sent' ? (
          <View style={styles.successBox}>
            <Text style={styles.successTitle}>Message sent</Text>
            <Text style={styles.successBody}>
              Thank you for reaching out. We'll get back to you within 48 hours.
            </Text>
            <Pressable onPress={() => setStatus('idle')} style={styles.resetLink}>
              <Text style={styles.resetText}>Send another message</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor={COLORS.textMuted}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Message</Text>
              <TextInput
                style={[styles.input, styles.textarea]}
                value={message}
                onChangeText={setMessage}
                placeholder="How can we help?"
                placeholderTextColor={COLORS.textMuted}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>

            {status === 'error' && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>
                  Something went wrong. Please try again or email us directly at hello@whollydate.com.
                </Text>
              </View>
            )}

            <Pressable
              onPress={handleSubmit}
              disabled={!canSubmit}
              style={({ pressed }) => [
                styles.button,
                !canSubmit && { opacity: 0.4 },
                pressed && canSubmit && { opacity: 0.85 },
              ]}
            >
              <Text style={styles.buttonText}>
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </Text>
            </Pressable>
          </View>
        )}

        <View style={styles.altContact}>
          <Text style={styles.altText}>
            You can also email us directly at hello@whollydate.com
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingVertical: 48, paddingHorizontal: 24 },
  inner: { maxWidth: 520, width: '100%', alignSelf: 'center' },
  backLink: { marginBottom: 32, ...(isWeb ? { cursor: 'pointer' } : {}) },
  backText: { fontFamily: FONTS.body, fontSize: 14, color: COLORS.textSecondary },
  title: {
    fontFamily: FONTS.heading,
    fontSize: FONT_SIZES.xxxl,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 26,
    marginBottom: 40,
  },
  form: { gap: 20 },
  field: { gap: 6 },
  label: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 13,
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  input: {
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.text,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    ...(isWeb ? { outlineStyle: 'none' } as any : {}),
  },
  textarea: {
    minHeight: 120,
    ...(isWeb ? { resize: 'vertical' } as any : {}),
  },
  button: {
    backgroundColor: COLORS.primary,
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
  successBox: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.green,
    borderRadius: BORDER_RADIUS.lg,
    padding: 32,
    alignItems: 'center',
    gap: 12,
  },
  successTitle: {
    fontFamily: FONTS.headingMedium,
    fontSize: 20,
    color: COLORS.text,
  },
  successBody: {
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  resetLink: {
    marginTop: 8,
    ...(isWeb ? { cursor: 'pointer' } : {}),
  },
  resetText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 14,
    color: COLORS.primary,
  },
  altContact: {
    marginTop: 40,
    alignItems: 'center',
  },
  altText: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.textMuted,
  },
});
