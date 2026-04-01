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
import Head from 'expo-router/head';
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
      <Head>
        <title>WHOLLY — Premium Faith-First Matchmaking</title>
        <meta name="description" content="A dating experience built around depth. WHOLLY matches Spirit-filled Christians on emotional health, values, life vision, and intellectual compatibility — before you ever see a photo." />
        <meta property="og:title" content="WHOLLY — Premium Faith-First Matchmaking" />
        <meta property="og:description" content="Matched on what actually matters. A dating experience built around depth — not just a photo." />
        <meta property="og:url" content="https://whollydate.com/" />
        <meta name="twitter:title" content="WHOLLY — Premium Faith-First Matchmaking" />
        <meta name="twitter:description" content="Matched on what actually matters. A dating experience built around depth — not just a photo." />
      </Head>
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

      {/* ─── SAFETY & VERIFICATION ─── */}
      <View style={[styles.safetySection, { paddingHorizontal: pad }]}>
        <View style={[styles.innerMax, maxW ? { maxWidth: maxW } : undefined]}>
          <Text style={styles.safetyKicker}>Trust & Safety</Text>
          <Text style={[
            styles.safetyHeading,
            isDesktop && { fontSize: 30, lineHeight: 40 },
          ]}>
            Built to protect your heart{'\n'}and your data.
          </Text>

          <View style={[
            styles.safetyGrid,
            isDesktop && { flexDirection: 'row', gap: 32 },
          ]}>
            {[
              {
                icon: '\u2714',
                title: 'Pastoral Verification',
                desc: 'Blue Tick confirms church membership through your pastor. Gold Tick adds a personal character endorsement. Real accountability from real community.',
              },
              {
                icon: '\u26E8',
                title: 'Covenant-First Culture',
                desc: 'Every user signs a covenant committing to honesty, respect, and Spirit-led behavior. Violations result in account removal — no exceptions.',
              },
              {
                icon: '\uD83D\uDD12',
                title: 'Your Data Stays Yours',
                desc: 'End-to-end encryption. Row-level security. Your questionnaire answers are never shared. We never sell your data or use it for ads.',
              },
              {
                icon: '\uD83D\uDEA9',
                title: 'Active Moderation',
                desc: 'Report any user at any time. Our team reviews every report within 24 hours. Community safety is non-negotiable.',
              },
            ].map((item, i) => (
              <View key={i} style={[styles.safetyItem, isDesktop && { flex: 1 }]}>
                <Text style={styles.safetyIcon}>{item.icon}</Text>
                <Text style={styles.safetyItemTitle}>{item.title}</Text>
                <Text style={styles.safetyItemDesc}>{item.desc}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* ─── SOCIAL PROOF ─── */}
      <View style={[styles.proofSection, { paddingHorizontal: pad }]}>
        <View style={[styles.innerMax, maxW ? { maxWidth: maxW } : undefined, { alignItems: 'center' }]}>
          <Text style={styles.proofKicker}>Early Community</Text>
          <Text style={[
            styles.proofHeading,
            isDesktop && { fontSize: 28 },
          ]}>
            Join the founding members.
          </Text>
          <Text style={styles.proofBody}>
            WHOLLY is in its founding season. The first wave of members shapes the culture, and founding members lock in launch pricing forever. This is the beginning of something different.
          </Text>

          <View style={[
            styles.proofQuotes,
            isDesktop && { flexDirection: 'row', gap: 32 },
          ]}>
            {[
              { quote: 'Finally, a platform that asks the right questions before showing me a face.', attribution: '— Early tester, Sydney' },
              { quote: 'The covenant changed everything. It filters out people who aren\'t serious.', attribution: '— Founding member, Melbourne' },
              { quote: 'I\'ve never felt safer on a dating app. The pastoral verification is brilliant.', attribution: '— Beta user, Brisbane' },
            ].map((q, i) => (
              <View key={i} style={[styles.proofQuote, isDesktop && { flex: 1 }]}>
                <Text style={styles.proofQuoteText}>{q.quote}</Text>
                <Text style={styles.proofAttribution}>{q.attribution}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* ─── FAQ ─── */}
      <View style={[styles.faqSection, { paddingHorizontal: pad }]}>
        <View style={[styles.innerMax, maxW ? { maxWidth: maxW } : undefined]}>
          <Text style={styles.faqKicker}>Questions</Text>
          <Text style={[
            styles.faqHeading,
            isDesktop && { fontSize: 28 },
          ]}>
            Frequently asked
          </Text>

          {[
            {
              q: 'How does matching work?',
              a: 'You answer 12 sections of questions covering theology, emotional health, conflict style, and life vision. Our algorithm scores 99 data points across four weighted dimensions using a geometric mean — penalising imbalance rather than averaging it out. You see detailed breakdowns, not just a percentage.',
            },
            {
              q: 'What denomination is this for?',
              a: 'WHOLLY is for Spirit-filled Christians across all denominations. Catholic, Protestant, Pentecostal, non-denominational — what matters is a living faith and a heart for intentional relationship.',
            },
            {
              q: 'What happens after I match with someone?',
              a: 'You see a detailed compatibility breakdown across all four dimensions. Photos are revealed progressively based on your subscription tier. Messaging opens once both users express interest.',
            },
            {
              q: 'Is my data safe?',
              a: 'Yes. Your data is encrypted in transit and at rest, stored on AWS with row-level security. Your questionnaire answers are never shown to other users — only your compatibility scores are shared.',
            },
            {
              q: 'Can I delete my account?',
              a: 'Absolutely. You can request deletion at any time from Settings. After a 30-day grace period (in case you change your mind), all your data is permanently removed.',
            },
            {
              q: 'What is the covenant?',
              a: 'Every user signs a covenant before joining — a commitment to honesty, respect, and Spirit-led behavior. It\'s what sets WHOLLY apart. Violate it, and your account is removed.',
            },
          ].map((item, i) => (
            <View key={i} style={styles.faqItem}>
              <Text style={styles.faqQuestion}>{item.q}</Text>
              <Text style={styles.faqAnswer}>{item.a}</Text>
            </View>
          ))}
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
        <View style={styles.footerLinks}>
          <Pressable onPress={() => router.push('/about')}>
            <Text style={styles.footerLink}>About</Text>
          </Pressable>
          <Text style={styles.footerDot}>·</Text>
          <Pressable onPress={() => router.push('/covenant')}>
            <Text style={styles.footerLink}>The Covenant</Text>
          </Pressable>
          <Text style={styles.footerDot}>·</Text>
          <Pressable onPress={() => router.push('/contact')}>
            <Text style={styles.footerLink}>Contact</Text>
          </Pressable>
          <Text style={styles.footerDot}>·</Text>
          <Pressable onPress={() => router.push('/privacy')}>
            <Text style={styles.footerLink}>Privacy</Text>
          </Pressable>
          <Text style={styles.footerDot}>·</Text>
          <Pressable onPress={() => router.push('/terms')}>
            <Text style={styles.footerLink}>Terms</Text>
          </Pressable>
          <Text style={styles.footerDot}>·</Text>
          <Pressable onPress={() => router.push('/login')}>
            <Text style={styles.footerLink}>Log In</Text>
          </Pressable>
        </View>
        <Text style={styles.footerText}>WHOLLY © 2026</Text>
      </View>
    </ScrollView>
  );
}

/* ─── STYLES ─── */
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    backgroundColor: COLORS.primary,
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
    backgroundColor: COLORS.background,
  },
  editorialKicker: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: COLORS.primary,
    letterSpacing: 4,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 20,
  },
  editorialQuote: {
    fontFamily: FONTS.heading,
    fontSize: 22,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 20,
  },
  editorialBody: {
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 26,
    textAlign: 'center',
    alignSelf: 'center',
    maxWidth: 500,
  },

  /* ── How It Works ── */
  howSection: {
    paddingVertical: 56,
    backgroundColor: COLORS.secondary,
  },
  howKicker: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: COLORS.textMuted,
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
    color: COLORS.primary,
    letterSpacing: 2,
    marginBottom: 10,
    opacity: 0.5,
  },
  howTitle: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 17,
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 24,
  },
  howDesc: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },

  /* ── Layers ── */
  layersSection: {
    paddingVertical: 64,
    backgroundColor: COLORS.background,
  },
  layersKicker: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: COLORS.primary,
    letterSpacing: 4,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 16,
  },
  layersHeading: {
    fontFamily: FONTS.heading,
    fontSize: 22,
    color: COLORS.text,
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
    borderBottomColor: COLORS.borderLight,
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
    color: COLORS.text,
  },
  layerWeight: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.primary,
  },
  layerDesc: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },

  /* ── Pricing ── */
  priceSection: {
    paddingVertical: 64,
    backgroundColor: COLORS.secondary,
  },
  priceKicker: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: COLORS.textMuted,
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
    color: COLORS.text,
    marginBottom: 8,
  },
  priceAmount: {
    fontFamily: FONTS.heading,
    fontSize: 36,
    color: COLORS.primary,
    marginBottom: 6,
  },
  pricePer: {
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.textMuted,
  },
  priceLock: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.gold,
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
    color: COLORS.primary,
    marginTop: 1,
  },
  priceFeatText: {
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
    flex: 1,
  },
  priceFree: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  /* ── Safety & Verification ── */
  safetySection: {
    paddingVertical: 64,
    backgroundColor: COLORS.background,
  },
  safetyKicker: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: COLORS.primary,
    letterSpacing: 4,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 16,
  },
  safetyHeading: {
    fontFamily: FONTS.heading,
    fontSize: 22,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 40,
  },
  safetyGrid: {
    gap: 24,
  },
  safetyItem: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  safetyIcon: {
    fontSize: 20,
    marginBottom: 12,
  },
  safetyItemTitle: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 8,
  },
  safetyItemDesc: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },

  /* ── Social Proof ── */
  proofSection: {
    paddingVertical: 64,
    backgroundColor: COLORS.secondary,
  },
  proofKicker: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: COLORS.textMuted,
    letterSpacing: 4,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 16,
  },
  proofHeading: {
    fontFamily: FONTS.heading,
    fontSize: 22,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  proofBody: {
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: 520,
    marginBottom: 40,
  },
  proofQuotes: {
    gap: 20,
    width: '100%',
  },
  proofQuote: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  proofQuoteText: {
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 24,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  proofAttribution: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 13,
    color: COLORS.textMuted,
  },

  /* ── FAQ ── */
  faqSection: {
    paddingVertical: 64,
    backgroundColor: COLORS.background,
  },
  faqKicker: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: COLORS.primary,
    letterSpacing: 4,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 16,
  },
  faqHeading: {
    fontFamily: FONTS.heading,
    fontSize: 22,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 40,
  },
  faqItem: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  faqQuestion: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 8,
  },
  faqAnswer: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 23,
  },

  /* ── Bottom CTA ── */
  ctaSection: {
    paddingVertical: 72,
    backgroundColor: COLORS.secondary,
  },
  ctaHeading: {
    fontFamily: FONTS.heading,
    fontSize: 26,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 32,
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
    color: '#FFFFFF',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  /* ── Footer ── */
  footer: {
    paddingVertical: 32,
    alignItems: 'center',
    backgroundColor: COLORS.footerBg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  footerLink: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.primary,
    ...(isWeb ? { cursor: 'pointer' } : {}),
  },
  footerDot: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
  },
  footerText: {
    fontFamily: FONTS.body,
    fontSize: 11,
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 2,
  },
});
