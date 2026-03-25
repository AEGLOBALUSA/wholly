/**
 * WHOLLY — Email Notification Service
 *
 * Sends transactional emails for key events.
 * Uses Supabase's built-in email or a provider like Resend/SendGrid.
 *
 * Deploy with: supabase functions deploy send-email
 *
 * Required secrets:
 *   supabase secrets set RESEND_API_KEY=re_...
 *   (or use Supabase built-in SMTP)
 *
 * Trigger this function from database triggers or other edge functions.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? '';
const FROM_EMAIL = 'WHOLLY <hello@whollydate.com>';
const APP_URL = 'https://whollydate.com';

type EmailType =
  | 'mutual_match'
  | 'new_message'
  | 'high_compatibility'
  | 'weekly_digest'
  | 'account_deletion_scheduled'
  | 'account_deletion_reminder'
  | 'welcome';

interface EmailPayload {
  type: EmailType;
  to: string;
  recipientName: string;
  data: Record<string, any>;
}

function getEmailContent(payload: EmailPayload): { subject: string; html: string } {
  const { type, recipientName, data } = payload;

  switch (type) {
    case 'welcome':
      return {
        subject: 'Welcome to WHOLLY',
        html: `
          <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <h1 style="color: #D4726A; font-size: 28px;">Welcome to WHOLLY, ${recipientName}!</h1>
            <p style="color: #5C5C5C; font-size: 16px; line-height: 1.6;">
              Your covenant is signed and your profile is live. We're believing with you for something meaningful.
            </p>
            <p style="color: #5C5C5C; font-size: 16px; line-height: 1.6;">
              Complete your onboarding to start seeing matches aligned with your faith, values, and vision.
            </p>
            <a href="${APP_URL}/onboarding/step-1" style="display: inline-block; background: #D4726A; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 20px;">
              Complete Your Profile
            </a>
          </div>
        `,
      };

    case 'mutual_match':
      return {
        subject: `You and ${data.matchName} are a mutual match!`,
        html: `
          <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <h1 style="color: #D4726A; font-size: 28px;">It's mutual!</h1>
            <p style="color: #5C5C5C; font-size: 16px; line-height: 1.6;">
              ${recipientName}, you and ${data.matchName} both expressed interest. Your compatibility score is <strong>${data.overallScore}%</strong>.
            </p>
            <p style="color: #5C5C5C; font-size: 16px; line-height: 1.6;">
              You can now message each other. Start a conversation!
            </p>
            <a href="${APP_URL}/chat" style="display: inline-block; background: #D4726A; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 20px;">
              Open Chat
            </a>
          </div>
        `,
      };

    case 'new_message':
      return {
        subject: `New message from ${data.senderName}`,
        html: `
          <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <h1 style="color: #D4726A; font-size: 28px;">New Message</h1>
            <p style="color: #5C5C5C; font-size: 16px; line-height: 1.6;">
              ${recipientName}, ${data.senderName} sent you a message.
            </p>
            <div style="background: #FFF0EE; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #1A1A1A; font-size: 16px; margin: 0; font-style: italic;">
                "${data.preview}"
              </p>
            </div>
            <a href="${APP_URL}/chat/${data.conversationId}" style="display: inline-block; background: #D4726A; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              Reply
            </a>
          </div>
        `,
      };

    case 'high_compatibility':
      return {
        subject: `New ${data.tier} match: ${data.matchName}`,
        html: `
          <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <h1 style="color: #D4726A; font-size: 28px;">New ${data.tier === 'exceptional' ? 'Exceptional' : 'Strong'} Match</h1>
            <p style="color: #5C5C5C; font-size: 16px; line-height: 1.6;">
              ${recipientName}, you have a new ${data.tier} match with <strong>${data.matchName}</strong> at <strong>${data.overallScore}%</strong> compatibility.
            </p>
            <a href="${APP_URL}/onboarding/results" style="display: inline-block; background: #D4726A; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 20px;">
              View Match
            </a>
          </div>
        `,
      };

    case 'weekly_digest':
      return {
        subject: 'Your weekly WHOLLY digest',
        html: `
          <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <h1 style="color: #D4726A; font-size: 28px;">Your Week on WHOLLY</h1>
            <ul style="color: #5C5C5C; font-size: 16px; line-height: 2;">
              <li><strong>${data.newMatches}</strong> new matches</li>
              <li><strong>${data.interestsReceived}</strong> people expressed interest in you</li>
              <li><strong>${data.unreadMessages}</strong> unread messages</li>
            </ul>
            <a href="${APP_URL}" style="display: inline-block; background: #D4726A; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 20px;">
              Open WHOLLY
            </a>
          </div>
        `,
      };

    case 'account_deletion_scheduled':
      return {
        subject: 'Your WHOLLY account is scheduled for deletion',
        html: `
          <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <h1 style="color: #1A1A1A; font-size: 28px;">Account Deletion Scheduled</h1>
            <p style="color: #5C5C5C; font-size: 16px; line-height: 1.6;">
              ${recipientName}, your account is scheduled to be permanently deleted on <strong>${data.scheduledDate}</strong>.
            </p>
            <p style="color: #5C5C5C; font-size: 16px; line-height: 1.6;">
              If you change your mind, you can cancel this within the next 30 days.
            </p>
            <a href="${APP_URL}/settings" style="display: inline-block; background: #5C5C5C; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 20px;">
              Cancel Deletion
            </a>
          </div>
        `,
      };

    default:
      return { subject: 'WHOLLY Notification', html: '<p>You have a new notification.</p>' };
  }
}

serve(async (req: Request) => {
  try {
    const payload: EmailPayload = await req.json();

    if (!payload.to || !payload.type) {
      return new Response(JSON.stringify({ error: 'to and type required' }), { status: 400 });
    }

    const { subject, html } = getEmailContent(payload);

    // Send via Resend (or swap for SendGrid/Postmark)
    if (RESEND_API_KEY) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: payload.to,
          subject,
          html,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        return new Response(JSON.stringify({ error: result }), { status: 500 });
      }
      return new Response(JSON.stringify({ sent: true, id: result.id }));
    }

    // Fallback: log email (dev mode)
    console.log(`[EMAIL] To: ${payload.to}, Subject: ${subject}`);
    return new Response(JSON.stringify({ sent: false, reason: 'No email provider configured' }));
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
