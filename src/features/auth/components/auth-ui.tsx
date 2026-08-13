import { Link } from 'react-router-dom'
import { useRef, useState } from 'react'

import { APP_INPUT_CLASS, AppFlowLayout } from '@/shared/ui/app-ui'
import { LandingLogo } from '@/shared/ui/brand-ui'

export const AUTH_INPUT_CLASS = APP_INPUT_CLASS

export function AuthLayout({ children }: { readonly children: React.ReactNode }) {
  return <AppFlowLayout compact>{children}</AppFlowLayout>
}

export function AuthHeader({
  title,
  description,
}: {
  readonly title: React.ReactNode
  readonly description?: React.ReactNode
}) {
  return (
    <div className="mb-4 text-center">
      <div className="mb-3 flex justify-center">
        <LandingLogo variant="light" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{title}</h1>
      {description ? <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{description}</p> : null}
    </div>
  )
}

export function AuthCard({ children }: { readonly children: React.ReactNode }) {
  return (
    <div className="glass-light rounded-[var(--radius-card-lg)] border border-border p-5 shadow-card sm:p-6">
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
    <div className="mb-4 flex rounded-[var(--radius-pill)] border border-border bg-surface-muted/80 p-1">
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
      className="mt-3 flex w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-ink py-2.5 text-sm font-semibold text-on-dark transition-all duration-200 hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  )
}

export function AuthDivider() {
  return (
    <div className="relative my-3.5">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-white/80 px-2 text-ink-faint">or</span>
      </div>
    </div>
  )
}

export function AuthBackChevron({
  to,
  label,
}: {
  readonly to: string
  readonly label: string
}) {
  return (
    <Link
      to={to}
      aria-label={label}
      className="fixed top-4 left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-white text-4xl leading-none text-ink shadow-soft transition-all duration-200 hover:bg-surface-muted"
    >
      ‹
    </Link>
  )
}

export const AUTH_OTP_LENGTH = 6

export function AuthOtpInputs({
  value,
  onChange,
  disabled = false,
}: {
  readonly value: string
  readonly onChange: (value: string) => void
  readonly disabled?: boolean
}) {
  const refs = useRef<Array<HTMLInputElement | null>>([])
  const digits = Array.from({ length: AUTH_OTP_LENGTH }, (_, i) => value[i] ?? '')

  const focusAt = (index: number) => {
    refs.current[index]?.focus()
  }

  const writeDigits = (next: string[]) => {
    onChange(next.join('').slice(0, AUTH_OTP_LENGTH))
  }

  const handleChange = (index: number, raw: string) => {
    const cleaned = raw.replace(/\D/g, '')
    if (cleaned.length === 0) {
      const next = [...digits]
      next[index] = ''
      writeDigits(next)
      return
    }

    if (cleaned.length > 1) {
      const next = [...digits]
      const chars = cleaned.slice(0, AUTH_OTP_LENGTH - index).split('')
      chars.forEach((char, offset) => {
        next[index + offset] = char
      })
      writeDigits(next)
      focusAt(Math.min(index + chars.length, AUTH_OTP_LENGTH - 1))
      return
    }

    const next = [...digits]
    next[index] = cleaned
    writeDigits(next)
    if (index < AUTH_OTP_LENGTH - 1) focusAt(index + 1)
  }

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && digits[index] === '' && index > 0) {
      event.preventDefault()
      const next = [...digits]
      next[index - 1] = ''
      writeDigits(next)
      focusAt(index - 1)
    }
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, AUTH_OTP_LENGTH)
    if (pasted.length === 0) return
    onChange(pasted)
    focusAt(Math.min(pasted.length, AUTH_OTP_LENGTH) - 1)
  }

  return (
    <div className="flex justify-center gap-2 sm:gap-2.5" role="group" aria-label="Verification code">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            refs.current[index] = el
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          aria-label={`Digit ${index + 1}`}
          disabled={disabled}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className="h-12 w-10 rounded-xl border border-border bg-white text-center text-lg font-semibold text-ink shadow-soft outline-none transition-all focus:border-ink focus:ring-2 focus:ring-ink/10 disabled:opacity-50 sm:h-14 sm:w-12 sm:text-xl"
        />
      ))}
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

function PasswordVisibilityIcon({ visible }: { readonly visible: boolean }) {
  if (visible) {
    return (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858 3.03a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
        />
      </svg>
    )
  }

  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  )
}

export function AuthPasswordInput({
  id,
  name,
  value,
  onChange,
  placeholder,
  minLength,
  required = true,
  autoComplete,
}: {
  readonly id: string
  readonly name: string
  readonly value: string
  readonly onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  readonly placeholder?: string
  readonly minLength?: number
  readonly required?: boolean
  readonly autoComplete?: string
}) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={visible ? 'text' : 'password'}
        required={required}
        value={value}
        onChange={onChange}
        className={`${AUTH_INPUT_CLASS} pr-10`}
        placeholder={placeholder}
        minLength={minLength}
        autoComplete={autoComplete}
      />
      <button
        type="button"
        onClick={() => setVisible((prev) => !prev)}
        className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-1 text-ink-faint transition-colors hover:text-ink"
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        <PasswordVisibilityIcon visible={visible} />
      </button>
    </div>
  )
}
