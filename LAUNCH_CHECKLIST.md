# WHOLLY Launch Checklist

Everything needed to go from code-complete to live. Work through in order.

---

## Phase 1: Supabase Setup (30 min)

### 1.1 Run Database Migrations
Go to **Supabase Dashboard → SQL Editor → New query** and run each file in order:

```
supabase/migrations/001_initial_schema.sql
supabase/migrations/002_rls_policies.sql
supabase/migrations/002_pastoral_verification.sql
supabase/migrations/003_seed_demo_profiles.sql
supabase/migrations/004_photo_storage.sql
supabase/migrations/005_subscriptions_and_safety.sql
supabase/migrations/006_analytics.sql
```

### 1.2 Create Storage Bucket
- Go to **Storage → New bucket**
- Name: `profile-photos`
- Public: **Yes**
- File size limit: 5MB
- Allowed MIME types: `image/jpeg, image/png, image/webp`

### 1.3 Add Storage RLS Policies
Go to **Storage → profile-photos → Policies** and add:

```sql
-- Anyone can view photos
CREATE POLICY "Public photo access" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-photos');

-- Authenticated users can upload own photos
CREATE POLICY "Users can upload own photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'profile-photos'
    AND auth.role() = 'authenticated'
  );

-- Users can delete own photos
CREATE POLICY "Users can delete own photos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'profile-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

### 1.4 Deploy Edge Functions
Install Supabase CLI if not already: `npm install -g supabase`

```bash
supabase login
supabase link --project-ref <your-project-ref>
supabase functions deploy calculate-matches
supabase functions deploy create-checkout
supabase functions deploy create-portal
supabase functions deploy stripe-webhook
supabase functions deploy send-email
```

### 1.5 Enable Realtime
Go to **Database → Replication** and enable realtime for:
- `messages`
- `matches`

---

## Phase 2: Stripe Setup (45 min)

### 2.1 Create Stripe Account
- Go to https://stripe.com and create account
- Complete identity verification
- Get API keys from **Developers → API keys**

### 2.2 Create Products and Prices
In **Stripe Dashboard → Products**, create:

| Product | Price ID | Amount | Interval |
|---------|----------|--------|----------|
| WHOLLY Connect Monthly | `price_standard_monthly` | $19.99 | month |
| WHOLLY Connect Annual | `price_standard_annual` | $179.88 | year |
| WHOLLY Intentional Monthly | `price_premium_monthly` | $29.99 | month |
| WHOLLY Intentional Annual | `price_premium_annual` | $275.88 | year |

**Important:** Copy the actual Stripe price IDs (e.g., `price_1Abc123...`) and update them in `services/payments.ts` → `STRIPE_PRICES`.

### 2.3 Configure Webhook
In **Stripe Dashboard → Developers → Webhooks**:
- Endpoint URL: `https://<your-project>.supabase.co/functions/v1/stripe-webhook`
- Events to listen for:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_failed`
- Copy the webhook signing secret (`whsec_...`)

### 2.4 Set Stripe Secrets in Supabase
```bash
supabase secrets set STRIPE_SECRET_KEY=sk_live_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
```

### 2.5 Configure Customer Portal
In **Stripe Dashboard → Settings → Billing → Customer portal**:
- Enable subscription cancellation
- Enable plan switching
- Set business name to "WHOLLY"

---

## Phase 3: Email Setup (15 min)

### 3.1 Create Resend Account
- Go to https://resend.com and create account
- Add domain: `whollydate.com`
- Verify domain (add DNS records)

### 3.2 Set Email Secret
```bash
supabase secrets set RESEND_API_KEY=re_...
```

### 3.3 Test Email
```bash
curl -X POST https://<your-project>.supabase.co/functions/v1/send-email \
  -H "Authorization: Bearer <anon-key>" \
  -H "Content-Type: application/json" \
  -d '{"type":"welcome","to":"your@email.com","recipientName":"Test","data":{}}'
