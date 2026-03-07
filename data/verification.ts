/**
 * WHOLLY — Pastoral Verification System
 *
 * Tiered verification where the verifier's role determines which
 * attribute chips they see. All chips are positive — the absence
 * of certain attributes is itself a signal.
 *
 * One verification per user. Expires after 6 months.
 */

// ═══════════════════════════════════════════════════════════════
// VERIFIER ROLES — ordered by leadership weight
// ═══════════════════════════════════════════════════════════════

export type VerifierRole =
  | 'connect_group_leader'
  | 'ministry_leader'
  | 'department_pastor'
  | 'campus_associate_pastor'
  | 'senior_lead_pastor';

export interface VerifierRoleInfo {
  id: VerifierRole;
  label: string;
  shortLabel: string;         // shown on profile tick
  description: string;        // helper text on the form
  weight: number;             // 1-5, for profile display ordering
}

export const VERIFIER_ROLES: VerifierRoleInfo[] = [
  {
    id: 'connect_group_leader',
    label: 'Connect / Small Group Leader',
    shortLabel: 'Connect Group Leader',
    description: 'I lead a connect group, life group, or small group that this person attends.',
    weight: 1,
  },
  {
    id: 'ministry_leader',
    label: 'Ministry Leader / Director',
    shortLabel: 'Ministry Leader',
    description: 'I lead or direct a ministry area (e.g. outreach, discipleship, community) that this person serves in.',
    weight: 2,
  },
  {
    id: 'department_pastor',
    label: 'Department Pastor (Youth, Worship, Kids, etc.)',
    shortLabel: 'Department Pastor',
    description: 'I am a pastor overseeing a specific department (youth, worship, kids ministry, etc.).',
    weight: 3,
  },
  {
    id: 'campus_associate_pastor',
    label: 'Campus / Associate Pastor',
    shortLabel: 'Associate Pastor',
    description: 'I am a campus pastor or associate pastor at this church.',
    weight: 4,
  },
  {
    id: 'senior_lead_pastor',
    label: 'Senior / Lead Pastor',
    shortLabel: 'Senior Pastor',
    description: 'I am the senior pastor or lead pastor of this church.',
    weight: 5,
  },
];

// ═══════════════════════════════════════════════════════════════
// ATTRIBUTE CHIPS — DoorDash-style tappable attributes
// ═══════════════════════════════════════════════════════════════

export interface AttributeChip {
  id: string;
  label: string;
  /** Minimum verifier weight required to see this chip */
  minWeight: number;
}

/**
 * All attributes are positive. Ordered intentionally so that
 * the strong spiritual endorsement words are visible and their
 * absence is noticeable.
 *
 * TIER 1 (weight 1+) — All verifiers see these
 *   Relational/behavioral attributes a connect group leader
 *   would observe week to week.
 *
 * TIER 2 (weight 2+) — Ministry Leader and above
 *   Adds spiritual maturity layer.
 *
 * TIER 3 (weight 3+) — Department Pastor and above
 *   Adds pastoral-level spiritual attributes.
 *
 * TIER 4 (weight 5) — Senior/Lead Pastor only
 *   The heavy hitters. If a senior pastor taps all of these,
 *   it's the strongest possible endorsement. If they skip
 *   "Person of integrity" or "Trustworthy in relationships,"
 *   the absence speaks volumes.
 */
