import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { AuthService } from '@/modules/auth/auth.service'
import { completeSupabaseAuthRedirect } from '@/modules/auth/lib/supabaseAuthRedirect'
import { Spinner } from '@/components/ui/Spinner'
import { SessionStorage } from '@/shared/session/storage'
import { getApiErrorMessage } from '@/shared/utils/api-error'

export function VerifyEmailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    void (async () => {
      try {
        const oauthSession = await completeSupabaseAuthRedirect()
        SessionStorage.saveTokens(oauthSession.accessToken, oauthSession.refreshToken)

        const me = await AuthService.getMe()
        if (cancelled) {
          return
        }

        SessionStorage.saveSessionProfile(me)

        const from = (location.state as { from?: { pathname: string } })?.from?.pathname
        if (!me.businessDetails.completed) {
          navigate('/business', { replace: true })
          return
        }

        navigate(from ?? '/dashboard', { replace: true })
      } catch (err: unknown) {
        if (!cancelled) {
          setError(getApiErrorMessage(err, 'Email verification failed. Please try again.'))
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [location.state, navigate])

  if (error !== null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-4">
        <div className="max-w-sm rounded-2xl border border-red-200 bg-white p-6 text-center shadow-lg">
          <h1 className="text-lg font-semibold text-neutral-900">Email verification failed</h1>
          <p className="mt-2 text-sm text-red-600">{error}</p>
          <button
            type="button"
            onClick={() => navigate('/auth?mode=login', { replace: true })}
            className="mt-4 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white"
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
        <Spinner size="lg" className="mx-auto mb-4" />
        <h1 className="text-xl font-semibold text-neutral-900">Verifying your email...</h1>
        <p className="mt-2 text-sm text-neutral-500">Please wait while we finish setting up your account.</p>
      </div>
    </div>
  )
}
