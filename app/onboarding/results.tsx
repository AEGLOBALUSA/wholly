import { View, Text, ScrollView, Platform, StyleSheet, Pressable, Image, ActivityIndicator } from 'react-native';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../context/OnboardingContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { analytics } from '../../context/AnalyticsContext';
import { DEMO_PROFILES } from '../../data/demoProfiles';
import { getRankedProfiles } from '../../services/matching';
import { getMatches, expressInterest } from '../../services/profiles';
import { DemoProfile, MatchTier } from '../../types';
import Button from '../../components/ui/Button';
import ThemeToggle from '../../components/ui/ThemeToggle';
import BlurredCard from '../../components/results/BlurredCard';
import PaywallModal from '../../components/ui/PaywallModal';

const isWeb = Platform.OS === 'web';

// Stock photo URL from randomuser.me — real human headshots
const photoCache: Record<string, string> = {};

function getPhotoUrl(profileId: string, gender: 'male' | 'female', name: string): string {
  if (photoCache[profileId]) return photoCache[profileId];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % 99;

  const folder = gender === 'female' ? 'women' : 'men';
  const url = `https://randomuser.me/api/portraits/${folder}/${index}.jpg`;
  photoCache[profileId] = url;
  return url;
}

function getProfileFamiliarity(spiritualScore: number): { level: string; color: string } {
  if (spiritualScore >= 85) return { level: 'Strong', color: '#4CAF7D' };
  if (spiritualScore >= 75) return { level: 'Moderate', color: '#D4A853' };
  if (spiritualScore >= 65) return { level: 'Growing', color: '#0ea5e9' };
  return { level: 'New', color: '#9CA3AF' };
}

function getTierColor(tier: MatchTier | string): string {
  switch (tier) {
    case 'exceptional': return '#4CAF7D';
    case 'strong': return '#D4A853';
    case 'compatible': return '#9CA3AF';
    case 'below': return '#E25050';
    default: return '#9CA3AF';
  }
}

function getTierLabel(tier: MatchTier | string): string {
  switch (tier) {
    case 'exceptional': return 'Exceptional';
    case 'strong': return 'Strong';
    case 'compatible': return 'Compatible';
    case 'below': return 'Below Average';
    default: return tier;
  }
}

function getBarColor(score: number): string {
  if (score >= 80) return '#4CAF7D';
  if (score >= 60) return '#D4A853';
  return '#9CA3AF';
}

type FilterType = 'all' | 'exceptional' | 'strong' | 'compatible';
type ThresholdType = 'all' | '72' | '82';

