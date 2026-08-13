import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { completeAuthSession } from '@/features/auth/lib/completeAuthSession'
import { handleGoogleOAuthCallback } from '@/features/auth/lib/googleOAuth'
import { getApiErrorMessage } from '@/shared/utils/api-error'
import { sanitizePostAuthDestination } from '@/shared/utils/subscription-access'
import { SessionStorage } from '@/shared/session/storage'
import { BrandMark } from '@/shared/ui/brand-ui'

import { AuthCard, AuthLayout, AuthPrimaryButton } from '@/features/auth/components/auth-ui'

const STATUS_LINES = ['Signing you in…', 'Preparing your workspace…', 'Almost ready…'] as const

function SigningInVisual() {
  const [statusIndex, setStatusIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % STATUS_LINES.length)
    }, 1600)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="animate-step-in text-center">
      <div className="relative mx-auto mb-8 flex h-28 w-28 items-center justify-center">
        <span className="absolute inset-0 animate-pulse-soft rounded-full border border-accent/25" aria-hidden />
        <span
          className="absolute inset-3 animate-pulse-soft rounded-full border border-accent-warm/30"
          style={{ animationDelay: '0.4s' }}
          aria-hidden
        />
        <span
          className="absolute inset-6 animate-pulse-soft rounded-full bg-accent/10 blur-md"
          style={{ animationDelay: '0.8s' }}
          aria-hidden
        />
        <div className="relative animate-float-gentle">
          <div className="scale-125">
            <BrandMark size="md" />
          </div>
        </div>
      </div>

      <h1 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
        {STATUS_LINES[statusIndex]}
      </h1>
      <p className="mt-2 text-sm text-ink-muted">Hang tight — this only takes a moment.</p>

      <div className="mx-auto mt-6 h-1 w-40 overflow-hidden rounded-full bg-border">
        <div className="h-full w-1/2 animate-[shimmer_1.4s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-accent via-accent-warm to-accent-violet" />
      </div>
    </div>
  )
}

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
        setError(getApiErrorMessage(err, 'Could not complete sign-in. Please try again.'))
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
            <h1 className="text-lg font-semibold text-ink">Sign-in failed</h1>
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
      <SigningInVisual />
    </AuthLayout>
  )
}
