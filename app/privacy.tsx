import React from 'react';
import { ScrollView, Text, StyleSheet, View, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { COLORS, FONTS, SPACING, FONT_SIZES } from '../styles/tokens';

const isWeb = Platform.OS === 'web';

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Head>
        <title>Privacy Policy — WHOLLY</title>
        <meta name="description" content="WHOLLY Privacy Policy. Learn how we handle your data with care and transparency." />
        <meta property="og:title" content="Privacy Policy — WHOLLY" />
        <meta property="og:url" content="https://whollydate.com/privacy" />
      </Head>

      <View style={styles.inner}>
        <Pressable onPress={() => router.push('/')} style={styles.backLink}>
          <Text style={styles.backText}>← WHOLLY</Text>
        </Pressable>

        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.updated}>Last updated: March 2026</Text>

        <Section title="1. Information We Collect">
          <Bold>Account Information:</Bold> Name, email, age, city, gender, denomination.{'\n\n'}
          <Bold>Onboarding Answers:</Bold> Your responses to theology, faith style, emotional health,
          conflict, intellectual, and life vision questions. These are used exclusively for compatibility
          matching and are never shared with other users.{'\n\n'}
          <Bold>Photos:</Bold> Profile photos you upload voluntarily.{'\n\n'}
          <Bold>Messages:</Bold> Content of messages between matched users.{'\n\n'}
          <Bold>Usage Data:</Bold> Anonymous analytics (page views, feature usage) via Google Analytics.
        </Section>

        <Section title="2. How We Use Your Information">
          {'\u2022'} Calculate compatibility scores between users{'\n'}
          {'\u2022'} Display your profile to potential matches{'\n'}
          {'\u2022'} Enable messaging between mutual matches{'\n'}
          {'\u2022'} Send notifications about matches, messages, and account activity{'\n'}
          {'\u2022'} Improve the matching algorithm{'\n'}
          {'\u2022'} Process payments for subscriptions{'\n'}
          {'\u2022'} Enforce community safety (covenant violations, reports)
        </Section>

        <Section title="3. What We Never Do">
          {'\u2022'} Sell your personal data to third parties{'\n'}
          {'\u2022'} Share your individual question answers with other users{'\n'}
          {'\u2022'} Use your data for targeted advertising{'\n'}
          {'\u2022'} Share your information with churches or pastors without your consent{'\n'}
          {'\u2022'} Allow other users to see your honesty check results
        </Section>

        <Section title="4. What Other Users See">
          {'\u2022'} Your name, age, city, denomination, and bio{'\n'}
          {'\u2022'} Your compatibility scores (overall + 4 dimensions + community familiarity){'\n'}
          {'\u2022'} Your photos (based on subscription tier: none, thumbnail, or full){'\n'}
          {'\u2022'} Your verification status (Blue Tick or Gold Tick){'\n'}
          {'\u2022'} Your messages (only to the person you're chatting with)
        </Section>

        <Section title="5. Data Storage and Security">
          Your data is stored securely on Supabase (hosted on AWS) with row-level security policies.
          All data is encrypted in transit (TLS) and at rest. We use Supabase Auth for authentication
          with secure session management.
        </Section>

        <Section title="6. Third-Party Services">
          {'\u2022'} <Bold>Supabase:</Bold> Database, authentication, file storage{'\n'}
          {'\u2022'} <Bold>Stripe:</Bold> Payment processing (web){'\n'}
          {'\u2022'} <Bold>Apple/Google:</Bold> Payment processing (mobile){'\n'}
          {'\u2022'} <Bold>Google Analytics:</Bold> Anonymous usage analytics{'\n'}
          {'\u2022'} <Bold>Resend:</Bold> Transactional email delivery
        </Section>

        <Section title="7. Data Retention">
          We retain your data for as long as your account is active. When you delete your account,
          all personal data is permanently removed after a 30-day grace period. Anonymous aggregated
          data (e.g., algorithm performance statistics) may be retained indefinitely.
        </Section>

        <Section title="8. Your Rights">
          You have the right to:{'\n'}
          {'\u2022'} Access your personal data{'\n'}
          {'\u2022'} Correct inaccurate data{'\n'}
          {'\u2022'} Delete your account and all associated data{'\n'}
          {'\u2022'} Export your data{'\n'}
          {'\u2022'} Opt out of non-essential emails{'\n'}
          {'\u2022'} Block other users from seeing your profile
        </Section>

        <Section title="9. Children's Privacy">
          WHOLLY is not intended for anyone under 18. We do not knowingly collect data from minors.
          If we discover a user is under 18, their account will be immediately removed.
        </Section>

        <Section title="10. Changes to This Policy">
          We will notify you of material changes via email or in-app notification at least 14 days
          before they take effect.
        </Section>

        <Section title="11. Contact">
          For privacy questions or data requests, contact us at privacy@whollydate.com.
        </Section>

        <View style={{ height: 60 }} />
      </View>
    </ScrollView>
  );
}

function Bold({ children }: { children: React.ReactNode }) {
  return <Text style={{ fontFamily: FONTS.bodyBold }}>{children}</Text>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.body}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingVertical: 48, paddingHorizontal: 24 },
  inner: { maxWidth: 680, width: '100%', alignSelf: 'center' },
  backLink: { marginBottom: 32, ...(isWeb ? { cursor: 'pointer' } : {}) },
  backText: { fontFamily: FONTS.body, fontSize: 14, color: COLORS.textSecondary },
  title: { fontFamily: FONTS.heading, fontSize: FONT_SIZES.xxxl, color: COLORS.text, marginBottom: SPACING.xs },
  updated: { fontFamily: FONTS.body, fontSize: FONT_SIZES.sm, color: COLORS.textMuted, marginBottom: SPACING.xl },
  section: { marginBottom: SPACING.lg },
  sectionTitle: { fontFamily: FONTS.headingMedium, fontSize: FONT_SIZES.lg, color: COLORS.text, marginBottom: SPACING.sm },
  body: { fontFamily: FONTS.body, fontSize: FONT_SIZES.md, color: COLORS.textSecondary, lineHeight: 26 },
});
