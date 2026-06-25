import { getSupabaseAuthClient } from '@/shared/auth/supabase'

type OtpType = 'signup' | 'invite' | 'magiclink' | 'recovery' | 'email_change' | 'email'

function parseHashParams(): URLSearchParams {
  const hash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash
  return new URLSearchParams(hash)
}

function sessionFromHash(): { accessToken: string; refreshToken: string; expiresIn: number } | null {
  const hashParams = parseHashParams()
  const accessToken = hashParams.get('access_token')
  const refreshToken = hashParams.get('refresh_token')

  if (accessToken === null || refreshToken === null) {
    return null
  }

  const expiresInRaw = hashParams.get('expires_in')
  const expiresIn =
    expiresInRaw !== null && Number.isFinite(Number.parseInt(expiresInRaw, 10)) && Number.parseInt(expiresInRaw, 10) > 0
      ? Number.parseInt(expiresInRaw, 10)
      : 3600

  return {
    accessToken,
    refreshToken,
    expiresIn,
  }
}

export async function completeSupabaseAuthRedirect(): Promise<{
  accessToken: string
  refreshToken: string
  expiresIn: number
}> {
  const supabase = getSupabaseAuthClient()
  const params = new URLSearchParams(window.location.search)
  const oauthError = params.get('error_description') ?? params.get('error')

  if (oauthError !== null && oauthError.length > 0) {
    throw new Error(oauthError)
  }

  const tokenHash = params.get('token_hash')
  const otpType = params.get('type')
  if (tokenHash !== null && tokenHash.length > 0 && otpType !== null && otpType.length > 0) {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: otpType as OtpType,
    })

    if (error !== null || data.session === null) {
      throw new Error(error?.message ?? 'Failed to verify email link')
    }

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresIn: data.session.expires_in ?? 3600,
    }
  }

  const hashSession = sessionFromHash()
  if (hashSession !== null) {
    return hashSession
  }

  const code = params.get('code')
  if (code !== null && code.length > 0) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (error !== null || data.session === null) {
      throw new Error(
        error?.message ??
          'Failed to complete sign-in. If you opened this link from email, request a new verification email and open it in the same browser you used to sign up.',
      )
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
