import { getSupabaseAuthClient } from '@/shared/auth/supabase'

export function getGoogleOAuthRedirectUri(): string {
  return `${window.location.origin}/oauth/google/callback`
}

export async function startGoogleSignIn(): Promise<void> {
  const supabase = getSupabaseAuthClient()
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: getGoogleOAuthRedirectUri(),
      queryParams: {
        access_type: 'offline',
        prompt: 'select_account',
      },
    },
  })

  if (error !== null) {
    throw error
  }
}
