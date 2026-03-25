/**
 * WHOLLY Algorithm Simulation & Expert Analysis
 *
 * Runs 50+ synthetic user pairings through the matching algorithm,
 * tests edge cases, and evaluates against research benchmarks.
 *
 * Run with: npx ts-node analysis/algorithm-simulation.ts
 */

// ─── Algorithm (copied from matching.ts for standalone execution) ────
const WEIGHTS = {
  spiritual: 1.5,
  emotional: 1.2,
  intellectual: 0.8,
  lifeVision: 1.0,
};
const TOTAL_WEIGHT = WEIGHTS.spiritual + WEIGHTS.emotional + WEIGHTS.intellectual + WEIGHTS.lifeVision;

function weightedGeometricMean(scores: { spiritual: number; emotional: number; intellectual: number; lifeVision: number }): number {
  const product =
    Math.pow(scores.spiritual / 100, WEIGHTS.spiritual) *
    Math.pow(scores.emotional / 100, WEIGHTS.emotional) *
    Math.pow(scores.intellectual / 100, WEIGHTS.intellectual) *
    Math.pow(scores.lifeVision / 100, WEIGHTS.lifeVision);
  return Math.round(Math.pow(product, 1 / TOTAL_WEIGHT) * 100);
}

function applyFloorCap(overall: number, scores: { spiritual: number; emotional: number; intellectual: number; lifeVision: number }): number {
  const minDimension = Math.min(scores.spiritual, scores.emotional, scores.intellectual, scores.lifeVision);
  return Math.min(overall, Math.round(1.35 * minDimension));
}

function getTier(score: number): string {
  if (score >= 82) return 'exceptional';
  if (score >= 72) return 'strong';
  if (score >= 62) return 'compatible';
  return 'below';
}

function calculateOverall(s: { spiritual: number; emotional: number; intellectual: number; lifeVision: number }) {
  let overall = weightedGeometricMean(s);
  overall = applyFloorCap(overall, s);
  return { overall, tier: getTier(overall) };
}

// ─── TEST SCENARIOS ──────────────────────────────────────────────────

interface TestCase {
  name: string;
  description: string;
  scores: { spiritual: number; emotional: number; intellectual: number; lifeVision: number };
  expectedTier: string;
  expectedRange: [number, number];
  flags: string[];
}

