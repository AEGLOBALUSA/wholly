import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  ImageBackground,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, FONTS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../styles/tokens';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const HERO_IMAGE = require('../assets/images/hero.jpg');
const isWeb = Platform.OS === 'web';

export default function LandingPage() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;
  const pad = isDesktop ? 80 : isTablet ? 48 : 24;
  const maxW = isDesktop ? 880 : isTablet ? 680 : undefined;

  const navigateToCovenant = () => router.push('/covenant');

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* ─── HERO ─── */}
      <ImageBackground
        source={HERO_IMAGE}
        style={[styles.hero, { height: isDesktop ? 720 : isTablet ? 640 : 580 }]}
        resizeMode="cover"
      >
        <View style={styles.heroGradient}>
          <View style={styles.heroInner}>
            <Text style={[
              styles.logoMark,
              isDesktop && { fontSize: 13, letterSpacing: 8 },
            ]}>
              WHOLLY
            </Text>
            <Text style={[
              styles.heroHeadline,
              isDesktop && { fontSize: 44, lineHeight: 52 },
              isTablet && { fontSize: 36, lineHeight: 44 },
            ]}>
              Matched on what{'\n'}actually matters.
            </Text>
            <Text style={[
              styles.heroSub,
              isDesktop && { fontSize: 17, lineHeight: 26 },
            ]}>
              A dating experience built around depth —{'\n'}not just a photo.
            </Text>

            <Pressable
              onPress={navigateToCovenant}
              style={({ pressed }) => [
                styles.heroCta,
                isDesktop && { paddingVertical: 18, paddingHorizontal: 52 },
                pressed && { opacity: 0.8, transform: [{ scale: 0.97 }] },
              ]}
            >
              <Text style={[
                styles.heroCtaText,
                isDesktop && { fontSize: 13 },
              ]}>Get Started</Text>
            </Pressable>

            <Text style={styles.heroSmall}>Free during launch · No card required</Text>
          </View>
        </View>
      </ImageBackground>

      {/* ─── EDITORIAL INTRO ─── */}
      <View style={[styles.editorialSection, { paddingHorizontal: pad }]}>
        <View style={[styles.innerMax, maxW ? { maxWidth: maxW } : undefined]}>
          <View style={styles.hairline} />
          <Text style={styles.editorialKicker}>The Idea</Text>
          <Text style={[
            styles.editorialQuote,
            isDesktop && { fontSize: 32, lineHeight: 46 },
            isTablet && { fontSize: 26, lineHeight: 38 },
          ]}>
            Most apps start with a face.{'\n'}We start with who you are.
          </Text>
          <Text style={[
            styles.editorialBody,
            isDesktop && { fontSize: 17, lineHeight: 30, maxWidth: 560 },
          ]}>
            WHOLLY uses a 4-layer compatibility model to match you on emotional health, values alignment, intellectual connection, and life direction — before you ever see a photo.
          </Text>
        </View>
      </View>

      {/* ─── HOW IT WORKS ─── */}
      <View style={[styles.howSection, { paddingHorizontal: pad }]}>
        <View style={[styles.innerMax, maxW ? { maxWidth: maxW } : undefined]}>
          <Text style={styles.howKicker}>How It Works</Text>

          <View style={[
            styles.howGrid,
            isDesktop && { flexDirection: 'row', gap: 48 },
          ]}>
            {[
              { n: '01', t: 'Share your story', d: 'Twelve thoughtful prompts about your values, emotional world, and vision for life.' },
              { n: '02', t: 'We find alignment', d: '99 data points scored across four dimensions of compatibility.' },
              { n: '03', t: 'Connect for real', d: 'Detailed match breakdowns first. Photos come later. No swiping.' },
            ].map((s, i) => (
              <View key={i} style={[styles.howItem, isDesktop && { flex: 1 }]}>
                <Text style={styles.howNum}>{s.n}</Text>
                <Text style={[styles.howTitle, isDesktop && { fontSize: 19 }]}>{s.t}</Text>
                <Text style={styles.howDesc}>{s.d}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* ─── THE 4 LAYERS ─── */}
      <View style={[styles.layersSection, { paddingHorizontal: pad }]}>
        <View style={[styles.innerMax, maxW ? { maxWidth: maxW } : undefined]}>
          <Text style={styles.layersKicker}>The Four Layers</Text>
          <Text style={[
            styles.layersHeading,
            isDesktop && { fontSize: 30, lineHeight: 40 },
          ]}>
            What we measure — and why it matters.
          </Text>

          <View style={[
            styles.layersGrid,
            isDesktop && { flexDirection: 'row', gap: 24 },
          ]}>
            {[
              { label: 'Emotional', weight: '35%', desc: 'Attachment style, conflict resolution, emotional maturity and self-awareness.' },
              { label: 'Values', weight: '25%', desc: 'Core beliefs, faith expression, moral framework and spiritual alignment.' },
              { label: 'Life Vision', weight: '25%', desc: 'Purpose, ambition, lifestyle goals, and how you see the next decade.' },
              { label: 'Intellectual', weight: '15%', desc: 'Curiosity, growth mindset, how you engage with ideas and the world.' },
            ].map((l, i) => (
              <View key={i} style={[
                styles.layerItem,
                isDesktop && { flex: 1 },
                i < 3 && !isDesktop && styles.layerItemBorder,
              ]}>
                <View style={styles.layerTop}>
                  <Text style={styles.layerLabel}>{l.label}</Text>
                  <Text style={styles.layerWeight}>{l.weight}</Text>
                </View>
                <Text style={styles.layerDesc}>{l.desc}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* ─── PRICING ─── */}
      <View style={[styles.priceSection, { paddingHorizontal: pad }]}>
        <View style={[styles.innerMax, maxW ? { maxWidth: maxW } : undefined]}>
          <View style={styles.hairline} />
          <Text style={styles.priceKicker}>Launch Pricing</Text>

          <View style={[
            styles.priceRow,
            isDesktop && { flexDirection: 'row', alignItems: 'flex-start', gap: 64 },
          ]}>
            <View style={[styles.priceLeft, isDesktop && { flex: 1 }]}>
              <Text style={[
                styles.priceHeading,
                isDesktop && { fontSize: 28 },
              ]}>
                Founding Member
              </Text>
              <Text style={styles.priceAmount}>
                $9.99<Text style={styles.pricePer}> /month</Text>
              </Text>
              <Text style={styles.priceLock}>Lock in this rate forever.</Text>
            </View>

            <View style={[styles.priceRight, isDesktop && { flex: 1 }]}>
              {[
                'Full 4-layer compatibility matching',
                'Detailed score breakdowns per match',
                'Unlimited profile browsing',
                'Priority early access to new features',
                'Messaging when it launches',
              ].map((f, i) => (
                <View key={i} style={styles.priceFeatRow}>
                  <Text style={styles.priceFeatDash}>—</Text>
                  <Text style={styles.priceFeatText}>{f}</Text>
                </View>
              ))}
            </View>
          </View>

          <Text style={styles.priceFree}>
            A free tier is also available — build your profile and see basic matches at no cost.
          </Text>
        </View>
      </View>

      {/* ─── BOTTOM CTA ─── */}
      <View style={[styles.ctaSection, { paddingHorizontal: pad }]}>
        <View style={[styles.innerMax, maxW ? { maxWidth: maxW } : undefined, { alignItems: 'center' }]}>
          <Text style={[
            styles.ctaHeading,
            isDesktop && { fontSize: 34, lineHeight: 46 },
          ]}>
            Ready to be known{'\n'}before you're seen?
          </Text>
          <Pressable
            onPress={navigateToCovenant}
            style={({ pressed }) => [
              styles.ctaBtn,
              isDesktop && { paddingVertical: 18, paddingHorizontal: 56 },
              pressed && { opacity: 0.8, transform: [{ scale: 0.97 }] },
            ]}
          >
            <Text style={[styles.ctaBtnText, isDesktop && { fontSize: 14 }]}>Begin Your Journey</Text>
          </Pressable>
        </View>
      </View>

      {/* ─── FOOTER ─── */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>WHOLLY © 2026</Text>
      </View>
    </ScrollView>
  );
}

/* ─── STYLES ─── */
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0a0a0c',
  },
  scrollContent: {},

  /* ── Shared ── */
  innerMax: {
    width: '100%',
    alignSelf: 'center',
  },
  hairline: {
    width: 40,
    height: 1,
    backgroundColor: '#6366f1',
    marginBottom: 24,
    alignSelf: 'center',
    opacity: 0.5,
  },

  /* ── Hero ── */
  hero: {
    width: '100%',
  },
  heroGradient: {
    flex: 1,
    backgroundColor: 'rgba(18, 16, 14, 0.38)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 56,
    paddingHorizontal: 32,
  },
  heroInner: {
    alignItems: 'center',
    maxWidth: 520,
    width: '100%',
  },
  logoMark: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 6,
    marginBottom: 20,
  },
  heroHeadline: {
    fontFamily: FONTS.heading,
    fontSize: 30,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: 16,
  },
  heroSub: {
    fontFamily: FONTS.body,
    fontSize: 15,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    lineHeight: 23,
    marginBottom: 32,
  },
  heroCta: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    paddingVertical: 15,
    paddingHorizontal: 44,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: 16,
    ...(isWeb ? { cursor: 'pointer', backdropFilter: 'blur(8px)' } : {}),
  },
  heroCtaText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
    color: '#FFFFFF',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  heroSmall: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 0.5,
  },

  /* ── Editorial Intro ── */
  editorialSection: {
    paddingVertical: 64,
    backgroundColor: '#0a0a0c',
  },
  editorialKicker: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: '#6366f1',
    letterSpacing: 4,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 20,
  },
  editorialQuote: {
    fontFamily: FONTS.heading,
    fontSize: 22,
    color: '#f0f0f0',
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 20,
  },
  editorialBody: {
    fontFamily: FONTS.body,
    fontSize: 15,
    color: '#9ca3af',
    lineHeight: 26,
    textAlign: 'center',
    alignSelf: 'center',
    maxWidth: 500,
  },

  /* ── How It Works ── */
  howSection: {
    paddingVertical: 56,
    backgroundColor: '#141416',
  },
  howKicker: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: '#52525b',
    letterSpacing: 4,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 40,
  },
  howGrid: {
    gap: 32,
  },
  howItem: {
    marginBottom: 8,
  },
  howNum: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: '#6366f1',
    letterSpacing: 2,
    marginBottom: 10,
    opacity: 0.5,
  },
  howTitle: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 17,
    color: '#f0f0f0',
    marginBottom: 8,
    lineHeight: 24,
  },
  howDesc: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 22,
  },

  /* ── Layers ── */
  layersSection: {
    paddingVertical: 64,
    backgroundColor: '#0a0a0c',
  },
  layersKicker: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: '#6366f1',
    letterSpacing: 4,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 16,
  },
  layersHeading: {
    fontFamily: FONTS.heading,
    fontSize: 22,
    color: '#f0f0f0',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 40,
  },
  layersGrid: {
    gap: 0,
  },
  layerItem: {
    paddingVertical: 20,
  },
  layerItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  layerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  layerLabel: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 16,
    color: '#f0f0f0',
  },
  layerWeight: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: '#6366f1',
  },
  layerDesc: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 22,
  },

  /* ── Pricing ── */
  priceSection: {
    paddingVertical: 64,
    backgroundColor: '#141416',
  },
  priceKicker: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: '#52525b',
    letterSpacing: 4,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 32,
  },
  priceRow: {
    gap: 24,
    marginBottom: 32,
  },
  priceLeft: {},
  priceHeading: {
    fontFamily: FONTS.heading,
    fontSize: 24,
    color: '#f0f0f0',
    marginBottom: 8,
  },
  priceAmount: {
    fontFamily: FONTS.heading,
    fontSize: 36,
    color: '#6366f1',
    marginBottom: 6,
  },
  pricePer: {
    fontFamily: FONTS.body,
    fontSize: 15,
    color: '#52525b',
  },
  priceLock: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: '#D4A853',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  priceRight: {
    gap: 14,
  },
  priceFeatRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  priceFeatDash: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: '#6366f1',
    marginTop: 1,
  },
  priceFeatText: {
    fontFamily: FONTS.body,
    fontSize: 15,
    color: '#9ca3af',
    lineHeight: 22,
    flex: 1,
  },
  priceFree: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: '#52525b',
    textAlign: 'center',
    fontStyle: 'italic',
  },

  /* ── Bottom CTA ── */
  ctaSection: {
    paddingVertical: 72,
    backgroundColor: '#141416',
  },
  ctaHeading: {
    fontFamily: FONTS.heading,
    fontSize: 26,
    color: '#f0f0f0',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 32,
  },
  ctaBtn: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: BORDER_RADIUS.full,
    ...(isWeb ? { cursor: 'pointer' } : {}),
  },
  ctaBtnText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
    color: '#FFFFFF',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  /* ── Footer ── */
  footer: {
    paddingVertical: 32,
    alignItems: 'center',
    backgroundColor: '#0a0a0c',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  footerText: {
    fontFamily: FONTS.body,
    fontSize: 11,
    color: '#52525b',
    letterSpacing: 2,
  },
});
