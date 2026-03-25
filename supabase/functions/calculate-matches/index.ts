/**
 * WHOLLY — Server-Side Matching Algorithm
 *
 * Supabase Edge Function (Deno/TypeScript)
 * Called after a user completes onboarding to calculate compatibility
 * scores against all opposite-gender profiles.
 *
 * Deploy with: supabase functions deploy calculate-matches
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ─── Matching Algorithm Constants ────────────────────────────────────
const WEIGHTS = {
  spiritual: 1.5,
  emotional: 1.2,
  intellectual: 0.8,
  lifeVision: 1.0,
};
const TOTAL_WEIGHT = WEIGHTS.spiritual + WEIGHTS.emotional + WEIGHTS.intellectual + WEIGHTS.lifeVision;

// ─── Scoring Functions ───────────────────────────────────────────────

function weightedGeometricMean(scores: {
  spiritual: number;
  emotional: number;
  intellectual: number;
  lifeVision: number;
}): number {
  const product =
    Math.pow(scores.spiritual / 100, WEIGHTS.spiritual) *
    Math.pow(scores.emotional / 100, WEIGHTS.emotional) *
    Math.pow(scores.intellectual / 100, WEIGHTS.intellectual) *
    Math.pow(scores.lifeVision / 100, WEIGHTS.lifeVision);

  return Math.round(Math.pow(product, 1 / TOTAL_WEIGHT) * 100);
}

function applyFloorCap(
  overall: number,
  scores: { spiritual: number; emotional: number; intellectual: number; lifeVision: number },
): number {
  const minDimension = Math.min(scores.spiritual, scores.emotional, scores.intellectual, scores.lifeVision);
  return Math.min(overall, Math.round(1.35 * minDimension));
}

function getTier(score: number): string {
  if (score >= 82) return 'exceptional';
  if (score >= 72) return 'strong';
  if (score >= 58) return 'compatible';
  return 'below';
}

/**
 * Compare two users' answers and produce dimension scores.
 *
 * For MVP with demo profiles, we use pre-calculated scores.
 * For real user-to-user matching, this compares actual onboarding answers.
 */
function compareDimensionScores(
  userAnswers: Record<string, Record<string, any>>,
  matchAnswers: Record<string, Record<string, any>>,
): { spiritual: number; emotional: number; intellectual: number; lifeVision: number } {
  // Spiritual: compare theology + faithStyle + jargon overlap
  const spiritual = compareSectionScores(userAnswers, matchAnswers, ['theology', 'faithStyle']);

  // Emotional: compare emotional + conflict + honesty
  const emotional = compareSectionScores(userAnswers, matchAnswers, ['emotional', 'conflict', 'honesty']);

  // Intellectual: compare intellectual section
  const intellectual = compareSectionScores(userAnswers, matchAnswers, ['intellectual']);

  // Life Vision: compare lifeVision + shortAnswers
  const lifeVision = compareSectionScores(userAnswers, matchAnswers, ['lifeVision', 'shortAnswers']);

  return { spiritual, emotional, intellectual, lifeVision };
}

// ─── Deal-Breaker Configuration ─────────────────────────────────────
// Hard deal-breakers cap the dimension at 50%
const HARD_DEAL_BREAKERS: Record<string, string[]> = {
  theology: ['theo1', 'theo2'], // Spirit baptism, tongues belief
  lifeVision: ['lv2'],          // Children desire (want vs don't want)
};

// Soft deal-breakers apply a penalty but don't hard-cap
const SOFT_DEAL_BREAKERS: Record<string, { key: string; penalty: number }[]> = {
  lifeVision: [
    { key: 'lv1', penalty: 10 },  // Marriage timeline gap
    { key: 'lv9', penalty: 10 },  // Family-of-origin involvement
  ],
};

/**
 * Marriage leadership compatibility matrix
 * servant-headship is the bridge position (Futures/Planetshakers default)
 * traditional-headship + egalitarian = hard deal-breaker
 */
