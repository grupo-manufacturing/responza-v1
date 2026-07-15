import { getAuthSupabaseClient, isAuthSupabaseConfigured } from '@/shared/auth/supabase'
import { clearGoogleOAuthStorage } from '@/shared/auth/googleOAuthStorage'
import { getAppOrigin } from '@/shared/config/env'
import { SessionStorage } from '@/shared/session/storage'

import { AuthService } from '@/features/auth/api/auth.service'
import type { AuthSession } from '@/features/auth/api/auth.types'

const CALLBACK_PATH = '/auth/google/callback'

export function isGoogleAuthConfigured(): boolean {
  return isAuthSupabaseConfigured()
}

function oauthOrigin(): string {
  return getAppOrigin() ?? window.location.origin
}

function buildRedirectUri(nextPath?: string): string {
  const url = new URL(CALLBACK_PATH, oauthOrigin())
  if (nextPath !== undefined && nextPath.startsWith('/')) {
    url.searchParams.set('next', nextPath)
  }
  return url.toString()
}

export async function startGoogleOAuth(nextPath = '/inbox'): Promise<void> {
  SessionStorage.clearTokens()
  clearGoogleOAuthStorage()

  const { error } = await getAuthSupabaseClient().auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: buildRedirectUri(nextPath),
      queryParams: { prompt: 'select_account' },
    },
  })

  if (error !== null) {
    throw new Error(error.message)
  }
}

export type GoogleOAuthCallbackResult =
  | { kind: 'waiting' }
  | { kind: 'redirect'; nextPath: string }
  | { kind: 'session'; session: AuthSession; nextPath: string }

function readCallbackParams(): URLSearchParams {
  return new URLSearchParams(window.location.search)
}

export async function handleGoogleOAuthCallback(): Promise<GoogleOAuthCallbackResult> {
  const params = readCallbackParams()

  const oauthError = params.get('error_description') ?? params.get('error')
  if (oauthError !== null && oauthError.length > 0) {
    throw new Error(oauthError)
  }

  const code = params.get('code')
  if (code === null || code.length === 0) {
    throw new Error('Google sign-in was canceled or did not return an authorization code.')
  }

  const nextPath =
    params.get('next')?.startsWith('/') === true ? (params.get('next') as string) : '/inbox'

  const codeKey = `responza-google-oauth:${code}`
  const codeState = sessionStorage.getItem(codeKey)

  if (codeState === 'pending') {
    return { kind: 'waiting' }
  }

  if (codeState === 'done') {
    if (SessionStorage.isAuthenticated()) {
      return { kind: 'redirect', nextPath }
    }
    sessionStorage.removeItem(codeKey)
  }

  sessionStorage.setItem(codeKey, 'pending')

  try {
    const { data, error } = await getAuthSupabaseClient().auth.exchangeCodeForSession(code)
    if (error !== null) {
      throw new Error(error.message)
    }
    if (data.session === null) {
      throw new Error('Google sign-in did not return a session.')
    }

    const session = await AuthService.completeOAuth({
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresIn: data.session.expires_in ?? 3600,
    })

    sessionStorage.setItem(codeKey, 'done')
    window.history.replaceState({}, document.title, CALLBACK_PATH)

    return { kind: 'session', session, nextPath }
  } catch (error) {
    sessionStorage.removeItem(codeKey)
    throw error
  }
}
