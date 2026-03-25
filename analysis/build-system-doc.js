const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat,
  HeadingLevel, BorderStyle, WidthType, ShadingType,
  PageNumber, PageBreak, TableOfContents
} = require("docx");

const PAGE_WIDTH = 12240;
const MARGIN = 1440;
const CW = PAGE_WIDTH - 2 * MARGIN;
const CORAL = "D4726A";
const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const cm = { top: 60, bottom: 60, left: 100, right: 100 };

function hc(text, w) {
  return new TableCell({ borders, width: { size: w, type: WidthType.DXA }, shading: { fill: CORAL, type: ShadingType.CLEAR }, margins: cm, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text, bold: true, font: "Arial", size: 18, color: "FFFFFF" })] })] });
}
function c(text, w, opts = {}) {
  return new TableCell({ borders, width: { size: w, type: WidthType.DXA }, margins: cm, children: [new Paragraph({ alignment: opts.align || AlignmentType.LEFT, children: [new TextRun({ text, font: "Arial", size: 18, bold: opts.bold || false, color: opts.color || "333333" })] })] });
}
function h1(text) { return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(text)] }); }
function h2(text) { return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(text)] }); }
function h3(text) { return new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun(text)] }); }
function p(text, opts = {}) { return new Paragraph({ spacing: { after: opts.after || 120 }, children: [new TextRun({ text, font: "Arial", size: 22, ...opts })] }); }
function bp(text, ref = "bullets") { return new Paragraph({ numbering: { reference: ref, level: 0 }, children: [new TextRun({ text, font: "Arial", size: 22 })] }); }
function bpBold(label, text) { return new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: label, font: "Arial", size: 22, bold: true }), new TextRun({ text, font: "Arial", size: 22 })] }); }
function np(label, text) { return new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: label, font: "Arial", size: 22, bold: true }), new TextRun({ text, font: "Arial", size: 22 })] }); }
function code(text) { return new Paragraph({ spacing: { before: 60, after: 60 }, indent: { left: 360 }, children: [new TextRun({ text, font: "Courier New", size: 18, color: "555555" })] }); }
function pb() { return new Paragraph({ children: [new PageBreak()] }); }

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 36, bold: true, font: "Arial", color: CORAL }, paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 28, bold: true, font: "Arial", color: "333333" }, paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 24, bold: true, font: "Arial", color: "555555" }, paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 } },
    ],
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "checks", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2610", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ],
  },
  sections: [
    // TITLE PAGE
    {
      properties: { page: { size: { width: PAGE_WIDTH, height: 15840 }, margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN } } },
      children: [
        new Paragraph({ spacing: { before: 3000 } }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: "WHOLLY", font: "Arial", size: 72, bold: true, color: CORAL })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [new TextRun({ text: "System Documentation & Launch Checklist", font: "Arial", size: 32, color: "666666" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: "Complete technical reference for rebuild, maintenance, and deployment", font: "Arial", size: 22, color: "888888" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 1200 }, children: [new TextRun({ text: "March 2026 | Version 1.0", font: "Arial", size: 20, color: "999999" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, border: { top: { style: BorderStyle.SINGLE, size: 2, color: CORAL, space: 8 } }, children: [new TextRun({ text: "whollydate.com | github.com/AEGLOBALUSA/wholly", font: "Arial", size: 18, color: "777777", italics: true })] }),
      ],
    },
    // MAIN CONTENT
    {
      properties: { page: { size: { width: PAGE_WIDTH, height: 15840 }, margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN } } },
      headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "WHOLLY System Documentation", font: "Arial", size: 16, color: "999999", italics: true })] })] }) },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Page ", font: "Arial", size: 16, color: "999999" }), new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 16, color: "999999" })] })] }) },
      children: [
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Table of Contents")] }),
        new TableOfContents("Table of Contents", { hyperlink: true, headingStyleRange: "1-3" }),
        pb(),

        // ═══ PART 1: SYSTEM DOCUMENTATION ═══
        h1("Part 1: System Documentation"),
        p("If you need to rebuild this app from scratch, paste this document to an AI assistant and it will have everything needed to recreate the entire system.", { italics: true, color: "666666" }),

        h2("1. What WHOLLY Is"),
        p("WHOLLY is a faith-based dating app for Spirit-filled Christians (Pentecostal/Charismatic). It matches users across 4 compatibility dimensions using a 53-question onboarding assessment, weighted geometric mean algorithm, and tiered matching system."),
        bpBold("Target audience: ", "Singles at churches like Futures Church (Adelaide) and Planetshakers (Melbourne)."),
        bpBold("Core differentiator: ", "Covenant agreement (no manipulation, no fake profiles, Spirit-led behavior) + jargon authenticity check."),
        bpBold("Business model: ", "Free tier (limited matches), Connect ($19.99/mo), Intentional ($29.99/mo). Annual pricing with 23-25% savings."),

        h2("2. Tech Stack"),
        new Table({ width: { size: CW, type: WidthType.DXA }, columnWidths: [2340, 4680, 2340],
          rows: [
            new TableRow({ children: [hc("Layer", 2340), hc("Technology", 4680), hc("Version", 2340)] }),
            new TableRow({ children: [c("Framework", 2340), c("Expo (React Native)", 4680), c("55", 2340)] }),
            new TableRow({ children: [c("Runtime", 2340), c("React + TypeScript", 4680), c("19.2 / 5.9", 2340)] }),
            new TableRow({ children: [c("Router", 2340), c("Expo Router (file-based)", 4680), c("55", 2340)] }),
            new TableRow({ children: [c("Backend", 2340), c("Supabase (Postgres + Auth + Storage + Edge Functions)", 4680), c("2.98.0", 2340)] }),
            new TableRow({ children: [c("Hosting", 2340), c("Netlify (web)", 4680), c("-", 2340)] }),
            new TableRow({ children: [c("Payments", 2340), c("Stripe (web) + RevenueCat (mobile)", 4680), c("-", 2340)] }),
            new TableRow({ children: [c("Email", 2340), c("Resend", 4680), c("-", 2340)] }),
            new TableRow({ children: [c("Analytics", 2340), c("Google Analytics 4", 4680), c("G-QRW7RR3H0Y", 2340)] }),
            new TableRow({ children: [c("Fonts", 2340), c("DM Sans (body) + Playfair Display (landing headings)", 4680), c("-", 2340)] }),
            new TableRow({ children: [c("Build", 2340), c("EAS Build (iOS/Android)", 4680), c("-", 2340)] }),
          ],
        }),

        pb(),
        h2("3. Matching Algorithm"),
        h3("3.1 Dimensions and Weights"),
        new Table({ width: { size: CW, type: WidthType.DXA }, columnWidths: [1800, 1200, 2160, 4200],
          rows: [
            new TableRow({ children: [hc("Dimension", 1800), hc("Weight", 1200), hc("Questions", 2160), hc("Measures", 4200)] }),
            new TableRow({ children: [c("Spiritual", 1800, { bold: true }), c("1.5x", 1200), c("6 + 10 pairs", 2160), c("Core Pentecostal beliefs + spiritual practices", 4200)] }),
            new TableRow({ children: [c("Emotional", 1800, { bold: true }), c("1.2x", 1200), c("10 + 6", 2160), c("Attachment (ECR-S adapted) + Gottman communication", 4200)] }),
            new TableRow({ children: [c("Life Vision", 1800, { bold: true }), c("1.0x", 1200), c("11", 2160), c("Marriage, kids, money, roles, family, boundaries, career", 4200)] }),
            new TableRow({ children: [c("Intellectual", 1800, { bold: true }), c("0.8x", 1200), c("6", 2160), c("Curiosity, conversation depth, learning style", 4200)] }),
          ],
        }),
        p("Total scored items: 53 (plus 2 honesty pairs, 2 short answers, 30 jargon terms)", { bold: true }),

        h3("3.2 Scoring: Weighted Geometric Mean"),
        code("product = (S/100)^1.5 x (E/100)^1.2 x (I/100)^0.8 x (L/100)^1.0"),
        code("overall = product^(1/4.5) x 100"),
        p("Penalizes weak dimensions: 95% spiritual + 40% emotional = 62% overall (arithmetic would give 68%)."),

        h3("3.3 Floor Capping"),
        bp("Spiritual, Emotional, Life Vision: capped at 1.35x lowest dimension"),
        bp("Intellectual: capped at 1.5x (softer - less critical mismatch)"),
        p("Example: emotional = 40% caps overall at 54% regardless of other scores."),

        h3("3.4 Match Tiers"),
        new Table({ width: { size: CW, type: WidthType.DXA }, columnWidths: [3120, 3120, 3120],
          rows: [
            new TableRow({ children: [hc("Tier", 3120), hc("Threshold", 3120), hc("Distribution", 3120)] }),
            new TableRow({ children: [c("Exceptional", 3120, { color: "4CAF7D", bold: true }), c("82+", 3120), c("5-8%", 3120)] }),
            new TableRow({ children: [c("Strong", 3120, { color: "D4A853", bold: true }), c("72-81", 3120), c("20-25%", 3120)] }),
            new TableRow({ children: [c("Compatible", 3120, { color: "9CA3AF", bold: true }), c("58-71", 3120), c("35-40%", 3120)] }),
            new TableRow({ children: [c("Below", 3120, { color: "E25050", bold: true }), c("<58", 3120), c("25-35%", 3120)] }),
          ],
        }),

        h3("3.5 Deal-Breaker System"),
        p("Hard deal-breakers (cap dimension at 50%):", { bold: true }),
        bp("Spirit baptism disagreement (theo1)"),
        bp("Tongues belief disagreement (theo2)"),
        bp("Children: want + don't want (lv2)"),
        bp("Marriage leadership: traditional headship + egalitarian (lv7)"),
        p("Soft deal-breakers (point penalties):", { bold: true }),
        bp("Marriage timeline mismatch: -10 points (lv1)"),
        bp("Family-of-origin involvement mismatch: -10 points (lv9)"),

        h3("3.6 Marriage Leadership Compatibility"),
        p("Servant headship model: man is spiritual head (not domination), day-to-day couples lead in their strengths."),
        new Table({ width: { size: CW, type: WidthType.DXA }, columnWidths: [1872, 1872, 1872, 1872, 1872],
          rows: [
            new TableRow({ children: [hc("A \\ B", 1872), hc("Servant", 1872), hc("Traditional", 1872), hc("Egalitarian", 1872), hc("Unsure", 1872)] }),
            new TableRow({ children: [c("Servant", 1872, { bold: true }), c("Perfect", 1872, { color: "4CAF7D" }), c("-10", 1872, { color: "D4A853" }), c("-15", 1872, { color: "E25050" }), c("OK", 1872)] }),
            new TableRow({ children: [c("Traditional", 1872, { bold: true }), c("-10", 1872, { color: "D4A853" }), c("Perfect", 1872, { color: "4CAF7D" }), c("BREAK", 1872, { color: "E25050", bold: true }), c("OK", 1872)] }),
            new TableRow({ children: [c("Egalitarian", 1872, { bold: true }), c("-15", 1872, { color: "E25050" }), c("BREAK", 1872, { color: "E25050", bold: true }), c("Perfect", 1872, { color: "4CAF7D" }), c("OK", 1872)] }),
            new TableRow({ children: [c("Unsure", 1872, { bold: true }), c("OK", 1872), c("OK", 1872), c("OK", 1872), c("OK", 1872)] }),
          ],
        }),

        pb(),
        h2("4. Database Schema"),
        h3("Core Tables"),
        bp("profiles: id, auth_id, email, first_name, age, city, denomination, gender, bio, photo_url, community_familiarity_score, subscription_tier, is_blocked, deleted_at"),
        bp("onboarding_answers: profile_id, section, answers (JSONB) - UNIQUE(profile_id, section)"),
        bp("compatibility_scores: user_id, match_id, spiritual, emotional, intellectual, life_vision, overall, tier"),
        bp("matches: user_a, user_b, status (pending/matched/declined)"),
        bp("conversations: match_id, last_message_at"),
        bp("messages: conversation_id, sender_id, content, read_at"),
        bp("subscriptions: user_id, stripe_customer_id, stripe_subscription_id, tier, period, status, current_period_end"),
        bp("reports: reporter_id, reported_id, reason, details, status, admin_notes"),
        bp("blocks: blocker_id, blocked_id - UNIQUE, bidirectional filtering"),
        bp("deletion_requests: user_id, reason, scheduled_deletion_at (NOW + 30 days), status"),
        bp("churches: name, slug, city (seeded: Futures Church, Planetshakers)"),

        h3("RLS Policies"),
        bp("Users can only read/write own profile and answers"),
        bp("Demo profiles publicly readable"),
        bp("Matched profiles readable if compatibility scores exist"),
        bp("Messages only accessible to conversation participants"),
        bp("Blocks filter both directions"),

        h2("5. Edge Functions"),
        new Table({ width: { size: CW, type: WidthType.DXA }, columnWidths: [2340, 4680, 2340],
          rows: [
            new TableRow({ children: [hc("Function", 2340), hc("Purpose", 4680), hc("Trigger", 2340)] }),
            new TableRow({ children: [c("calculate-matches", 2340), c("Compare user answers against opposite-gender profiles, store scores", 4680), c("After onboarding", 2340)] }),
            new TableRow({ children: [c("create-checkout", 2340), c("Create Stripe Checkout session for subscription", 4680), c("Subscribe click", 2340)] }),
            new TableRow({ children: [c("create-portal", 2340), c("Create Stripe Customer Portal session", 4680), c("Manage click", 2340)] }),
            new TableRow({ children: [c("stripe-webhook", 2340), c("Handle Stripe events (subscribe, cancel, fail)", 4680), c("Stripe POST", 2340)] }),
            new TableRow({ children: [c("send-email", 2340), c("Send transactional emails via Resend (6 templates)", 4680), c("Functions/triggers", 2340)] }),
          ],
        }),

        pb(),
        h2("6. Design System"),
        h3("Colors"),
        bp("Background: #FFFAF7 (warm off-white)"),
        bp("Primary: #D4726A (coral/rose accent)"),
        bp("Text: #1A1A1A / Secondary: #5C5C5C / Muted: #9CA3AF"),
        bp("Gold: #D4A853 (strong tier) / Green: #4CAF7D (exceptional) / Error: #E25050"),
        h3("Fonts"),
        bp("Headings: DM Sans Bold/SemiBold"),
        bp("Body: DM Sans Regular/Medium"),
        bp("Landing page: Playfair Display (serif headings)"),

        h2("7. Subscription Tiers"),
        new Table({ width: { size: CW, type: WidthType.DXA }, columnWidths: [3120, 2080, 2080, 2080],
          rows: [
            new TableRow({ children: [hc("Feature", 3120), hc("Free", 2080), hc("Connect $19.99", 2080), hc("Intentional $29.99", 2080)] }),
            new TableRow({ children: [c("View profiles", 3120), c("Limited", 2080), c("Full", 2080), c("Full", 2080)] }),
            new TableRow({ children: [c("Express interest", 3120), c("No", 2080), c("Yes", 2080), c("Yes", 2080)] }),
            new TableRow({ children: [c("Chat (mutual)", 3120), c("No", 2080), c("Yes", 2080), c("Yes", 2080)] }),
            new TableRow({ children: [c("Photos", 3120), c("None", 2080), c("Thumbnail", 2080), c("Full", 2080)] }),
            new TableRow({ children: [c("Blue Tick", 3120), c("Yes (free)", 2080), c("Yes", 2080), c("Yes", 2080)] }),
            new TableRow({ children: [c("Gold Tick + Pastor Note", 3120), c("No", 2080), c("No", 2080), c("Yes", 2080)] }),
            new TableRow({ children: [c("Threshold selector", 3120), c("No", 2080), c("No", 2080), c("Yes", 2080)] }),
            new TableRow({ children: [c("Weekly digest + filters", 3120), c("No", 2080), c("No", 2080), c("Yes", 2080)] }),
          ],
        }),

        h2("8. Safety Features"),
        p("Report reasons:", { bold: true }),
        np("Inappropriate content ", ""),
        np("Harassment ", ""),
        np("Fake profile ", ""),
        np("Spiritual manipulation ", "(unique to WHOLLY - using prophecy/dreams/authority to pressure)"),
        np("Underage user ", ""),
        np("Spam ", ""),
        np("Other ", ""),
        p("Block system: immediate, bidirectional, filtered from all matches/chat.", { bold: true }),
        p("Account deletion: 30-day grace period, cancelable, then permanent removal.", { bold: true }),

        h2("9. Covenant Statements"),
        np("", "I am here to build a meaningful, long-term relationship that honours God and ideally leads to marriage and lasting happiness."),
        np("", "I commit to honesty, authenticity, and respect in every interaction on this platform."),
        np("", "I am willing to be accountable for my behavior in this community and will not harass, mislead, or pressure another user."),
        np("", "I will not use prophetic language, dreams, or spiritual authority to manipulate or pressure someone."),
        np("", "I commit to seeking God's will and Spirit-led behavior in my relationships."),
        np("", "I understand that WHOLLY reserves the right to remove anyone who violates this covenant."),

        pb(),
        h2("10. Key Architectural Decisions"),
        np("Geometric mean over arithmetic mean: ", "Penalizes hidden weaknesses. Validated by 26-scenario simulation (92% pass rate)."),
        np("Servant headship as default: ", "Aligned with Futures/Planetshakers theology. Man is spiritual head (not domination), daily leadership by strengths."),
        np("Community familiarity as context: ", "Shown on match cards but doesn't affect compatibility. Being new doesn't mean incompatible."),
        np("Honesty check hidden: ", "Social desirability bias flagged internally, never shown to matches."),
        np("30-day deletion grace: ", "Meets app store requirements, prevents impulse deletions."),
        np("Spiritual manipulation report: ", "Unique to WHOLLY. Addresses real Pentecostal dating problem."),
        np("Floor cap 1.35x (1.5x intellectual): ", "Prevents catastrophically low dimensions from being hidden."),
        np("Demo mode fallback: ", "App works fully with 100 demo profiles when Supabase not configured."),

        pb(),

        // ═══ PART 2: LAUNCH CHECKLIST ═══
        h1("Part 2: Launch Checklist"),
        p("Everything needed to go from code-complete to live. Work through in order."),

        h2("Phase 1: Supabase Setup (30 min)"),
        h3("1.1 Run Database Migrations"),
        p("Go to Supabase Dashboard > SQL Editor > New query and run each in order:"),
        code("001_initial_schema.sql"),
        code("002_rls_policies.sql"),
        code("002_pastoral_verification.sql"),
        code("003_seed_demo_profiles.sql"),
        code("004_photo_storage.sql"),
        code("005_subscriptions_and_safety.sql"),
        code("006_analytics.sql"),

        h3("1.2 Create Storage Bucket"),
        bp("Storage > New bucket > Name: profile-photos"),
        bp("Public: Yes, File size limit: 5MB"),
        bp("MIME types: image/jpeg, image/png, image/webp"),

        h3("1.3 Deploy Edge Functions"),
        code("supabase login"),
        code("supabase link --project-ref <your-project-ref>"),
        code("supabase functions deploy calculate-matches"),
        code("supabase functions deploy create-checkout"),
        code("supabase functions deploy create-portal"),
        code("supabase functions deploy stripe-webhook"),
        code("supabase functions deploy send-email"),

        h3("1.4 Enable Realtime"),
        bp("Database > Replication > Enable for: messages, matches"),

        h2("Phase 2: Stripe Setup (45 min)"),
        np("Create Stripe account ", "at stripe.com, complete verification"),
        np("Create 4 products: ", "Connect Monthly ($19.99), Connect Annual ($179.88/yr), Intentional Monthly ($29.99), Intentional Annual ($275.88/yr)"),
        np("Configure webhook: ", "URL: https://<project>.supabase.co/functions/v1/stripe-webhook"),
        np("Events: ", "checkout.session.completed, customer.subscription.updated, customer.subscription.deleted, invoice.payment_failed"),
        np("Set secrets: ", "supabase secrets set STRIPE_SECRET_KEY=sk_live_... STRIPE_WEBHOOK_SECRET=whsec_..."),

        h2("Phase 3: Email Setup (15 min)"),
        np("Create Resend account ", "at resend.com"),
        np("Add domain: ", "whollydate.com, verify DNS"),
        np("Set secret: ", "supabase secrets set RESEND_API_KEY=re_..."),

        h2("Phase 4: Netlify Deploy (10 min)"),
        p("Set environment variables in Netlify Dashboard:", { bold: true }),
        bp("EXPO_PUBLIC_SUPABASE_URL = https://<project>.supabase.co"),
        bp("EXPO_PUBLIC_SUPABASE_ANON_KEY = your anon key"),
        bp("EXPO_PUBLIC_GA4_ID = G-QRW7RR3H0Y"),
        p("Push to main branch or click Trigger deploy."),

        h2("Phase 5: App Store Builds"),
        code("npm install -g eas-cli && eas login"),
        code("eas build --platform ios --profile production"),
        code("eas build --platform android --profile production"),
        code("eas submit --platform ios"),
        code("eas submit --platform android"),

        h2("Phase 6: Pre-Launch Testing"),
        h3("Critical Path"),
        new Paragraph({ numbering: { reference: "checks", level: 0 }, children: [new TextRun({ text: "Sign up with email", font: "Arial", size: 22 })] }),
        new Paragraph({ numbering: { reference: "checks", level: 0 }, children: [new TextRun({ text: "Complete all 11 onboarding steps", font: "Arial", size: 22 })] }),
        new Paragraph({ numbering: { reference: "checks", level: 0 }, children: [new TextRun({ text: "View matches with scores", font: "Arial", size: 22 })] }),
        new Paragraph({ numbering: { reference: "checks", level: 0 }, children: [new TextRun({ text: "Express interest + mutual match creates conversation", font: "Arial", size: 22 })] }),
        new Paragraph({ numbering: { reference: "checks", level: 0 }, children: [new TextRun({ text: "Send and receive messages (realtime)", font: "Arial", size: 22 })] }),
        new Paragraph({ numbering: { reference: "checks", level: 0 }, children: [new TextRun({ text: "Upload profile photo", font: "Arial", size: 22 })] }),
        new Paragraph({ numbering: { reference: "checks", level: 0 }, children: [new TextRun({ text: "Subscribe via Stripe checkout", font: "Arial", size: 22 })] }),
        new Paragraph({ numbering: { reference: "checks", level: 0 }, children: [new TextRun({ text: "Cancel subscription", font: "Arial", size: 22 })] }),
        new Paragraph({ numbering: { reference: "checks", level: 0 }, children: [new TextRun({ text: "Report + block a user (verify removal from matches)", font: "Arial", size: 22 })] }),
        new Paragraph({ numbering: { reference: "checks", level: 0 }, children: [new TextRun({ text: "Request account deletion + cancel", font: "Arial", size: 22 })] }),
        new Paragraph({ numbering: { reference: "checks", level: 0 }, children: [new TextRun({ text: "Sign out and sign back in", font: "Arial", size: 22 })] }),

        h3("Email Tests"),
        new Paragraph({ numbering: { reference: "checks", level: 0 }, children: [new TextRun({ text: "Welcome email on sign-up", font: "Arial", size: 22 })] }),
        new Paragraph({ numbering: { reference: "checks", level: 0 }, children: [new TextRun({ text: "Mutual match notification", font: "Arial", size: 22 })] }),
        new Paragraph({ numbering: { reference: "checks", level: 0 }, children: [new TextRun({ text: "New message notification", font: "Arial", size: 22 })] }),
        new Paragraph({ numbering: { reference: "checks", level: 0 }, children: [new TextRun({ text: "Weekly digest", font: "Arial", size: 22 })] }),

        pb(),
        h2("Credentials Summary"),
        p("Fill in at launch time:", { bold: true }),
        new Table({ width: { size: CW, type: WidthType.DXA }, columnWidths: [3120, 3120, 3120],
          rows: [
            new TableRow({ children: [hc("Service", 3120), hc("Key", 3120), hc("Location", 3120)] }),
            new TableRow({ children: [c("Supabase URL", 3120), c("https://xxx.supabase.co", 3120), c(".env + Netlify", 3120)] }),
            new TableRow({ children: [c("Supabase Anon Key", 3120), c("eyJ...", 3120), c(".env + Netlify", 3120)] }),
            new TableRow({ children: [c("Supabase Service Role", 3120), c("eyJ...", 3120), c("Edge function secrets", 3120)] }),
            new TableRow({ children: [c("Stripe Secret Key", 3120), c("sk_live_...", 3120), c("Supabase secrets", 3120)] }),
            new TableRow({ children: [c("Stripe Webhook Secret", 3120), c("whsec_...", 3120), c("Supabase secrets", 3120)] }),
            new TableRow({ children: [c("Resend API Key", 3120), c("re_...", 3120), c("Supabase secrets", 3120)] }),
            new TableRow({ children: [c("Google Analytics", 3120), c("G-QRW7RR3H0Y", 3120), c(".env + Netlify", 3120)] }),
            new TableRow({ children: [c("Apple Developer", 3120), c("Team ID, ASC App ID", 3120), c("eas.json", 3120)] }),
            new TableRow({ children: [c("Google Play", 3120), c("Service account JSON", 3120), c("eas.json", 3120)] }),
          ],
        }),

        new Paragraph({ spacing: { before: 600 }, border: { top: { style: BorderStyle.SINGLE, size: 2, color: CORAL, space: 8 } }, children: [
          new TextRun({ text: "Document version 1.0 | March 2026 | github.com/AEGLOBALUSA/wholly | whollydate.com", font: "Arial", size: 18, color: "888888", italics: true }),
        ] }),
      ],
    },
  ],
});

Packer.toBuffer(doc).then(buffer => {
  const path = "/Users/ashleymarkevans/wholly/WHOLLY_System_Documentation.docx";
  fs.writeFileSync(path, buffer);
  console.log(`Created: ${path}`);
  console.log(`Size: ${(buffer.length / 1024).toFixed(1)} KB`);
});
