import {
  getInstagramAppId,
  getInstagramOAuthAllowedOrigins,
  getInstagramRedirectUri,
  isInstagramOAuthConfigured,
} from '@/shared/config/env'

let oauthListenerBound = false
let oauthPopup: Window | null = null
let oauthResolve: ((result: { code: string }) => void) | null = null
let oauthReject: ((error: Error) => void) | null = null

function resetInstagramOAuthState(): void {
  oauthResolve = null
  oauthReject = null
  oauthPopup = null
}

function bindInstagramOAuthListener(): void {
  if (oauthListenerBound) {
    return
  }

  oauthListenerBound = true
  const allowedOrigins = getInstagramOAuthAllowedOrigins()

  window.addEventListener('message', (event) => {
    if (!event.origin || !allowedOrigins.includes(event.origin)) {
      return
    }

    try {
      const payload = typeof event.data === 'object' ? event.data : null
      if (payload?.type === 'INSTAGRAM_OAUTH_SUCCESS' && typeof payload.code === 'string') {
        if (oauthResolve) {
          oauthResolve({ code: payload.code })
          resetInstagramOAuthState()
        }
      } else if (payload?.type === 'INSTAGRAM_OAUTH_ERROR') {
        if (oauthReject) {
          oauthReject(new Error(payload.error || 'Instagram OAuth failed'))
          resetInstagramOAuthState()
        }
      }
    } catch {
      void 0
    }
  })
}

export async function startInstagramOAuth(): Promise<{ code: string }> {
  if (!isInstagramOAuthConfigured()) {
    throw new Error('Instagram OAuth is not configured for this app')
  }

  bindInstagramOAuthListener()

  const authUrl = new URL('https://www.instagram.com/oauth/authorize')
  authUrl.searchParams.set('client_id', getInstagramAppId())
  authUrl.searchParams.set('redirect_uri', getInstagramRedirectUri())
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('scope', 'instagram_business_basic,instagram_business_manage_messages')
  authUrl.searchParams.set('force_reauth', 'true')

  return new Promise((resolve, reject) => {
    oauthResolve = resolve
    oauthReject = reject

    oauthPopup = window.open(
      authUrl.toString(),
      'instagram_oauth',
      'width=560,height=720,menubar=no,toolbar=no,status=no,scrollbars=yes'
    )

    if (!oauthPopup) {
      reject(new Error('Pop-up blocked. Allow pop-ups and try again.'))
      return
    }

    const checkClosed = setInterval(() => {
      if (oauthPopup?.closed) {
        clearInterval(checkClosed)
        if (oauthReject) {
          oauthReject(new Error('Instagram OAuth was canceled'))
          resetInstagramOAuthState()
        }
      }
    }, 1000)
  })
}

function postInstagramOAuthResult(payload: Record<string, unknown>): void {
  const targetOrigin = window.location.origin
  window.opener?.postMessage(payload, targetOrigin)
  setTimeout(() => {
    window.close()
  }, 150)
}

export function handleInstagramOAuthCallback(): void {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')?.replace(/#_$/, '').trim() ?? ''
  const error = urlParams.get('error')
  const errorDescription = urlParams.get('error_description')

  if (error) {
    postInstagramOAuthResult({
      type: 'INSTAGRAM_OAUTH_ERROR',
      error: errorDescription || error || 'Instagram OAuth failed',
    })
    return
  }

  if (code.length === 0) {
    postInstagramOAuthResult({
      type: 'INSTAGRAM_OAUTH_ERROR',
      error: 'No authorization code received',
    })
    return
  }

  postInstagramOAuthResult({
    type: 'INSTAGRAM_OAUTH_SUCCESS',
    code,
  })
}