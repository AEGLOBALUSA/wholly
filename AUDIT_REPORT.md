# WHOLLY (whollydate.com) — Full Security & Bot Audit Report

**Date:** 2026-03-30
**Auditor:** Claude Code (Automated Audit)
**Scope:** Full codebase review with focus on bot prevention, abuse, and security

---

## Executive Summary

WHOLLY is a faith-based dating app for Spirit-filled Christians built with Expo (React Native) + Supabase + Netlify. The app has **strong domain-specific safety features** (pastoral verification, covenant agreement, community jargon scoring) but **critically lacks standard automated bot and abuse prevention**. There are no rate limiters, no CAPTCHAs, no device fingerprinting, no content moderation AI, and no automated spam detection. The app relies almost entirely on manual moderation and community self-policing.

### Risk Rating: **HIGH** for bot/spam abuse at scale

---

## 1. BOT & FAKE PROFILE DEFENSES — Current State

### 1.1 What Exists (Strengths)

| Defense | Location | Effectiveness vs Bots |
|---------|----------|----------------------|
| **Covenant Agreement** | `data/covenant.ts`, `app/covenant.tsx` | LOW — Bots can click "agree" programmatically |
| **Community Jargon Test (Spirit Check)** | `utils/validation.ts`, onboarding step 3 | MEDIUM — 30 terms (20 authentic, 10 decoy). Scored 0-100. However, term lists are **hardcoded in client-side code** — a bot can scrape them |
| **Pastoral Verification (Blue/Gold Tick)** | `supabase/migrations/002_pastoral_verification.sql` | HIGH — Requires real pastor email confirmation. Hard for bots to forge. But it's **optional** — unverified profiles still appear |
| **User Reporting** | `services/safety.ts` | MEDIUM — Reactive only. Reports must be manually reviewed. No automated escalation |
| **User Blocking** | `services/safety.ts` | LOW — Individual defense. Doesn't remove bot from platform |
| **Honesty Check (Lie Scale)** | 2 forced-choice pairs in onboarding | LOW — Flags social desirability bias but doesn't block access |
| **RLS Policies** | `supabase/migrations/002_rls_policies.sql` | MEDIUM — Prevents cross-user data access, but doesn't prevent bot accounts from existing |
| **Age Verification** | DB constraint `CHECK (age >= 18 AND age <= 100)` | LOW — Self-reported, no ID verification |

### 1.2 What Is MISSING (Critical Gaps)

| Missing Defense | Risk Level | Impact |
|-----------------|-----------|--------|
| **Rate Limiting** | CRITICAL | Bots can create unlimited accounts, send unlimited messages, and spam interest expressions |
| **CAPTCHA / Challenge** | CRITICAL | No human verification at signup or any sensitive action |
| **Email Verification Enforcement** | HIGH | Supabase Auth sends confirmation emails, but **no evidence the app blocks access before verification** |
| **Bot Detection Algorithm** | HIGH | No behavioral analysis, no velocity checks, no fingerprinting |
| **Content Moderation (AI)** | HIGH | No scanning of messages for spam, scam links, phishing, or inappropriate content |
| **Photo Moderation / NSFW Detection** | HIGH | Photos uploaded to Supabase Storage with no content scanning |
| **IP-Based Throttling** | HIGH | No IP tracking or blocking for abuse patterns |
| **Device Fingerprinting** | MEDIUM | No device ID tracking to detect multi-account bots |
| **Phone Verification** | MEDIUM | No SMS/phone verification as second factor |
| **Automated Spam Detection** | HIGH | No keyword filtering, no link detection in messages |
| **Admin Dashboard** | HIGH | No moderation UI exists — all moderation requires direct DB access |
| **Automated Report Escalation** | MEDIUM | Reports sit in DB with no automated triage or alerts |
| **Account Creation Throttling** | CRITICAL | No limit on how many accounts can be created from same IP/device |
| **Suspicious Activity Alerts** | MEDIUM | No automated monitoring for unusual patterns |

---

## 2. ATTACK VECTORS — Bot Exploitation Scenarios

### 2.1 Mass Account Creation
**Risk: CRITICAL**
- No CAPTCHA at signup (`app/auth/sign-up.tsx`)
- No rate limiting on `supabase.auth.signUp()`
- No device fingerprinting
- A bot can create thousands of accounts with disposable emails
- **Mitigation needed:** CAPTCHA + rate limit + email verification gate

### 2.2 Jargon Test Bypass
**Risk: HIGH**
- All 30 jargon terms (20 authentic + 10 decoy) are **hardcoded in client-side JavaScript** (`data/` directory)
- Bot can read the source code, identify authentic terms, and score 100/100 every time
- **Mitigation needed:** Move jargon terms server-side, randomize subsets, add new terms regularly

