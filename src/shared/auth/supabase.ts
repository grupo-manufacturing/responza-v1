import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import { getSupabaseAnonKey, getSupabaseUrl } from '@/shared/config/env'

let authClient: SupabaseClient | null = null

export function isSupabaseAuthConfigured(): boolean {
  return getSupabaseUrl().length > 0 && getSupabaseAnonKey().length > 0
}

export function getSupabaseAuthClient(): SupabaseClient {
  if (authClient !== null) {
    return authClient
  }

  authClient = createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
  })

  return authClient
}
