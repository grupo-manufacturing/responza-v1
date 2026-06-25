import { getSupabaseAuthClient } from '@/shared/auth/supabase'

export async function completeSupabaseAuthRedirect(): Promise<{
  accessToken: string
  refreshToken: string
  expiresIn: number
}> {
  const supabase = getSupabaseAuthClient()
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')
  const oauthError = params.get('error_description') ?? params.get('error')

  if (oauthError !== null && oauthError.length > 0) {
    throw new Error(oauthError)
  }

  if (code !== null && code.length > 0) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (error !== null || data.session === null) {
      throw new Error(error?.message ?? 'Failed to complete sign-in')
    }

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresIn: data.session.expires_in ?? 3600,
    }
  }

  const { data, error } = await supabase.auth.getSession()
  if (error !== null || data.session === null) {
    throw new Error(error?.message ?? 'No sign-in session found')
  }

  return {
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
    expiresIn: data.session.expires_in ?? 3600,
  }
}
