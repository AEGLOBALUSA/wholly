# WHOLLY — Complete System Documentation

> If you need to rebuild this app from scratch, paste this document to an AI assistant and it will have everything needed to recreate the entire system.

---

## 1. What WHOLLY Is

WHOLLY is a faith-based dating app for Spirit-filled Christians (Pentecostal/Charismatic). It matches users across 4 compatibility dimensions using a 53-question onboarding assessment, weighted geometric mean algorithm, and tiered matching system.

**Target audience:** Singles at churches like Futures Church (Adelaide) and Planetshakers (Melbourne).

**Core differentiator:** The app requires a Covenant agreement (no manipulation, no fake profiles, Spirit-led behavior) and includes a jargon authenticity check to verify genuine community familiarity.

**Business model:** Free tier (limited matches), Connect ($19.99/mo), Intentional ($29.99/mo). Annual pricing available with 23-25% savings.

---

## 2. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Expo (React Native) | 55 |
| Runtime | React | 19.2.0 |
| Language | TypeScript | 5.9.2 |
| Router | Expo Router (file-based) | 55 |
| Backend | Supabase (Postgres + Auth + Storage + Edge Functions) | 2.98.0 |
| Hosting | Netlify (web) | — |
| Payments | Stripe (web) + RevenueCat (mobile) | — |
| Email | Resend | — |
| Analytics | Google Analytics 4 | G-QRW7RR3H0Y |
| Fonts | DM Sans (body) + Playfair Display (headings in landing) | — |
| Build | EAS Build (iOS/Android) | — |

---

## 3. Project Structure

