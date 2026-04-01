import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import Head from 'expo-router/head';
import { COLORS, FONTS, SPACING, FONT_SIZES } from '../../styles/tokens';

export default function TermsOfService() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Head>
        <title>Terms of Service — WHOLLY</title>
        <meta property="og:title" content="Terms of Service — WHOLLY" />
        <meta property="og:url" content="https://whollydate.com/legal/terms" />
      </Head>
      <Text style={styles.title}>Terms of Service</Text>
      <Text style={styles.updated}>Last updated: March 2026</Text>

      <Section title="1. Acceptance of Terms">
        By creating a WHOLLY account, you agree to these Terms of Service and our Privacy Policy.
        WHOLLY is a faith-based dating platform designed for Spirit-filled Christians seeking
        meaningful, covenant-centered relationships.
      </Section>

      <Section title="2. Eligibility">
        You must be at least 18 years old to use WHOLLY. By using this service, you represent
        that you are at least 18 years of age. WHOLLY reserves the right to verify your age and
        remove accounts that violate this requirement.
      </Section>

      <Section title="3. The Covenant">
        All users must agree to the WHOLLY Covenant before accessing the platform. The Covenant
        includes commitments to honesty, respect, accountability, and Spirit-led behavior. Violation
        of the Covenant may result in account suspension or removal.
      </Section>

      <Section title="4. Account Conduct">
        You agree not to:{'\n'}
        {'\u2022'} Harass, threaten, or intimidate other users{'\n'}
        {'\u2022'} Use prophetic language, dreams, or spiritual authority to manipulate or pressure others{'\n'}
        {'\u2022'} Create fake or misleading profiles{'\n'}
        {'\u2022'} Share sexually explicit content{'\n'}
        {'\u2022'} Use the platform for commercial purposes{'\n'}
        {'\u2022'} Attempt to circumvent security features{'\n'}
        {'\u2022'} Collect personal information of other users without consent
      </Section>

      <Section title="5. Subscriptions and Payments">
        WHOLLY offers free and paid subscription tiers. Paid subscriptions auto-renew unless
        canceled before the renewal date. Refunds are handled per the policies of your payment
        platform (Apple App Store, Google Play, or Stripe for web). You can manage or cancel
        your subscription at any time through Settings.
      </Section>

      <Section title="6. Pastoral Verification">
        The Blue Tick and Gold Tick verification features are based on pastoral endorsement
        and do not constitute a background check. WHOLLY does not guarantee the accuracy of
        pastoral verifications. Users should exercise their own judgment and discernment.
      </Section>

      <Section title="7. Content Ownership">
        You retain ownership of content you upload (photos, bio, answers). By uploading content,
        you grant WHOLLY a non-exclusive license to display it within the platform. We will never
        sell your data or use it for advertising.
      </Section>

      <Section title="8. Privacy and Data">
        Your onboarding answers are used solely for compatibility matching. We do not share
        individual answers with other users. Only compatibility scores are visible to matches.
        See our Privacy Policy for full details on data handling.
      </Section>

      <Section title="9. Account Deletion">
        You can request account deletion at any time through Settings. Deletion is processed
        after a 30-day grace period during which you can cancel the request. After 30 days,
        all your data is permanently removed.
      </Section>

      <Section title="10. Disclaimer">
        WHOLLY provides a matching algorithm based on shared values and compatibility indicators.
        We do not guarantee relationship outcomes. WHOLLY is not a substitute for professional
        relationship counseling. Users are encouraged to seek pastoral guidance alongside using
        the platform.
      </Section>

      <Section title="11. Limitation of Liability">
        WHOLLY is provided "as is" without warranties. We are not liable for any damages arising
        from your use of the platform, interactions with other users, or reliance on compatibility
        scores. Our total liability is limited to the amount you paid for your subscription in
        the 12 months preceding the claim.
      </Section>

      <Section title="12. Changes to Terms">
        We may update these terms from time to time. We will notify you of material changes
        via email or in-app notification. Continued use after changes constitutes acceptance.
      </Section>

      <Section title="13. Contact">
        For questions about these terms, contact us at hello@whollydate.com.
      </Section>

      <View style={{ height: 60 }} />
    </ScrollView>
  );
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
  content: { padding: SPACING.lg },
  title: { fontFamily: FONTS.heading, fontSize: FONT_SIZES.xxxl, color: COLORS.text, marginBottom: SPACING.xs },
  updated: { fontFamily: FONTS.body, fontSize: FONT_SIZES.sm, color: COLORS.textMuted, marginBottom: SPACING.xl },
  section: { marginBottom: SPACING.lg },
  sectionTitle: { fontFamily: FONTS.headingMedium, fontSize: FONT_SIZES.lg, color: COLORS.text, marginBottom: SPACING.sm },
  body: { fontFamily: FONTS.body, fontSize: FONT_SIZES.md, color: COLORS.textSecondary, lineHeight: 24 },
});