### 2.3 Onboarding Auto-Fill
**Risk: HIGH**
- All 11 onboarding steps are client-side forms with predictable question IDs
- A bot can POST answers directly to Supabase without rendering the UI
- Validation is client-side only (`utils/validation.ts`) — not enforced server-side
- **Mitigation needed:** Server-side validation in edge functions, behavioral timing analysis

### 2.4 Message Spam
**Risk: HIGH**
- No rate limiting on message sends (`services/chat.ts`)
- No content filtering or link detection
- Messages insert directly to Supabase `messages` table
- A bot with a mutual match can spam unlimited messages
- **Mitigation needed:** Message rate limits, content filtering, link blocking

### 2.5 Interest Spam
**Risk: MEDIUM**
- No throttle on expressing interest in matches
- A bot could "like" every profile to force mutual matches
- **Mitigation needed:** Daily interest limit, velocity detection

### 2.6 Photo Abuse
**Risk: HIGH**
- Photos upload to Supabase Storage with only size (5MB) and MIME type checks
- No NSFW detection, no content scanning
- Inappropriate images could be served to users before reports are filed
- **Mitigation needed:** AI photo moderation (e.g., AWS Rekognition, Google Vision, Cloudflare Images)

### 2.7 Scraping User Data
**Risk: MEDIUM**
- RLS policies prevent cross-user reads... but compatibility scores are readable for matched users
- A bot account could accumulate match data (names, ages, cities, bios) for all opposite-gender users
- **Mitigation needed:** Rate limit on profile reads, anomaly detection on data access patterns

### 2.8 Stripe Webhook Spoofing
**Risk: LOW** (already mitigated)
- Stripe webhook endpoint verifies HMAC-SHA256 signatures (`supabase/functions/stripe-webhook/index.ts`)
- Good: Properly implemented signature verification with timing validation

### 2.9 Report System Abuse
**Risk: MEDIUM**
- No limit on how many reports a user can file
- A bot could mass-report legitimate users to overwhelm moderation
- Self-report prevented by DB constraint, but mass false reporting is not
- **Mitigation needed:** Report rate limiting, reporter credibility scoring

---

## 3. INFRASTRUCTURE SECURITY AUDIT

### 3.1 Environment & Secrets

| Item | Status | Notes |
|------|--------|-------|
| `.env` file in repo | **WARNING** | `.env` file exists in repo root. Should be in `.gitignore` |
| `.env.example` | OK | Only contains placeholder variable names, no secrets |
| Supabase Anon Key | WARNING | Exposed in client code (by design with Supabase, but RLS must be airtight) |
| Stripe Secret Keys | OK | Stored in Supabase Edge Function secrets, not in client code |
| Resend API Key | OK | Server-side only |

### 3.2 Database Security

| Item | Status | Notes |
|------|--------|-------|
| RLS Enabled | OK | All tables have Row-Level Security policies |
| Self-Report Prevention | OK | `CHECK (reporter_id != reported_id)` constraint |
| Unique Constraints | OK | Blocks, matches, scores all have proper unique constraints |
| Foreign Key Cascades | OK | `ON DELETE CASCADE` for cleanup |
| Demo Profile Isolation | WARNING | Demo profiles are publicly readable — ensure they can't be exploited |
| `is_blocked` Admin Flag | OK | Exists on profiles for admin blocking |

### 3.3 Authentication

| Item | Status | Notes |
|------|--------|-------|
| Password Minimum | WARNING | Only 8 characters minimum, no complexity requirements |
| Session Management | OK | Auto-refresh tokens, AsyncStorage persistence |
| Password Reset | OK | Email-based reset via Supabase Auth |
| MFA / 2FA | MISSING | No multi-factor authentication |
| OAuth Providers | MISSING | Only email/password — no Google/Apple sign-in |
| Brute Force Protection | UNKNOWN | Depends on Supabase Auth defaults (typically has some built-in) |

### 3.4 API & Network

| Item | Status | Notes |
|------|--------|-------|
| HTTPS | OK | Supabase and Netlify both enforce HTTPS |
| CORS | DEPENDS | Supabase has default CORS — verify it's restricted to whollydate.com |
| API Rate Limiting | MISSING | No application-level rate limiting |
| Request Size Limits | PARTIAL | 5MB photo limit, 500 char report detail limit, 1000 char message limit |
| robots.txt | OK | Blocks `/api/` path from crawlers |