const LEADERSHIP_COMPATIBILITY: Record<string, Record<string, number>> = {
  'servant-headship':    { 'servant-headship': 0, 'traditional-headship': -10, 'egalitarian': -15, 'unsure': 0 },
  'traditional-headship': { 'servant-headship': -10, 'traditional-headship': 0, 'egalitarian': -999, 'unsure': 0 },
  'egalitarian':          { 'servant-headship': -15, 'traditional-headship': -999, 'egalitarian': 0, 'unsure': 0 },
  'unsure':               { 'servant-headship': 0, 'traditional-headship': 0, 'egalitarian': 0, 'unsure': 0 },
};

function compareSectionScores(
  userAnswers: Record<string, Record<string, any>>,
  matchAnswers: Record<string, Record<string, any>>,
  sections: string[],
): number {
  let totalQuestions = 0;
  let agreements = 0;
  let hasDealBreaker = false;
  let softPenalty = 0;

  for (const section of sections) {
    const userSection = userAnswers[section] || {};
    const matchSection = matchAnswers[section] || {};
    const allKeys = new Set([...Object.keys(userSection), ...Object.keys(matchSection)]);
    const hardBreakers = HARD_DEAL_BREAKERS[section] || [];
    const softBreakers = SOFT_DEAL_BREAKERS[section] || [];

    for (const key of allKeys) {
      if (userSection[key] !== undefined && matchSection[key] !== undefined) {
        totalQuestions++;

        if (userSection[key] === matchSection[key]) {
          agreements++;
        } else {
          // Check hard deal-breakers
          if (hardBreakers.includes(key)) {
            // For children: want + dont-want = deal-breaker, but want + probably = ok
            if (key === 'lv2') {
              const vals = [userSection[key], matchSection[key]];
              if (vals.includes('want') && vals.includes('dont-want')) {
                hasDealBreaker = true;
              } else if (vals.includes('dont-want') && vals.includes('probably')) {
                hasDealBreaker = true;
              }
              // Other combos (want+probably, want+unsure) get partial credit below
            } else {
              hasDealBreaker = true;
            }
          }

          // Check soft deal-breakers
          for (const sb of softBreakers) {
            if (sb.key === key) {
              softPenalty += sb.penalty;
            }
          }

          // Check marriage leadership compatibility
          if (key === 'lv7') {
            const userVal = userSection[key] as string;
            const matchVal = matchSection[key] as string;
            const compat = LEADERSHIP_COMPATIBILITY[userVal]?.[matchVal] ?? -5;
            if (compat === -999) {
              hasDealBreaker = true; // traditional-headship + egalitarian
            } else {
              softPenalty += Math.abs(compat);
            }
          }

          // Partial credit for close answers (non-deal-breaker questions)
          if (!hardBreakers.includes(key)) {
            const u = typeof userSection[key] === 'string' ? userSection[key] : '';
            const m = typeof matchSection[key] === 'string' ? matchSection[key] : '';

            if (u && m) {
              const uWords = new Set(u.toLowerCase().split(/\s+/));
              const mWords = new Set(m.toLowerCase().split(/\s+/));
              let overlap = 0;
              for (const w of uWords) {
                if (mWords.has(w) && w.length > 3) overlap++;
              }
              if (overlap > 0) agreements += 0.5;
            }
          }
        }
      }
    }
  }

  if (totalQuestions === 0) return 70;

  let score = Math.round(Math.min(100, Math.max(30, (agreements / totalQuestions) * 100)));

  // Apply soft penalties
  score = Math.max(30, score - softPenalty);

  // Hard deal-breaker cap: if fundamental disagreement, cap at 50%
  if (hasDealBreaker) {
    score = Math.min(score, 50);
  }

  return score;
}

// ─── Edge Function Handler ───────────────────────────────────────────

