import { Suspense, type ReactNode } from 'react'

type SpinnerSize = 'sm' | 'md' | 'lg'
type SpinnerVariant = 'brand' | 'white' | 'muted'

type SpinnerProps = {
  readonly size?: SpinnerSize
  readonly variant?: SpinnerVariant
  readonly className?: string
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'h-3.5 w-3.5 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-10 w-10 border-2',
}

const variantClasses: Record<SpinnerVariant, string> = {
  brand: 'border-border border-t-accent',
  white: 'border-white/30 border-t-white',
  muted: 'border-border border-t-ink-muted',
}

export function Spinner({
  size = 'md',
  variant = 'brand',
  className = '',
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={[
        'inline-block shrink-0 animate-spin rounded-full',
        sizeClasses[size],
        variantClasses[variant],
        className,
      ].join(' ')}
    />
  )
}

type SpinnerSectionProps = {
  readonly className?: string
  readonly minHeightClassName?: string
}

export function SpinnerSection({
  className = '',
  minHeightClassName = 'min-h-[12rem]',
}: SpinnerSectionProps) {
  return (
    <div
      className={['flex items-center justify-center', minHeightClassName, className].join(' ')}
      role="status"
      aria-label="Loading"
    >
      <Spinner />
    </div>
  )
}

type SpinnerOverlayProps = {
  readonly className?: string
}

export function SpinnerOverlay({ className = '' }: SpinnerOverlayProps) {
  return (
    <div
      className={['bg-surface-muted flex min-h-screen items-center justify-center', className].join(' ')}
      role="status"
      aria-label="Loading"
    >
      <Spinner size="lg" />
    </div>
  )
}

type PageSuspenseProps = {
  readonly children: ReactNode
}

export function PageSuspense({ children }: PageSuspenseProps) {
  return (
    <Suspense fallback={<SpinnerSection minHeightClassName="min-h-[50vh]" />}>
      {children}
    </Suspense>
  )
}
