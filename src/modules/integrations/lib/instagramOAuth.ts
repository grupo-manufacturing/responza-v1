import {
  getInstagramAppId,
  getInstagramOAuthAllowedOrigins,
  getInstagramRedirectUri,
  isInstagramOAuthConfigured,
} from '@/shared/config/env'

let oauthPopup: Window | null = null
let oauthResolve: ((result: { code: string }) => void) | null = null
let oauthReject: ((error: Error) => void) | null = null

function bindInstagramOAuthListener(): void {
  const allowedOrigins = getInstagramOAuthAllowedOrigins()

  window.addEventListener('message', (event) => {
    if (!event.origin || !allowedOrigins.includes(event.origin)) {
      return
    }

    try {
      const payload = typeof event.data === 'object' ? event.data : null
      if (payload?.type === 'INSTAGRAM_OAUTH_SUCCESS') {
        if (oauthResolve) {
          oauthResolve({ code: payload.code })
          oauthResolve = null
          oauthReject = null
        }
      } else if (payload?.type === 'INSTAGRAM_OAUTH_ERROR') {
        if (oauthReject) {
          oauthReject(new Error(payload.error || 'Instagram OAuth failed'))
          oauthResolve = null
          oauthReject = null
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
          oauthResolve = null
          oauthReject = null
        }
      }
    }, 1000)
  })
}

export function handleInstagramOAuthCallback(): void {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  const error = urlParams.get('error')
  const errorDescription = urlParams.get('error_description')

  if (error) {
    window.opener?.postMessage({
      type: 'INSTAGRAM_OAUTH_ERROR',
      error: errorDescription || error || 'Instagram OAuth failed'
    }, window.location.origin)
    window.close()
    return
  }

  if (!code) {
    window.opener?.postMessage({
      type: 'INSTAGRAM_OAUTH_ERROR',
      error: 'No authorization code received'
    }, window.location.origin)
    window.close()
    return
  }

  window.opener?.postMessage({
    type: 'INSTAGRAM_OAUTH_SUCCESS',
    code
  }, window.location.origin)
  
  window.close()
}