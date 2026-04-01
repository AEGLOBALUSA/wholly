/**
 * WHOLLY — Send Push Notification
 *
 * Sends a Web Push notification to a specific user. Called by
 * database triggers or other edge functions when a new match
 * or message event occurs.
 *
 * Deploy with: supabase functions deploy send-push
 *
 * Required secrets:
 *   supabase secrets set VAPID_PRIVATE_KEY=...
 *   supabase secrets set VAPID_PUBLIC_KEY=...
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const VAPID_SUBJECT = 'mailto:hello@whollydate.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

/**
 * Sign and send a Web Push message using the Web Push protocol.
 * Uses VAPID authentication with the configured keys.
 */
async function sendWebPush(
  subscription: { endpoint: string; p256dh: string; auth_key: string },
  payload: object,
): Promise<boolean> {
  const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY');
  const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY');

  if (!vapidPrivateKey || !vapidPublicKey) {
    console.error('VAPID keys not configured');
    return false;
  }

  // Import the VAPID private key for signing
  const privateKeyData = base64UrlDecode(vapidPrivateKey);
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    privateKeyData,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign'],
  );

  // Create VAPID JWT header
  const url = new URL(subscription.endpoint);
  const audience = `${url.protocol}//${url.host}`;
  const expiry = Math.floor(Date.now() / 1000) + 12 * 60 * 60; // 12 hours

  const header = base64UrlEncode(JSON.stringify({ typ: 'JWT', alg: 'ES256' }));
  const body = base64UrlEncode(JSON.stringify({
    aud: audience,
    exp: expiry,
    sub: VAPID_SUBJECT,
  }));

  const unsignedToken = `${header}.${body}`;
  const signature = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    cryptoKey,
    new TextEncoder().encode(unsignedToken),
  );

  const jwt = `${unsignedToken}.${base64UrlEncode(new Uint8Array(signature))}`;

  // Encrypt the payload using the subscription keys
  const payloadBytes = new TextEncoder().encode(JSON.stringify(payload));

  // Import subscriber's public key
  const p256dhKey = base64UrlDecode(subscription.p256dh);
  const authSecret = base64UrlDecode(subscription.auth_key);

  const subscriberKey = await crypto.subtle.importKey(
    'raw',
    p256dhKey,
    { name: 'ECDH', namedCurve: 'P-256' },
    false,
    [],
  );

  // Generate ephemeral key pair
  const localKeyPair = await crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    ['deriveBits'],
  );

  // Derive shared secret
  const sharedSecret = await crypto.subtle.deriveBits(
    { name: 'ECDH', public: subscriberKey },
    localKeyPair.privateKey,
    256,
  );

  // Derive encryption key using HKDF
  const sharedSecretKey = await crypto.subtle.importKey(
    'raw',
    sharedSecret,
    'HKDF',
    false,
    ['deriveBits'],
  );

  const prk = await crypto.subtle.deriveBits(
    {
      name: 'HKDF',
      hash: 'SHA-256',
      salt: authSecret,
      info: new TextEncoder().encode('Content-Encoding: auth\0'),
    },
    sharedSecretKey,
    256,
  );

  const prkKey = await crypto.subtle.importKey('raw', prk, 'HKDF', false, ['deriveBits']);

  const localPublicKey = await crypto.subtle.exportKey('raw', localKeyPair.publicKey);
  const localPublicKeyBytes = new Uint8Array(localPublicKey);

  // Build context for content encryption key derivation
  const context = new Uint8Array([
    ...new TextEncoder().encode('P-256\0'),
    0, 65, ...new Uint8Array(p256dhKey),
    0, 65, ...localPublicKeyBytes,
  ]);

  const cekInfo = new Uint8Array([
    ...new TextEncoder().encode('Content-Encoding: aesgcm\0'),
    ...context,
  ]);

  const nonceInfo = new Uint8Array([
    ...new TextEncoder().encode('Content-Encoding: nonce\0'),
    ...context,
  ]);

  const cekBits = await crypto.subtle.deriveBits(
    { name: 'HKDF', hash: 'SHA-256', salt: new Uint8Array(0), info: cekInfo },
    prkKey,
    128,
  );

  const nonceBits = await crypto.subtle.deriveBits(
    { name: 'HKDF', hash: 'SHA-256', salt: new Uint8Array(0), info: nonceInfo },
    prkKey,
    96,
  );

  // Encrypt
  const cek = await crypto.subtle.importKey('raw', cekBits, 'AES-GCM', false, ['encrypt']);
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: nonceBits },
    cek,
    payloadBytes,
  );

  // Send to push service
  const response = await fetch(subscription.endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `vapid t=${jwt}, k=${vapidPublicKey}`,
      'Content-Encoding': 'aesgcm',
      'Crypto-Key': `dh=${base64UrlEncode(localPublicKeyBytes)};p256ecdsa=${vapidPublicKey}`,
      'Content-Type': 'application/octet-stream',
      'TTL': '86400',
    },
    body: encrypted,
  });

  return response.ok || response.status === 201;
}

function base64UrlEncode(data: string | Uint8Array): string {
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  const base64 = btoa(String.fromCharCode(...bytes));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str: string): Uint8Array {
  const padded = str + '='.repeat((4 - (str.length % 4)) % 4);
  const base64 = padded.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64);
  return new Uint8Array([...binary].map((c) => c.charCodeAt(0)));
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { profileId, title, body, tag, url } = await req.json();

    if (!profileId || !title) {
      return new Response(JSON.stringify({ error: 'profileId and title required' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Use service role to read any user's subscriptions
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: subscriptions } = await supabase
      .from('push_subscriptions')
      .select('endpoint, p256dh, auth_key')
      .eq('profile_id', profileId);

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(JSON.stringify({ sent: 0, reason: 'No subscriptions found' }), {
        headers: corsHeaders,
      });
    }

    const payload = { title, body, tag, url };
    let sent = 0;
    const failed: string[] = [];

    for (const sub of subscriptions) {
      const success = await sendWebPush(sub, payload);
      if (success) {
        sent++;
      } else {
        failed.push(sub.endpoint);
      }
    }

    // Clean up failed/expired subscriptions
    if (failed.length > 0) {
      await supabase
        .from('push_subscriptions')
        .delete()
        .eq('profile_id', profileId)
        .in('endpoint', failed);
    }

    return new Response(
      JSON.stringify({ sent, failed: failed.length }),
      { headers: corsHeaders },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
