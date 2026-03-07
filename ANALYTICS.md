# WHOLLY Analytics System

Comprehensive user analytics and event tracking system for the WHOLLY dating app, built with Supabase backend storage and optional Google Analytics 4 (GA4) web integration.

## Overview

The analytics system tracks user behavior across the WHOLLY app with the following features:

- **Event Tracking**: Automated and manual event capture
- **Session Management**: Unique session IDs for grouping related events
- **Batch Processing**: Events queued locally and flushed every 30 seconds or on 10 events
- **Multi-Platform Support**: Works on web, iOS, and Android
- **GA4 Integration**: Web platform sends events to Google Analytics 4
- **Fallback Handling**: Gracefully degrades if Supabase isn't configured
- **User Context**: Automatically attaches user_id when authenticated

## Architecture

### Core Files

1. **`services/analytics.ts`** — Core analytics service
   - `AnalyticsService` class: Manages event queue, batching, and flushing
   - `analytics` object: Convenience methods for common events
   - Handles both Supabase insertion and GA4 transmission

2. **`context/AnalyticsContext.tsx`** — React context provider
   - Auto-initializes analytics service on app load
   - Auto-tracks page views on route changes
   - Provides `useAnalytics()` hook for components
   - Manages user context and cleanup

3. **`utils/gtag.ts`** — GA4 helper utilities
   - `sendEvent()`: Send events to GA4
   - `setGA4UserId()`: Identify users in GA4
   - `isGA4Ready()`: Check if GA4 is initialized
   - Event parameter sanitization and validation

4. **`supabase/migrations/006_analytics.sql`** — Database schema
   - `analytics_events` table with JSONB properties
   - Indexes for fast queries by event, user, and time
   - RLS policies for security

5. **`types/database.ts`** — TypeScript definitions
   - `AnalyticsEvent` type for reading
   - `AnalyticsEventInsert` type for writing

## Tracked Events

### Authentication

- `signup_complete` — New account created
- `signin_complete` — Existing user signed in

### Onboarding

- `onboarding_start` — User begins step 1
- `onboarding_step_complete` — Each step completed (includes step number)
- `onboarding_complete` — All 11 steps finished
- `onboarding_abandon` — User leaves mid-flow (includes abandoned step)

### Matching

- `page_view` — Every screen navigation
- `match_view` — Results page loaded (includes match counts by tier)
- `match_expand` — User expands a match card
- `interest_express` — "I'm Interested" button tapped

### Monetization

- `paywall_view` — Pricing modal shown
- `paywall_tier_select` — Tier selection made (includes tier and price)
- `paywall_convert` — Subscription activated (includes tier and price)

### Settings

- `theme_toggle` — Dark/light mode switched
- `covenant_complete` — Covenant accepted

## Setup

### 1. Environment Configuration

Add GA4 measurement ID to `.env`:

```bash
EXPO_PUBLIC_GA4_ID=G-XXXXXXXXXX
```

Get this from Google Analytics 4 property settings. If not configured, analytics will work without GA4.

### 2. Apply Database Migration

Run the migration in Supabase SQL Editor:

```bash
supabase migration up
```

Or manually execute `supabase/migrations/006_analytics.sql` in Supabase Dashboard → SQL Editor.

### 3. Add AnalyticsProvider to App

The `AnalyticsProvider` is already added to `app/_layout.tsx`:

```tsx
<AuthProvider>
  <AnalyticsProvider>
    <ThemeProvider>
      <OnboardingProvider>
        <InnerLayout />
      </OnboardingProvider>
    </ThemeProvider>
  </AnalyticsProvider>
</AuthProvider>
```

This wraps the entire app and provides context to all child components.

## Usage

### Automatic Tracking

The analytics system automatically tracks:

- **Page views**: Every route navigation
- **User context**: User ID is attached when authenticated
- **Session tracking**: Unique session ID generated per app session

### Manual Event Tracking

Use the `analytics` object to track custom events:

```tsx
import { analytics } from '../../context/AnalyticsContext';

// Track onboarding completion
await analytics.onboardingComplete();

// Track interest expression
await analytics.interestExpress(matchId, matchTier);

// Track theme toggle
await analytics.themeToggle('dark');
```

### Using the Hook

Get access to analytics methods in any component:

```tsx
import { useAnalytics } from '../../context/AnalyticsContext';

export function MyComponent() {
  const { trackEvent, trackPageView, flush } = useAnalytics();

  const handleCustomEvent = async () => {
    await trackEvent('custom_event_name', {
      custom_param: 'value',
    });
  };

  return (
    <button onPress={handleCustomEvent}>
      Track Event
    </button>
  );
}
```

## Event Properties

All events include:

- **event_name** — Name of the event
- **properties** — JSONB object with event-specific data
- **user_id** — User ID (if authenticated)
- **session_id** — Unique session identifier
- **platform** — 'web' | 'ios' | 'android'
- **screen_name** — Current screen/route name
- **created_at** — Server-side timestamp