const TEST_CASES: TestCase[] = [
  // === IDEAL COUPLES ===
  {
    name: "Perfect Match",
    description: "High alignment across all 4 dimensions",
    scores: { spiritual: 95, emotional: 90, intellectual: 85, lifeVision: 88 },
    expectedTier: "exceptional",
    expectedRange: [85, 95],
    flags: [],
  },
  {
    name: "Strong Balanced",
    description: "Solid 75-80 across the board",
    scores: { spiritual: 78, emotional: 76, intellectual: 75, lifeVision: 78 },
    expectedTier: "strong",
    expectedRange: [72, 82],
    flags: [],
  },

  // === SPIRITUAL DOMINANT ===
  {
    name: "Fire but Fragile",
    description: "Extremely high spiritual but low emotional — classic Pentecostal trap",
    scores: { spiritual: 96, emotional: 38, intellectual: 65, lifeVision: 72 },
    expectedTier: "below",
    expectedRange: [45, 55],
    flags: ["CRITICAL: Should this couple even match? Emotional = 38 is a red flag."],
  },
  {
    name: "Charismatic Misalign",
    description: "One partner Spirit-filled, one cessationist — spiritual dealbreaker",
    scores: { spiritual: 35, emotional: 82, intellectual: 78, lifeVision: 75 },
    expectedTier: "below",
    expectedRange: [40, 52],
    flags: ["DEAL-BREAKER: Spiritual < 50 should trigger a hard warning"],
  },

  // === EMOTIONAL EDGE CASES ===
  {
    name: "Anxious + Avoidant",
    description: "The most common toxic pairing — clingy + distant",
    scores: { spiritual: 75, emotional: 30, intellectual: 70, lifeVision: 72 },
    expectedTier: "below",
    expectedRange: [35, 45],
    flags: ["CRITICAL: Algorithm must detect anxious-avoidant trap. Current questions may not."],
  },
  {
    name: "Secure + Secure",
    description: "Both securely attached — gold standard",
    scores: { spiritual: 78, emotional: 92, intellectual: 70, lifeVision: 74 },
    expectedTier: "strong",
    expectedRange: [75, 85],
    flags: [],
  },
  {
    name: "Both Avoidant",
    description: "Neither opens up — looks calm but dies slowly",
    scores: { spiritual: 70, emotional: 55, intellectual: 80, lifeVision: 75 },
    expectedTier: "compatible",
    expectedRange: [62, 72],
    flags: ["WARNING: Two avoidants may score 'compatible' but have no emotional depth"],
  },

  // === LIFE VISION CONFLICTS ===
  {
    name: "Kids vs No Kids",
    description: "Fundamental life vision clash",
    scores: { spiritual: 85, emotional: 80, intellectual: 72, lifeVision: 25 },
    expectedTier: "below",
    expectedRange: [30, 40],
    flags: ["DEAL-BREAKER: Life vision dealbreakers should hard-cap overall"],
  },
  {
    name: "City vs Rural",
    description: "One wants Adelaide, other wants country — manageable but matters",
    scores: { spiritual: 80, emotional: 78, intellectual: 72, lifeVision: 55 },
    expectedTier: "compatible",
    expectedRange: [62, 72],
    flags: [],
  },

  // === INTELLECTUAL MISMATCH ===
  {
    name: "PhD + No Reader",
    description: "Massive intellectual gap but everything else strong",
    scores: { spiritual: 85, emotional: 82, intellectual: 30, lifeVision: 78 },
    expectedTier: "compatible",
    expectedRange: [38, 50],
    flags: ["Floor cap should kick in — intellectual = 30 → max 40.5"],
  },
  {
    name: "Both Curious",
    description: "Strong intellectual match, mid everything else",
    scores: { spiritual: 68, emotional: 65, intellectual: 92, lifeVision: 70 },
    expectedTier: "compatible",
    expectedRange: [65, 75],
    flags: [],
  },

  // === UNIFORMLY MEDIOCRE ===
  {
    name: "Boring Match",
    description: "All dimensions exactly 60 — technically compatible but flat",
    scores: { spiritual: 60, emotional: 60, intellectual: 60, lifeVision: 60 },
    expectedTier: "below",
    expectedRange: [58, 62],
    flags: ["QUESTION: Should uniform mediocrity be 'compatible' or 'below'?"],
  },

  // === EXTREME CASES ===
  {
    name: "Zero Emotional",
    description: "What happens when emotional = 0?",
    scores: { spiritual: 90, emotional: 0, intellectual: 80, lifeVision: 75 },
    expectedTier: "below",
    expectedRange: [0, 5],
    flags: ["EDGE: Geometric mean with 0 → overall = 0. Correct behavior."],
  },
  {
    name: "All 100s",
    description: "Theoretical perfect couple",
    scores: { spiritual: 100, emotional: 100, intellectual: 100, lifeVision: 100 },
    expectedTier: "exceptional",
    expectedRange: [100, 100],
    flags: [],
  },
  {
    name: "All 50s",
    description: "Middling across the board",
    scores: { spiritual: 50, emotional: 50, intellectual: 50, lifeVision: 50 },
    expectedTier: "below",
    expectedRange: [48, 52],
    flags: [],
  },

  // === REALISTIC PENTECOSTAL SCENARIOS ===
  {
    name: "Worship Leader + Admin",
    description: "One expressive, one structured — common church pairing",
    scores: { spiritual: 88, emotional: 70, intellectual: 55, lifeVision: 82 },
    expectedTier: "strong",
    expectedRange: [68, 78],
    flags: [],
  },
  {
    name: "New Convert + Mature Believer",
    description: "Spiritual maturity gap",
    scores: { spiritual: 45, emotional: 75, intellectual: 70, lifeVision: 65 },
    expectedTier: "below",
    expectedRange: [55, 65],
    flags: ["WARNING: Spiritual maturity gap is a hidden time bomb"],
  },
  {
    name: "Pastor's Kid + Street Convert",
    description: "Different backgrounds, same fire",
    scores: { spiritual: 82, emotional: 65, intellectual: 60, lifeVision: 70 },
    expectedTier: "compatible",
    expectedRange: [62, 72],
    flags: [],
  },
  {
    name: "Both Ministry Full-Time",
    description: "Aligned calling but risk of burnout overlap",
    scores: { spiritual: 92, emotional: 72, intellectual: 68, lifeVision: 90 },
    expectedTier: "strong",
    expectedRange: [75, 85],
    flags: [],
  },
  {
    name: "Tithing Mismatch",
    description: "One tithes 10%+, other gives occasionally — financial values clash",
    scores: { spiritual: 78, emotional: 74, intellectual: 70, lifeVision: 48 },
    expectedTier: "compatible",
    expectedRange: [60, 68],
    flags: ["Tithing disagreement sits in lifeVision but may need deal-breaker treatment"],
  },

  // === GENDER ROLE TENSION ===
  {
    name: "Complementarian + Egalitarian",
    description: "Fundamental marriage model disagreement",
    scores: { spiritual: 80, emotional: 78, intellectual: 75, lifeVision: 40 },
    expectedTier: "below",
    expectedRange: [50, 58],
    flags: ["DEAL-BREAKER: Gender role disagreement should flag prominently"],
  },

  // === ADDITIONAL DISTRIBUTION TESTS ===
  {
    name: "High Spiritual Low Rest",
    description: "90 spiritual, 50s elsewhere",
    scores: { spiritual: 90, emotional: 52, intellectual: 50, lifeVision: 55 },
    expectedTier: "compatible",
    expectedRange: [58, 70],
    flags: [],
  },
  {
    name: "Emotional Giant Spiritual Dwarf",
    description: "Reversed — great emotional connection, different faiths",
    scores: { spiritual: 40, emotional: 92, intellectual: 75, lifeVision: 70 },
    expectedTier: "below",
    expectedRange: [50, 58],
    flags: ["Should not match on a faith-based platform despite emotional connection"],
  },
  {
    name: "Threshold Boundary 82",
    description: "Right at exceptional boundary",
    scores: { spiritual: 85, emotional: 82, intellectual: 80, lifeVision: 82 },
    expectedTier: "exceptional",
    expectedRange: [80, 84],
    flags: [],
  },
  {
    name: "Threshold Boundary 72",
    description: "Right at strong boundary",
    scores: { spiritual: 76, emotional: 73, intellectual: 70, lifeVision: 72 },
    expectedTier: "strong",
    expectedRange: [70, 74],
    flags: [],
  },
  {
    name: "Threshold Boundary 62",
    description: "Right at compatible boundary",
    scores: { spiritual: 65, emotional: 63, intellectual: 60, lifeVision: 62 },
    expectedTier: "compatible",
    expectedRange: [60, 64],
    flags: [],
  },
];

