import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AuthService } from '@/modules/auth/auth.service'
import { completeAuthSession } from '@/modules/auth/lib/completeAuthSession'
import {
  exchangeGoogleOAuthCode,
  readGoogleOAuthCallbackCode,
  readGoogleOAuthCallbackError,
  readGoogleOAuthNextPath,
} from '@/modules/auth/lib/googleOAuth'
import { Spinner } from '@/components/ui/Spinner'
import { getApiErrorMessage } from '@/shared/utils/api-error'

export function GoogleOAuthCallbackPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
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
        completeAuthSession(session, navigate, nextPath)
      } catch (err: unknown) {
        setError(getApiErrorMessage(err, 'Could not complete Google sign-in. Please try again.'))
      }
    })()
  }, [navigate])

  if (error !== null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-4">
        <div className="w-full max-w-sm rounded-2xl border border-red-200 bg-white p-6 text-center shadow-lg">
          <h1 className="text-lg font-semibold text-neutral-900">Google sign-in failed</h1>
          <p className="mt-2 text-sm text-red-600">{error}</p>
          <button
            type="button"
            onClick={() => navigate('/auth?mode=login', { replace: true })}
            className="mt-4 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
          >
            Back to sign in
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50">
      <div className="text-center">
        <Spinner size="lg" />
        <h1 className="mt-4 text-lg font-semibold text-neutral-900">Completing Google sign-in...</h1>
        <p className="mt-1 text-sm text-neutral-500">Please wait while we set up your workspace.</p>
      </div>
    </div>
  )
}