### 3.5 Client-Side Security

| Item | Status | Notes |
|------|--------|-------|
| Input Validation | WARNING | Client-side only (`utils/validation.ts`). No server-side validation |
| XSS Prevention | OK | React Native auto-escapes by default |
| SQL Injection | OK | Supabase JS client uses parameterized queries |
| Sensitive Data in Client | WARNING | Jargon terms, scoring weights, tier thresholds all in client code |

---

## 4. SPECIFIC FILE-BY-FILE FINDINGS

### `services/safety.ts`
- **Report details capped at 500 chars** — Good
- **No report rate limiting** — A user can file unlimited reports
- **No automated escalation** — Reports stay in `pending` status until manual review
- **Block system is one-directional in DB** but `get_visible_matches()` filters both directions — Good

### `services/chat.ts`
- **No message rate limiting** — Unlimited messages can be sent
- **No content filtering** — Any text content passes through
- **No link detection** — Scam/phishing links can be sent freely
- **Real-time subscriptions** — Good for UX, but also means bots get instant delivery confirmation

### `services/matching.ts`
- **Match calculation server-side** — Good, uses edge function
- **Scoring algorithm in client AND server** — Algorithm details exposed in client code (`analysis/algorithm-simulation.ts`)
- **Demo mode fallback** — If Supabase unavailable, returns demo profiles. Ensure this can't be exploited in production

### `services/photos.ts`
- **5MB size limit** — Good
- **MIME type check** — Good but can be spoofed
- **No content scanning** — NSFW/inappropriate images pass through
- **Public URLs** — Photos are publicly accessible once uploaded

### `services/profiles.ts`
- **No rate limiting on profile reads** — Scraping possible
- **Community familiarity score stored in profile** — Good for matching, but score is self-generated from client-side test

### `utils/validation.ts`
- **Client-side only** — Can be bypassed entirely by posting directly to Supabase
- **Jargon scoring logic exposed** — Bot can reverse-engineer the scoring
- **Age check client-side** — DB constraint provides backup, but other validations do not have DB-level enforcement

### `lib/supabase.ts`
- **Anon key in environment variable** — Standard Supabase pattern, security relies on RLS
- **Auto-refresh sessions** — Good
- **No additional security headers or interceptors**

### `supabase/migrations/002_rls_policies.sql`
- **Comprehensive RLS** — Generally well-structured
- **Demo profiles publicly readable** — By design, but verify no sensitive data leaks
- **Messages restricted to conversation participants** — Good
- **Analytics events: anyone can INSERT** — Potential for analytics spam/pollution

### `landing.html`
- **6,682 lines** — Very large static file. Contains inline Supabase JS for waitlist signup
- **No CAPTCHA on waitlist form** — Bot can spam the waitlist table
- **Google Analytics ID exposed** — `G-QRW7RR3H0Y` (normal, but note it)

---

## 5. PRIORITY RECOMMENDATIONS

### P0 — Critical (Implement Before Launch)

1. **Add CAPTCHA to signup and waitlist**
   - Use Cloudflare Turnstile (free, privacy-respecting) or hCaptcha
   - Apply to: sign-up form, waitlist form, forgot-password form
   - Verify server-side, not just client-side

2. **Enforce email verification before access**
   - Gate onboarding behind confirmed email status
   - Check `email_confirmed_at` in AuthContext before allowing navigation past sign-in

3. **Add rate limiting to Supabase Edge Functions**
   - Account creation: max 3 per IP per hour
   - Message sends: max 30 per conversation per hour
   - Interest expressions: max 50 per day
   - Report filing: max 10 per day per user
   - Profile reads: max 200 per hour

4. **Move jargon terms server-side**
   - Create an edge function that returns a random subset of terms per session
   - Score on server, not client
   - Rotate/add new terms periodically

5. **Add server-side validation**
   - Create an edge function that validates onboarding answers before storing
   - Don't trust client-side validation alone

6. **Verify `.env` is in `.gitignore`**
   - Confirm no secrets are committed to version control

### P1 — High Priority (Implement Within First Month)

7. **Add message content filtering**
   - Block messages containing URLs/links (or require approval)
   - Basic keyword filtering for known scam patterns
   - Flag messages with phone numbers or external contact info (common bot behavior)

8. **Add photo moderation**
   - Integrate NSFW detection API (AWS Rekognition, Google Cloud Vision, or Cloudflare Images)
   - Queue photos for review before they become visible
   - Auto-reject clear violations

9. **Build admin moderation dashboard**
   - View pending reports with context
   - One-click user suspension/ban
   - Report analytics (volume, categories, resolution times)
   - User activity timeline for investigation

