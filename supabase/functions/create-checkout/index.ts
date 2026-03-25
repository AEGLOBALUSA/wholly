/**
 * WHOLLY — Stripe Checkout Session Creator
 *
 * Creates a Stripe Checkout session for subscription purchases.
 * Deploy with: supabase functions deploy create-checkout
 *
 * Required secrets:
 *   supabase secrets set STRIPE_SECRET_KEY=sk_live_...
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY') ?? '';
const STRIPE_API = 'https://api.stripe.com/v1';

async function stripeRequest(endpoint: string, body: Record<string, string>) {
  const params = new URLSearchParams(body);
  const res = await fetch(`${STRIPE_API}${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });
  return res.json();
}

serve(async (req: Request) => {
  try {
    const { user_id, price_id, tier, period, success_url, cancel_url } = await req.json();

    if (!user_id || !price_id) {
      return new Response(JSON.stringify({ error: 'user_id and price_id required' }), { status: 400 });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, first_name')
      .eq('id', user_id)
      .single();

    if (!profile) {
      return new Response(JSON.stringify({ error: 'Profile not found' }), { status: 404 });
    }

    // Check for existing Stripe customer
    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user_id)
      .single();

    let customerId = existingSub?.stripe_customer_id;

    if (!customerId) {
      // Create Stripe customer
      const customer = await stripeRequest('/customers', {
        email: profile.email,
        name: profile.first_name,
        'metadata[user_id]': user_id,
      });
      customerId = customer.id;
    }

    // Create Checkout Session
    const session = await stripeRequest('/checkout/sessions', {
      'customer': customerId,
      'mode': 'subscription',
      'payment_method_types[0]': 'card',
      'line_items[0][price]': price_id,
      'line_items[0][quantity]': '1',
      'success_url': success_url || 'https://whollydate.com/settings/subscription?success=true',
      'cancel_url': cancel_url || 'https://whollydate.com/settings/subscription?canceled=true',
      'subscription_data[metadata][user_id]': user_id,
      'subscription_data[metadata][tier]': tier,
      'subscription_data[metadata][period]': period,
      'allow_promotion_codes': 'true',
    });

    if (session.error) {
      return new Response(JSON.stringify({ error: session.error.message }), { status: 400 });
    }

    // Store customer ID
    await supabase
      .from('subscriptions')
      .upsert({
        user_id,
        stripe_customer_id: customerId,
        tier: 'free', // Will be updated by webhook on payment success
        status: 'pending',
      }, { onConflict: 'user_id' });

    return new Response(
      JSON.stringify({ url: session.url, session_id: session.id }),
      { headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
