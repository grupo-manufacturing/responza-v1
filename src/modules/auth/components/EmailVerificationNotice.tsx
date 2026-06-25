import { useState } from 'react'
import { Link } from 'react-router-dom'

import { AuthService } from '@/modules/auth/auth.service'
import { Spinner } from '@/components/ui/Spinner'
import { getApiErrorMessage } from '@/shared/utils/api-error'

type EmailVerificationNoticeProps = {
  readonly email: string
  readonly onBackToSignIn: () => void
}

export function EmailVerificationNotice({ email, onBackToSignIn }: EmailVerificationNoticeProps) {
  const [isResending, setIsResending] = useState(false)
  const [resendMessage, setResendMessage] = useState<string | null>(null)
  const [resendError, setResendError] = useState<string | null>(null)

  const handleResend = async () => {
    setIsResending(true)
    setResendMessage(null)
    setResendError(null)

    try {
      await AuthService.resendVerificationEmail(email)
      setResendMessage('Verification email sent. Please check your inbox.')
    } catch (err: unknown) {
      setResendError(getApiErrorMessage(err, 'Failed to resend verification email.'))
    } finally {
      setIsResending(false)
    }
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

        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Check your email</h1>
        <p className="mt-1 text-sm text-neutral-500">
          We sent a verification link to <span className="font-medium text-neutral-800">{email}</span>
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-lg shadow-neutral-900/5">
        <p className="text-sm text-neutral-600">
          Click the link in the email to verify your account. After that, you can sign in.
        </p>

        {resendMessage !== null && (
          <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-2.5">
            <p className="text-xs text-emerald-700">{resendMessage}</p>
          </div>
        )}

        {resendError !== null && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-2.5">
            <p className="text-xs text-red-600">{resendError}</p>
          </div>
        )}

        <button
          type="button"
          onClick={() => void handleResend()}
          disabled={isResending}
          className="mt-4 w-full rounded-lg border border-neutral-200 bg-white py-2.5 text-sm font-semibold text-neutral-900 transition-all duration-200 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isResending ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner size="sm" />
              Resending...
            </span>
          ) : (
            'Resend verification email'
          )}
        </button>

        <button
          type="button"
          onClick={onBackToSignIn}
          className="mt-3 text-sm font-semibold text-neutral-900 underline-offset-2 hover:underline"
        >
          Back to sign in
        </button>
      </div>
    </div>
  )
}
