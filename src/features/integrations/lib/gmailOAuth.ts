import {
  getGmailOAuthAllowedOrigins,
  getGmailRedirectUri,
  getGoogleClientId,
  isGmailOAuthConfigured,
} from '@/shared/config/env'
import { postOAuthResultToOpener, waitForOAuthPopupCode } from '@/features/integrations/lib/oauthPopup'

const GMAIL_OAUTH_STATE_KEY = 'gmail_oauth_state'

function createOAuthState(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export async function startGmailOAuth(): Promise<{ code: string }> {
  if (!isGmailOAuthConfigured()) {
    throw new Error('Gmail OAuth is not configured for this app')
  }

  const state = createOAuthState()
  sessionStorage.setItem(GMAIL_OAUTH_STATE_KEY, state)

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  authUrl.searchParams.set('client_id', getGoogleClientId())
  authUrl.searchParams.set('redirect_uri', getGmailRedirectUri())
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set(
    'scope',
    [
      'https://www.googleapis.com/auth/gmail.modify',
      'https://www.googleapis.com/auth/gmail.send',
    ].join(' '),
  )
  authUrl.searchParams.set('access_type', 'offline')
  authUrl.searchParams.set('prompt', 'consent')
  authUrl.searchParams.set('state', state)

  try {
    const result = await waitForOAuthPopupCode({
      authUrl: authUrl.toString(),
      windowName: 'gmail_oauth',
      allowedOrigins: getGmailOAuthAllowedOrigins(),
      successType: 'GMAIL_OAUTH_SUCCESS',
      errorType: 'GMAIL_OAUTH_ERROR',
      canceledMessage: 'Gmail OAuth was canceled',
      validate: (payload) => {
        const expectedState = sessionStorage.getItem(GMAIL_OAUTH_STATE_KEY)
        const returnedState = typeof payload.state === 'string' ? payload.state : ''
        if (expectedState === null || expectedState.length === 0 || returnedState !== expectedState) {
          return 'Gmail OAuth state validation failed'
        }
        return null
      },
    })

    sessionStorage.removeItem(GMAIL_OAUTH_STATE_KEY)
    return { code: result.code }
  } catch (error) {
    sessionStorage.removeItem(GMAIL_OAUTH_STATE_KEY)
    throw error
  }
}

export function handleGmailOAuthCallback(): void {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')?.replace(/#_$/, '').trim() ?? ''
  const state = urlParams.get('state')?.trim() ?? ''
  const error = urlParams.get('error')
  const errorDescription = urlParams.get('error_description')

  if (error) {
    postOAuthResultToOpener({
      type: 'GMAIL_OAUTH_ERROR',
      error: errorDescription || error || 'Gmail OAuth failed',
    })
    return
  }

  if (code.length === 0) {
    postOAuthResultToOpener({
      type: 'GMAIL_OAUTH_ERROR',
      error: 'No authorization code received',
    })
    return
  }

  postOAuthResultToOpener({
    type: 'GMAIL_OAUTH_SUCCESS',
    code,
    ...(state.length > 0 ? { state } : {}),
  })
}