serve(async (req: Request) => {
  try {
    const { user_profile_id } = await req.json();
    if (!user_profile_id) {
      return new Response(JSON.stringify({ error: 'user_profile_id required' }), { status: 400 });
    }

    // Create Supabase client with service role (bypasses RLS)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Get the user's profile
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user_profile_id)
      .single();

    if (!userProfile) {
      return new Response(JSON.stringify({ error: 'Profile not found' }), { status: 404 });
    }

    // Get the user's onboarding answers
    const { data: userAnswerRows } = await supabase
      .from('onboarding_answers')
      .select('section, answers')
      .eq('profile_id', user_profile_id);

    const userAnswers: Record<string, any> = {};
    for (const row of userAnswerRows || []) {
      userAnswers[row.section] = row.answers;
    }

    // Get opposite gender profiles
    const oppositeGender = userProfile.gender === 'male' ? 'female' : 'male';
    const { data: matchProfiles } = await supabase
      .from('profiles')
      .select('*')
      .eq('gender', oppositeGender)
      .neq('id', user_profile_id);

    if (!matchProfiles || matchProfiles.length === 0) {
      return new Response(JSON.stringify({ matches: [] }));
    }

    const scores = [];

    for (const matchProfile of matchProfiles) {
      // For demo profiles, use pre-stored scores
      // For real profiles, calculate from answers
      let dimensionScores;

      if (matchProfile.is_demo) {
        // Check if pre-calculated scores exist
        const { data: existingScore } = await supabase
          .from('compatibility_scores')
          .select('*')
          .eq('user_id', user_profile_id)
          .eq('match_id', matchProfile.id)
          .single();

        if (existingScore) continue; // Already calculated

        // For demo profiles, generate deterministic scores from profile data
        // This simulates what real matching would produce
        const hash = matchProfile.first_name.split('').reduce((a: number, c: string) => a + c.charCodeAt(0), 0);
        dimensionScores = {
          spiritual: 50 + (hash % 45),
          emotional: 45 + ((hash * 7) % 50),
          intellectual: 40 + ((hash * 13) % 55),
          lifeVision: 45 + ((hash * 3) % 50),
        };
      } else {
        // Get match's onboarding answers
        const { data: matchAnswerRows } = await supabase
          .from('onboarding_answers')
          .select('section, answers')
          .eq('profile_id', matchProfile.id);

        const matchAnswers: Record<string, any> = {};
        for (const row of matchAnswerRows || []) {
          matchAnswers[row.section] = row.answers;
        }

        dimensionScores = compareDimensionScores(userAnswers, matchAnswers);
      }

      // Apply weighted geometric mean + floor cap
      let overall = weightedGeometricMean(dimensionScores);
      overall = applyFloorCap(overall, dimensionScores);
      const tier = getTier(overall);

      const scoreRecord = {
        user_id: user_profile_id,
        match_id: matchProfile.id,
        spiritual: dimensionScores.spiritual,
        emotional: dimensionScores.emotional,
        intellectual: dimensionScores.intellectual,
        life_vision: dimensionScores.lifeVision,
        overall,
        tier,
      };

      scores.push(scoreRecord);
    }

    // Batch upsert all scores
    if (scores.length > 0) {
      const { error: upsertError } = await supabase
        .from('compatibility_scores')
        .upsert(scores, { onConflict: 'user_id,match_id' });

      if (upsertError) {
        return new Response(JSON.stringify({ error: upsertError.message }), { status: 500 });
      }
    }

    return new Response(
      JSON.stringify({
        matches_calculated: scores.length,
        distribution: {
          exceptional: scores.filter((s) => s.tier === 'exceptional').length,
          strong: scores.filter((s) => s.tier === 'strong').length,
          compatible: scores.filter((s) => s.tier === 'compatible').length,
          below: scores.filter((s) => s.tier === 'below').length,
        },
      }),
      { headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