```
wholly/
├── app/                          # Expo Router pages (file-based routing)
│   ├── _layout.tsx               # Root layout (providers, fonts, navigation)
│   ├── index.tsx                 # App entry (redirects to covenant or matches)
│   ├── covenant.tsx              # Covenant agreement screen
│   ├── auth/
│   │   ├── sign-in.tsx
│   │   ├── sign-up.tsx
│   │   └── forgot-password.tsx
│   ├── onboarding/
│   │   ├── _layout.tsx
│   │   ├── step-1.tsx            # Basic info (name, age, city, gender)
│   │   ├── step-2.tsx            # Denomination selection
│   │   ├── step-3.tsx            # Jargon authenticity check
│   │   ├── step-4.tsx            # Theology questions
│   │   ├── step-5.tsx            # Faith style forced-choice pairs
│   │   ├── step-6.tsx            # Honesty check
│   │   ├── step-7.tsx            # Short answers
│   │   ├── step-8.tsx            # Emotional health
│   │   ├── step-9.tsx            # Conflict style
│   │   ├── step-10.tsx           # Intellectual
│   │   ├── step-11.tsx           # Life vision
│   │   ├── results.tsx           # Match results with filters
│   │   └── deep-insights.tsx     # Extended questionnaire (optional)
│   ├── chat/
│   │   ├── index.tsx             # Conversation list
│   │   └── [id].tsx              # Individual chat room (realtime)
│   ├── profile/
│   │   └── index.tsx             # View/edit profile
│   ├── legal/
│   │   ├── terms.tsx             # Terms of Service
│   │   └── privacy.tsx           # Privacy Policy
│   └── settings/
│       └── subscription.tsx      # Manage subscription
│
├── components/
│   ├── onboarding/
│   │   ├── StepContainer.tsx     # Wraps each step with progress bar + nav
│   │   ├── QuestionCard.tsx      # Single/multi-choice question renderer
│   │   ├── ForcedChoiceCard.tsx   # Binary A/B choice pairs
│   │   ├── CheckboxList.tsx      # Multi-select list
│   │   ├── JargonGrid.tsx        # Tap-to-select jargon authenticity grid
│   │   └── CovenantItem.tsx      # Covenant statement with checkbox
│   ├── results/
│   │   ├── MatchCard.tsx         # Profile card with 5 score bars + community familiarity
│   │   ├── ScoreBar.tsx          # Horizontal bar with label + percentage (0-100)
│   │   ├── TierBadge.tsx         # Exceptional/Strong/Compatible/Below badge
│   │   └── BlurredCard.tsx       # Paywall blur for free tier
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── RadioGroup.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── PaywallModal.tsx      # Upgrade prompt modal
│   │   └── VerifiedBadge.tsx     # Blue tick / Gold tick
│   └── PhotoUpload.tsx           # Photo picker + upload to Supabase Storage
│
├── context/
│   ├── AuthContext.tsx            # Supabase auth state + session management
│   ├── OnboardingContext.tsx      # Onboarding answers + validation + persistence
│   ├── SubscriptionContext.tsx    # Tier state + feature gates
│   ├── ThemeContext.tsx           # Light/dark mode toggle
│   └── AnalyticsContext.tsx       # GA4 event tracking
│
├── services/
│   ├── matching.ts               # Compatibility algorithm (geometric mean + floor cap)
│   ├── profiles.ts               # CRUD for profiles + onboarding answers
│   ├── chat.ts                   # Messaging + realtime subscriptions
│   ├── photos.ts                 # Photo upload/delete via Supabase Storage
│   ├── payments.ts               # Stripe checkout + portal + RevenueCat
│   ├── subscription.ts           # Pricing config + feature descriptions + verification
│   ├── safety.ts                 # Report + block/unblock users
│   ├── account.ts                # Account deletion with 30-day grace
│   ├── notifications.ts          # Browser push notifications
│   └── analytics.ts              # GA4 event helpers
│
├── data/
│   ├── covenant.ts               # 6 covenant statements
│   ├── demoProfiles.ts           # 100 demo profiles with pre-calculated scores
│   └── questions/
│       ├── theology.ts           # 6 questions (Spirit baptism, tongues, prophecy, etc.)
│       ├── faithStyle.ts         # 10 forced-choice pairs (spiritual practices)
│       ├── emotionalHealth.ts    # 10 questions (attachment + Gottman communication)
│       ├── conflictStyle.ts      # 6 questions (TKI 5 styles + scenarios)
│       ├── intellectual.ts       # 6 questions (curiosity, conversation, learning)
│       ├── lifeVision.ts         # 11 questions (marriage, kids, money, roles, family, boundaries, career)
│       ├── honestyCheck.ts       # 2 forced-choice lie scale pairs
│       ├── shortAnswers.ts       # 2 free-text profile display questions
│       ├── jargon.ts             # 30 terms (20 authentic + 10 decoy)
│       └── deepInsights.ts       # Extended questionnaire (60+ items, optional)
│
├── lib/
│   └── supabase.ts               # Supabase client with lazy init + demo fallback
│
├── styles/
│   └── tokens.ts                 # Colors, fonts, spacing, border radius, tier colors
│
├── types/
│   ├── index.ts                  # App types (Question, DemoProfile, CompatibilityScores, etc.)
│   └── database.ts               # Supabase generated types
│
├── utils/
│   ├── validation.ts             # Email, password, age validation
│   ├── storage.ts                # AsyncStorage helpers
│   └── gtag.ts                   # Google Analytics tag helpers
│
├── supabase/
│   ├── functions/
│   │   ├── calculate-matches/    # Server-side compatibility calculation
│   │   ├── create-checkout/      # Stripe Checkout session creator
│   │   ├── create-portal/        # Stripe Customer Portal session
│   │   ├── stripe-webhook/       # Handles Stripe events (subscribe/cancel/fail)
│   │   └── send-email/           # Resend-based transactional email (6 templates)
│   └── migrations/
│       ├── 001_initial_schema.sql      # profiles, onboarding_answers, compatibility_scores, matches, conversations, messages, churches
│       ├── 002_rls_policies.sql        # Row-level security for all tables
│       ├── 002_pastoral_verification.sql # Blue/Gold tick tables
│       ├── 003_seed_demo_profiles.sql  # 100 demo profiles
│       ├── 004_photo_storage.sql       # Photo bucket config
│       ├── 005_subscriptions_and_safety.sql # subscriptions, reports, blocks, deletion_requests
│       └── 006_analytics.sql           # Analytics tables
│
├── analysis/
│   ├── algorithm-simulation.ts         # 26-scenario algorithm test suite
│   ├── build-report.js                 # Generates expert analysis DOCX
│   └── WHOLLY_Algorithm_Expert_Analysis.docx
│
├── landing.html                  # Static landing page (deployed as whollydate.com root)
├── app.json                      # Expo config
├── eas.json                      # EAS Build profiles (dev, preview, production)
├── netlify.toml                  # Netlify build + redirect config
├── tsconfig.json                 # TypeScript strict mode
├── package.json                  # Dependencies
├── .env.example                  # Environment variable template
├── LAUNCH_CHECKLIST.md           # Step-by-step go-live guide
└── SYSTEM_DOCUMENTATION.md       # This file
```

