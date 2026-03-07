import { Question } from '../../types';

// ═══════════════════════════════════════════════════════════════════════
// DEEP INSIGHTS — Optional psychometric questionnaire for richer matching
//
// Grounded in validated instruments:
//   1. Attachment: Adapted from ECR-R (Fraley, Waller & Brennan, 2000)
//      - Two dimensions: Anxiety (fear of abandonment) & Avoidance (discomfort with closeness)
//      - 7-point Likert → adapted to 5-point for mobile UX
//      - Cronbach's alpha: 0.93-0.95 in source instrument
//
//   2. Emotional Regulation: Adapted from DERS (Gratz & Roemer, 2004)
//      and ERQ (Gross & John, 2003)
//      - DERS subscales: Awareness, Clarity, Nonacceptance, Strategies, Impulse, Goals
//      - ERQ dimensions: Cognitive Reappraisal vs. Expressive Suppression
//      - 5-point Likert in source instrument
//
//   3. Relational Needs: Adapted from PREPARE/ENRICH (Olson)
//      - 80-85% predictive accuracy for marital success
//      - Draws from: Communication, Conflict Resolution, Expectations,
//        Personality Issues, Leisure Activities, Religious Orientation
//      - NOT Chapman's Love Languages (not empirically validated)
//
// Scoring: Each answer maps to a dimensional score (1-5 scale).
// Matching compares dimensional profiles between users.
// ═══════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// SECTION 1: ATTACHMENT (12 questions)
// Based on ECR-R two-dimension model
// Measures: Attachment Anxiety (6 items) + Attachment Avoidance (6 items)
// Response format: 5-point agreement scale
// Scoring: Low anxiety + low avoidance = secure attachment
// ─────────────────────────────────────────────────────────────

