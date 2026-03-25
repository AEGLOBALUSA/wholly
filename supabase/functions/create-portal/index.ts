/**
 * WHOLLY — Stripe Customer Portal Session
 *
 * Creates a portal session so users can manage their subscription.
 * Deploy with: supabase functions deploy create-portal
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY') ?? '';
const STRIPE_API = 'https://api.stripe.com/v1';

serve(async (req: Request) => {
  try {
    const { user_id, return_url } = await req.json();

    if (!user_id) {
      return new Response(JSON.stringify({ error: 'user_id required' }), { status: 400 });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Get Stripe customer ID
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user_id)
      .single();

    if (!sub?.stripe_customer_id) {
      return new Response(JSON.stringify({ error: 'No subscription found' }), { status: 404 });
    }

    // Create portal session
    const params = new URLSearchParams({
      customer: sub.stripe_customer_id,
      return_url: return_url || 'https://whollydate.com/settings/subscription',
    });

    const res = await fetch(`${STRIPE_API}/billing_portal/sessions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const session = await res.json();

    if (session.error) {
      return new Response(JSON.stringify({ error: session.error.message }), { status: 400 });
    }

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