---

## 4. Matching Algorithm

### 4.1 Dimensions and Weights

| Dimension | Weight | Questions | What it measures |
|-----------|--------|-----------|-----------------|
| Spiritual | 1.5x | 6 theology + 10 faith style pairs | Core Pentecostal beliefs + spiritual practices |
| Emotional | 1.2x | 10 attachment + 6 conflict | Attachment style (ECR-S adapted) + Gottman communication |
| Life Vision | 1.0x | 11 life questions | Marriage, kids, money, roles, family, boundaries, career |
| Intellectual | 0.8x | 6 questions | Curiosity, conversation depth, learning style |

**Total scored items: 53** (plus 2 honesty check pairs, 2 short answers, 30 jargon terms)

### 4.2 Scoring Method: Weighted Geometric Mean

```
product = (spiritual/100)^1.5 × (emotional/100)^1.2 × (intellectual/100)^0.8 × (lifeVision/100)^1.0
overall = product^(1/4.5) × 100
```

Why geometric mean: It naturally penalizes any single weak dimension. A 95% spiritual + 40% emotional = 62% overall (arithmetic would give 68%).

### 4.3 Floor Capping

Overall score cannot exceed a multiplier of the lowest dimension:
- Spiritual, Emotional, Life Vision: capped at **1.35×** lowest
- Intellectual: capped at **1.5×** (softer — intellectual mismatch is less critical)

Example: If emotional = 40%, overall caps at 54% regardless of other scores.

### 4.4 Match Tiers

| Tier | Threshold | Expected Distribution |
|------|-----------|----------------------|
| Exceptional | ≥82 | 5-8% |
| Strong | ≥72 | 20-25% |
| Compatible | ≥58 | 35-40% |
| Below | <58 | 25-35% |

### 4.5 Deal-Breaker System

**Hard deal-breakers** (cap dimension at 50%):
- Spirit baptism disagreement (theo1)
- Tongues belief disagreement (theo2)
- Children: want + don't want (lv2)
- Marriage leadership: traditional headship + egalitarian (lv7)

**Soft deal-breakers** (point penalties):
- Marriage timeline mismatch: -10 points on life vision (lv1)
- Family-of-origin involvement mismatch: -10 points (lv9)

### 4.6 Marriage Leadership Compatibility Matrix

WHOLLY uses a servant headship model aligned with Futures Church theology: the man is the spiritual head of the home (not domination), but day-to-day couples lead in their strengths.

| User A \ User B | Servant Headship | Traditional | Egalitarian | Unsure |
|-----------------|-----------------|-------------|-------------|--------|
| **Servant Headship** | Perfect (0) | Minor (-10) | Moderate (-15) | OK (0) |
| **Traditional** | Minor (-10) | Perfect (0) | **DEAL-BREAKER** | OK (0) |
| **Egalitarian** | Moderate (-15) | **DEAL-BREAKER** | Perfect (0) | OK (0) |
| **Unsure** | OK (0) | OK (0) | OK (0) | OK (0) |

### 4.7 Community Familiarity Score

Calculated from the jargon grid (Step 3):
- 30 terms shown (20 authentic Spirit-filled terms + 10 decoys)
- Score = (authentic selected - decoys selected) / 20 × 100
- Displayed as a 0-100 slider on match cards
- NOT part of the compatibility score — it's context, not a match factor

### 4.8 Honesty Check (Lie Scale)

2 forced-choice pairs where Option A is "too good to be true":
- "I have never had a doubt about my faith" vs "I have wrestled with questions about God"
- "I always feel God's presence when I pray" vs "Sometimes prayer feels dry or distant"

