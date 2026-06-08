import { Suspense, type ReactNode } from 'react'

type SpinnerSize = 'sm' | 'md' | 'lg'
type SpinnerVariant = 'brand' | 'white' | 'muted'

type SpinnerProps = {
  readonly size?: SpinnerSize
  readonly variant?: SpinnerVariant
  readonly label?: string
  readonly className?: string
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'h-3.5 w-3.5 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-10 w-10 border-2',
}

const variantClasses: Record<SpinnerVariant, string> = {
  brand: 'border-neutral-200 border-t-neutral-900',
  white: 'border-white/30 border-t-white',
  muted: 'border-neutral-200 border-t-neutral-500',
}

export function Spinner({
  size = 'md',
  variant = 'brand',
  label,
  className = '',
}: SpinnerProps) {
  const ring = (
    <span
      role="status"
      aria-hidden={label === undefined}
      aria-label={label}
      className={[
        'inline-block shrink-0 animate-spin rounded-full',
        sizeClasses[size],
        variantClasses[variant],
        className,
      ].join(' ')}
    />
  )

  if (label === undefined) {
    return ring
  }

  const labelClassName =
    variant === 'muted' ? 'text-neutral-500' : variant === 'white' ? 'text-white/90' : 'text-neutral-600'

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      {ring}
      <p className={`animate-pulse text-sm font-medium ${labelClassName}`}>{label}</p>
    </div>
  )
}

type SpinnerSectionProps = {
  readonly label?: string
  readonly className?: string
  readonly minHeightClassName?: string
}

export function SpinnerSection({
  label = 'Loading...',
  className = '',
  minHeightClassName = 'min-h-[12rem]',
}: SpinnerSectionProps) {
  return (
    <div
      className={['flex flex-col items-center justify-center', minHeightClassName, className].join(' ')}
      role="status"
      aria-live="polite"
    >
      <Spinner label={label} />
    </div>
  )
}

type SpinnerOverlayProps = {
  readonly label?: string
  readonly className?: string
}

export function SpinnerOverlay({ label = 'Loading...', className = '' }: SpinnerOverlayProps) {
  return (
    <div
      className={['flex min-h-screen flex-col items-center justify-center bg-neutral-50', className].join(' ')}
    >
      <Spinner size="lg" label={label} />
    </div>
  )
}

type PageSuspenseProps = {
  readonly children: ReactNode
  readonly label?: string
}

export function PageSuspense({ children, label = 'Loading page...' }: PageSuspenseProps) {
  return (
    <Suspense fallback={<SpinnerSection label={label} minHeightClassName="min-h-[50vh]" />}>
      {children}
    </Suspense>
  )
}