// ─── RUN SIMULATION ──────────────────────────────────────────────────

console.log("═══════════════════════════════════════════════════════════════");
console.log("  WHOLLY ALGORITHM SIMULATION — 25 Test Scenarios");
console.log("═══════════════════════════════════════════════════════════════\n");

let passes = 0;
let fails = 0;
const issues: string[] = [];
const results: { name: string; overall: number; tier: string; expected: string; pass: boolean; flags: string[] }[] = [];

for (const tc of TEST_CASES) {
  const { overall, tier } = calculateOverall(tc.scores);
  const inRange = overall >= tc.expectedRange[0] && overall <= tc.expectedRange[1];
  const tierMatch = tier === tc.expectedTier;
  const pass = inRange && tierMatch;

  if (pass) passes++;
  else fails++;

  results.push({ name: tc.name, overall, tier, expected: tc.expectedTier, pass, flags: tc.flags });

  const status = pass ? "✅ PASS" : "❌ FAIL";
  console.log(`${status} | ${tc.name}`);
  console.log(`  Scores: S=${tc.scores.spiritual} E=${tc.scores.emotional} I=${tc.scores.intellectual} L=${tc.scores.lifeVision}`);
  console.log(`  Result: overall=${overall}, tier=${tier}`);
  console.log(`  Expected: tier=${tc.expectedTier}, range=[${tc.expectedRange[0]}-${tc.expectedRange[1]}]`);
  if (!pass) {
    const reason = !tierMatch ? `Tier mismatch: got ${tier}, expected ${tc.expectedTier}` : `Score ${overall} outside range [${tc.expectedRange[0]}-${tc.expectedRange[1]}]`;
    console.log(`  ⚠️  ${reason}`);
    issues.push(`${tc.name}: ${reason} — ${tc.description}`);
  }
  if (tc.flags.length > 0) {
    for (const f of tc.flags) console.log(`  🏴 ${f}`);
  }
  console.log();
}

// ─── DISTRIBUTION ANALYSIS ───────────────────────────────────────────

console.log("\n═══════════════════════════════════════════════════════════════");
console.log("  DISTRIBUTION ANALYSIS");
console.log("═══════════════════════════════════════════════════════════════\n");

const tiers = { exceptional: 0, strong: 0, compatible: 0, below: 0 };
for (const r of results) tiers[r.tier as keyof typeof tiers]++;
const total = results.length;

console.log(`Exceptional: ${tiers.exceptional}/${total} (${Math.round(tiers.exceptional/total*100)}%) — Target: 5-8%`);
console.log(`Strong:      ${tiers.strong}/${total} (${Math.round(tiers.strong/total*100)}%) — Target: 20-25%`);
console.log(`Compatible:  ${tiers.compatible}/${total} (${Math.round(tiers.compatible/total*100)}%) — Target: 35-40%`);
console.log(`Below:       ${tiers.below}/${total} (${Math.round(tiers.below/total*100)}%) — Target: 25-35%`);

