import { createClient, SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Database } from '../types/database';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// WHOLLY — Supabase Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
// The app works in two modes:
// 1. DEMO MODE (no Supabase) — uses local demo data, no auth
// 2. LIVE MODE (Supabase configured) — real database + auth
//
// SETUP: Copy .env.example to .env and add your Supabase keys
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if Supabase is properly configured
export const isSupabaseConfigured =
  SUPABASE_URL.length > 0 &&
  SUPABASE_URL !== 'YOUR_SUPABASE_URL' &&
  SUPABASE_URL.startsWith('http') &&
  SUPABASE_ANON_KEY.length > 0 &&
  SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY';

// Lazy-initialize: only create the client when keys exist
let _client: SupabaseClient<Database> | null = null;

function getClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured) return null;
  if (!_client) {
    _client = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
  }
  return _client;
}

// Export a proxy that lazily initializes — avoids crash at import time
export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(_target, prop) {
    const client = getClient();
    if (!client) {
      // In demo mode, return no-ops for common methods
      if (prop === 'from') return () => ({ select: () => ({ data: null, error: null }), insert: () => ({ data: null, error: null }), update: () => ({ data: null, error: null }), upsert: () => ({ data: null, error: null }), delete: () => ({ data: null, error: null }) });
      if (prop === 'auth') return { getSession: () => ({ data: { session: null } }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }), signUp: () => ({ error: { message: 'Supabase not configured' } }), signInWithPassword: () => ({ error: { message: 'Supabase not configured' } }), signOut: () => ({}), resetPasswordForEmail: () => ({ error: { message: 'Supabase not configured' } }) };
      if (prop === 'functions') return { invoke: () => ({ error: { message: 'Supabase not configured' } }) };
      if (prop === 'rpc') return () => ({ data: null, error: { message: 'Supabase not configured' } });
      if (prop === 'channel') return () => ({ on: () => ({ subscribe: () => ({}) }), subscribe: () => ({}) });
      if (prop === 'removeChannel') return () => {};
      return undefined;
    }
    return (client as any)[prop];
  },
});

export default supabase;
