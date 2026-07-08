import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

type RevealProps = {
  readonly children: React.ReactNode
  readonly className?: string
  readonly delay?: number
}

export function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (node === null) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={[
        'transition-all duration-700 ease-out',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0',
        className,
      ].join(' ')}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

const BADGE_TONE_CLASS = {
  light: {
    default: 'border-border bg-surface-muted text-ink-faint',
    teal: 'border-accent/25 bg-accent/10 text-accent',
    warm: 'border-accent-warm/25 bg-accent-warm/10 text-accent-warm',
    violet: 'border-accent-violet/25 bg-accent-violet/10 text-accent-violet',
  },
  dark: {
    default: 'border-border-dark text-on-dark-muted',
    teal: 'border-accent/30 bg-accent/10 text-accent-soft',
    warm: 'border-accent-warm/30 bg-accent-warm/10 text-accent-warm',
    violet: 'border-accent-violet/30 bg-accent-violet/10 text-accent-violet',
  },
} as const

export function SectionBadge({
  children,
  variant = 'light',
  tone = 'default',
}: {
  readonly children: React.ReactNode
  readonly variant?: 'light' | 'dark'
  readonly tone?: 'default' | 'teal' | 'warm' | 'violet'
}) {
  return (
    <span
      className={`inline-block rounded-[var(--radius-pill)] border px-3 py-1 text-[10px] font-medium tracking-widest uppercase ${BADGE_TONE_CLASS[variant][tone]}`}
    >
      {children}
    </span>
  )
}

export function SectionDivider({
  label,
  variant = 'dark',
}: {
  readonly label: string
  readonly variant?: 'light' | 'dark'
}) {
  const lineClass = variant === 'dark' ? 'bg-border-dark' : 'bg-border'
  return (
    <div className="flex items-center gap-4">
      <div className={`h-px flex-1 ${lineClass}`} />
      <SectionBadge variant={variant}>{label}</SectionBadge>
      <div className={`h-px flex-1 ${lineClass}`} />
    </div>
  )
}

const BUTTON_VARIANT_CLASS = {
  primary: 'bg-ink text-on-dark hover:bg-ink/90 hover:shadow-soft',
  secondary: 'bg-on-dark text-ink hover:bg-on-dark/90',
  ghost: 'text-on-dark-muted hover:text-on-dark',
} as const

export function LandingButton({
  to,
  children,
  variant = 'primary',
  showChevron = false,
  className = '',
  onClick,
}: {
  readonly to: string
  readonly children: React.ReactNode
  readonly variant?: 'primary' | 'secondary' | 'ghost'
  readonly showChevron?: boolean
  readonly className?: string
  readonly onClick?: () => void
}) {
  const base =
    'inline-flex items-center justify-center gap-1.5 rounded-[var(--radius-pill)] px-5 py-2 text-sm font-medium transition-all duration-200'

  if (variant === 'ghost') {
    return (
      <Link to={to} onClick={onClick} className={`${base} ${BUTTON_VARIANT_CLASS.ghost} ${className}`}>
        {children}
      </Link>
    )
  }

  return (
    <Link to={to} onClick={onClick} className={`${base} ${BUTTON_VARIANT_CLASS[variant]} ${className}`}>
      {children}
      {showChevron && (
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      )}
    </Link>
  )
}

export function BrandMark({ size = 'md' }: { readonly size?: 'sm' | 'md' }) {
  const boxClass = size === 'sm' ? 'h-8 w-8 rounded-lg text-xs' : 'h-9 w-9 rounded-lg text-sm'
  return (
    <div
      className={`flex shrink-0 items-center justify-center bg-gradient-to-br from-accent-soft via-accent to-accent-violet font-bold text-white shadow-[0_4px_14px_rgb(91_138_133/0.35)] ${boxClass}`}
    >
      R
    </div>
  )
}

export function LandingLogo({ variant = 'dark' }: { readonly variant?: 'light' | 'dark' }) {
  const textClass = variant === 'dark' ? 'text-on-dark' : 'text-ink'
  return (
    <Link to="/" className={`inline-flex min-w-0 items-center gap-2.5 ${textClass}`}>
      <BrandMark size="sm" />
      <span className="hidden truncate text-sm font-semibold tracking-wide min-[400px]:inline">RESPONZA AI</span>
    </Link>
  )
}

export function ProfilePhoto({
  src,
  alt,
  size = 'md',
}: {
  readonly src: string
  readonly alt: string
  readonly size?: 'sm' | 'md'
}) {
  const sizeClass = size === 'sm' ? 'h-6 w-6' : 'h-8 w-8'
  return (
    <img src={src} alt={alt} className={`${sizeClass} shrink-0 rounded-full object-cover ring-2 ring-white`} />
  )
}
