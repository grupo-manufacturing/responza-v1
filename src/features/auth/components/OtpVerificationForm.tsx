import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Spinner } from '@/shared/ui/primitives/Spinner'
import { AuthService } from '@/features/auth/api/auth.service'
import { completeAuthSession } from '@/features/auth/lib/completeAuthSession'
import { getApiErrorMessage } from '@/shared/utils/api-error'
import { resolveDefaultAppPath } from '@/shared/utils/subscription-access'

import {
  AUTH_OTP_LENGTH,
  AuthAlert,
  AuthBackChevron,
  AuthCard,
  AuthHeader,
  AuthOtpInputs,
  AuthPrimaryButton,
} from '@/features/auth/components/auth-ui'

const RESEND_COOLDOWN_SECONDS = 60

type VerifyLocationState = {
  email?: string
  from?: { pathname: string }
}

export function OtpVerificationForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state as VerifyLocationState | null) ?? {}
  const email = state.email ?? ''

  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resendMessage, setResendMessage] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(0)

  const from = state.from?.pathname || resolveDefaultAppPath(null)

  useEffect(() => {
    if (email.length === 0) {
      navigate('/auth?mode=register', { replace: true })
    }
  }, [email, navigate])

  useEffect(() => {
    if (cooldown <= 0) return

    const timer = window.setTimeout(() => {
      setCooldown((value) => value - 1)
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [cooldown])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setResendMessage(null)

    try {
      const response = await AuthService.verifyOtp({ email, token: otp })
      completeAuthSession(response, navigate, from)
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Invalid or expired code. Please try again.'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return

    setIsResending(true)
    setError(null)
    setResendMessage(null)

    try {
      await AuthService.resendOtp({ email })
      setResendMessage('A new verification code has been sent to your email.')
      setCooldown(RESEND_COOLDOWN_SECONDS)
      setOtp('')
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Could not resend code. Please try again.'))
    } finally {
      setIsResending(false)
    }
  }

  if (email.length === 0) {
    return null
  }

  return (
    <>
      <AuthBackChevron to="/auth?mode=login" label="Back to sign in" />

      <AuthHeader
        title={
          <>
            Verify your <span className="text-accent-gradient">email</span>
          </>
        }
        description={
          <>
            We sent a verification code to{' '}
            <span className="font-medium text-ink">{email}</span>
          </>
        }
      />

      <AuthCard>
        {error && <AuthAlert variant="error">{error}</AuthAlert>}
        {resendMessage && <AuthAlert variant="success">{resendMessage}</AuthAlert>}

        <form onSubmit={(e) => void handleVerify(e)} className="space-y-3">
          <div>
            <label className="mb-2 block text-center text-xs font-medium text-ink-muted">
              Verification code
            </label>
            <AuthOtpInputs value={otp} onChange={setOtp} disabled={isLoading} />
          </div>

          <AuthPrimaryButton disabled={isLoading || otp.length !== AUTH_OTP_LENGTH}>
            {isLoading ? (
              <>
                <Spinner size="sm" variant="white" />
                Verifying...
              </>
            ) : (
              'Verify and continue'
            )}
          </AuthPrimaryButton>
        </form>

        <div className="mt-3 text-center">
          <p className="text-xs text-ink-muted">
            Didn&apos;t receive the code?{' '}
            <button
              type="button"
              onClick={() => void handleResend()}
              disabled={cooldown > 0 || isResending}
              className="font-semibold text-ink underline-offset-2 transition-colors hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isResending ? 'Sending...' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
            </button>
          </p>
        </div>
      </AuthCard>
    </>
  )
}