If a user picks Option A on both: flag as potential social desirability bias. Not shown to matches, used internally for data quality.

---

## 5. Database Schema

### 5.1 Core Tables

**profiles** — User accounts
```sql
id, auth_id, email, first_name, age, city, denomination, gender, bio,
photo_url, community_familiarity_score, is_demo, onboarding_complete,
subscription_tier, is_blocked, deleted_at, created_at, updated_at
```

**onboarding_answers** — JSONB answers per section
```sql
id, profile_id, section, answers (JSONB), created_at, updated_at
UNIQUE(profile_id, section)
```

**compatibility_scores** — Pre-calculated match scores
```sql
id, user_id, match_id, spiritual, emotional, intellectual, life_vision,
overall, tier, created_at
UNIQUE(user_id, match_id)
```

**matches** — Mutual interest tracking
```sql
id, user_a, user_b, status ('pending'|'matched'|'declined'), created_at
```

**conversations** — Chat threads linked to matches
```sql
id, match_id, last_message_at, created_at
```

**messages** — Individual chat messages
```sql
id, conversation_id, sender_id, content, read_at, created_at
```

**subscriptions** — Payment status
```sql
id, user_id, stripe_customer_id, stripe_subscription_id, tier, period,
status, current_period_end, cancel_at_period_end, created_at
```

**reports** — User safety reports
```sql
id, reporter_id, reported_id, reason, details, status, admin_notes,
created_at, reviewed_at
```

**blocks** — Bidirectional user blocks
```sql
id, blocker_id, blocked_id, created_at
UNIQUE(blocker_id, blocked_id)
```

**deletion_requests** — Account deletion with grace period
```sql
id, user_id, reason, requested_at, scheduled_deletion_at (NOW() + 30 days),
canceled_at, status
```

**churches** — Pre-seeded church list
```sql
id, name, slug, city, state, country
-- Seeded: Futures Church (Adelaide), Planetshakers (Melbourne)
```

