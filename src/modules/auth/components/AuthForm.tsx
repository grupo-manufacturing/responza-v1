import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Spinner } from '@/components/ui/Spinner'
import { SectionBadge } from '@/modules/landing/landing-ui'
import { AuthService } from '@/modules/auth/auth.service'
import { isRegisterPending } from '@/modules/auth/auth.types'
import type { AuthFormData } from '@/modules/auth/auth.types'
import { completeAuthSession } from '@/modules/auth/lib/completeAuthSession'
import { isGoogleAuthConfigured, startGoogleOAuth } from '@/modules/auth/lib/googleOAuth'
import { getApiErrorMessage, isEmailNotVerifiedError } from '@/shared/utils/api-error'

import {
  AUTH_INPUT_CLASS,
  AuthAlert,
  AuthBackLink,
  AuthCard,
  AuthDivider,
  AuthHeader,
  AuthModeToggle,
  AuthPrimaryButton,
  GoogleIcon,
} from '../auth-ui'

export function AuthForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const mode = searchParams.get('mode')
  const [isLogin, setIsLogin] = useState(mode !== 'register')
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const googleAuthEnabled = isGoogleAuthConfigured()
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    name: '',
  })

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (isLogin) {
        const response = await AuthService.login({ email: formData.email, password: formData.password })
        completeAuthSession(response, navigate, from)
        return
      }

      const response = await AuthService.register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      })

      if (isRegisterPending(response)) {
        navigate('/auth/verify', {
          replace: true,
          state: { email: response.email, from: { pathname: from } },
        })
        return
      }

      completeAuthSession(response, navigate, from)
    } catch (err: unknown) {
      if (isLogin && isEmailNotVerifiedError(err)) {
        navigate('/auth/verify', {
          replace: true,
          state: { email: formData.email, from: { pathname: from } },
        })
        return
      }

      setError(getApiErrorMessage(err, 'Something went wrong. Please try again.'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const switchToLogin = () => {
    if (isLogin) return
    setIsLogin(true)
    setError(null)
    setFormData({ email: '', password: '', name: '' })
    navigate('/auth?mode=login', { replace: true })
  }

  const switchToRegister = () => {
    if (!isLogin) return
    setIsLogin(false)
    setError(null)
    setFormData({ email: '', password: '', name: '' })
    navigate('/auth?mode=register', { replace: true })
  }

  const toggleMode = () => {
    if (isLogin) switchToRegister()
    else switchToLogin()
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    setError(null)

    try {
      await startGoogleOAuth(from)
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Could not start Google sign-in. Please try again.'))
      setIsGoogleLoading(false)
    }
  }

  const isBusy = isLoading || isGoogleLoading

  return (
    <>
      <AuthHeader
        title={
          isLogin ? (
            <>
              Sign in to your <span className="text-accent-gradient">workspace</span>
            </>
          ) : (
            <>
              Create your <span className="text-accent-gradient">account</span>
            </>
          )
        }
        description={
          isLogin
            ? 'Pick up where you left off.'
            : 'Start managing WhatsApp and Instagram conversations in one place.'
        }
      />

      <AuthCard>
        <AuthModeToggle isLogin={isLogin} onSelectLogin={switchToLogin} onSelectRegister={switchToRegister} />

        {error && <AuthAlert variant="error">{error}</AuthAlert>}

        {googleAuthEnabled && (
          <>
            <button
              type="button"
              onClick={() => void handleGoogleSignIn()}
              disabled={isBusy}
              className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] border border-border bg-white py-2.5 text-sm font-medium text-ink transition-all duration-200 hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isGoogleLoading ? (
                <>
                  <Spinner size="sm" />
                  Redirecting to Google...
                </>
              ) : (
                <>
                  <GoogleIcon />
                  Continue with Google
                </>
              )}
            </button>
            <AuthDivider />
          </>
        )}

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-3.5">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-ink-muted">
                Organization name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required={!isLogin}
                value={formData.name}
                onChange={handleInputChange}
                className={AUTH_INPUT_CLASS}
                placeholder="Your company name"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-ink-muted">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className={AUTH_INPUT_CLASS}
              placeholder="you@company.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-ink-muted">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className={AUTH_INPUT_CLASS}
              placeholder={isLogin ? 'Enter password' : 'Min 8 characters'}
              minLength={isLogin ? 1 : 8}
            />
          </div>

          {!isLogin && (
            <div className="flex justify-center pt-1">
              <SectionBadge variant="light" tone="teal">
                7-day free trial on Basic
              </SectionBadge>
            </div>
          )}

          <AuthPrimaryButton disabled={isBusy}>
            {isLoading ? (
              <>
                <Spinner size="sm" variant="white" />
                {isLogin ? 'Signing in...' : 'Creating...'}
              </>
            ) : isLogin ? (
              'Sign in'
            ) : (
              'Create account'
            )}
          </AuthPrimaryButton>
        </form>

        <div className="mt-5 text-center">
          <p className="text-xs text-ink-muted">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={toggleMode}
              className="font-semibold text-ink underline-offset-2 transition-colors hover:underline"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        {!isLogin && (
          <p className="mt-3 text-center text-[10px] leading-relaxed text-ink-faint">
            By creating an account, you agree to our Terms & Privacy Policy
          </p>
        )}
      </AuthCard>

      <AuthBackLink to="/">← Back to home</AuthBackLink>
    </>
  )
}
