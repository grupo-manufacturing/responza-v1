import {
  getInstagramAppId,
  getInstagramOAuthAllowedOrigins,
  getInstagramRedirectUri,
  isInstagramOAuthConfigured,
} from '@/shared/config/env'
import { postOAuthResultToOpener, waitForOAuthPopupCode } from '@/features/integrations/lib/oauthPopup'

export async function startInstagramOAuth(): Promise<{ code: string }> {
  if (!isInstagramOAuthConfigured()) {
    throw new Error('Instagram OAuth is not configured for this app')
  }

  const authUrl = new URL('https://www.instagram.com/oauth/authorize')
  authUrl.searchParams.set('client_id', getInstagramAppId())
  authUrl.searchParams.set('redirect_uri', getInstagramRedirectUri())
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('scope', 'instagram_business_basic,instagram_business_manage_messages')
  authUrl.searchParams.set('force_reauth', 'true')

  const result = await waitForOAuthPopupCode({
    authUrl: authUrl.toString(),
    windowName: 'instagram_oauth',
    allowedOrigins: getInstagramOAuthAllowedOrigins(),
    successType: 'INSTAGRAM_OAUTH_SUCCESS',
    errorType: 'INSTAGRAM_OAUTH_ERROR',
    canceledMessage: 'Instagram OAuth was canceled',
  })

  return { code: result.code }
}

export function handleInstagramOAuthCallback(): void {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')?.replace(/#_$/, '').trim() ?? ''
  const error = urlParams.get('error')
  const errorDescription = urlParams.get('error_description')

  if (error) {
    postOAuthResultToOpener({
      type: 'INSTAGRAM_OAUTH_ERROR',
      error: errorDescription || error || 'Instagram OAuth failed',
    })
    return
  }

  if (code.length === 0) {
    postOAuthResultToOpener({
      type: 'INSTAGRAM_OAUTH_ERROR',
      error: 'No authorization code received',
    })
    return
  }

  postOAuthResultToOpener({
    type: 'INSTAGRAM_OAUTH_SUCCESS',
    code,
  })
}
