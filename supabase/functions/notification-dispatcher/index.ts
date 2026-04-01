/**
 * WHOLLY — Notification Dispatcher
 *
 * Called by Database Webhooks when a new notification is inserted.
 * Checks user email preferences and dispatches email + push notifications.
 *
 * Deploy: supabase functions deploy notification-dispatcher
 *
 * Database Webhook Config (Supabase Dashboard → Database → Webhooks):
 *   Table: notifications
 *   Event: INSERT
 *   Type: Supabase Edge Function
 *   Function: notification-dispatcher
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? '';
const FROM_EMAIL = 'WHOLLY <hello@whollydate.com>';
const APP_URL = 'https://whollydate.com';

/** Map notification type → email preference key */
const PREF_MAP: Record<string, string> = {
  mutual_match: 'match_notifications',
  new_message: 'message_alerts',
  high_compatibility: 'high_compatibility',
  profile_view: 'match_notifications',
  covenant_reminder: 'system_updates',
  system: 'system_updates',
  welcome: 'system_updates',
};

interface WebhookPayload {
  type: 'INSERT';
  table: string;
  record: {
    id: string;
    user_id: string;
    type: string;
    title: string;
    body: string;
    metadata: Record<string, any>;
    created_at: string;
  };
  schema: string;
}

function buildEmailHtml(
  notification: WebhookPayload['record'],
  recipientName: string,
): { subject: string; html: string } {
  const { type, title, body, metadata } = notification;

  const ctaUrl = type === 'new_message' && metadata.conversation_id
    ? `${APP_URL}/chat/${metadata.conversation_id}`
    : type === 'mutual_match'
    ? `${APP_URL}/chat`
    : type === 'high_compatibility'
    ? `${APP_URL}/onboarding/results`
    : APP_URL;

  const ctaLabel = type === 'new_message'
    ? 'Reply'
    : type === 'mutual_match'
    ? 'Start Chatting'
    : type === 'high_compatibility'
    ? 'View Match'
    : 'Open WHOLLY';

  return {
    subject: title,
    html: `
      <div style="font-family: 'DM Sans', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #FFF8F6;">
        <div style="text-align: center; margin-bottom: 32px;">
          <span style="font-size: 12px; letter-spacing: 4px; color: #E8615A; font-weight: 500;">WHOLLY</span>
        </div>
        <h1 style="color: #2D2D2D; font-size: 24px; margin-bottom: 16px;">${title}</h1>
        <p style="color: #5C5C5C; font-size: 16px; line-height: 1.6; margin-bottom: 8px;">
          Hi ${recipientName},
        </p>
        <p style="color: #5C5C5C; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          ${body}
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${ctaUrl}" style="display: inline-block; background: #E8615A; color: white; padding: 14px 32px; border-radius: 9999px; text-decoration: none; font-weight: 600; font-size: 14px; letter-spacing: 0.5px;">
            ${ctaLabel}
          </a>
        </div>
        <hr style="border: none; border-top: 1px solid #E8E0DC; margin: 32px 0;" />
        <p style="color: #9CA3AF; font-size: 12px; text-align: center; line-height: 1.6;">
          You're receiving this because you have an account on WHOLLY.
          <br />To manage your email preferences, visit your <a href="${APP_URL}/settings" style="color: #E8615A;">account settings</a>.
        </p>
      </div>
    `,
  };
}

serve(async (req: Request) => {
  try {
    const payload: WebhookPayload = await req.json();

    // Only handle notification inserts
    if (payload.table !== 'notifications' || payload.type !== 'INSERT') {
      return new Response(JSON.stringify({ skipped: true }), { status: 200 });
    }

    const notification = payload.record;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Look up user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, email, email_preferences, auth_id')
      .eq('auth_id', notification.user_id)
      .single();

    if (!profile?.email) {
      return new Response(JSON.stringify({ skipped: true, reason: 'no_profile' }), { status: 200 });
    }

    // Check email preferences
    const prefKey = PREF_MAP[notification.type] ?? 'system_updates';
    const prefs = profile.email_preferences ?? {};
    if (prefs[prefKey] === false) {
      return new Response(JSON.stringify({ skipped: true, reason: 'opted_out' }), { status: 200 });
    }

    const recipientName = profile.first_name || 'there';
    const { subject, html } = buildEmailHtml(notification, recipientName);

    // Send email via Resend
    let emailStatus = 'skipped';
    let providerResponse: Record<string, any> = {};

    if (RESEND_API_KEY) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: profile.email,
          subject,
          html,
        }),
      });

      providerResponse = await res.json();
      emailStatus = res.ok ? 'sent' : 'failed';
    }

    // Log email
    await supabase.from('email_log').insert({
      user_id: notification.user_id,
      email_type: notification.type,
      recipient_email: profile.email,
      subject,
      status: emailStatus,
      provider_response: providerResponse,
    });

    // Send push notification (fire and forget)
    if (notification.type !== 'welcome') {
      try {
        await supabase.functions.invoke('send-push', {
          body: {
            userId: notification.user_id,
            title: notification.title,
            body: notification.body,
            url: notification.type === 'new_message' && notification.metadata.conversation_id
              ? `/chat/${notification.metadata.conversation_id}`
              : '/',
          },
        });
      } catch {
        // Push failure is non-critical
      }
    }

    return new Response(
      JSON.stringify({ email: emailStatus, notification_id: notification.id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
});