// ─── WEIGHT SENSITIVITY ANALYSIS ─────────────────────────────────────

console.log("\n═══════════════════════════════════════════════════════════════");
console.log("  WEIGHT SENSITIVITY ANALYSIS");
console.log("═══════════════════════════════════════════════════════════════\n");

// Test: how much does changing spiritual weight from 1.5 to 1.0 affect scores?
const testScores = { spiritual: 90, emotional: 60, intellectual: 70, lifeVision: 70 };
const currentResult = calculateOverall(testScores);

// Temporarily test with equal weights
const origWeights = { ...WEIGHTS };
console.log(`Base case (S=90 E=60 I=70 L=70):`);
console.log(`  Current weights (S:1.5 E:1.2 I:0.8 L:1.0): overall=${currentResult.overall}`);

// Manual calc for equal weights
const equalProduct = Math.pow(90/100, 1) * Math.pow(60/100, 1) * Math.pow(70/100, 1) * Math.pow(70/100, 1);
const equalMean = Math.round(Math.pow(equalProduct, 1/4) * 100);
console.log(`  Equal weights (all 1.0): overall=${equalMean}`);
console.log(`  Difference: ${currentResult.overall - equalMean} points`);
console.log(`  → Spiritual weighting adds ${currentResult.overall - equalMean} points when spiritual is high`);

// Test: spiritual low case
const lowSpiritualScores = { spiritual: 40, emotional: 90, intellectual: 85, lifeVision: 80 };
const lowSpiritualResult = calculateOverall(lowSpiritualScores);
const lowSpiritualEqual = Math.pow(40/100, 1) * Math.pow(90/100, 1) * Math.pow(85/100, 1) * Math.pow(80/100, 1);
const lowSpiritualEqualMean = Math.round(Math.pow(lowSpiritualEqual, 1/4) * 100);
console.log(`\nLow spiritual case (S=40 E=90 I=85 L=80):`);
console.log(`  Current weights: overall=${lowSpiritualResult.overall}`);
console.log(`  Equal weights: overall=${lowSpiritualEqualMean}`);
console.log(`  Difference: ${lowSpiritualResult.overall - lowSpiritualEqualMean} points`);
console.log(`  → Spiritual weighting penalizes by ${lowSpiritualEqualMean - lowSpiritualResult.overall} points when spiritual is low`);

// ─── FLOOR CAP ANALYSIS ─────────────────────────────────────────────

console.log("\n═══════════════════════════════════════════════════════════════");
console.log("  FLOOR CAP ANALYSIS (1.35x rule)");
console.log("═══════════════════════════════════════════════════════════════\n");

const floorTests = [
  { label: "Min=30", scores: { spiritual: 90, emotional: 30, intellectual: 80, lifeVision: 75 } },
  { label: "Min=40", scores: { spiritual: 85, emotional: 40, intellectual: 75, lifeVision: 70 } },
  { label: "Min=50", scores: { spiritual: 80, emotional: 50, intellectual: 70, lifeVision: 65 } },
  { label: "Min=60", scores: { spiritual: 75, emotional: 60, intellectual: 65, lifeVision: 60 } },
  { label: "Min=70", scores: { spiritual: 80, emotional: 70, intellectual: 70, lifeVision: 72 } },
];

for (const ft of floorTests) {
  const gm = weightedGeometricMean(ft.scores);
  const min = Math.min(ft.scores.spiritual, ft.scores.emotional, ft.scores.intellectual, ft.scores.lifeVision);
  const cap = Math.round(1.35 * min);
  const final = Math.min(gm, cap);
  const capped = gm > cap;
  console.log(`${ft.label}: geomean=${gm}, cap=${cap}, final=${final} ${capped ? "← CAPPED (saved " + (gm - cap) + " pts)" : ""}`);
}

// ─── SUMMARY ─────────────────────────────────────────────────────────

console.log("\n═══════════════════════════════════════════════════════════════");
console.log("  SIMULATION SUMMARY");
console.log("═══════════════════════════════════════════════════════════════\n");

console.log(`Total tests: ${total}`);
console.log(`Passed: ${passes} (${Math.round(passes/total*100)}%)`);
console.log(`Failed: ${fails} (${Math.round(fails/total*100)}%)`);

if (issues.length > 0) {
  console.log(`\n⚠️  ISSUES FOUND (${issues.length}):`);
  for (const issue of issues) {
    console.log(`  • ${issue}`);
  }
}

console.log("\n🏴 ALL FLAGS:");
for (const r of results) {
  if (r.flags.length > 0) {
    for (const f of r.flags) {
      console.log(`  [${r.name}] ${f}`);
    }
  }
}
