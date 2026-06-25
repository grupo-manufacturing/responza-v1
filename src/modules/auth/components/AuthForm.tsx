import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { AuthService } from '@/modules/auth/auth.service'
import type { AuthFormData } from '@/modules/auth/auth.types'
import { Spinner } from '@/components/ui/Spinner'
import { SessionStorage } from '@/shared/session/storage'
import { getApiErrorMessage } from '@/shared/utils/api-error'

const inputClassName =
  'w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition-all duration-200 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10'

export function AuthForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const mode = searchParams.get('mode')
  const [isLogin, setIsLogin] = useState(mode !== 'register')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    name: '',
  })

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard'

  const completeSignIn = (response: Awaited<ReturnType<typeof AuthService.login>>) => {
    SessionStorage.saveTokens(response.accessToken, response.refreshToken)
    SessionStorage.saveSessionProfile(response)

    if (!response.businessDetails.completed) {
      navigate('/business', { replace: true })
    } else {
      navigate(from, { replace: true })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (isLogin) {
        const response = await AuthService.login({ email: formData.email, password: formData.password })
        completeSignIn(response)
        return
      }

      const response = await AuthService.register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      })
      completeSignIn(response)
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Something went wrong. Please try again.'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const toggleMode = () => {
    const newMode = isLogin ? 'register' : 'login'
    setIsLogin(!isLogin)
    setError(null)
    setFormData({ email: '', password: '', name: '' })
    navigate(`/auth?mode=${newMode}`, { replace: true })
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

        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          {isLogin ? 'Sign in to your workspace' : (
            <>Create your <span className="text-neutral-500">account</span></>
          )}
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          {isLogin ? 'Pick up where you left off.' : 'Start managing your sales leads in one place.'}
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-lg shadow-neutral-900/5">
        <div className="mb-4 flex rounded-xl bg-neutral-100 p-1">
          <button
            type="button"
            onClick={() => !isLogin && toggleMode()}
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 ${
              isLogin
                ? 'bg-white text-neutral-900 shadow-sm ring-1 ring-neutral-200'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => isLogin && toggleMode()}
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 ${
              !isLogin
                ? 'bg-white text-neutral-900 shadow-sm ring-1 ring-neutral-200'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Sign up
          </button>
        </div>

        {error && (
          <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-2.5">
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-3">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-neutral-700">
                Organization name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required={!isLogin}
                value={formData.name}
                onChange={handleInputChange}
                className={inputClassName}
                placeholder="Your company name"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-neutral-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className={inputClassName}
              placeholder="you@company.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-neutral-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className={inputClassName}
              placeholder={isLogin ? 'Enter password' : 'Min 8 characters'}
              minLength={isLogin ? 1 : 8}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-3 w-full rounded-lg bg-neutral-900 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner size="sm" variant="white" />
                {isLogin ? 'Signing in...' : 'Creating...'}
              </span>
            ) : isLogin ? (
              'Sign in'
            ) : (
              'Create account'
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-neutral-500">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={toggleMode}
              className="font-semibold text-neutral-900 underline-offset-2 transition-colors hover:underline"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        {!isLogin && (
          <p className="mt-3 text-center text-[10px] leading-tight text-neutral-400">
            By creating an account, you agree to our Terms & Privacy Policy
          </p>
        )}
      </div>

      <div className="mt-4 text-center">
        <Link to="/" className="text-xs text-neutral-500 transition-colors hover:text-neutral-900">
          ← Back to home
        </Link>
      </div>
    </div>
  )
}
