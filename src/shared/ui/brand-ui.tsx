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
      const frame = requestAnimationFrame(() => setVisible(true))
      return () => cancelAnimationFrame(frame)
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
  default: 'border-border-dark bg-ink/[0.04] text-on-dark-muted',
  mint: 'border-accent/30 bg-accent/10 text-accent',
  violet: 'border-accent-violet/30 bg-accent-violet/10 text-accent-violet',
  amber: 'border-accent-warm/30 bg-accent-warm/10 text-accent-warm',
  sky: 'border-accent-sky/30 bg-accent-sky/10 text-accent-sky',
} as const

export type BadgeTone = keyof typeof BADGE_TONE_CLASS

export function SectionBadge({
  children,
  tone = 'default',
}: {
  readonly children: React.ReactNode
  readonly tone?: BadgeTone
}) {
  return (
    <span
      className={`inline-block rounded-[var(--radius-pill)] border px-3 py-1 text-[11px] font-medium tracking-[0.14em] uppercase ${BADGE_TONE_CLASS[tone]}`}
    >
      {children}
    </span>
  )
}

export function SectionHeading({
  badge,
  tone = 'mint',
  title,
  description,
  align = 'center',
}: {
  readonly badge: string
  readonly tone?: BadgeTone
  readonly title: React.ReactNode
  readonly description?: React.ReactNode
  readonly align?: 'center' | 'left'
}) {
  const alignClass = align === 'center' ? 'mx-auto text-center' : 'text-left'
  return (
    <Reveal className={`max-w-2xl ${alignClass}`}>
      <SectionBadge tone={tone}>{badge}</SectionBadge>
      <h2 className="mt-5 text-3xl leading-[1.08] font-semibold tracking-[-0.035em] text-ink sm:text-5xl">{title}</h2>
      {description !== undefined && (
        <p className="mt-5 text-base leading-relaxed text-ink-muted sm:text-lg">{description}</p>
      )}
    </Reveal>
  )
}

const BUTTON_VARIANT_CLASS = {
  primary: 'bg-btn text-btn-fg hover:bg-btn-hover hover:shadow-card',
  accent: 'bg-brand text-black hover:brightness-105 hover:shadow-[0_0_44px_rgb(52_224_161/0.5)]',
  secondary: 'glass-dark text-on-dark hover:bg-ink/10',
  ghost: 'text-on-dark-muted hover:text-on-dark',
} as const

export function LandingButton({
  to,
  children,
  variant = 'primary',
  showChevron = false,
  className = '',
  onClick,
  size = 'md',
}: {
  readonly to: string
  readonly children: React.ReactNode
  readonly variant?: 'primary' | 'accent' | 'secondary' | 'ghost'
  readonly showChevron?: boolean
  readonly className?: string
  readonly onClick?: () => void
  readonly size?: 'md' | 'lg'
}) {
  const sizeClass = size === 'lg' ? 'px-7 py-3.5 text-[15px]' : 'px-5 py-2.5 text-sm'
  const base = `inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] font-medium whitespace-nowrap transition-all duration-300 ${sizeClass}`
  const buttonClass = `${base} ${BUTTON_VARIANT_CLASS[variant]} ${className}`
  const content = (
    <>
      {children}
      {showChevron && variant !== 'ghost' && (
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M9 5l7 7-7 7" />
        </svg>
      )}
    </>
  )

  if (/^(mailto:|https?:)/.test(to)) {
    const external = to.startsWith('http')
    return (
      <a
        href={to}
        onClick={onClick}
        className={buttonClass}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {content}
      </a>
    )
  }

  if (to.includes('#')) {
    return (
      <a href={to} onClick={onClick} className={buttonClass}>
        {content}
      </a>
    )
  }

  return (
    <Link to={to} onClick={onClick} className={buttonClass}>
      {content}
    </Link>
  )
}

export function PlayIcon({ className = 'h-5 w-5' }: { readonly className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path d="M3.6 2.4c-.3.3-.5.8-.5 1.4v16.4c0 .6.2 1.1.5 1.4l.1.1 9.2-9.2v-.2L3.7 2.3l-.1.1z" fill="#00d7fe" />
      <path d="M16 15.2l-3.1-3.1v-.2L16 8.8l.1.1 3.7 2.1c1 .6 1 1.6 0 2.2l-3.7 2.1-.1-.1z" fill="#ffce00" />
      <path d="M16.1 15.1L12.9 12 3.6 21.3c.3.4.9.4 1.5.1l11-6.3" fill="#f43249" />
      <path d="M16.1 8.9l-11-6.3c-.6-.3-1.2-.3-1.5.1L12.9 12l3.2-3.1z" fill="#00f076" />
    </svg>
  )
}

