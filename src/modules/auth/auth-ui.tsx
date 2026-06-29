import { Link } from 'react-router-dom'

import { LandingLogo } from '@/modules/landing/landing-ui'

export const AUTH_INPUT_CLASS =
  'w-full rounded-xl border border-border bg-white/90 px-3.5 py-2.5 text-sm text-ink outline-none transition-all duration-200 placeholder:text-ink-faint focus:border-accent focus:ring-2 focus:ring-accent/15'

export function AuthLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <div className="bg-hero-gradient bg-grid-light relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
      <div
        className="pointer-events-none absolute top-1/4 -left-24 h-72 w-72 rounded-full bg-accent-soft/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-0 bottom-1/4 h-80 w-80 rounded-full bg-accent-warm/15 blur-3xl"
        aria-hidden
      />
      <div className="relative w-full max-w-md">{children}</div>
    </div>
  )
}

export function AuthHeader({
  title,
  description,
}: {
  readonly title: React.ReactNode
  readonly description: React.ReactNode
}) {
  return (
    <div className="mb-6 text-center">
      <div className="mb-4 flex justify-center">
        <LandingLogo variant="light" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{description}</p>
    </div>
  )
}

export function AuthCard({ children }: { readonly children: React.ReactNode }) {
  return (
    <div className="glass-light rounded-[var(--radius-card-lg)] border border-border p-6 shadow-card sm:p-8">
      {children}
    </div>
  )
}

export function AuthAlert({
  variant,
  children,
}: {
  readonly variant: 'error' | 'success'
  readonly children: React.ReactNode
}) {
  const className =
    variant === 'error'
      ? 'border-red-200/80 bg-red-50 text-red-700'
      : 'border-emerald-200/80 bg-emerald-50 text-emerald-800'

  return <p className={`mb-4 rounded-xl border px-3.5 py-2.5 text-xs sm:text-sm ${className}`}>{children}</p>
}

export function AuthModeToggle({
  isLogin,
  onSelectLogin,
  onSelectRegister,
}: {
  readonly isLogin: boolean
  readonly onSelectLogin: () => void
  readonly onSelectRegister: () => void
}) {
  return (
    <div className="mb-5 flex rounded-[var(--radius-pill)] border border-border bg-surface-muted/80 p-1">
      <button
        type="button"
        onClick={onSelectLogin}
        className={[
          'flex-1 rounded-[var(--radius-pill)] px-3 py-2 text-xs font-semibold transition-all duration-200',
          isLogin ? 'bg-ink text-on-dark shadow-soft' : 'text-ink-muted hover:text-ink',
        ].join(' ')}
      >
        Sign in
      </button>
      <button
        type="button"
        onClick={onSelectRegister}
        className={[
          'flex-1 rounded-[var(--radius-pill)] px-3 py-2 text-xs font-semibold transition-all duration-200',
          !isLogin ? 'bg-ink text-on-dark shadow-soft' : 'text-ink-muted hover:text-ink',
        ].join(' ')}
      >
        Sign up
      </button>
    </div>
  )
}

export function AuthPrimaryButton({
  children,
  disabled,
  type = 'submit',
  onClick,
}: {
  readonly children: React.ReactNode
  readonly disabled?: boolean
  readonly type?: 'submit' | 'button'
  readonly onClick?: () => void
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="mt-4 flex w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-ink py-2.5 text-sm font-semibold text-on-dark transition-all duration-200 hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  )
}

export function AuthDivider() {
  return (
    <div className="relative my-5">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-white/80 px-2 text-ink-faint">or</span>
      </div>
    </div>
  )
}

export function AuthBackLink({ to, children }: { readonly to: string; readonly children: React.ReactNode }) {
  return (
    <div className="mt-5 text-center">
      <Link to={to} className="text-xs text-ink-muted transition-colors hover:text-ink">
        {children}
      </Link>
    </div>
  )
}

export function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}