export const ATTRIBUTE_CHIPS: AttributeChip[] = [
  // ── Tier 1: All verifiers (connect group+) ──
  { id: 'consistent',     label: 'Consistent',         minWeight: 1 },
  { id: 'reliable',       label: 'Reliable',           minWeight: 1 },
  { id: 'kind',           label: 'Kind',               minWeight: 1 },
  { id: 'good_listener',  label: 'Good listener',      minWeight: 1 },
  { id: 'respectful',     label: 'Respectful',         minWeight: 1 },
  { id: 'authentic',      label: 'Authentic',          minWeight: 1 },
  { id: 'generous',       label: 'Generous',           minWeight: 1 },
  { id: 'encouraging',    label: 'Encouraging',        minWeight: 1 },

  // ── Tier 2: Ministry Leader+ ──
  { id: 'servant_hearted',     label: 'Servant-hearted',     minWeight: 2 },
  { id: 'emotionally_mature',  label: 'Emotionally mature',  minWeight: 2 },
  { id: 'accountable',         label: 'Accountable',         minWeight: 2 },
  { id: 'teachable',           label: 'Teachable',           minWeight: 2 },
  { id: 'growing_in_faith',    label: 'Growing in faith',    minWeight: 2 },

  // ── Tier 3: Department Pastor+ ──
  { id: 'deeply_spiritual',      label: 'Deeply spiritual',      minWeight: 3 },
  { id: 'theologically_grounded', label: 'Theologically grounded', minWeight: 3 },
  { id: 'ministry_minded',       label: 'Ministry-minded',       minWeight: 3 },
  { id: 'prayerful',             label: 'Prayerful',             minWeight: 3 },

  // ── Tier 4: Senior/Lead Pastor only ──
  { id: 'person_of_integrity',       label: 'Person of integrity',       minWeight: 5 },
  { id: 'doctrinally_sound',         label: 'Doctrinally sound',         minWeight: 5 },
  { id: 'trustworthy_relationships', label: 'Trustworthy in relationships', minWeight: 5 },
  { id: 'wholeheartedly_committed',  label: 'Wholeheartedly committed',  minWeight: 5 },
  { id: 'leadership_potential',      label: 'Leadership potential',      minWeight: 5 },
];

/**
 * Returns the chips visible to a verifier at a given role weight.
 */
export function getChipsForRole(roleWeight: number): AttributeChip[] {
  return ATTRIBUTE_CHIPS.filter(chip => chip.minWeight <= roleWeight);
}

/**
 * Returns the chips grouped by tier for display purposes.
 */
export function getChipsGroupedByTier(roleWeight: number): { tier: string; chips: AttributeChip[] }[] {
  const groups: { tier: string; chips: AttributeChip[] }[] = [];

  const t1 = ATTRIBUTE_CHIPS.filter(c => c.minWeight === 1);
  if (roleWeight >= 1 && t1.length) groups.push({ tier: 'Character', chips: t1 });

  const t2 = ATTRIBUTE_CHIPS.filter(c => c.minWeight === 2);
  if (roleWeight >= 2 && t2.length) groups.push({ tier: 'Spiritual Growth', chips: t2 });

  const t3 = ATTRIBUTE_CHIPS.filter(c => c.minWeight === 3);
  if (roleWeight >= 3 && t3.length) groups.push({ tier: 'Spiritual Depth', chips: t3 });

  const t4 = ATTRIBUTE_CHIPS.filter(c => c.minWeight === 5);
  if (roleWeight >= 5 && t4.length) groups.push({ tier: 'Pastoral Endorsement', chips: t4 });

  return groups;
}

// ═══════════════════════════════════════════════════════════════
// VERIFICATION RECORD — stored in Supabase
// ═══════════════════════════════════════════════════════════════

export interface VerificationRecord {
  id: string;
  user_id: string;
  /** Unique token for the verification link */
  token: string;
  /** Status of the verification request */
  status: 'pending' | 'completed' | 'expired';

  // ── Verifier details (filled by pastor) ──
  verifier_name: string;
  verifier_role: VerifierRole;
  verifier_role_weight: number;
  verifier_church: string;
  verifier_denomination: string;

  // ── Attributes selected (chip IDs) ──
  attributes: string[];

  // ── Pastor's Note (Premium only, max 150 chars) ──
  pastors_note: string | null;

  // ── Timestamps ──
  requested_at: string;    // ISO
  completed_at: string | null;
  expires_at: string | null;  // 6 months after completed_at
}

// ═══════════════════════════════════════════════════════════════
// VERIFICATION CONFIG
// ═══════════════════════════════════════════════════════════════

export const VERIFICATION_CONFIG = {
  /** How long a verification lasts before renewal required */
  expiryMonths: 6,
  /** Maximum characters for Pastor's Note (Premium tier) */
  pastorsNoteMaxChars: 150,
  /** One verification per user at a time */
  maxVerificationsPerUser: 1,
  /** Token expiry for verification links (days) */
  linkExpiryDays: 30,
};
