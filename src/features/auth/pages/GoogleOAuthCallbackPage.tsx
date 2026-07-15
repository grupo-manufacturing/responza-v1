import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Spinner } from '@/shared/ui/primitives/Spinner'
import { completeAuthSession } from '@/features/auth/lib/completeAuthSession'
import { handleGoogleOAuthCallback } from '@/features/auth/lib/googleOAuth'
import { getApiErrorMessage } from '@/shared/utils/api-error'
import { sanitizePostAuthDestination } from '@/shared/utils/subscription-access'
import { SessionStorage } from '@/shared/session/storage'

import { AuthCard, AuthLayout, AuthPrimaryButton } from '@/features/auth/components/auth-ui'

export function GoogleOAuthCallbackPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      const result = await handleGoogleOAuthCallback()

      if (cancelled) {
        return
      }

      if (result.kind === 'waiting') {
        return
      }

      if (result.kind === 'redirect') {
        const destination = sanitizePostAuthDestination(
          result.nextPath,
          SessionStorage.getStoredSubscription(),
        )
        navigate(destination, { replace: true })
        return
      }

      completeAuthSession(result.session, navigate, result.nextPath)
    }

    void run().catch((err: unknown) => {
      if (!cancelled) {
        setError(getApiErrorMessage(err, 'Could not complete Google sign-in. Please try again.'))
      }
    })

    return () => {
      cancelled = true
    }
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
