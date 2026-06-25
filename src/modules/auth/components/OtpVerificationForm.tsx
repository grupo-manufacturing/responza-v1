import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { AuthService } from '@/modules/auth/auth.service'
import { completeAuthSession } from '@/modules/auth/lib/completeAuthSession'
import { Spinner } from '@/components/ui/Spinner'
import { getApiErrorMessage } from '@/shared/utils/api-error'

const inputClassName =
  'w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition-all duration-200 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10'

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

  const from = state.from?.pathname || '/dashboard'

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
      const response = await AuthService.verifyOtp({ email, token: otp.trim() })
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
    <div className="relative w-full max-w-sm">
      <div className="mb-5 text-center">
        <Link to="/" className="mb-3 inline-flex items-center gap-2 transition-opacity hover:opacity-70">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900 text-sm font-bold text-white shadow-md">
            R
          </div>
          <span className="text-lg font-semibold text-neutral-900">Responza AI</span>
        </Link>

        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Verify your email</h1>
        <p className="mt-1 text-sm text-neutral-500">
          We sent a 6-digit code to <span className="font-medium text-neutral-700">{email}</span>
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-lg shadow-neutral-900/5">
        {error && (
          <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-2.5">
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        {resendMessage && (
          <div className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 p-2.5">
            <p className="text-xs text-emerald-700">{resendMessage}</p>
          </div>
        )}

        <form onSubmit={(e) => void handleVerify(e)} className="space-y-3">
          <div>
            <label htmlFor="otp" className="mb-1.5 block text-xs font-medium text-neutral-700">
              Verification code
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className={`${inputClassName} text-center text-lg tracking-[0.3em]`}
              placeholder="000000"
              maxLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="mt-3 w-full rounded-lg bg-neutral-900 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner size="sm" variant="white" />
                Verifying...
              </span>
            ) : (
              'Verify and continue'
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-neutral-500">
            Didn&apos;t receive the code?{' '}
            <button
              type="button"
              onClick={() => void handleResend()}
              disabled={cooldown > 0 || isResending}
              className="font-semibold text-neutral-900 underline-offset-2 transition-colors hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isResending ? 'Sending...' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
            </button>
          </p>
        </div>
      </div>

      <div className="mt-4 text-center">
        <Link to="/auth?mode=login" className="text-xs text-neutral-500 transition-colors hover:text-neutral-900">
          ← Back to sign in
        </Link>
      </div>
    </div>
  )
}
