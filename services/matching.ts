import { OnboardingAnswers, CompatibilityScores, MatchTier, DemoProfile } from '../types';

/**
 * WHOLLY Matching Algorithm v2
 *
 * Uses weighted geometric mean + floor capping for meaningful differentiation.
 *
 * Why geometric mean instead of arithmetic:
 * - Penalises any single weak dimension heavily
 * - A 95% spiritual + 40% emotional = 62% overall (not 67%)
 * - Prevents high scores in one area masking low scores elsewhere
 *
 * Dimension weights (within a Spirit-filled community):
 * - Spiritual:     1.5x (core to a faith-based app)
 * - Emotional:     1.2x (relationship health is critical)
 * - Life Vision:   1.0x (direction alignment matters)
 * - Intellectual:  0.8x (less central than spiritual/emotional)
 *
 * Floor capping rule:
 * - Overall score cannot exceed 1.35× the lowest dimension
 * - This prevents catastrophically low dimensions from being hidden
 * - Example: if emotional = 40%, overall caps at 54% max
 */

const WEIGHTS = {
  spiritual: 1.5,
  emotional: 1.2,
  intellectual: 0.8,
  lifeVision: 1.0,
};

const TOTAL_WEIGHT = WEIGHTS.spiritual + WEIGHTS.emotional + WEIGHTS.intellectual + WEIGHTS.lifeVision;

/**
 * Calculate weighted geometric mean of compatibility scores
 */
function weightedGeometricMean(scores: CompatibilityScores): number {
  const product =
    Math.pow(scores.spiritual / 100, WEIGHTS.spiritual) *
    Math.pow(scores.emotional / 100, WEIGHTS.emotional) *
    Math.pow(scores.intellectual / 100, WEIGHTS.intellectual) *
    Math.pow(scores.lifeVision / 100, WEIGHTS.lifeVision);

  return Math.round(Math.pow(product, 1 / TOTAL_WEIGHT) * 100);
}

/**
 * Apply floor capping — overall cannot exceed 1.35× the lowest dimension
 */
function applyFloorCap(overall: number, scores: CompatibilityScores): number {
  const minDimension = Math.min(
    scores.spiritual,
    scores.emotional,
    scores.intellectual,
    scores.lifeVision
  );
  const floor = Math.round(1.35 * minDimension);
  return Math.min(overall, floor);
}

/**
 * Calculate compatibility between user answers and a profile
 * For MVP, uses the demo profile's pre-calculated dimension scores
 * and applies geometric mean + floor capping for the overall
 *
 * Phase 2 will implement real answer comparison with:
 * - Compatibility matrices per question category
 * - Deal-breaker detection that caps at 50%
 * - Non-linear penalty functions for disagreement gaps
 */
export function calculateCompatibility(
  userAnswers: OnboardingAnswers,
  profile: DemoProfile
): CompatibilityScores {
  // Use pre-calculated dimension scores from demo profiles
  const { spiritual, emotional, intellectual, lifeVision } = profile.scores;

  // Calculate overall using weighted geometric mean + floor cap
  let overall = weightedGeometricMean({ spiritual, emotional, intellectual, lifeVision, overall: 0 });
  overall = applyFloorCap(overall, { spiritual, emotional, intellectual, lifeVision, overall });

  return {
    spiritual,
    emotional,
    intellectual,
    lifeVision,
    overall,
  };
}

/**
 * Get match tier based on overall compatibility score
 *
 * Thresholds designed for realistic distribution:
 * - Exceptional: ~5-8% of matches (the rare great ones)
 * - Strong: ~20-25% (very promising)
 * - Compatible: ~35-40% (worth exploring)
 * - Below: ~25-35% (filtered out by default)
 */
export function getMatchTier(score: number): MatchTier {
  if (score >= 82) return 'exceptional';
  if (score >= 72) return 'strong';
  if (score >= 62) return 'compatible';
  return 'below';
}

/**
 * Calculate overall compatibility with weighted geometric mean
 */
export function calculateOverallScore(scores: CompatibilityScores): number {
  let overall = weightedGeometricMean(scores);
  overall = applyFloorCap(overall, scores);
  return overall;
}

/**
 * Get all profiles sorted by compatibility
 */
export function getRankedProfiles(
  userAnswers: OnboardingAnswers,
  profiles: DemoProfile[]
): DemoProfile[] {
  return profiles
    .map(profile => {
      const scores = calculateCompatibility(userAnswers, profile);
      const tier = getMatchTier(scores.overall);
      return {
        ...profile,
        scores,
        overallScore: scores.overall,
        tier,
      };
    })
    .sort((a, b) => b.scores.overall - a.scores.overall);
}
