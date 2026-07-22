import {
  getGmailOAuthAllowedOrigins,
  getGmailRedirectUri,
  getGoogleClientId,
  isGmailOAuthConfigured,
} from '@/shared/config/env'

const GMAIL_OAUTH_STATE_KEY = 'gmail_oauth_state'

let oauthListenerBound = false
let oauthPopup: Window | null = null
let oauthResolve: ((result: { code: string }) => void) | null = null
let oauthReject: ((error: Error) => void) | null = null

function resetGmailOAuthState(): void {
  oauthResolve = null
  oauthReject = null
  oauthPopup = null
}

function createOAuthState(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function bindGmailOAuthListener(): void {
  if (oauthListenerBound) {
    return
  }

  oauthListenerBound = true
  const allowedOrigins = getGmailOAuthAllowedOrigins()

  window.addEventListener('message', (event) => {
    if (!event.origin || !allowedOrigins.includes(event.origin)) {
      return
    }

    try {
      const payload = typeof event.data === 'object' ? event.data : null
      if (payload?.type === 'GMAIL_OAUTH_SUCCESS' && typeof payload.code === 'string') {
        const expectedState = sessionStorage.getItem(GMAIL_OAUTH_STATE_KEY)
        const returnedState = typeof payload.state === 'string' ? payload.state : ''

        if (expectedState === null || expectedState.length === 0 || returnedState !== expectedState) {
          if (oauthReject) {
            oauthReject(new Error('Gmail OAuth state validation failed'))
            resetGmailOAuthState()
          }
          return
        }

        sessionStorage.removeItem(GMAIL_OAUTH_STATE_KEY)

        if (oauthResolve) {
          oauthResolve({ code: payload.code })
          resetGmailOAuthState()
        }
      } else if (payload?.type === 'GMAIL_OAUTH_ERROR') {
        sessionStorage.removeItem(GMAIL_OAUTH_STATE_KEY)
        if (oauthReject) {
          oauthReject(new Error(payload.error || 'Gmail OAuth failed'))
          resetGmailOAuthState()
        }
      }
    } catch {
      void 0
    }
  })
}

export async function startGmailOAuth(): Promise<{ code: string }> {
  if (!isGmailOAuthConfigured()) {
    throw new Error('Gmail OAuth is not configured for this app')
  }

  bindGmailOAuthListener()

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

  return new Promise((resolve, reject) => {
    oauthResolve = resolve
    oauthReject = reject

    oauthPopup = window.open(
      authUrl.toString(),
      'gmail_oauth',
      'width=560,height=720,menubar=no,toolbar=no,status=no,scrollbars=yes',
    )

    if (!oauthPopup) {
      sessionStorage.removeItem(GMAIL_OAUTH_STATE_KEY)
      reject(new Error('Pop-up blocked. Allow pop-ups and try again.'))
      return
    }

    const checkClosed = setInterval(() => {
      if (oauthPopup?.closed) {
        clearInterval(checkClosed)
        if (oauthReject) {
          sessionStorage.removeItem(GMAIL_OAUTH_STATE_KEY)
          oauthReject(new Error('Gmail OAuth was canceled'))
          resetGmailOAuthState()
        }
      }
    }, 1000)
  })
}

function postGmailOAuthResult(payload: Record<string, unknown>): void {
  const targetOrigin = window.location.origin
  window.opener?.postMessage(payload, targetOrigin)
  setTimeout(() => {
    window.close()
  }, 150)
}

export function handleGmailOAuthCallback(): void {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')?.replace(/#_$/, '').trim() ?? ''
  const state = urlParams.get('state')?.trim() ?? ''
  const error = urlParams.get('error')
  const errorDescription = urlParams.get('error_description')

  if (error) {
    postGmailOAuthResult({
      type: 'GMAIL_OAUTH_ERROR',
      error: errorDescription || error || 'Gmail OAuth failed',
    })
    return
  }

  if (code.length === 0) {
    postGmailOAuthResult({
      type: 'GMAIL_OAUTH_ERROR',
      error: 'No authorization code received',
    })
    return
  }

  postGmailOAuthResult({
    type: 'GMAIL_OAUTH_SUCCESS',
    code,
    ...(state.length > 0 ? { state } : {}),
  })
}