### Example Event Record

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "event_name": "interest_express",
  "properties": {
    "match_id": "user-123",
    "tier": "exceptional"
  },
  "user_id": "auth-user-id",
  "session_id": "1709876543210-abc1234",
  "platform": "web",
  "screen_name": "results",
  "created_at": "2026-03-07T16:00:00Z"
}
```

## Implementation Details

### Batching Strategy

Events are collected in memory and flushed in two scenarios:

1. **Size threshold**: 10 events queued → immediate flush
2. **Time threshold**: 30 seconds elapsed → automatic flush

This balances real-time feedback with efficiency.

### Error Handling

- **Supabase unavailable**: Events queue locally and retry on next flush
- **GA4 unavailable**: Events still stored in Supabase
- **Network offline**: Events persist in queue until connection restored

### Session Tracking

Each app session gets a unique ID:

```
{timestamp}-{random-string}
Example: 1709876543210-abc1234
```

This allows grouping related events in analytics dashboards.

## Querying Analytics

### In Supabase

Find all events for a specific user:

```sql
SELECT * FROM analytics_events
WHERE user_id = 'your-user-id'
ORDER BY created_at DESC;
```

Find conversion events:

```sql
SELECT * FROM analytics_events
WHERE event_name = 'paywall_convert'
ORDER BY created_at DESC;
```

Count events by type:

```sql
SELECT event_name, COUNT(*) as count
FROM analytics_events
GROUP BY event_name
ORDER BY count DESC;
```

### In Google Analytics 4

GA4 provides:

- Real-time event streaming
- Funnel analysis (e.g., onboarding completion rates)
- Audience segmentation
- Custom reports and dashboards

## Row Level Security (RLS)

The `analytics_events` table has three policies:

1. **Anyone can insert** — No auth required (anonymous events)
2. **Users can read own events** — Authenticated users see their events
3. **Service role can read all** — Admin dashboards access

This allows:

- Frontend to insert analytics without authentication
- Users to access their own event history
- Backend services to generate reports

## Monitoring

### Check Analytics Table Size

```sql
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE tablename = 'analytics_events';
```

### View Recent Events

```sql
SELECT event_name, COUNT(*) as count, MAX(created_at) as latest
FROM analytics_events
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY event_name
ORDER BY count DESC;
```

## Best Practices

### Naming Conventions

Use snake_case for event names and properties:

```tsx
// Good
analytics.track('match_expand', { match_id: '123' });

// Avoid
analytics.track('matchExpand', { matchID: '123' });
```

### Meaningful Properties

Include context that helps analysis:

```tsx
// Good
analytics.interestExpress(matchId, tier);

// Avoid
analytics.interestExpress(matchId); // Missing tier info
```

### Avoid PII in Properties

Never log sensitive information:

```tsx
// Good
analytics.signupComplete(email); // Optional, email is non-sensitive in context

// Avoid
analytics.track('signup', { password: '...' });
analytics.track('signup', { credit_card: '...' });
```

### Manual Flush for Critical Events

For important conversions, manually flush immediately:

```tsx
await analytics.paywallConvert('premium', 99.99);
await analytics.flush(); // Ensure saved immediately
```

## Development

### Enable Debug Logging

Set `__DEV__` to see console logs:

```tsx
[Analytics] Initialized { sessionId, userId, platform, ga4Enabled }
[Analytics Event] event_name { properties }
[Analytics] Flushed 5 events
```

### Test Event Insertion

Insert a test event:

```tsx
await analytics.track('test_event', { test: true });
await analytics.flush();
```

Check Supabase:

```sql
SELECT * FROM analytics_events
WHERE event_name = 'test_event'
ORDER BY created_at DESC
LIMIT 1;
```

### Verify GA4 Integration

In browser dev tools:

1. Open Network tab
2. Filter by "google"
3. Trigger an event (e.g., theme toggle)
4. Confirm request to `www.googletagmanager.com`

## Troubleshooting

### Events Not Appearing in Supabase

1. Check that Supabase is configured:
   ```tsx
   import { isSupabaseConfigured } from '../lib/supabase';
   console.log(isSupabaseConfigured); // Should be true
   ```

2. Verify migration was applied:
   ```sql
   SELECT * FROM information_schema.tables
   WHERE table_name = 'analytics_events';
   ```

3. Check RLS policies:
   ```sql
   SELECT * FROM pg_policies
   WHERE tablename = 'analytics_events';
   ```

### Events Not Appearing in GA4

1. Verify GA4 ID in environment:
   ```tsx
   console.log(process.env.EXPO_PUBLIC_GA4_ID);
   ```

2. Check gtag script injection in Network tab

3. Confirm GA4 property receives events in real-time view

## API Reference

### analytics object

```tsx
// Onboarding
analytics.onboardingStart()
analytics.onboardingStepComplete(stepNumber: number)
analytics.onboardingComplete()
analytics.onboardingAbandon(stepNumber: number)

// Matching
analytics.pageView(screenName: string)
analytics.matchView(matchCounts?: Record<string, number>)
analytics.matchExpand(matchId: string, tier?: string)
analytics.interestExpress(matchId: string, tier?: string)

// Monetization
analytics.paywallView()
analytics.paywallTierSelect(tier: string, price?: number)
analytics.paywallConvert(tier: string, price?: number)

// Auth
analytics.signupComplete(email?: string)
analytics.signinComplete(email?: string)

// Settings
analytics.themeToggle(newMode: 'dark' | 'light')
analytics.covenantComplete()

// System
analytics.flush()
```

### useAnalytics hook

```tsx
const { trackEvent, trackPageView, flush } = useAnalytics();

await trackEvent(eventName, properties?, screenName?);
await trackPageView(screenName);
await flush();
```

## Support

For questions or issues:

1. Check this documentation
2. Review the implementation in `services/analytics.ts`
3. Check Supabase logs in Dashboard → Logs
4. Check GA4 real-time view in Google Analytics

