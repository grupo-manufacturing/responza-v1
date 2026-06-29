import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Spinner } from '@/components/ui/Spinner'
import { AuthService } from '@/modules/auth/auth.service'
import { completeAuthSession } from '@/modules/auth/lib/completeAuthSession'
import {
  exchangeGoogleOAuthCode,
  readGoogleOAuthCallbackCode,
  readGoogleOAuthCallbackError,
  readGoogleOAuthNextPath,
} from '@/modules/auth/lib/googleOAuth'
import { getApiErrorMessage } from '@/shared/utils/api-error'

import { AuthCard, AuthLayout, AuthPrimaryButton } from '../auth-ui'

export function GoogleOAuthCallbackPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const hasHandledCallback = useRef(false)

  useEffect(() => {
    if (hasHandledCallback.current) {
      return
    }
    hasHandledCallback.current = true

    const oauthError = readGoogleOAuthCallbackError()
    if (oauthError !== null) {
      setError(oauthError)
      return
    }

    const code = readGoogleOAuthCallbackCode()
    if (code === null) {
      setError('Google sign-in was canceled or did not return an authorization code.')
      return
    }

    const nextPath = readGoogleOAuthNextPath()

    void (async () => {
      try {
        const tokens = await exchangeGoogleOAuthCode(code)
        const session = await AuthService.completeOAuth(tokens)
        window.history.replaceState({}, document.title, '/auth/google/callback')
        completeAuthSession(session, navigate, nextPath)
      } catch (err: unknown) {
        setError(getApiErrorMessage(err, 'Could not complete Google sign-in. Please try again.'))
      }
    })()
  }, [navigate])

  if (error !== null) {
    return (
      <AuthLayout>
        <AuthCard>
          <div className="text-center">
            <h1 className="text-lg font-semibold text-ink">Google sign-in failed</h1>
            <p className="mt-2 text-sm text-red-600">{error}</p>
            <AuthPrimaryButton type="button" onClick={() => navigate('/auth?mode=login', { replace: true })}>
              Back to sign in
            </AuthPrimaryButton>
          </div>
        </AuthCard>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div className="text-center">
        <Spinner size="lg" />
        <h1 className="mt-4 text-lg font-semibold text-ink">Completing Google sign-in...</h1>
        <p className="mt-1 text-sm text-ink-muted">Please wait while we set up your workspace.</p>
      </div>
    </AuthLayout>
  )
}
