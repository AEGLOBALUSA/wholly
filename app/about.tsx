import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { FONTS, BORDER_RADIUS, COLORS } from '../styles/tokens';

const isWeb = Platform.OS === 'web';

export default function AboutPage() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;
  const pad = isDesktop ? 80 : isTablet ? 48 : 24;
  const maxW = isDesktop ? 720 : isTablet ? 600 : undefined;

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Head>
        <title>About — WHOLLY</title>
        <meta property="og:title" content="About WHOLLY" />
        <meta property="og:description" content="Learn about WHOLLY — a premium faith-first matchmaking platform built on depth, not just a photo." />
        <meta property="og:url" content="https://whollydate.com/about" />
      </Head>

      <View style={[styles.section, { paddingHorizontal: pad }]}>
        <View style={[styles.innerMax, maxW ? { maxWidth: maxW } : undefined]}>
          {/* Back link */}
          <Pressable onPress={() => router.back()} style={styles.backLink}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>

          <View style={styles.hairline} />
          <Text style={styles.kicker}>ABOUT</Text>

          <Text style={[
            styles.heading,
            isDesktop && { fontSize: 36, lineHeight: 48 },
          ]}>
            Built on what lasts.
          </Text>

          <Text style={styles.body}>
            WHOLLY is a dating platform for Spirit-filled Christians who want more than a swipe. We match people on emotional health, values alignment, intellectual connection, and life direction — the things that actually determine whether a relationship thrives.
          </Text>

          <Text style={styles.body}>
            Every user begins with a covenant — a commitment to honesty, respect, and intentionality. Then a thoughtful questionnaire maps four dimensions of compatibility before you ever see a photo. This isn't about volume. It's about depth.
          </Text>

          <Text style={[styles.subheading, isDesktop && { fontSize: 22 }]}>
            Why we exist
          </Text>

          <Text style={styles.body}>
            Most dating apps optimise for engagement — more swipes, more matches, more time on screen. WHOLLY optimises for alignment. We believe the best relationships start with shared values and emotional maturity, not just attraction.
          </Text>

          <Text style={styles.body}>
            The matching algorithm uses a weighted geometric mean across four dimensions, with floor capping to prevent hiding weak areas. A 95% spiritual score with a 40% emotional score doesn't average to 67% — it drops to 62%. We penalise imbalance because real relationships can't survive on one dimension alone.
          </Text>

          <Text style={[styles.subheading, isDesktop && { fontSize: 22 }]}>
            How it works
          </Text>

          <View style={styles.stepList}>
            {[
              { num: '01', title: 'Sign the covenant', desc: 'Commit to honesty, respect, and Spirit-led behaviour.' },
              { num: '02', title: 'Answer the questionnaire', desc: 'Twelve sections covering theology, emotional health, conflict style, and life vision.' },
              { num: '03', title: 'Get matched', desc: 'See detailed compatibility breakdowns — not just a percentage, but where you align and where you differ.' },
              { num: '04', title: 'Connect with intention', desc: 'Photos come later. Conversation comes first.' },
            ].map((step, i) => (
              <View key={i} style={styles.step}>
                <Text style={styles.stepNum}>{step.num}</Text>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepDesc}>{step.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* CTA */}
          <View style={styles.ctaBlock}>
            <Pressable
              onPress={() => router.push('/covenant')}
              style={({ pressed }) => [
                styles.ctaBtn,
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text style={styles.ctaBtnText}>Get Started</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>WHOLLY © 2026</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {},
  innerMax: {
    width: '100%',
    alignSelf: 'center',
  },
  section: {
    paddingVertical: 64,
    backgroundColor: COLORS.background,
  },
  backLink: {
    marginBottom: 32,
    ...(isWeb ? { cursor: 'pointer' } : {}),
  },
  backText: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  hairline: {
    width: 40,
    height: 1,
    backgroundColor: COLORS.primary,
    marginBottom: 24,
    opacity: 0.5,
  },
  kicker: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: COLORS.primary,
    letterSpacing: 4,
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  heading: {
    fontFamily: FONTS.heading,
    fontSize: 28,
    color: COLORS.text,
    lineHeight: 38,
    marginBottom: 24,
  },
  subheading: {
    fontFamily: FONTS.heading,
    fontSize: 20,
    color: COLORS.text,
    lineHeight: 28,
    marginTop: 40,
    marginBottom: 16,
  },
  body: {
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 26,
    marginBottom: 16,
  },
  stepList: {
    marginTop: 8,
    gap: 24,
  },
  step: {
    flexDirection: 'row',
    gap: 16,
  },
  stepNum: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.primary,
    letterSpacing: 2,
    opacity: 0.5,
    marginTop: 2,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 4,
  },
  stepDesc: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  ctaBlock: {
    alignItems: 'center',
    marginTop: 48,
  },
  ctaBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: BORDER_RADIUS.full,
    ...(isWeb ? { cursor: 'pointer' } : {}),
  },
  ctaBtnText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
    color: COLORS.white,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  footer: {
    paddingVertical: 32,
    alignItems: 'center',
    backgroundColor: COLORS.footerBg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  footerText: {
    fontFamily: FONTS.body,
    fontSize: 11,
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 2,
  },
});