```

---

## Phase 4: Netlify Deploy (10 min)

### 4.1 Set Environment Variables
Go to **Netlify Dashboard → whollydate → Site configuration → Environment variables**:

| Variable | Value |
|----------|-------|
| `EXPO_PUBLIC_SUPABASE_URL` | `https://<project>.supabase.co` |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Your anon key from Supabase |
| `EXPO_PUBLIC_GA4_ID` | `G-QRW7RR3H0Y` |

### 4.2 Trigger Build
Push to `main` branch or click **Trigger deploy** in Netlify.

### 4.3 Verify
- Visit https://whollydate.com — landing page loads
- Click "Get Started" — app loads
- Sign up with test email — auth works
- Complete onboarding — matches appear
- Express interest — chat unlocks on mutual match

---

## Phase 5: App Store Builds (when ready)

### 5.1 Install EAS CLI
```bash
npm install -g eas-cli
eas login
```

### 5.2 Configure Credentials
Update `eas.json` → `submit.production`:
- iOS: Add Apple ID, ASC App ID, Team ID
- Android: Add service account key path

### 5.3 Build
```bash
# iOS
eas build --platform ios --profile production

# Android
eas build --platform android --profile production
```

### 5.4 Submit
```bash
eas submit --platform ios
eas submit --platform android
```

### 5.5 App Store Requirements
Before submission, ensure:
- [ ] App icon (1024x1024) in assets
- [ ] Screenshots (6.7", 6.5", 5.5" for iOS; phone + tablet for Android)
- [ ] App description and keywords
- [ ] Privacy policy URL: https://whollydate.com/legal/privacy
- [ ] Terms of service URL: https://whollydate.com/legal/terms
- [ ] Age rating: 17+ (dating app)
- [ ] Content rating questionnaire completed
- [ ] In-app purchases configured (RevenueCat)

---

## Phase 6: Pre-Launch Testing

### 6.1 Critical Path Test
- [ ] Sign up with email
- [ ] Complete all 11 onboarding steps
- [ ] View matches with scores
- [ ] Express interest
- [ ] Mutual match creates conversation
- [ ] Send and receive messages (realtime)
- [ ] Upload profile photo
- [ ] Edit profile
- [ ] Subscribe (Stripe checkout)
- [ ] View subscription in settings
- [ ] Cancel subscription
- [ ] Report a user
- [ ] Block a user (verify they disappear from matches)
- [ ] Request account deletion
- [ ] Cancel account deletion
- [ ] Sign out and sign back in

### 6.2 Email Test
- [ ] Welcome email on sign-up
- [ ] Mutual match notification
- [ ] New message notification
- [ ] Weekly digest

### 6.3 Edge Cases
- [ ] Sign up with invalid email → shows error
- [ ] Skip onboarding step → blocked
- [ ] 0% compatibility profile → shows "Below" tier
- [ ] Block user then check matches → user gone
- [ ] Slow network → loading states show
- [ ] Refresh app → state persists

---

## DNS / Domain

| Record | Type | Value |
|--------|------|-------|
| whollydate.com | A | Netlify load balancer |
| www.whollydate.com | CNAME | whollydate.netlify.app |

---

## Credentials Summary (fill in at launch)

| Service | Key | Location |
|---------|-----|----------|
| Supabase URL | `https://xxx.supabase.co` | .env + Netlify |
| Supabase Anon Key | `eyJ...` | .env + Netlify |
| Supabase Service Role Key | `eyJ...` | Supabase secrets (edge functions) |
| Stripe Secret Key | `sk_live_...` | Supabase secrets |
| Stripe Webhook Secret | `whsec_...` | Supabase secrets |
| Resend API Key | `re_...` | Supabase secrets |
| Google Analytics | `G-QRW7RR3H0Y` | .env + Netlify |
| Apple Developer | Team ID, ASC App ID | eas.json |
| Google Play | Service account JSON | eas.json |
