import { View, Text, ScrollView, Platform, StyleSheet, Pressable, Image, ActivityIndicator, TextInput } from 'react-native';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../context/OnboardingContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { DEMO_PROFILES } from '../../data/demoProfiles';
import { getRankedProfiles } from '../../services/matching';
import { getMatches, expressInterest } from '../../services/profiles';
import { DemoProfile, MatchTier } from '../../types';
import Button from '../../components/ui/Button';

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
type SortType = 'overall' | 'spiritual' | 'emotional' | 'intellectual' | 'lifeVision';

export default function ResultsPage() {
  const router = useRouter();
  const { state } = useOnboarding();
  const { profile } = useAuth();
  const { colors } = useTheme();
  const [filter, setFilter] = useState<FilterType>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [liveProfiles, setLiveProfiles] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortType>('overall');
  const [showFilters, setShowFilters] = useState(false);
  const [ageMin, setAgeMin] = useState('18');
  const [ageMax, setAgeMax] = useState('99');
  const [cityFilter, setCityFilter] = useState('');
  const [denomFilter, setDenomFilter] = useState('');

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
    let results = filter === 'all'
      ? rankedProfiles.filter((p: any) => p.tier !== 'below')
      : rankedProfiles.filter((p: any) => p.tier === filter);

    // Apply advanced filters
    const minAge = parseInt(ageMin) || 18;
    const maxAge = parseInt(ageMax) || 99;
    results = results.filter((p: any) => p.age >= minAge && p.age <= maxAge);

    if (cityFilter.trim()) {
      const cf = cityFilter.toLowerCase();
      results = results.filter((p: any) => (p.city || '').toLowerCase().includes(cf));
    }

    if (denomFilter) {
      results = results.filter((p: any) => p.denomination === denomFilter);
    }

    // Sort
    if (sortBy !== 'overall') {
      results = [...results].sort((a: any, b: any) => {
        const aScore = a.scores?.[sortBy] || 0;
        const bScore = b.scores?.[sortBy] || 0;
        return bScore - aScore;
      });
    }

    return results;
  }, [rankedProfiles, filter, sortBy, ageMin, ageMax, cityFilter, denomFilter]);

  const counts = useMemo(() => ({
    all: rankedProfiles.filter((p: any) => p.tier !== 'below').length,
    exceptional: rankedProfiles.filter((p: any) => p.tier === 'exceptional').length,
    strong: rankedProfiles.filter((p: any) => p.tier === 'strong').length,
    compatible: rankedProfiles.filter((p: any) => p.tier === 'compatible').length,
  }), [rankedProfiles]);

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

  const [interestState, setInterestState] = useState<Record<string, 'interested' | 'passed' | 'mutual'>>({});

  const handleInterest = async (matchId: string, interested: boolean) => {
    const profileId = (state as any).profileId || profile?.id;
    if (!profileId) return;

    const success = await expressInterest(profileId, matchId, interested);
    if (success) {
      setInterestState(prev => ({
        ...prev,
        [matchId]: interested ? 'interested' : 'passed',
      }));
    }
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

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 20 }}
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
                ...(isWeb ? { fontFamily: 'DM Sans, sans-serif' } : {}),
              }}>
                {btn.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Advanced Filters Toggle */}
      <Pressable
        onPress={() => setShowFilters(!showFilters)}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 10,
          marginBottom: 8,
        }}
      >
        <Text style={{
          fontSize: 13,
          fontWeight: '500',
          color: colors.textSecondary,
          ...(isWeb ? { fontFamily: 'DM Sans, sans-serif' } : {}),
        }}>
          {showFilters ? 'Hide Filters' : 'Advanced Filters'}
        </Text>
        <Text style={{ color: colors.accent, fontSize: 12 }}>
          {showFilters ? '▲' : '▼'}
        </Text>
      </Pressable>

      {showFilters && (
        <View style={{
          backgroundColor: colors.surface,
          borderRadius: 14,
          padding: 16,
          marginBottom: 16,
          gap: 14,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.surfaceBorder,
        }}>
          {/* Age Range */}
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Text style={{ fontSize: 13, color: colors.textSecondary, width: 80, ...(isWeb ? { fontFamily: 'DM Sans, sans-serif' } : {}) }}>
              Age
            </Text>
            <TextInput
              style={{
                flex: 1, padding: 8, borderRadius: 8,
                backgroundColor: colors.background, color: colors.text,
                borderWidth: 1, borderColor: colors.surfaceBorder,
                fontSize: 14, textAlign: 'center',
                ...(isWeb ? { fontFamily: 'DM Sans, sans-serif' } : {}),
              }}
              value={ageMin}
              onChangeText={setAgeMin}
              keyboardType="numeric"
              placeholder="18"
              placeholderTextColor={colors.textMuted}
            />
            <Text style={{ color: colors.textMuted }}>—</Text>
            <TextInput
              style={{
                flex: 1, padding: 8, borderRadius: 8,
                backgroundColor: colors.background, color: colors.text,
                borderWidth: 1, borderColor: colors.surfaceBorder,
                fontSize: 14, textAlign: 'center',
                ...(isWeb ? { fontFamily: 'DM Sans, sans-serif' } : {}),
              }}
              value={ageMax}
              onChangeText={setAgeMax}
              keyboardType="numeric"
              placeholder="99"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          {/* City */}
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Text style={{ fontSize: 13, color: colors.textSecondary, width: 80, ...(isWeb ? { fontFamily: 'DM Sans, sans-serif' } : {}) }}>
              City
            </Text>
            <TextInput
              style={{
                flex: 1, padding: 8, borderRadius: 8,
                backgroundColor: colors.background, color: colors.text,
                borderWidth: 1, borderColor: colors.surfaceBorder,
                fontSize: 14,
                ...(isWeb ? { fontFamily: 'DM Sans, sans-serif' } : {}),
              }}
              value={cityFilter}
              onChangeText={setCityFilter}
              placeholder="Any city"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          {/* Denomination */}
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Text style={{ fontSize: 13, color: colors.textSecondary, width: 80, ...(isWeb ? { fontFamily: 'DM Sans, sans-serif' } : {}) }}>
              Church
            </Text>
            <View style={{ flex: 1, flexDirection: 'row', gap: 6 }}>
              {[
                { key: '', label: 'All' },
                { key: 'futures-church', label: 'Futures' },
                { key: 'planetshakers', label: 'Planetshakers' },
              ].map((d) => (
                <Pressable
                  key={d.key}
                  onPress={() => setDenomFilter(d.key)}
                  style={{
                    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 9999,
                    backgroundColor: denomFilter === d.key ? colors.accent : colors.background,
                    borderWidth: 1,
                    borderColor: denomFilter === d.key ? colors.accent : colors.surfaceBorder,
                  }}
                >
                  <Text style={{
                    fontSize: 11, fontWeight: denomFilter === d.key ? '600' : '400',
                    color: denomFilter === d.key ? '#fff' : colors.textSecondary,
                    ...(isWeb ? { fontFamily: 'DM Sans, sans-serif' } : {}),
                  }}>
                    {d.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Sort By */}
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Text style={{ fontSize: 13, color: colors.textSecondary, width: 80, ...(isWeb ? { fontFamily: 'DM Sans, sans-serif' } : {}) }}>
              Sort by
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
              {[
                { key: 'overall' as SortType, label: 'Overall' },
                { key: 'spiritual' as SortType, label: 'Spiritual' },
                { key: 'emotional' as SortType, label: 'Emotional' },
                { key: 'intellectual' as SortType, label: 'Intellectual' },
                { key: 'lifeVision' as SortType, label: 'Life Vision' },
              ].map((s) => (
                <Pressable
                  key={s.key}
                  onPress={() => setSortBy(s.key)}
                  style={{
                    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 9999,
                    backgroundColor: sortBy === s.key ? colors.accent : colors.background,
                    borderWidth: 1,
                    borderColor: sortBy === s.key ? colors.accent : colors.surfaceBorder,
                  }}
                >
                  <Text style={{
                    fontSize: 11, fontWeight: sortBy === s.key ? '600' : '400',
                    color: sortBy === s.key ? '#fff' : colors.textSecondary,
                    ...(isWeb ? { fontFamily: 'DM Sans, sans-serif' } : {}),
                  }}>
                    {s.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {/* Results Count */}
      <Text style={{
        fontSize: 12, color: colors.textMuted, marginBottom: 12,
        ...(isWeb ? { fontFamily: 'DM Sans, sans-serif' } : {}),
      }}>
        {filteredProfiles.length} match{filteredProfiles.length !== 1 ? 'es' : ''}
      </Text>

      {/* Match Cards */}
      <View style={{ gap: 12 }}>
        {filteredProfiles.map((profile: any) => {
          const tierColor = getTierColor(profile.tier);
          const isExpanded = expandedId === profile.id;
          const familiarity = getProfileFamiliarity(profile.scores?.spiritual || 70);
          const photoUrl = profile.photo_url || getPhotoUrl(
            profile.id,
            profile.gender,
            profile.name || profile.first_name || 'Unknown',
          );
          const displayName = profile.name || profile.first_name || 'Unknown';

          return (
            <Pressable
              key={profile.id}
              onPress={() => setExpandedId(isExpanded ? null : profile.id)}
              style={[styles.card, {
                backgroundColor: colors.surface,
                borderColor: colors.surfaceBorder,
              }]}
            >
              {/* Avatar + Name Row */}
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 16, marginBottom: 14 }}>
                {/* Photo */}
                <View style={{ alignItems: 'center', gap: 6 }}>
                  <View style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    backgroundColor: colors.surface,
                    borderWidth: 2,
                    borderColor: 'rgba(255,255,255,0.1)',
                    overflow: 'hidden',
                  }}>
                    <Image
                      source={{ uri: photoUrl }}
                      style={{ width: 64, height: 64 }}
                    />
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
                      ...(isWeb ? { fontFamily: 'DM Sans, sans-serif' } : {}),
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
                        ...(isWeb ? { fontFamily: 'DM Sans, sans-serif' } : {}),
                      }}>
                        {displayName}, {profile.age}
                      </Text>
                      <Text style={{
                        fontSize: 13,
                        color: colors.textMuted,
                        ...(isWeb ? { fontFamily: 'DM Sans, sans-serif' } : {}),
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
                        ...(isWeb ? { fontFamily: 'DM Sans, sans-serif' } : {}),
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
                      ...(isWeb ? { fontFamily: 'DM Sans, sans-serif' } : {}),
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
                ...(isWeb ? { fontFamily: 'DM Sans, sans-serif' } : {}),
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
                  ...(isWeb ? { fontFamily: 'DM Sans, sans-serif' } : {}),
                }}>
                  Compatibility
                </Text>
                <Text style={{
                  fontSize: 24,
                  fontWeight: '300',
                  color: colors.accent,
                  letterSpacing: -0.5,
                  ...(isWeb ? { fontFamily: 'DM Sans, sans-serif' } : {}),
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
                          ...(isWeb ? { fontFamily: 'DM Sans, sans-serif' } : {}),
                        }}>
                          {item.label}
                        </Text>
                        <Text style={{
                          fontSize: 13,
                          fontWeight: '500',
                          color: colors.text,
                          ...(isWeb ? { fontFamily: 'DM Sans, sans-serif' } : {}),
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

                  {/* Interest Buttons */}
                  {interestState[profile.id] === 'interested' ? (
                    <View style={{
                      backgroundColor: 'rgba(76,175,125,0.12)',
                      paddingVertical: 12,
                      borderRadius: 9999,
                      alignItems: 'center',
                      marginTop: 8,
                      borderWidth: 1,
                      borderColor: 'rgba(76,175,125,0.3)',
                    }}>
                      <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: '#4CAF7D',
                        ...(isWeb ? { fontFamily: 'DM Sans, sans-serif' } : {}),
                      }}>
                        Interest Expressed
                      </Text>
                    </View>
                  ) : interestState[profile.id] === 'passed' ? (
                    <View style={{
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      paddingVertical: 12,
                      borderRadius: 9999,
                      alignItems: 'center',
                      marginTop: 8,
                    }}>
                      <Text style={{
                        fontSize: 14,
                        fontWeight: '500',
                        color: colors.textMuted,
                        ...(isWeb ? { fontFamily: 'DM Sans, sans-serif' } : {}),
                      }}>
                        Passed
                      </Text>
                    </View>
                  ) : (
                    <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
                      <Pressable
                        onPress={() => handleInterest(profile.id, false)}
                        style={{
                          flex: 1,
                          backgroundColor: 'rgba(255,255,255,0.06)',
                          paddingVertical: 12,
                          borderRadius: 9999,
                          alignItems: 'center',
                          borderWidth: 1,
                          borderColor: 'rgba(255,255,255,0.1)',
                        }}
                      >
                        <Text style={{
                          fontSize: 14,
                          fontWeight: '500',
                          color: colors.textSecondary,
                          ...(isWeb ? { fontFamily: 'DM Sans, sans-serif' } : {}),
                        }}>
                          Pass
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() => handleInterest(profile.id, true)}
                        style={{
                          flex: 2,
                          backgroundColor: colors.accent,
                          paddingVertical: 12,
                          borderRadius: 9999,
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{
                          fontSize: 14,
                          fontWeight: '600',
                          color: '#ffffff',
                          ...(isWeb ? { fontFamily: 'DM Sans, sans-serif' } : {}),
                        }}>
                          I'm Interested
                        </Text>
                      </Pressable>
                    </View>
                  )}

                  <Text style={{
                    fontSize: 11,
                    color: colors.textMuted,
                    marginTop: 6,
                    textAlign: 'center',
                    ...(isWeb ? { fontFamily: 'DM Sans, sans-serif' } : {}),
                  }}>
                    Photos revealed after mutual interest
                  </Text>
                </View>
              )}

              {!isExpanded && (
                <Text style={{
                  fontSize: 12,
                  color: colors.textMuted,
                  textAlign: 'center',
                  marginTop: 8,
                  ...(isWeb ? { fontFamily: 'DM Sans, sans-serif' } : {}),
                }}>
                  Tap to see score breakdown
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Bottom Actions */}
      <View style={{ gap: 12, marginTop: 24 }}>
        <Button
          title="Messages"
          onPress={() => router.push('/chat')}
          variant="primary"
        />
        <Button
          title="My Profile"
          onPress={() => router.push('/profile')}
          variant="secondary"
        />
      </View>
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
    fontFamily: 'DM Sans, sans-serif',
  },
  card: {
    borderRadius: 16,
    padding: 20,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
