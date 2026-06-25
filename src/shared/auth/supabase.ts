import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import { getSupabaseAnonKey, getSupabaseUrl } from '@/shared/config/env'

let authClient: SupabaseClient | null = null

export function isAuthSupabaseConfigured(): boolean {
  return getSupabaseUrl().length > 0 && getSupabaseAnonKey().length > 0
}

export function getAuthSupabaseClient(): SupabaseClient {
  const url = getSupabaseUrl()
  const anonKey = getSupabaseAnonKey()

  if (url.length === 0 || anonKey.length === 0) {
    throw new Error('Supabase is not configured for authentication')
  }

  if (authClient === null) {
    authClient = createClient(url, anonKey, {
      auth: {
        flowType: 'pkce',
        // PKCE verifier must survive the Google redirect (in-memory storage does not).
        persistSession: true,
        detectSessionInUrl: false,
        autoRefreshToken: false,
        storageKey: 'responza-auth-oauth',
      },
    })
  }

  return authClient
}