10. **Add behavioral bot detection**
    - Track onboarding completion speed (bots complete in seconds, humans take minutes)
    - Flag accounts that complete all 11 steps in under 3 minutes
    - Monitor message patterns (same text sent to multiple users)
    - Detect rapid-fire interest expressions

11. **Implement automated report alerts**
    - Email admin team when reports exceed threshold (e.g., 3+ reports on same user)
    - Auto-suspend accounts with 5+ reports pending review
    - Slack/Discord webhook for real-time moderation alerts

### P2 — Medium Priority (Implement Within First Quarter)

12. **Add device fingerprinting**
    - Track device IDs to detect multi-account creation
    - Flag accounts sharing devices with banned users

13. **Implement IP-based tracking**
    - Log IPs on signup and login
    - Detect and flag VPN/datacenter IPs for additional scrutiny
    - Block known bot network IP ranges

14. **Add OAuth sign-in (Google/Apple)**
    - Raises the bar for bot account creation
    - Apple Sign-In required for iOS App Store anyway
    - Provides verified identity signal

15. **Enhance password requirements**
    - Require 12+ characters or complexity rules
    - Check against known breached passwords (Have I Been Pwned API)

16. **Analytics spam prevention**
    - RLS allows anyone to INSERT analytics events — add validation
    - Rate limit analytics event insertion
    - Validate event names against known event list

17. **Implement account age gates**
    - New accounts can't message for first 24 hours
    - New accounts limited to 5 interest expressions on day 1
    - Pastoral-verified accounts get higher trust/limits

### P3 — Nice to Have

18. **Phone verification as optional 2FA**
19. **AI-powered conversation quality scoring**
20. **Reputation system based on report history and verification status**
21. **Honeypot fields in signup form to catch simple bots**
22. **Browser/app integrity checking (SafetyNet/App Attest)**

---

## 6. SECURITY POSTURE SCORECARD

| Category | Score | Notes |
|----------|-------|-------|
| **Bot Prevention** | 2/10 | No CAPTCHA, no rate limits, no detection |
| **Fake Profile Prevention** | 5/10 | Pastoral verification is strong but optional; jargon test is client-side |
| **Spam Prevention** | 1/10 | No content filtering, no rate limits on messages |
| **Data Access Control** | 7/10 | RLS is comprehensive and well-structured |
| **Authentication Security** | 5/10 | Basic email/password, no MFA, no OAuth |
| **Content Moderation** | 2/10 | Manual reporting only, no automated scanning |
| **Admin Tools** | 1/10 | No moderation dashboard exists |
| **Infrastructure Security** | 6/10 | HTTPS, Stripe webhook verification, but no rate limiting |
| **Client-Side Security** | 4/10 | Sensitive logic exposed, validation client-only |
| **Privacy & Data Protection** | 7/10 | 30-day deletion, RLS, minimal data collection |

**Overall Security Score: 4.0 / 10**

---

## 7. POSITIVE FINDINGS (What's Done Well)

1. **Pastoral Verification** — Genuinely innovative anti-fake-profile mechanism unique to faith-based dating
2. **Covenant System** — Sets behavioral expectations and provides grounds for removal
3. **Spiritual Manipulation Reporting** — Addresses a real abuse pattern in Pentecostal communities
4. **Comprehensive RLS** — Database access control is thorough
5. **Stripe Webhook Verification** — Properly implemented HMAC-SHA256 validation
6. **Geometric Mean Scoring** — Algorithm is mathematically sound and penalizes hidden weaknesses
7. **Deal-Breaker System** — Hard caps on fundamental incompatibilities prevent bad matches
8. **Soft Delete with Grace Period** — Meets app store requirements and prevents data loss
9. **Community Familiarity as Context** — Not using it as a gatekeeping score is the right call
10. **Bidirectional Block Filtering** — `get_visible_matches()` properly filters both directions

---

## 8. CONCLUSION

WHOLLY has a **thoughtful, domain-specific safety architecture** that leverages church community trust networks (pastoral verification) in a way no other dating app does. However, the technical bot/spam defenses are **severely underdeveloped**. The platform would be trivially exploitable by even basic automated scripts.

**The most urgent actions are:**
1. Add CAPTCHA to signup
2. Enforce email verification before platform access
3. Add rate limiting across all endpoints
4. Move jargon scoring server-side
5. Build a basic admin moderation dashboard

Without these, launching publicly would expose users to spam, fake profiles, and potential scam/abuse at scale.

---

*This audit was generated by automated codebase analysis. A manual penetration test is recommended before public launch.*
