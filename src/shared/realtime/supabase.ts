import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import { getSupabaseAnonKey, getSupabaseUrl } from '@/shared/config/env'

let client: SupabaseClient | null = null
let activeAccessToken: string | null = null

export function isRealtimeConfigured(): boolean {
  return getSupabaseUrl().length > 0 && getSupabaseAnonKey().length > 0
}

export async function getRealtimeSupabaseClient(): Promise<SupabaseClient | null> {
  const url = getSupabaseUrl()
  const anonKey = getSupabaseAnonKey()
  if (url.length === 0 || anonKey.length === 0) {
    return null
  }

  const accessToken = localStorage.getItem('accessToken')
  const refreshToken = localStorage.getItem('refreshToken')
  if (accessToken === null || refreshToken === null) {
    return null
  }

  if (client === null) {
    client = createClient(url, anonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }

  if (activeAccessToken !== accessToken) {
    const { error } = await client.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    })

    if (error !== null) {
      return null
    }

    activeAccessToken = accessToken
  }

  return client
}

export function resetRealtimeSupabaseClient(): void {
  client = null
  activeAccessToken = null
}
