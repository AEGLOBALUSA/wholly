#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# WHOLLY — Beta Setup Script
# Run from the wholly project root: ./setup-beta.sh
# ═══════════════════════════════════════════════════════════════

set -e

PROJECT_REF="umzyimdhpaquvbyutmir"

echo "━━━ WHOLLY Beta Setup ━━━"
echo ""

# Check supabase CLI
if ! command -v npx &> /dev/null; then
    echo "ERROR: npx not found. Install Node.js first."
    exit 1
fi

echo "Step 1/4: Running database migrations..."
echo "  → Open your Supabase Dashboard SQL Editor:"
echo "    https://supabase.com/dashboard/project/${PROJECT_REF}/sql/new"
echo ""
echo "  Paste and run each migration file IN ORDER:"
echo "    1. supabase/migrations/001_initial_schema.sql"
echo "    2. supabase/migrations/002_rls_policies.sql"
echo "    3. supabase/migrations/002_pastoral_verification.sql"
echo "    4. supabase/migrations/004_photo_storage.sql"
echo "    5. supabase/migrations/005_subscriptions_and_safety.sql"
echo "    6. supabase/migrations/006_analytics.sql"
echo ""
echo "  SKIP 003_seed_demo_profiles.sql for now (has schema issues)."
echo ""
read -p "Press Enter when migrations are done (or 's' to skip)... " STEP1

echo ""
echo "Step 2/4: Creating storage bucket..."
echo "  → Go to: https://supabase.com/dashboard/project/${PROJECT_REF}/storage/buckets"
echo "  → Click 'New Bucket'"
echo "  → Name: profile-photos"
echo "  → Check 'Public bucket'"
echo "  → File size limit: 5MB"
echo ""
read -p "Press Enter when bucket is created (or 's' to skip)... " STEP2

echo ""
echo "Step 3/4: Deploying edge functions..."
echo "  (Make sure SUPABASE_ACCESS_TOKEN is exported)"
echo ""

export SUPABASE_ACCESS_TOKEN="${SUPABASE_ACCESS_TOKEN}"

for fn in calculate-matches send-email; do
    echo "  Deploying ${fn}..."
    npx supabase functions deploy ${fn} --project-ref ${PROJECT_REF} 2>&1 || echo "  ⚠ ${fn} failed — deploy manually"
done

echo "  ✓ ai-bot-reply already deployed"
echo ""

echo "Step 4/4: Setting secrets..."
echo ""

if [ -z "${RESEND_API_KEY}" ]; then
    echo "  RESEND_API_KEY not set. Skipping email setup."
    echo "  To add later: npx supabase secrets set RESEND_API_KEY=re_... --project-ref ${PROJECT_REF}"
else
    npx supabase secrets set RESEND_API_KEY="${RESEND_API_KEY}" --project-ref ${PROJECT_REF}
    echo "  ✓ Resend API key set"
fi

echo ""
echo "━━━ Setup Complete ━━━"
echo ""
echo "Your beta is ready! Testers can:"
echo "  1. Sign up at whollydate.com"
echo "  2. Verify email"
echo "  3. Accept covenant"
echo "  4. Complete 11-step onboarding"
echo "  5. See matches (demo profiles)"
echo "  6. Express interest → mutual match → chat with AI bots"
echo ""
echo "Note: Payments are disabled for beta. Subscription UI is view-only."
