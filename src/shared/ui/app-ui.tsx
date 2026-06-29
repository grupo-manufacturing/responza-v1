import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export const APP_INPUT_CLASS =
  'w-full rounded-xl border border-border bg-white/90 px-3.5 py-2.5 text-sm text-ink outline-none transition-all duration-200 placeholder:text-ink-faint focus:border-accent focus:ring-2 focus:ring-accent/15'

export const APP_TEXTAREA_CLASS = `${APP_INPUT_CLASS} resize-none leading-relaxed`

const BUTTON_BASE =
  'inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50'

const BUTTON_VARIANT_CLASS = {
  primary: 'bg-ink px-5 py-2.5 text-on-dark hover:bg-ink/90 hover:shadow-soft',
  secondary: 'border border-border bg-white px-5 py-2.5 text-ink hover:bg-surface-muted',
  ghost: 'px-3 py-2 text-ink-muted hover:bg-surface-muted hover:text-ink',
} as const

type ButtonVariant = keyof typeof BUTTON_VARIANT_CLASS

export function AppButton({
  children,
  variant = 'primary',
  type = 'button',
  disabled,
  onClick,
  className = '',
}: {
  readonly children: ReactNode
  readonly variant?: ButtonVariant
  readonly type?: 'button' | 'submit'
  readonly disabled?: boolean
  readonly onClick?: () => void
  readonly className?: string
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[BUTTON_BASE, BUTTON_VARIANT_CLASS[variant], className].join(' ')}
    >
      {children}
    </button>
  )
}

export function AppButtonLink({
  to,
  children,
  variant = 'primary',
  className = '',
}: {
  readonly to: string
  readonly children: ReactNode
  readonly variant?: ButtonVariant
  readonly className?: string
}) {
  return (
    <Link to={to} className={[BUTTON_BASE, BUTTON_VARIANT_CLASS[variant], className].join(' ')}>
      {children}
    </Link>
  )
}

export function AppLabel({ htmlFor, children }: { readonly htmlFor?: string; readonly children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-medium text-ink-muted">
      {children}
    </label>
  )
}

export function AppCard({
  children,
  className = '',
  padding = 'default',
}: {
  readonly children: ReactNode
  readonly className?: string
  readonly padding?: 'default' | 'none' | 'compact'
}) {
  const paddingClass =
    padding === 'none' ? '' : padding === 'compact' ? 'p-4 sm:p-5' : 'p-5 sm:p-6'

  return (
    <div
      className={[
        'glass-light rounded-[var(--radius-card-lg)] border border-border shadow-card',
        paddingClass,
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}

export function AppStatCard({
  label,
  value,
  children,
  hideValue = false,
}: {
  readonly label: string
  readonly value?: string
  readonly children?: ReactNode
  readonly hideValue?: boolean
}) {
  return (
    <AppCard padding="compact" className="hover-lift">
      <p className="text-sm font-medium text-ink-muted">{label}</p>
      {!hideValue && value !== undefined && (
        <p className="mt-2 text-3xl font-semibold tracking-tight text-ink">{value}</p>
      )}
      {children !== undefined && <div className="mt-3">{children}</div>}
    </AppCard>
  )
}

export function AppPage({ children, className = '' }: { readonly children: ReactNode; readonly className?: string }) {
  return <div className={['mx-auto w-full max-w-6xl', className].join(' ')}>{children}</div>
}

export function AppPageHeader({
  title,
  description,
  action,
}: {
  readonly title: ReactNode
  readonly description?: ReactNode
  readonly action?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">{title}</h1>
        {description !== undefined && (
          <p className="mt-1 text-sm leading-relaxed text-ink-muted">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}

export function AppGateCard({
  icon,
  title,
  description,
  actionLabel,
  actionTo,
}: {
  readonly icon?: ReactNode
  readonly title: string
  readonly description: string
  readonly actionLabel?: string
  readonly actionTo?: string
}) {
  return (
    <AppCard className="flex min-h-[50vh] items-center justify-center border-dashed">
      <div className="max-w-md px-2 py-6 text-center">
        {icon !== undefined && <div className="mb-4 flex justify-center">{icon}</div>}
        <h2 className="text-lg font-semibold text-ink sm:text-xl">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{description}</p>
        {actionLabel !== undefined && actionTo !== undefined && (
          <AppButtonLink to={actionTo} className="mt-6">
            {actionLabel}
          </AppButtonLink>
        )}
      </div>
    </AppCard>
  )
}

export function AppFlowLayout({
  children,
  maxWidthClass = 'max-w-md',
}: {
  readonly children: ReactNode
  readonly maxWidthClass?: string
}) {
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
      <div className={['relative w-full', maxWidthClass].join(' ')}>{children}</div>
    </div>
  )
}

export function AppProgressBar({ value, label }: { readonly value: number; readonly label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-2 min-w-0 flex-1 overflow-hidden rounded-[var(--radius-pill)] bg-border">
        <div
          className="h-full rounded-[var(--radius-pill)] bg-gradient-to-r from-accent-soft via-accent to-accent-violet transition-all duration-500 ease-out"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="shrink-0 text-sm font-medium text-ink-muted">{label}</span>
    </div>
  )
}