export function PlayStoreButton({
  href,
  size = 'lg',
  className = '',
  label = 'Join open testing on Google Play',
}: {
  readonly href: string
  readonly size?: 'md' | 'lg'
  readonly className?: string
  readonly label?: string
}) {
  return (
    <LandingButton to={href} variant="primary" size={size} className={className}>
      <PlayIcon className="h-5 w-5" />
      {label}
    </LandingButton>
  )
}

export function Wordmark({ className = 'h-[15px]' }: { readonly className?: string }) {
  return (
    <>
      <img
        src="/logo-wordmark-dark.png"
        alt="Responza"
        width={666}
        height={76}
        className={`only-light w-auto select-none ${className}`}
        decoding="async"
      />
      <img
        src="/logo-wordmark.png"
        alt=""
        aria-hidden
        width={666}
        height={76}
        className={`only-dark w-auto select-none ${className}`}
        decoding="async"
      />
    </>
  )
}

export function LandingLogo({ className = 'h-[15px]' }: { readonly className?: string }) {
  return (
    <Link to="/" aria-label="Responza home" className="inline-flex min-w-0 items-center">
      <Wordmark className={className} />
    </Link>
  )
}

export function MetaTechProviderBadge({ className = '' }: { readonly className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-2.5 rounded-[var(--radius-pill)] border border-border-dark bg-ink/[0.04] py-1.5 pr-4 pl-2 ${className}`}
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white ring-1 ring-border">
        <img src="/meta-icon.webp" alt="" width={14} height={14} className="h-3.5 w-3.5 object-contain" aria-hidden />
      </span>
      <span className="text-xs font-medium text-on-dark">Meta Verified</span>
    </div>
  )
}

export function CheckIcon({ className = 'h-4 w-4' }: { readonly className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.6} d="M5 13l4 4L19 7" />
    </svg>
  )
}

export function SparkleIcon({ className = 'h-4 w-4' }: { readonly className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l1.9 5.6L19.5 9.5l-5.6 1.9L12 17l-1.9-5.6L4.5 9.5l5.6-1.9L12 2zM19 15l.9 2.6 2.6.9-2.6.9L19 22l-.9-2.6-2.6-.9 2.6-.9L19 15z" />
    </svg>
  )
}

type PhoneMockupProps = {
  readonly children: React.ReactNode
  readonly className?: string
  readonly glow?: string
}

/** Device frame drawn in CSS. Children fill the screen area (use PhoneScreenImage). */
export function PhoneMockup({ children, className = '', glow }: PhoneMockupProps) {
  return (
    <div className={`phone-wrap ${className}`}>
      <div className="phone" style={glow === undefined ? undefined : ({ '--glow': glow } as React.CSSProperties)}>
        <span className="phone-btn phone-btn-l1" aria-hidden />
        <span className="phone-btn phone-btn-l2" aria-hidden />
        <span className="phone-btn phone-btn-l3" aria-hidden />
        <span className="phone-btn phone-btn-r1" aria-hidden />
        <div className="phone-bezel">
          <div className="phone-screen">
            {children}
            <span className="phone-island" aria-hidden />
          </div>
        </div>
      </div>
    </div>
  )
}

export function PhoneScreenImage({
  src,
  alt,
  priority = false,
  className = '',
}: {
  readonly src: string
  readonly alt: string
  readonly priority?: boolean
  readonly className?: string
}) {
  return (
    <img
      src={src}
      alt={alt}
      width={900}
      height={1955}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
    />
  )
}

/** Light is the default; the choice is saved and applied before first paint by the script in index.html. */
export function ThemeToggle({ className = '' }: { readonly className?: string }) {
  const toggle = () => {
    const root = document.documentElement
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark'
    root.dataset.theme = next
    try {
      localStorage.setItem('responza-theme', next)
    } catch {
      /* storage can be unavailable (private mode); the choice then lasts for this visit only */
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#060608' : '#ffffff')
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark theme"
      title="Switch theme"
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border-dark text-on-dark-muted transition-colors hover:bg-ink/5 hover:text-on-dark ${className}`}
    >
      <svg className="only-light h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />
      </svg>
      <svg className="only-dark h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="12" r="4" />
        <path strokeLinecap="round" d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4l1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4l1.4-1.4" />
      </svg>
    </button>
  )
}
