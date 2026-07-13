const SUPABASE_OAUTH_STORAGE_PREFIX = 'responza-auth-oauth'

export function clearGoogleOAuthStorage(): void {
  for (const key of Object.keys(localStorage)) {
    if (key.startsWith(SUPABASE_OAUTH_STORAGE_PREFIX)) {
      localStorage.removeItem(key)
    }
  }
}