### 5.2 RLS Policies
All tables have Row-Level Security enabled. Key rules:
- Users can only read/write own profile and answers
- Demo profiles are publicly readable
- Matched profiles are readable if compatibility scores exist
- Messages are only accessible to conversation participants
- Blocks filter both directions (blocker and blocked can't see each other)

---

## 6. Edge Functions

| Function | Purpose | Trigger |
|----------|---------|---------|
| `calculate-matches` | Compare user answers against all opposite-gender profiles, store scores | Called after onboarding completion |
| `create-checkout` | Create Stripe Checkout session for subscription purchase | User clicks subscribe |
| `create-portal` | Create Stripe Customer Portal session for management | User clicks manage subscription |
| `stripe-webhook` | Handle Stripe events (subscribe, cancel, payment fail) | Stripe webhook POST |
| `send-email` | Send transactional emails via Resend | Called by other functions or DB triggers |

---

## 7. Design System

### 7.1 Colors
```typescript
background: '#FFFAF7'    // Warm off-white
surface: '#FFFFFF'        // Card backgrounds
text: '#1A1A1A'          // Primary text
textSecondary: '#5C5C5C' // Secondary text
textMuted: '#9CA3AF'     // Muted labels
primary: '#D4726A'       // Coral/rose accent
primaryLight: '#F0B8B3'  // Light coral
secondary: '#F5EBE7'     // Warm neutral
gold: '#D4A853'          // Strong tier / Gold tick
green: '#4CAF7D'         // Exceptional tier
error: '#E25050'         // Error states
```

### 7.2 Fonts
- **Headings:** DM Sans Bold / SemiBold
- **Body:** DM Sans Regular / Medium
- **Landing page:** Playfair Display (serif headings)

### 7.3 Tier Colors
```typescript
exceptional: '#4CAF7D' (green)
strong: '#D4A853' (gold)
compatible: '#9CA3AF' (gray)
below: '#E25050' (red)
```

---

## 8. Subscription Tiers and Feature Gates

| Feature | Free (Discover) | Standard (Connect) | Premium (Intentional) |
|---------|:-:|:-:|:-:|
| View profiles | Limited | Full | Full |
| Express interest | No | Yes | Yes |
| Chat (mutual) | No | Yes | Yes |
| Photos | None | Thumbnail | Full |
| Blue Tick | Yes (free) | Yes | Yes |
| Gold Tick + Pastor Note | No | No | Yes |
| Threshold selector | No | No | Yes |
| Weekly digest | No | No | Yes |
| Priority discovery | No | No | Yes |
| Extended insights | No | No | Yes |
| Curated filters | No | No | Yes |
| Monthly visibility boost | No | No | Yes |
| Active status | No | No | Yes |

---

## 9. Safety Features

### 9.1 Report Reasons
1. Inappropriate content
2. Harassment
3. Fake profile
4. **Spiritual manipulation** (unique to WHOLLY — using prophecy/dreams/authority to pressure)
5. Underage user
6. Spam
7. Other

### 9.2 Block System
- Blocking is immediate and bidirectional
- Blocked users disappear from matches, chat, and search
- `get_visible_matches()` SQL function filters blocked + deleted users
- Users can unblock from settings

### 9.3 Account Deletion
- 30-day grace period (required by app stores)
- User can cancel during grace period
- After 30 days, all data permanently removed
- Profile marked with `deleted_at` during grace period (hidden from matches)

---

## 10. Covenant Statements

All users must agree to all 6 before accessing the platform:

1. I am here to build a meaningful, long-term relationship that honours God and ideally leads to marriage and lasting happiness.
2. I commit to honesty, authenticity, and respect in every interaction on this platform.
3. I am willing to be accountable for my behavior in this community and will not harass, mislead, or pressure another user.
4. I will not use prophetic language, dreams, or spiritual authority to manipulate or pressure someone.
5. I commit to seeking God's will and Spirit-led behavior in my relationships.
6. I understand that WHOLLY reserves the right to remove anyone who violates this covenant.

---

## 11. Question Bank (53 Scored Items)

### Theology (6 questions)
- theo1: Spirit baptism as distinct from water baptism (yes/no/not sure)
- theo2: Speaking in tongues for today (yes/no/not sure)
- theo3: Prophecy in worship (yes/sometimes/no)
- theo4: Gifts of the Spirit witnessed (multi-select: tongues, prophecy, healing, etc.)
- theo5: Altar call participation frequency
- theo6: Laying on of hands practice

### Faith Style (10 forced-choice pairs)
- fs1: Pray for guidance before dating vs go with feelings
- fs2: God speaks through gifts vs rely on own understanding
- fs3: Pastor knows dating life vs keep private
- fs6: Seek prayer first in conflict vs fix it myself
- fs7: Fasting is important vs don't fast
- fs8: Pray together about future vs figure it out
- fs10: Spirit-filled = accountability vs sincerity enough
- fs11: Check in spirit = pause vs move forward
- fs13: Want ministry partner vs genuine Jesus-lover
- fs14: Believe in spiritual warfare vs focus on God's goodness

### Emotional Health (10 questions)
- eh1-eh5: Attachment style classification (secure/anxious/avoidant/disorganized)
  - Pulls away response, relationship dependence, upset handling, biggest fear, new relationship
- eh6-eh8: ECR-S adapted (comfort depending, abandonment worry, sharing feelings)
- eh9: Gottman criticism detection (complaint vs "you always" vs suppress vs sarcasm)
- eh10: Gottman defensiveness detection (listen vs explain vs counter-attack vs stonewall)

### Conflict Style (6 questions)
- cs1-cs4: Thomas-Kilmann 5 styles (collaborative/accommodating/avoiding/competing/compromising)
  - First instinct, during argument, after resolution, beliefs about healthy conflict
- cs5: Situational — partner makes unilateral purchase
- cs6: Situational — partner criticizes you in front of friends

### Intellectual (6 questions)
- int1: Reading and learning habits
- int2: Conversation energy (deep faith/practical/emotional/banter)
- int3: Response to different opinions
- int4: Importance of deep conversation in partner
- int5: Topics of interest (multi-select up to 3)
- int7: Decision-making approach

### Life Vision (11 questions)
- lv1: Marriage timeline
- lv2: Children desire (DEAL-BREAKER: want + don't want)
- lv3: Tithing approach
- lv4: Relocation willingness
- lv5: Different denomination flexibility
- lv6: Debt approach
- lv7: Marriage leadership (DEAL-BREAKER: traditional + egalitarian)
  - Servant headship / Traditional headship / Egalitarian / Unsure
- lv8: Ministry involvement level
- lv9: Extended family involvement (SOFT DEAL-BREAKER)
- lv10: Physical intimacy boundaries
- lv11: Career and family expectations

### Honesty Check (2 forced-choice pairs)
- hc1: Never doubted faith vs wrestled with questions
- hc2: Always feel God's presence vs sometimes prayer is dry

### Short Answers (2 text, not scored)
- sa1: Moment where God's presence changed your life direction
- sa3: What you're believing God for in this next season

---

## 12. How to Rebuild From Scratch

### Step 1: Create Project
```bash
npx create-expo-app wholly-app --template tabs
cd wholly-app
```

### Step 2: Install Dependencies
```bash
npx expo install @supabase/supabase-js @react-native-async-storage/async-storage \
  react-native-reanimated react-native-safe-area-context react-native-screens \
  expo-router expo-font expo-splash-screen expo-status-bar expo-linking \
  expo-web-browser expo-constants expo-symbols react-native-web react-native-worklets
```

### Step 3: Create Supabase Project
- Go to https://supabase.com → New project
- Run all migrations in order (001-006) in SQL Editor
- Enable Realtime on `messages` and `matches` tables
- Create `profile-photos` storage bucket (public)

### Step 4: Create File Structure
Recreate the directory structure from Section 3. Key files to create first:
1. `lib/supabase.ts` — client config
2. `styles/tokens.ts` — design system
3. `types/index.ts` — all type definitions
4. `context/` — all 5 context providers
5. `data/` — questions, covenant, demo profiles
6. `services/` — all service files
7. `app/_layout.tsx` — root layout with providers

### Step 5: Configure Environment
```bash
cp .env.example .env
# Fill in Supabase URL and Anon Key
```

### Step 6: Configure Netlify
- Connect GitHub repo
- Set build command: `npx expo export --platform web && cp landing.html dist/index.html && mkdir -p dist/assets/carousel && cp assets/carousel/*.jpg dist/assets/carousel/`
- Set publish directory: `dist`
- Add environment variables

### Step 7: Configure Stripe
- Create Stripe account
- Create 4 products/prices (standard monthly/annual, premium monthly/annual)
- Set up webhook pointing to Supabase edge function
- Deploy edge functions

### Step 8: Deploy
```bash
git push origin main  # Triggers Netlify build
supabase functions deploy calculate-matches
supabase functions deploy create-checkout
supabase functions deploy create-portal
supabase functions deploy stripe-webhook
supabase functions deploy send-email
```

---

## 13. Key Architectural Decisions

1. **Geometric mean over arithmetic mean** — Penalizes hidden weaknesses without arbitrary rules. Validated by simulation (92% pass rate across 26 scenarios).

2. **Servant headship as default marriage model** — Aligned with Futures Church / Planetshakers theology: man is spiritual head (not domination), daily leadership by strengths.

3. **Community familiarity as context, not score** — Shown on match cards but doesn't affect compatibility. Being new to church culture doesn't mean incompatible.

4. **Honesty check hidden from matches** — Social desirability bias is flagged internally, never exposed to other users.

5. **30-day deletion grace period** — Meets app store requirements while preventing impulse deletions.

6. **Spiritual manipulation as a report category** — Unique to WHOLLY. Addresses a real problem in Pentecostal communities where prophecy or spiritual authority is misused in dating.

7. **Floor cap at 1.35x (1.5x for intellectual)** — Prevents catastrophically low dimensions from being hidden. Intellectual gets a softer cap because it's less critical than spiritual/emotional alignment.

8. **Demo mode fallback** — App works fully with demo profiles when Supabase is not configured. All services check `isSupabaseConfigured()` and return mock data if not.

---

*Document version: 1.0 — March 2026*
*GitHub: https://github.com/AEGLOBALUSA/wholly*
*Live: https://whollydate.com*