export const ATTACHMENT_QUESTIONS: Question[] = [
  // ── Attachment Anxiety Items (fear of abandonment, need for reassurance) ──
  {
    id: 'ecr_anx1',
    text: 'I worry about being abandoned by people I\'m close to.',
    type: 'single-choice',
    category: 'attachment_anxiety',
    required: true,
    options: [
      { id: 'ecr_anx1_1', label: 'Strongly disagree', value: '1' },
      { id: 'ecr_anx1_2', label: 'Disagree', value: '2' },
      { id: 'ecr_anx1_3', label: 'Neutral', value: '3' },
      { id: 'ecr_anx1_4', label: 'Agree', value: '4' },
      { id: 'ecr_anx1_5', label: 'Strongly agree', value: '5' },
    ],
  },
  {
    id: 'ecr_anx2',
    text: 'I need a lot of reassurance that I am loved.',
    type: 'single-choice',
    category: 'attachment_anxiety',
    required: true,
    options: [
      { id: 'ecr_anx2_1', label: 'Strongly disagree', value: '1' },
      { id: 'ecr_anx2_2', label: 'Disagree', value: '2' },
      { id: 'ecr_anx2_3', label: 'Neutral', value: '3' },
      { id: 'ecr_anx2_4', label: 'Agree', value: '4' },
      { id: 'ecr_anx2_5', label: 'Strongly agree', value: '5' },
    ],
  },
  {
    id: 'ecr_anx3',
    text: 'When I\'m not with the person I\'m dating, I worry that they might become interested in someone else.',
    type: 'single-choice',
    category: 'attachment_anxiety',
    required: true,
    options: [
      { id: 'ecr_anx3_1', label: 'Strongly disagree', value: '1' },
      { id: 'ecr_anx3_2', label: 'Disagree', value: '2' },
      { id: 'ecr_anx3_3', label: 'Neutral', value: '3' },
      { id: 'ecr_anx3_4', label: 'Agree', value: '4' },
      { id: 'ecr_anx3_5', label: 'Strongly agree', value: '5' },
    ],
  },
  {
    id: 'ecr_anx4',
    text: 'I find that others don\'t want to get as close as I would like.',
    type: 'single-choice',
    category: 'attachment_anxiety',
    required: true,
    options: [
      { id: 'ecr_anx4_1', label: 'Strongly disagree', value: '1' },
      { id: 'ecr_anx4_2', label: 'Disagree', value: '2' },
      { id: 'ecr_anx4_3', label: 'Neutral', value: '3' },
      { id: 'ecr_anx4_4', label: 'Agree', value: '4' },
      { id: 'ecr_anx4_5', label: 'Strongly agree', value: '5' },
    ],
  },
  {
    id: 'ecr_anx5',
    text: 'When someone I care about is late or doesn\'t respond, my mind tends to assume the worst.',
    type: 'single-choice',
    category: 'attachment_anxiety',
    required: true,
    options: [
      { id: 'ecr_anx5_1', label: 'Strongly disagree', value: '1' },
      { id: 'ecr_anx5_2', label: 'Disagree', value: '2' },
      { id: 'ecr_anx5_3', label: 'Neutral', value: '3' },
      { id: 'ecr_anx5_4', label: 'Agree', value: '4' },
      { id: 'ecr_anx5_5', label: 'Strongly agree', value: '5' },
    ],
  },
  {
    id: 'ecr_anx6',
    text: 'Sometimes I feel that I value close relationships more than other people do.',
    type: 'single-choice',
    category: 'attachment_anxiety',
    required: true,
    options: [
      { id: 'ecr_anx6_1', label: 'Strongly disagree', value: '1' },
      { id: 'ecr_anx6_2', label: 'Disagree', value: '2' },
      { id: 'ecr_anx6_3', label: 'Neutral', value: '3' },
      { id: 'ecr_anx6_4', label: 'Agree', value: '4' },
      { id: 'ecr_anx6_5', label: 'Strongly agree', value: '5' },
    ],
  },

  // ── Attachment Avoidance Items (discomfort with closeness/dependence) ──
  {
    id: 'ecr_avo1',
    text: 'I am comfortable depending on others in close relationships.',
    type: 'single-choice',
    category: 'attachment_avoidance',
    required: true,
    options: [
      { id: 'ecr_avo1_1', label: 'Strongly disagree', value: '5' },  // reverse scored
      { id: 'ecr_avo1_2', label: 'Disagree', value: '4' },
      { id: 'ecr_avo1_3', label: 'Neutral', value: '3' },
      { id: 'ecr_avo1_4', label: 'Agree', value: '2' },
      { id: 'ecr_avo1_5', label: 'Strongly agree', value: '1' },
    ],
  },
  {
    id: 'ecr_avo2',
    text: 'I prefer not to show others how I feel deep down.',
    type: 'single-choice',
    category: 'attachment_avoidance',
    required: true,
    options: [
      { id: 'ecr_avo2_1', label: 'Strongly disagree', value: '1' },
      { id: 'ecr_avo2_2', label: 'Disagree', value: '2' },
      { id: 'ecr_avo2_3', label: 'Neutral', value: '3' },
      { id: 'ecr_avo2_4', label: 'Agree', value: '4' },
      { id: 'ecr_avo2_5', label: 'Strongly agree', value: '5' },
    ],
  },
  {
    id: 'ecr_avo3',
    text: 'I find it easy to be emotionally close to a romantic partner.',
    type: 'single-choice',
    category: 'attachment_avoidance',
    required: true,
    options: [
      { id: 'ecr_avo3_1', label: 'Strongly disagree', value: '5' },  // reverse scored
      { id: 'ecr_avo3_2', label: 'Disagree', value: '4' },
      { id: 'ecr_avo3_3', label: 'Neutral', value: '3' },
      { id: 'ecr_avo3_4', label: 'Agree', value: '2' },
      { id: 'ecr_avo3_5', label: 'Strongly agree', value: '1' },
    ],
  },
  {
    id: 'ecr_avo4',
    text: 'I get uncomfortable when someone wants to be very emotionally close.',
    type: 'single-choice',
    category: 'attachment_avoidance',
    required: true,
    options: [
      { id: 'ecr_avo4_1', label: 'Strongly disagree', value: '1' },
      { id: 'ecr_avo4_2', label: 'Disagree', value: '2' },
      { id: 'ecr_avo4_3', label: 'Neutral', value: '3' },
      { id: 'ecr_avo4_4', label: 'Agree', value: '4' },
      { id: 'ecr_avo4_5', label: 'Strongly agree', value: '5' },
    ],
  },
  {
    id: 'ecr_avo5',
    text: 'I turn to the people I\'m close to when I need comfort or support.',
    type: 'single-choice',
    category: 'attachment_avoidance',
    required: true,
    options: [
      { id: 'ecr_avo5_1', label: 'Strongly disagree', value: '5' },  // reverse scored
      { id: 'ecr_avo5_2', label: 'Disagree', value: '4' },
      { id: 'ecr_avo5_3', label: 'Neutral', value: '3' },
      { id: 'ecr_avo5_4', label: 'Agree', value: '2' },
      { id: 'ecr_avo5_5', label: 'Strongly agree', value: '1' },
    ],
  },
  {
    id: 'ecr_avo6',
    text: 'I worry that opening up to someone will give them power over me.',
    type: 'single-choice',
    category: 'attachment_avoidance',
    required: true,
    options: [
      { id: 'ecr_avo6_1', label: 'Strongly disagree', value: '1' },
      { id: 'ecr_avo6_2', label: 'Disagree', value: '2' },
      { id: 'ecr_avo6_3', label: 'Neutral', value: '3' },
      { id: 'ecr_avo6_4', label: 'Agree', value: '4' },
      { id: 'ecr_avo6_5', label: 'Strongly agree', value: '5' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// SECTION 2: EMOTIONAL REGULATION (12 questions)
// Based on DERS (Gratz & Roemer) + ERQ (Gross & John)
//
// DERS subscales represented:
//   - Emotional Awareness (2 items)
//   - Emotional Clarity (2 items)
//   - Nonacceptance of emotions (2 items)
//   - Access to regulation strategies (2 items)
//   - Impulse control under distress (2 items)
// ERQ dimensions:
//   - Cognitive Reappraisal (1 item)
//   - Expressive Suppression (1 item)
//
// Scoring: 1-5 (lower = better regulation, except reverse items)
// ─────────────────────────────────────────────────────────────

export const REGULATION_QUESTIONS: Question[] = [
  // ── Emotional Awareness (DERS subscale) ──
  {
    id: 'ders_aw1',
    text: 'I pay attention to how I feel.',
    type: 'single-choice',
    category: 'regulation_awareness',
    required: true,
    options: [
      { id: 'ders_aw1_1', label: 'Almost never', value: '5' },  // reverse scored (low awareness = high difficulty)
      { id: 'ders_aw1_2', label: 'Sometimes', value: '4' },
      { id: 'ders_aw1_3', label: 'About half the time', value: '3' },
      { id: 'ders_aw1_4', label: 'Most of the time', value: '2' },
      { id: 'ders_aw1_5', label: 'Almost always', value: '1' },
    ],
  },
  {
    id: 'ders_aw2',
    text: 'I care about what I am feeling.',
    type: 'single-choice',
    category: 'regulation_awareness',
    required: true,
    options: [
      { id: 'ders_aw2_1', label: 'Almost never', value: '5' },  // reverse scored
      { id: 'ders_aw2_2', label: 'Sometimes', value: '4' },
      { id: 'ders_aw2_3', label: 'About half the time', value: '3' },
      { id: 'ders_aw2_4', label: 'Most of the time', value: '2' },
      { id: 'ders_aw2_5', label: 'Almost always', value: '1' },
    ],
  },

  // ── Emotional Clarity (DERS subscale) ──
  {
    id: 'ders_cl1',
    text: 'I have difficulty making sense out of my feelings.',
    type: 'single-choice',
    category: 'regulation_clarity',
    required: true,
    options: [
      { id: 'ders_cl1_1', label: 'Almost never', value: '1' },
      { id: 'ders_cl1_2', label: 'Sometimes', value: '2' },
      { id: 'ders_cl1_3', label: 'About half the time', value: '3' },
      { id: 'ders_cl1_4', label: 'Most of the time', value: '4' },
      { id: 'ders_cl1_5', label: 'Almost always', value: '5' },
    ],
  },
  {
    id: 'ders_cl2',
    text: 'I have no idea how I am feeling.',
    type: 'single-choice',
    category: 'regulation_clarity',
    required: true,
    options: [
      { id: 'ders_cl2_1', label: 'Almost never', value: '1' },
      { id: 'ders_cl2_2', label: 'Sometimes', value: '2' },
      { id: 'ders_cl2_3', label: 'About half the time', value: '3' },
      { id: 'ders_cl2_4', label: 'Most of the time', value: '4' },
      { id: 'ders_cl2_5', label: 'Almost always', value: '5' },
    ],
  },

  // ── Nonacceptance of Emotions (DERS subscale) ──
  {
    id: 'ders_na1',
    text: 'When I\'m upset, I feel guilty for feeling that way.',
    type: 'single-choice',
    category: 'regulation_nonacceptance',
    required: true,
    options: [
      { id: 'ders_na1_1', label: 'Almost never', value: '1' },
      { id: 'ders_na1_2', label: 'Sometimes', value: '2' },
      { id: 'ders_na1_3', label: 'About half the time', value: '3' },
      { id: 'ders_na1_4', label: 'Most of the time', value: '4' },
      { id: 'ders_na1_5', label: 'Almost always', value: '5' },
    ],
  },
  {
    id: 'ders_na2',
    text: 'When I\'m upset, I become embarrassed for feeling that way.',
    type: 'single-choice',
    category: 'regulation_nonacceptance',
    required: true,
    options: [
      { id: 'ders_na2_1', label: 'Almost never', value: '1' },
      { id: 'ders_na2_2', label: 'Sometimes', value: '2' },
      { id: 'ders_na2_3', label: 'About half the time', value: '3' },
      { id: 'ders_na2_4', label: 'Most of the time', value: '4' },
      { id: 'ders_na2_5', label: 'Almost always', value: '5' },
    ],
  },

  // ── Access to Regulation Strategies (DERS subscale) ──
  {
    id: 'ders_st1',
    text: 'When I\'m upset, I believe there is nothing I can do to make myself feel better.',
    type: 'single-choice',
    category: 'regulation_strategies',
    required: true,
    options: [
      { id: 'ders_st1_1', label: 'Almost never', value: '1' },
      { id: 'ders_st1_2', label: 'Sometimes', value: '2' },
      { id: 'ders_st1_3', label: 'About half the time', value: '3' },
      { id: 'ders_st1_4', label: 'Most of the time', value: '4' },
      { id: 'ders_st1_5', label: 'Almost always', value: '5' },
    ],
  },
  {
    id: 'ders_st2',
    text: 'When I\'m upset, I know that I can find a way to eventually feel better.',
    type: 'single-choice',
    category: 'regulation_strategies',
    required: true,
    options: [
      { id: 'ders_st2_1', label: 'Almost never', value: '5' },  // reverse scored
      { id: 'ders_st2_2', label: 'Sometimes', value: '4' },
      { id: 'ders_st2_3', label: 'About half the time', value: '3' },
      { id: 'ders_st2_4', label: 'Most of the time', value: '2' },
      { id: 'ders_st2_5', label: 'Almost always', value: '1' },
    ],
  },

  // ── Impulse Control (DERS subscale) ──
  {
    id: 'ders_im1',
    text: 'When I\'m upset, I have difficulty controlling my behaviours.',
    type: 'single-choice',
    category: 'regulation_impulse',
    required: true,
    options: [
      { id: 'ders_im1_1', label: 'Almost never', value: '1' },
      { id: 'ders_im1_2', label: 'Sometimes', value: '2' },
      { id: 'ders_im1_3', label: 'About half the time', value: '3' },
      { id: 'ders_im1_4', label: 'Most of the time', value: '4' },
      { id: 'ders_im1_5', label: 'Almost always', value: '5' },
    ],
  },
  {
    id: 'ders_im2',
    text: 'When I\'m upset, I feel out of control.',
    type: 'single-choice',
    category: 'regulation_impulse',
    required: true,
    options: [
      { id: 'ders_im2_1', label: 'Almost never', value: '1' },
      { id: 'ders_im2_2', label: 'Sometimes', value: '2' },
      { id: 'ders_im2_3', label: 'About half the time', value: '3' },
      { id: 'ders_im2_4', label: 'Most of the time', value: '4' },
      { id: 'ders_im2_5', label: 'Almost always', value: '5' },
    ],
  },

  // ── Cognitive Reappraisal (ERQ dimension) ──
  {
    id: 'erq_re1',
    text: 'When I want to feel less negative emotion, I change the way I think about the situation.',
    type: 'single-choice',
    category: 'regulation_reappraisal',
    required: true,
    options: [
      { id: 'erq_re1_1', label: 'Strongly disagree', value: '5' },  // reverse: high reappraisal = better
      { id: 'erq_re1_2', label: 'Disagree', value: '4' },
      { id: 'erq_re1_3', label: 'Neutral', value: '3' },
      { id: 'erq_re1_4', label: 'Agree', value: '2' },
      { id: 'erq_re1_5', label: 'Strongly agree', value: '1' },
    ],
  },

  // ── Expressive Suppression (ERQ dimension) ──
  {
    id: 'erq_su1',
    text: 'I keep my emotions to myself.',
    type: 'single-choice',
    category: 'regulation_suppression',
    required: true,
    options: [
      { id: 'erq_su1_1', label: 'Strongly disagree', value: '1' },
      { id: 'erq_su1_2', label: 'Disagree', value: '2' },
      { id: 'erq_su1_3', label: 'Neutral', value: '3' },
      { id: 'erq_su1_4', label: 'Agree', value: '4' },
      { id: 'erq_su1_5', label: 'Strongly agree', value: '5' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// SECTION 3: RELATIONAL NEEDS & COMPATIBILITY (12 questions)
// Based on PREPARE/ENRICH dimensions (Olson)
// NOT based on Chapman's Love Languages (not empirically validated)
//
// Covers the PREPARE/ENRICH domains most predictive of satisfaction:
//   - Communication style (2 items)
//   - Conflict resolution approach (2 items)
//   - Realistic expectations (2 items)
//   - Leisure/companionship preferences (2 items)
//   - Personality issues / adaptability (2 items)
//   - Spiritual intimacy expectations (2 items)
//
// Scoring: Profile-based matching (similarity on each dimension)
// ─────────────────────────────────────────────────────────────

export const RELATIONAL_NEEDS_QUESTIONS: Question[] = [
  // ── Communication Style (PREPARE/ENRICH dimension) ──
  {
    id: 'pe_com1',
    text: 'When something is bothering me, I tend to bring it up directly rather than wait for the right moment.',
    type: 'single-choice',
    category: 'relational_communication',
    required: true,
    options: [
      { id: 'pe_com1_1', label: 'Strongly disagree', value: '1' },
      { id: 'pe_com1_2', label: 'Disagree', value: '2' },
      { id: 'pe_com1_3', label: 'Neutral', value: '3' },
      { id: 'pe_com1_4', label: 'Agree', value: '4' },
      { id: 'pe_com1_5', label: 'Strongly agree', value: '5' },
    ],
  },
  {
    id: 'pe_com2',
    text: 'I feel confident that I can share my deepest feelings with a partner without being judged.',
    type: 'single-choice',
    category: 'relational_communication',
    required: true,
    options: [
      { id: 'pe_com2_1', label: 'Strongly disagree', value: '1' },
      { id: 'pe_com2_2', label: 'Disagree', value: '2' },
      { id: 'pe_com2_3', label: 'Neutral', value: '3' },
      { id: 'pe_com2_4', label: 'Agree', value: '4' },
      { id: 'pe_com2_5', label: 'Strongly agree', value: '5' },
    ],
  },

  // ── Conflict Resolution (PREPARE/ENRICH dimension) ──
  {
    id: 'pe_con1',
    text: 'In a disagreement, I find it more important to understand the other person\'s perspective than to win.',
    type: 'single-choice',
    category: 'relational_conflict',
    required: true,
    options: [
      { id: 'pe_con1_1', label: 'Strongly disagree', value: '1' },
      { id: 'pe_con1_2', label: 'Disagree', value: '2' },
      { id: 'pe_con1_3', label: 'Neutral', value: '3' },
      { id: 'pe_con1_4', label: 'Agree', value: '4' },
      { id: 'pe_con1_5', label: 'Strongly agree', value: '5' },
    ],
  },
  {
    id: 'pe_con2',
    text: 'After an argument, I need time alone before I can reconnect.',
    type: 'single-choice',
    category: 'relational_conflict',
    required: true,
    options: [
      { id: 'pe_con2_1', label: 'Strongly disagree', value: '1' },
      { id: 'pe_con2_2', label: 'Disagree', value: '2' },
      { id: 'pe_con2_3', label: 'Neutral', value: '3' },
      { id: 'pe_con2_4', label: 'Agree', value: '4' },
      { id: 'pe_con2_5', label: 'Strongly agree', value: '5' },
    ],
  },

  // ── Realistic Expectations (PREPARE/ENRICH dimension) ──
  {
    id: 'pe_exp1',
    text: 'I believe my partner should be my best friend and meet most of my emotional needs.',
    type: 'single-choice',
    category: 'relational_expectations',
    required: true,
    options: [
      { id: 'pe_exp1_1', label: 'Strongly disagree', value: '1' },
      { id: 'pe_exp1_2', label: 'Disagree', value: '2' },
      { id: 'pe_exp1_3', label: 'Neutral', value: '3' },
      { id: 'pe_exp1_4', label: 'Agree', value: '4' },
      { id: 'pe_exp1_5', label: 'Strongly agree', value: '5' },
    ],
  },
  {
    id: 'pe_exp2',
    text: 'I expect that a healthy relationship will still have seasons that are difficult and dry.',
    type: 'single-choice',
    category: 'relational_expectations',
    required: true,
    options: [
      { id: 'pe_exp2_1', label: 'Strongly disagree', value: '1' },
      { id: 'pe_exp2_2', label: 'Disagree', value: '2' },
      { id: 'pe_exp2_3', label: 'Neutral', value: '3' },
      { id: 'pe_exp2_4', label: 'Agree', value: '4' },
      { id: 'pe_exp2_5', label: 'Strongly agree', value: '5' },
    ],
  },

  // ── Leisure & Companionship (PREPARE/ENRICH dimension) ──
  {
    id: 'pe_lei1',
    text: 'It\'s important to me that my partner and I share hobbies and interests.',
    type: 'single-choice',
    category: 'relational_leisure',
    required: true,
    options: [
      { id: 'pe_lei1_1', label: 'Strongly disagree', value: '1' },
      { id: 'pe_lei1_2', label: 'Disagree', value: '2' },
      { id: 'pe_lei1_3', label: 'Neutral', value: '3' },
      { id: 'pe_lei1_4', label: 'Agree', value: '4' },
      { id: 'pe_lei1_5', label: 'Strongly agree', value: '5' },
    ],
  },
  {
    id: 'pe_lei2',
    text: 'I value having my own separate friendships and activities outside of a relationship.',
    type: 'single-choice',
    category: 'relational_leisure',
    required: true,
    options: [
      { id: 'pe_lei2_1', label: 'Strongly disagree', value: '1' },
      { id: 'pe_lei2_2', label: 'Disagree', value: '2' },
      { id: 'pe_lei2_3', label: 'Neutral', value: '3' },
      { id: 'pe_lei2_4', label: 'Agree', value: '4' },
      { id: 'pe_lei2_5', label: 'Strongly agree', value: '5' },
    ],
  },

  // ── Personality / Adaptability (PREPARE/ENRICH dimension) ──
  {
    id: 'pe_per1',
    text: 'I am comfortable with change and can adapt easily when plans shift.',
    type: 'single-choice',
    category: 'relational_personality',
    required: true,
    options: [
      { id: 'pe_per1_1', label: 'Strongly disagree', value: '1' },
      { id: 'pe_per1_2', label: 'Disagree', value: '2' },
      { id: 'pe_per1_3', label: 'Neutral', value: '3' },
      { id: 'pe_per1_4', label: 'Agree', value: '4' },
      { id: 'pe_per1_5', label: 'Strongly agree', value: '5' },
    ],
  },
  {
    id: 'pe_per2',
    text: 'I tend to take things personally, even when they aren\'t directed at me.',
    type: 'single-choice',
    category: 'relational_personality',
    required: true,
    options: [
      { id: 'pe_per2_1', label: 'Almost never', value: '1' },
      { id: 'pe_per2_2', label: 'Sometimes', value: '2' },
      { id: 'pe_per2_3', label: 'About half the time', value: '3' },
      { id: 'pe_per2_4', label: 'Most of the time', value: '4' },
      { id: 'pe_per2_5', label: 'Almost always', value: '5' },
    ],
  },

  // ── Spiritual Intimacy Expectations (faith-specific adaptation) ──
  {
    id: 'pe_spi1',
    text: 'I need my partner to be someone I can pray with openly and regularly.',
    type: 'single-choice',
    category: 'relational_spiritual',
    required: true,
    options: [
      { id: 'pe_spi1_1', label: 'Strongly disagree', value: '1' },
      { id: 'pe_spi1_2', label: 'Disagree', value: '2' },
      { id: 'pe_spi1_3', label: 'Neutral', value: '3' },
      { id: 'pe_spi1_4', label: 'Agree', value: '4' },
      { id: 'pe_spi1_5', label: 'Strongly agree', value: '5' },
    ],
  },
  {
    id: 'pe_spi2',
    text: 'I believe the spiritual leadership dynamic in a relationship should be shared equally rather than one person leading.',
    type: 'single-choice',
    category: 'relational_spiritual',
    required: true,
    options: [
      { id: 'pe_spi2_1', label: 'Strongly disagree', value: '1' },
      { id: 'pe_spi2_2', label: 'Disagree', value: '2' },
      { id: 'pe_spi2_3', label: 'Neutral', value: '3' },
      { id: 'pe_spi2_4', label: 'Agree', value: '4' },
      { id: 'pe_spi2_5', label: 'Strongly agree', value: '5' },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// SCORING METHODOLOGY
// ═══════════════════════════════════════════════════════════════
//
// ATTACHMENT (ECR-R adapted):
//   Anxiety Score = mean(ecr_anx1..6)  → 1 (low anxiety) to 5 (high anxiety)
//   Avoidance Score = mean(ecr_avo1..6) → 1 (low avoidance) to 5 (high avoidance)
//   Classification:
//     Secure:           Anxiety < 3 AND Avoidance < 3
//     Anxious-Preoccupied: Anxiety >= 3 AND Avoidance < 3
//     Dismissive-Avoidant: Anxiety < 3 AND Avoidance >= 3
//     Fearful-Avoidant:    Anxiety >= 3 AND Avoidance >= 3
//
// REGULATION (DERS/ERQ adapted):
//   Total DERS Score = sum(all ders_ items) → 10-50 (lower = better regulation)
//   Reappraisal = erq_re1 score (1=high reappraisal, 5=low)
//   Suppression = erq_su1 score (1=low suppression, 5=high)
//
// RELATIONAL (PREPARE/ENRICH adapted):
//   Profile matching = Euclidean distance between user vectors
//   Each dimension scored independently (1-5)
//   Smaller distance = more compatible
//
// COMPATIBILITY MATCHING:
//   Attachment: Best match = similar quadrant or complementary secure
//   Regulation: Best match = both low DERS scores (well-regulated)
//   Relational: Best match = small Euclidean distance (similar expectations)
// ═══════════════════════════════════════════════════════════════

export interface AttachmentProfile {
  anxietyScore: number;      // 1-5, mean of anxiety items
  avoidanceScore: number;    // 1-5, mean of avoidance items
  style: 'secure' | 'anxious' | 'dismissive' | 'fearful';
}

export interface RegulationProfile {
  totalDERS: number;         // 10-50, sum of DERS items
  awarenessScore: number;    // subscale
  clarityScore: number;      // subscale
  nonacceptanceScore: number; // subscale
  strategiesScore: number;   // subscale
  impulseScore: number;      // subscale
  reappraisalScore: number;  // ERQ: 1=high reappraisal (good)
  suppressionScore: number;  // ERQ: 1=low suppression (good)
}

export interface RelationalProfile {
  communicationStyle: number;   // 1-5
  conflictApproach: number;     // 1-5
  expectations: number;         // 1-5
  leisurePreference: number;    // 1-5
  adaptability: number;         // 1-5
  spiritualIntimacy: number;    // 1-5
}

export function calculateAttachmentProfile(answers: Record<string, string>): AttachmentProfile | null {
  const anxietyItems = ['ecr_anx1', 'ecr_anx2', 'ecr_anx3', 'ecr_anx4', 'ecr_anx5', 'ecr_anx6'];
  const avoidanceItems = ['ecr_avo1', 'ecr_avo2', 'ecr_avo3', 'ecr_avo4', 'ecr_avo5', 'ecr_avo6'];

  const anxScores = anxietyItems.map(id => parseInt(answers[id])).filter(v => !isNaN(v));
  const avoScores = avoidanceItems.map(id => parseInt(answers[id])).filter(v => !isNaN(v));

  if (anxScores.length < 6 || avoScores.length < 6) return null;

  const anxietyScore = anxScores.reduce((a, b) => a + b, 0) / anxScores.length;
  const avoidanceScore = avoScores.reduce((a, b) => a + b, 0) / avoScores.length;

  let style: AttachmentProfile['style'];
  if (anxietyScore < 3 && avoidanceScore < 3) style = 'secure';
  else if (anxietyScore >= 3 && avoidanceScore < 3) style = 'anxious';
  else if (anxietyScore < 3 && avoidanceScore >= 3) style = 'dismissive';
  else style = 'fearful';

  return { anxietyScore, avoidanceScore, style };
}

export function calculateRegulationProfile(answers: Record<string, string>): RegulationProfile | null {
  const dersItems = [
    'ders_aw1', 'ders_aw2', 'ders_cl1', 'ders_cl2',
    'ders_na1', 'ders_na2', 'ders_st1', 'ders_st2',
    'ders_im1', 'ders_im2',
  ];

  const dersScores = dersItems.map(id => parseInt(answers[id])).filter(v => !isNaN(v));
  if (dersScores.length < 10) return null;

  const reappraisal = parseInt(answers['erq_re1']);
  const suppression = parseInt(answers['erq_su1']);
  if (isNaN(reappraisal) || isNaN(suppression)) return null;

  const mean = (ids: string[]) => {
    const vals = ids.map(id => parseInt(answers[id])).filter(v => !isNaN(v));
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  };

  return {
    totalDERS: dersScores.reduce((a, b) => a + b, 0),
    awarenessScore: mean(['ders_aw1', 'ders_aw2']),
    clarityScore: mean(['ders_cl1', 'ders_cl2']),
    nonacceptanceScore: mean(['ders_na1', 'ders_na2']),
    strategiesScore: mean(['ders_st1', 'ders_st2']),
    impulseScore: mean(['ders_im1', 'ders_im2']),
    reappraisalScore: reappraisal,
    suppressionScore: suppression,
  };
}

export function calculateRelationalProfile(answers: Record<string, string>): RelationalProfile | null {
  const mean = (ids: string[]) => {
    const vals = ids.map(id => parseInt(answers[id])).filter(v => !isNaN(v));
    if (vals.length === 0) return NaN;
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  };

  const comm = mean(['pe_com1', 'pe_com2']);
  const conflict = mean(['pe_con1', 'pe_con2']);
  const expectations = mean(['pe_exp1', 'pe_exp2']);
  const leisure = mean(['pe_lei1', 'pe_lei2']);
  const adaptability = mean(['pe_per1', 'pe_per2']);
  const spiritual = mean(['pe_spi1', 'pe_spi2']);

  if ([comm, conflict, expectations, leisure, adaptability, spiritual].some(isNaN)) return null;

  return {
    communicationStyle: comm,
    conflictApproach: conflict,
    expectations,
    leisurePreference: leisure,
    adaptability,
    spiritualIntimacy: spiritual,
  };
}

// Compatibility scoring between two users
export function calculateDeepCompatibility(
  userA: { attachment: AttachmentProfile; regulation: RegulationProfile; relational: RelationalProfile },
  userB: { attachment: AttachmentProfile; regulation: RegulationProfile; relational: RelationalProfile },
): { attachmentScore: number; regulationScore: number; relationalScore: number; overall: number } {
  // Attachment: secure-secure is best, same style gets moderate, opposite gets lower
  const attDist = Math.sqrt(
    Math.pow(userA.attachment.anxietyScore - userB.attachment.anxietyScore, 2) +
    Math.pow(userA.attachment.avoidanceScore - userB.attachment.avoidanceScore, 2)
  );
  // Max possible distance is sqrt(32) ≈ 5.66, normalize to 0-100
  const attachmentScore = Math.max(0, Math.round(100 - (attDist / 5.66) * 100));

  // Regulation: both well-regulated is best
  const regMeanA = userA.regulation.totalDERS / 10;
  const regMeanB = userB.regulation.totalDERS / 10;
  const regDist = Math.abs(regMeanA - regMeanB);
  const regBase = (5 - (regMeanA + regMeanB) / 2) / 4 * 60; // bonus for both being well-regulated
  const regSimilarity = (4 - regDist) / 4 * 40; // bonus for similarity
  const regulationScore = Math.max(0, Math.min(100, Math.round(regBase + regSimilarity)));

  // Relational: Euclidean distance across 6 dimensions
  const relVecA = [userA.relational.communicationStyle, userA.relational.conflictApproach, userA.relational.expectations, userA.relational.leisurePreference, userA.relational.adaptability, userA.relational.spiritualIntimacy];
  const relVecB = [userB.relational.communicationStyle, userB.relational.conflictApproach, userB.relational.expectations, userB.relational.leisurePreference, userB.relational.adaptability, userB.relational.spiritualIntimacy];
  const relDist = Math.sqrt(relVecA.reduce((sum, val, i) => sum + Math.pow(val - relVecB[i], 2), 0));
  // Max distance for 6 dimensions with range 4 each = sqrt(6*16) ≈ 9.8
  const relationalScore = Math.max(0, Math.round(100 - (relDist / 9.8) * 100));

  // Weighted overall: attachment 40%, regulation 25%, relational 35%
  const overall = Math.round(
    attachmentScore * 0.40 +
    regulationScore * 0.25 +
    relationalScore * 0.35
  );

  return { attachmentScore, regulationScore, relationalScore, overall };
}

// Section metadata for the UI
export const DEEP_INSIGHTS_SECTIONS = [
  {
    id: 'attachment',
    title: 'Attachment Style',
    subtitle: 'Based on the ECR-R framework — how you bond, trust, and handle closeness in relationships',
    questions: ATTACHMENT_QUESTIONS,
    icon: '🔗',
    science: 'Adapted from the Experiences in Close Relationships-Revised scale (Fraley et al., 2000). Measures attachment anxiety and avoidance — the two strongest individual-difference predictors of relationship satisfaction.',
  },
  {
    id: 'regulation',
    title: 'Emotional Regulation',
    subtitle: 'Based on the DERS and ERQ frameworks — how you process and manage difficult emotions',
    questions: REGULATION_QUESTIONS,
    icon: '🌊',
    science: 'Adapted from the Difficulties in Emotion Regulation Scale (Gratz & Roemer, 2004) and Emotion Regulation Questionnaire (Gross & John, 2003). Measures awareness, clarity, acceptance, strategies, impulse control, and regulation approach.',
  },
  {
    id: 'relational',
    title: 'Relational Compatibility',
    subtitle: 'Based on the PREPARE/ENRICH model — your expectations, communication, and relationship style',
    questions: RELATIONAL_NEEDS_QUESTIONS,
    icon: '💛',
    science: 'Adapted from the PREPARE/ENRICH assessment (Olson). This model has 80-85% accuracy in predicting marital success across 1,200+ published studies.',
  },
];

export const TOTAL_DEEP_QUESTIONS =
  ATTACHMENT_QUESTIONS.length +
  REGULATION_QUESTIONS.length +
  RELATIONAL_NEEDS_QUESTIONS.length;
