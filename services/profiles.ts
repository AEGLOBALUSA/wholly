/**
 * WHOLLY — Profile Service Layer
 *
 * Handles all profile CRUD operations via Supabase.
 * Falls back to demo data when Supabase is not configured.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Profile, ProfileInsert } from '../types/database';
import { OnboardingAnswers } from '../types';
import { DEMO_PROFILES } from '../data/demoProfiles';

/**
 * Create a new user profile after sign-up
 */
export async function createProfile(
  authId: string,
  email: string,
  basicInfo: {
    firstName: string;
    age: string;
    city: string;
    denomination: string;
    gender: string;
  },
): Promise<Profile | null> {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await supabase
    .from('profiles')
    .insert({
      auth_id: authId,
      email,
      first_name: basicInfo.firstName,
      age: parseInt(basicInfo.age, 10),
      city: basicInfo.city,
      denomination: basicInfo.denomination,
      gender: basicInfo.gender as 'male' | 'female',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating profile:', error);
    return null;
  }

  return data as Profile;
}

/**
 * Update an existing profile
 */
export async function updateProfile(
  profileId: string,
  updates: Partial<ProfileInsert>,
): Promise<Profile | null> {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', profileId)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    return null;
  }

  return data as Profile;
}

/**
 * Save onboarding answers for a section
 */
export async function saveOnboardingAnswers(
  profileId: string,
  section: string,
  answers: Record<string, any>,
): Promise<boolean> {
  if (!isSupabaseConfigured) return true; // Silently succeed in demo mode

  const { error } = await supabase
    .from('onboarding_answers')
    .upsert(
      {
        profile_id: profileId,
        section,
        answers,
      },
      { onConflict: 'profile_id,section' },
    );

  if (error) {
    console.error('Error saving answers:', error);
    return false;
  }

  return true;
}

/**
 * Mark onboarding as complete and trigger match calculation
 */
export async function completeOnboarding(profileId: string): Promise<boolean> {
  if (!isSupabaseConfigured) return true;

  // Mark profile as complete
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ onboarding_complete: true })
    .eq('id', profileId);

  if (updateError) {
    console.error('Error completing onboarding:', updateError);
    return false;
  }

  // Trigger server-side match calculation
  try {
    const { error: fnError } = await supabase.functions.invoke('calculate-matches', {
      body: { user_profile_id: profileId },
    });

    if (fnError) {
      console.error('Error calculating matches:', fnError);
      // Non-fatal — matches can be recalculated later
    }
  } catch (err) {
    console.error('Edge function error:', err);
  }

  return true;
}

/**
 * Calculate community familiarity score from jargon answers
 */
export function calculateCommunityFamiliarity(
  selectedTerms: string[],
  allTerms: Array<{ id: string; isAuthentic: boolean }>,
): number {
  const authenticTerms = allTerms.filter((t) => t.isAuthentic);
  const decoyTerms = allTerms.filter((t) => !t.isAuthentic);

  const authenticSelected = selectedTerms.filter((id) =>
    authenticTerms.some((t) => t.id === id),
  ).length;
  const decoySelected = selectedTerms.filter((id) =>
    decoyTerms.some((t) => t.id === id),
  ).length;

  const totalAuthentic = authenticTerms.length;
  if (totalAuthentic === 0) return 0;

  const score = Math.round(
    ((authenticSelected - decoySelected) / totalAuthentic) * 100,
  );
  return Math.max(0, Math.min(100, score));
}

/**
 * Get ranked matches for a user
 * Falls back to demo data when Supabase isn't configured
 */
export async function getMatches(
  profileId: string | null,
  userGender: string,
) {
  if (!isSupabaseConfigured || !profileId) {
    // Demo mode — use local data
    const oppositeGender = userGender === 'male' ? 'female' : 'male';
    return DEMO_PROFILES
      .filter((p) => p.gender === oppositeGender)
      .sort((a, b) => b.overallScore - a.overallScore);
  }

  // Live mode — query from Supabase
  const oppositeGender = userGender === 'male' ? 'female' : 'male';

  const { data, error } = await supabase.rpc('get_user_matches', {
    p_user_id: profileId,
    p_gender_filter: oppositeGender,
  });

  if (error) {
    console.error('Error fetching matches:', error);
    // Fall back to demo data
    return DEMO_PROFILES
      .filter((p) => p.gender === oppositeGender)
      .sort((a, b) => b.overallScore - a.overallScore);
  }

  // Transform Supabase results to match DemoProfile shape
  return (data || []).map((row: any) => ({
    id: row.profile_id,
    name: row.first_name,
    age: row.age,
    city: row.city,
    denomination: row.denomination,
    gender: row.gender,
    bio: row.bio || '',
    photo_url: row.photo_url,
    communityFamiliarity: row.community_familiarity_score,
    scores: {
      spiritual: row.spiritual,
      emotional: row.emotional,
      intellectual: row.intellectual,
      lifeVision: row.life_vision,
      overall: row.overall,
    },
    tier: row.tier,
    overallScore: row.overall,
  }));
}

/**
 * Express interest in a match
 */
export async function expressInterest(
  userId: string,
  matchId: string,
  interested: boolean,
): Promise<boolean> {
  if (!isSupabaseConfigured) return true;

  // Check if a match record exists
  const { data: existing } = await supabase
    .from('matches')
    .select('*')
    .or(`and(user_a.eq.${userId},user_b.eq.${matchId}),and(user_a.eq.${matchId},user_b.eq.${userId})`)
    .single();

  if (existing) {
    // Update existing match
    const isUserA = existing.user_a === userId;
    const updateField = isUserA ? 'user_a_interested' : 'user_b_interested';
    const otherInterested = isUserA ? existing.user_b_interested : existing.user_a_interested;

    const newStatus = interested && otherInterested ? 'mutual' : 'pending';

    const { error } = await supabase
      .from('matches')
      .update({
        [updateField]: interested,
        status: interested === false ? 'declined' : newStatus,
      })
      .eq('id', existing.id);

    return !error;
  } else {
    // Create new match record
    const { error } = await supabase.from('matches').insert({
      user_a: userId,
      user_b: matchId,
      user_a_interested: interested,
      status: 'pending',
    });

    return !error;
  }
}