export default function ResultsPage() {
  const router = useRouter();
  const { state } = useOnboarding();
  const { profile } = useAuth();
  const { colors } = useTheme();
  const { tier } = useSubscription();
  const [filter, setFilter] = useState<FilterType>('all');
  const [threshold, setThreshold] = useState<ThresholdType>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [liveProfiles, setLiveProfiles] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [paywallVisible, setPaywallVisible] = useState(false);

  // Gender filter: men see women, women see men
  const userGender = state.answers.basicInfo.gender;
  const oppositeGender = userGender === 'male' ? 'female' : 'male';

  // Try to load from Supabase, fall back to demo
  useEffect(() => {
    const loadMatches = async () => {
      const profileId = (state as any).profileId || profile?.id || null;
      const matches = await getMatches(profileId, userGender);
      setLiveProfiles(matches);
      setLoading(false);
    };

    loadMatches();
  }, [profile, userGender]);

  // Demo mode fallback
  const rankedProfiles = useMemo(() => {
    if (liveProfiles && liveProfiles.length > 0) {
      return liveProfiles;
    }
    // Fallback to local demo data
    const genderFiltered = userGender
      ? DEMO_PROFILES.filter(p => p.gender === oppositeGender)
      : DEMO_PROFILES;
    return getRankedProfiles(state.answers, genderFiltered);
  }, [liveProfiles, state.answers, userGender, oppositeGender]);

  const filteredProfiles = useMemo(() => {
    let profiles = rankedProfiles;

    // Apply tier filter
    if (filter === 'all') {
      profiles = profiles.filter((p: any) => p.tier !== 'below');
    } else {
      profiles = profiles.filter((p: any) => p.tier === filter);
    }

    // Apply threshold filter (premium only)
    if (tier === 'premium' && threshold !== 'all') {
      const thresholdValue = parseInt(threshold);
      profiles = profiles.filter((p: any) => (p.overallScore || p.scores?.overall || 0) >= thresholdValue);
    }

    return profiles;
  }, [rankedProfiles, filter, threshold, tier]);

  const counts = useMemo(() => ({
    all: rankedProfiles.filter((p: any) => p.tier !== 'below').length,
    exceptional: rankedProfiles.filter((p: any) => p.tier === 'exceptional').length,
    strong: rankedProfiles.filter((p: any) => p.tier === 'strong').length,
    compatible: rankedProfiles.filter((p: any) => p.tier === 'compatible').length,
  }), [rankedProfiles]);

  // Track match view when component mounts and profiles are loaded
  useEffect(() => {
    if (!loading && rankedProfiles.length > 0) {
      analytics.matchView({
        exceptional: counts.exceptional,
        strong: counts.strong,
        compatible: counts.compatible,
        total: counts.all,
      });
    }
  }, [loading, counts]);

  const filterButtons: { key: FilterType; label: string }[] = [
    { key: 'all', label: `All (${counts.all})` },
    { key: 'exceptional', label: `Exceptional (${counts.exceptional})` },
    { key: 'strong', label: `Strong (${counts.strong})` },
    { key: 'compatible', label: `Compatible (${counts.compatible})` },
  ];

  const denominationLabel = (d: string) => {
    if (d === 'futures-church') return 'Futures Church';
    if (d === 'planetshakers') return 'Planetshakers';
    return d;
  };

  const handleInterest = async (matchId: string) => {
    const profileId = (state as any).profileId || profile?.id;
    if (profileId) {
      const matchProfile = rankedProfiles.find((p: any) => p.id === matchId);
      // Track interest expression
      analytics.interestExpress(matchId, matchProfile?.tier);
      await expressInterest(profileId, matchId, true);
    }
  };

  const handleExpandCard = (matchId: string) => {
    const matchProfile = rankedProfiles.find((p: any) => p.id === matchId);
    // Track match expansion
    analytics.matchExpand(matchId, matchProfile?.tier);
    setExpandedId(expandedId === matchId ? null : matchId);
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={[styles.subtitle, { color: colors.textSecondary, marginTop: 16 }, isWeb && styles.webFont]}>
          Finding your best matches...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }, isWeb && styles.webFont]}>
          Your Matches
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }, isWeb && styles.webFont]}>
          Based on your responses, here are the people most aligned with your faith, values, and vision for life.
        </Text>
      </View>

      {/* Free Tier Banner */}
      {tier === 'free' && (
        <View
          style={[
            styles.freeTierBanner,
            { backgroundColor: colors.accentSubtle, borderColor: colors.accentBorder },
          ]}
        >
          <View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: colors.accent,
                marginBottom: 8,
                ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
              }}
            >
              You have {counts.exceptional} Exceptional, {counts.strong} Strong, {counts.compatible} Compatible matches
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: colors.textSecondary,
                ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
              }}
            >
              Upgrade to see full profiles, bigger photos, and express interest.
            </Text>
          </View>
          <Button
            title="Unlock Matches"
            onPress={() => setPaywallVisible(true)}
            variant="primary"
          />
        </View>
      )}

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: tier === 'premium' ? 12 : 20 }}
        contentContainerStyle={{ gap: 8 }}
      >
        {filterButtons.map((btn) => {
          const isActive = filter === btn.key;
          return (
            <Pressable
              key={btn.key}
              onPress={() => setFilter(btn.key)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 9999,
                backgroundColor: isActive ? colors.accent : colors.surface,
                borderWidth: 1,
                borderColor: isActive ? colors.accent : colors.surfaceBorder,
              }}
            >
              <Text style={{
                fontSize: 13,
                fontWeight: isActive ? '600' : '400',
                color: isActive ? '#ffffff' : colors.textSecondary,
                ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
              }}>
                {btn.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Premium Threshold Selector */}
      {tier === 'premium' && (
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: colors.textSecondary,
              marginBottom: 8,
              ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
            }}
          >
            Threshold
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {(['all', '72', '82'] as const).map((thresholdOption) => {
              const isThresholdActive = threshold === thresholdOption;
              const label = thresholdOption === 'all' ? 'All' : `${thresholdOption}%+`;
              return (
                <Pressable
                  key={thresholdOption}
                  onPress={() => setThreshold(thresholdOption)}
                  style={{
                    flex: 1,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 8,
                    backgroundColor: isThresholdActive ? colors.accent : colors.surface,
                    borderWidth: 1,
                    borderColor: isThresholdActive ? colors.accent : colors.surfaceBorder,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: isThresholdActive ? '600' : '400',
                      color: isThresholdActive ? '#ffffff' : colors.textSecondary,
                      textAlign: 'center',
                      ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
                    }}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      {/* Match Cards */}
      <View style={{ gap: 12 }}>
        {filteredProfiles.map((profile: any) => {
          const photoUrl = profile.photo_url || getPhotoUrl(
            profile.id,
            profile.gender,
            profile.name || profile.first_name || 'Unknown',
          );
          const displayName = profile.name || profile.first_name || 'Unknown';

          // Show blurred card for free tier
          if (tier === 'free') {
            return (
              <BlurredCard
                key={profile.id}
                profileId={profile.id}
                name={displayName}
                age={profile.age}
                city={profile.city}
                tier={profile.tier}
                overallScore={profile.overallScore || profile.scores?.overall || 0}
                photoUrl={photoUrl}
                denomination={denominationLabel(profile.denomination)}
                bio={profile.bio}
              />
            );
          }

          // Full card for standard and premium tiers
          const tierColor = getTierColor(profile.tier);
          const isExpanded = expandedId === profile.id;
          const familiarity = getProfileFamiliarity(profile.scores?.spiritual || 70);
          const isPremium = tier === 'premium';
          // Standard = bigger photo (48x48), Premium = full photo (64x64)

          return (
            <Pressable
              key={profile.id}
              onPress={() => handleExpandCard(profile.id)}
              style={[styles.card, {
                backgroundColor: colors.surface,
                borderColor: colors.surfaceBorder,
              }]}
            >
              {/* Avatar + Name Row */}
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 16, marginBottom: 14 }}>
                {/* Photo — Standard=bigger photo, Premium=full reveal */}
                <View style={{ alignItems: 'center', gap: 6 }}>
                  <View style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    backgroundColor: colors.surfaceBorder,
                    borderWidth: 2,
                    borderColor: isPremium ? colors.accent + '40' : 'rgba(255,255,255,0.1)',
                    overflow: 'hidden',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    {isPremium ? (
                      // Premium: full-size clear photo
                      <Image
                        source={{ uri: photoUrl }}
                        style={{ width: 64, height: 64 }}
                      />
                    ) : (
                      // Standard: bigger photo (48px) centered in circle
                      <View style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        overflow: 'hidden',
                      }}>
                        <Image
                          source={{ uri: photoUrl }}
                          style={{ width: 48, height: 48 }}
                        />
                      </View>
                    )}
                  </View>
                  {/* Community Familiarity Tag */}
                  <View style={{
                    backgroundColor: familiarity.color + '18',
                    borderRadius: 6,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                  }}>
                    <Text style={{
                      fontSize: 9,
                      fontWeight: '600',
                      color: familiarity.color,
                      letterSpacing: 0.2,
                      ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
                    }}>
                      {familiarity.level}
                    </Text>
                  </View>
                </View>

                {/* Name + Location + Tier */}
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{
                        fontSize: 18,
                        fontWeight: '600',
                        color: colors.text,
                        marginBottom: 2,
                        ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
                      }}>
                        {displayName}, {profile.age}
                      </Text>
                      <Text style={{
                        fontSize: 13,
                        color: colors.textMuted,
                        ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
                      }}>
                        {profile.city}
                      </Text>
                    </View>
                    <View style={{
                      backgroundColor: tierColor + '18',
                      borderColor: tierColor + '40',
                      borderWidth: 1,
                      borderRadius: 9999,
                      paddingHorizontal: 12,
                      paddingVertical: 5,
                    }}>
                      <Text style={{
                        fontSize: 11,
                        fontWeight: '600',
                        color: tierColor,
                        letterSpacing: 0.3,
                        ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
                      }}>
                        {getTierLabel(profile.tier)}
                      </Text>
                    </View>
                  </View>

                  {/* Denomination tag */}
                  <View style={{
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 9999,
                    alignSelf: 'flex-start',
                    marginTop: 8,
                  }}>
                    <Text style={{
                      fontSize: 11,
                      fontWeight: '500',
                      color: colors.textSecondary,
                      ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
                    }}>
                      {denominationLabel(profile.denomination)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Bio */}
              <Text style={{
                fontSize: 14,
                lineHeight: 22,
                color: colors.textSecondary,
                marginBottom: 16,
                ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
              }}>
                {profile.bio}
              </Text>

              {/* Overall Score Row */}
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                paddingTop: 12,
                borderTopWidth: StyleSheet.hairlineWidth,
                borderTopColor: 'rgba(255,255,255,0.06)',
                marginBottom: isExpanded ? 16 : 0,
              }}>
                <Text style={{
                  fontSize: 13,
                  fontWeight: '500',
                  color: colors.textSecondary,
                  ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
                }}>
                  Compatibility
                </Text>
                <Text style={{
                  fontSize: 24,
                  fontWeight: '300',
                  color: colors.accent,
                  letterSpacing: -0.5,
                  ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
                }}>
                  {profile.overallScore || profile.scores?.overall || 0}%
                </Text>
              </View>

              {/* Expanded Score Breakdown */}
              {isExpanded && (
                <View style={{ gap: 14 }}>
                  {[
                    { label: 'Spiritual', score: profile.scores?.spiritual || 0 },
                    { label: 'Emotional', score: profile.scores?.emotional || 0 },
                    { label: 'Intellectual', score: profile.scores?.intellectual || 0 },
                    { label: 'Life Vision', score: profile.scores?.lifeVision || profile.scores?.life_vision || 0 },
                  ].map((item) => (
                    <View key={item.label} style={{ gap: 5 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{
                          fontSize: 13,
                          color: colors.textSecondary,
                          ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
                        }}>
                          {item.label}
                        </Text>
                        <Text style={{
                          fontSize: 13,
                          fontWeight: '500',
                          color: colors.text,
                          ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
                        }}>
                          {item.score}%
                        </Text>
                      </View>
                      <View style={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        overflow: 'hidden',
                      }}>
                        <View style={{
                          height: '100%',
                          width: `${item.score}%`,
                          borderRadius: 3,
                          backgroundColor: getBarColor(item.score),
                        }} />
                      </View>
                    </View>
                  ))}

                  {/* Interest Button */}
                  <Pressable
                    onPress={() => handleInterest(profile.id)}
                    style={{
                      backgroundColor: colors.accent,
                      paddingVertical: 12,
                      borderRadius: 9999,
                      alignItems: 'center',
                      marginTop: 8,
                    }}
                  >
                    <Text style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: '#ffffff',
                      ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
                    }}>
                      I'm Interested
                    </Text>
                  </Pressable>

                  {tier === 'standard' && (
                    <Text style={{
                      fontSize: 11,
                      color: colors.textMuted,
                      marginTop: 4,
                      textAlign: 'center',
                      ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
                    }}>
                      Upgrade to Intentional for full photo reveal
                    </Text>
                  )}
                  {tier === 'premium' && (
                    <Text style={{
                      fontSize: 11,
                      color: colors.textMuted,
                      marginTop: 4,
                      textAlign: 'center',
                      ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
                    }}>
                      Full photo access included with Intentional
                    </Text>
                  )}
                </View>
              )}

              {!isExpanded && (
                <Text style={{
                  fontSize: 12,
                  color: colors.textMuted,
                  textAlign: 'center',
                  marginTop: 8,
                  ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
                }}>
                  Tap to see score breakdown
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Deep Insights CTA */}
      <Pressable
        onPress={() => router.push('/onboarding/deep-insights')}
        style={[styles.deepInsightsCta, {
          backgroundColor: colors.accentSubtle,
          borderColor: colors.accentBorder,
        }]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <Text style={{ fontSize: 24 }}>{'🧠'}</Text>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: colors.text,
              ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
            }}>
              Go Deeper
            </Text>
            <Text style={{
              fontSize: 12,
              color: colors.textSecondary,
              marginTop: 2,
              ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
            }}>
              Optional — 36 more questions for richer matches
            </Text>
          </View>
        </View>
        <Text style={{
          fontSize: 12,
          color: colors.textMuted,
          lineHeight: 18,
          ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
        }}>
          Explore your attachment style, emotional regulation patterns, and relational compatibility. Based on validated psychometric instruments (ECR-R, DERS, PREPARE/ENRICH) used by relationship researchers worldwide.
        </Text>
        <View style={{
          marginTop: 12,
          backgroundColor: colors.accent,
          paddingVertical: 10,
          borderRadius: 9999,
          alignItems: 'center',
        }}>
          <Text style={{
            fontSize: 13,
            fontWeight: '600',
            color: '#ffffff',
            ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
          }}>
            Take the Deep Insights Questionnaire
          </Text>
        </View>
      </Pressable>

      {/* Bottom Actions */}
      <View style={{ gap: 12, marginTop: 24 }}>
        <Button
          title="Messages"
          onPress={() => router.push('/chat')}
          variant="primary"
        />
        <Button
          title="Back to Home"
          onPress={() => router.replace('/')}
          variant="secondary"
        />
      </View>

      <PaywallModal
        visible={paywallVisible}
        onClose={() => setPaywallVisible(false)}
      />
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
    paddingBottom: 48,
    maxWidth: 640,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    marginTop: 48,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 26,
  },
  webFont: {
    fontFamily: 'Inter, sans-serif',
  },
  card: {
    borderRadius: 16,
    padding: 20,
    borderWidth: StyleSheet.hairlineWidth,
  },
  deepInsightsCta: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    marginTop: 24,
  },
  freeTierBanner: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginBottom: 20,
    flexDirection: isWeb ? 'row' : 'column',
    justifyContent: isWeb ? 'space-between' : 'flex-start',
    alignItems: isWeb ? 'center' : 'stretch',
    gap: isWeb ? 16 : 12,
  },
});
