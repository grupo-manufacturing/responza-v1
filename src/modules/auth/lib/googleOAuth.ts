import { getAuthSupabaseClient, isAuthSupabaseConfigured } from '@/shared/auth/supabase'

export function isGoogleAuthConfigured(): boolean {
  return isAuthSupabaseConfigured()
}

export function getGoogleOAuthRedirectUri(nextPath?: string): string {
  const redirectTo = new URL('/auth/google/callback', window.location.origin)

  if (nextPath !== undefined && nextPath.startsWith('/')) {
    redirectTo.searchParams.set('next', nextPath)
  }

  return redirectTo.toString()
}

export async function startGoogleOAuth(nextPath = '/inbox'): Promise<void> {
  const supabase = getAuthSupabaseClient()
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: getGoogleOAuthRedirectUri(nextPath),
      queryParams: {
        access_type: 'offline',
        prompt: 'select_account',
      },
    },
  })

  if (error !== null) {
    throw new Error(error.message)
  }
}

export type GoogleOAuthTokens = {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export async function exchangeGoogleOAuthCode(code: string): Promise<GoogleOAuthTokens> {
  const supabase = getAuthSupabaseClient()
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error !== null) {
    throw new Error(error.message)
  }

  if (data.session === null) {
    throw new Error('Google sign-in did not return a session')
  }

  return {
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
    expiresIn: data.session.expires_in ?? 3600,
  }
}

export function readGoogleOAuthCallbackError(): string | null {
  const params = new URLSearchParams(window.location.search)
  const errorDescription = params.get('error_description')
  const error = params.get('error')

  if (errorDescription !== null && errorDescription.length > 0) {
    return errorDescription
  }

  if (error !== null && error.length > 0) {
    return error
  }

  return null
}

export function readGoogleOAuthCallbackCode(): string | null {
  return new URLSearchParams(window.location.search).get('code')
}

export function readGoogleOAuthNextPath(): string {
  const next = new URLSearchParams(window.location.search).get('next')
  if (next !== null && next.startsWith('/')) {
    return next
  }

  return '/inbox'
}
