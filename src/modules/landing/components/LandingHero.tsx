import { useEffect, useState } from 'react'

import { INTEGRATION_PLATFORM_LOGOS } from '@/modules/integrations/integrations.constants'

import { LANDING_AVATARS, LANDING_PLATFORMS, NAV_LINKS, PLATFORM_GLOW, PLATFORM_RING, landingPlatformLogoClass } from '../landing.constants'
import { LandingButton, LandingLogo, ProfilePhoto, Reveal } from '../landing-ui'

function LandingNavbar({ variant = 'dark' }: { readonly variant?: 'light' | 'dark' }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const shellClass = variant === 'dark' ? 'glass-dark' : 'glass-light shadow-soft'
  const menuBorderClass = variant === 'dark' ? 'border-border-dark' : 'border-border/60'
  const linkClass =
    variant === 'dark' ? 'text-on-dark-muted hover:text-on-dark' : 'text-ink-muted hover:text-ink'
  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    if (!menuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu()
    }
    const onResize = () => {
      if (window.matchMedia('(min-width: 1024px)').matches) closeMenu()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', onResize)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', onResize)
    }
  }, [menuOpen])

  return (
    <header className="fixed top-0 right-0 left-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
      <div
        className={[
          'mx-auto max-w-6xl rounded-2xl lg:rounded-[var(--radius-pill)]',
          shellClass,
          menuOpen ? 'shadow-card' : '',
        ].join(' ')}
      >
        <div className="flex h-14 items-center gap-3 px-3 sm:gap-4 sm:px-5">
          <div className="min-w-0 shrink-0">
            <LandingLogo variant={variant} />
          </div>

          <nav className="hidden items-center justify-center gap-6 lg:flex lg:flex-1">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className={`text-sm transition-colors ${linkClass}`}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            {variant === 'light' ? (
              <LandingButton
                to="/auth?mode=login"
                variant="ghost"
                className="!text-ink-muted hover:!text-ink px-4"
              >
                Sign in
              </LandingButton>
            ) : (
              <LandingButton to="/auth?mode=login" variant="secondary" className="px-4">
                Sign in
              </LandingButton>
            )}
            <LandingButton to="/auth?mode=register" variant="primary" showChevron className="px-4">
              Get started
            </LandingButton>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className={`ml-auto inline-flex shrink-0 rounded-lg p-2 touch-manipulation lg:hidden ${linkClass}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="landing-mobile-nav"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div id="landing-mobile-nav" className={`border-t px-4 py-3 lg:hidden ${menuBorderClass}`}>
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={`rounded-lg px-3 py-2.5 text-sm ${linkClass}`}
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className={`mt-3 flex flex-col gap-2 border-t pt-3 ${menuBorderClass}`}>
              <LandingButton to="/auth?mode=register" variant="primary" showChevron className="w-full" onClick={closeMenu}>
                Get started
              </LandingButton>
              <LandingButton
                to="/auth?mode=login"
                variant="ghost"
                className={`w-full ${variant === 'light' ? '!text-ink-muted' : ''}`}
                onClick={closeMenu}
              >
                Sign in
              </LandingButton>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

function MockupShell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`hover-lift rounded-[var(--radius-card-lg)] border border-border bg-gradient-to-br from-white to-surface-muted p-4 shadow-card ${className}`}
    >
      {children}
    </div>
  )
}

function HeroVisual() {
  return (
    <div className="relative mx-auto max-w-sm sm:max-w-none">
      <MockupShell className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-medium text-ink">Inbox</p>
          <span className="flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-ink px-2 py-0.5 text-[10px] text-on-dark">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-soft" />
            Live
          </span>
        </div>
        <div className="space-y-2">
          {[
            { name: 'Priya Sharma', avatar: LANDING_AVATARS.priya, active: true },
            { name: 'Alex Chen', avatar: LANDING_AVATARS.alex, active: false },
          ].map((row) => (
            <div
              key={row.name}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${row.active ? 'bg-white shadow-soft ring-1 ring-emerald-500/15' : 'bg-white/60'}`}
            >
              <ProfilePhoto src={row.avatar} alt={row.name} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{row.name}</p>
                <p className="truncate text-xs text-ink-muted">Thanks for the quote…</p>
              </div>
            </div>
          ))}
        </div>
      </MockupShell>
      <div className="animate-float-gentle absolute right-0 -bottom-3 z-20 w-[min(100%,12rem)] rounded-xl border border-emerald-500/20 bg-white p-3 shadow-card sm:-right-4 sm:-bottom-4 sm:w-48">
        <div className="flex items-center gap-2">
          <ProfilePhoto src={LANDING_AVATARS.natasha} alt="New contact" size="sm" />
          <img src={INTEGRATION_PLATFORM_LOGOS.whatsapp} alt="WhatsApp" className="h-4 w-4 object-contain" />
          <p className="text-xs text-ink-faint">New on WhatsApp</p>
        </div>
        <p className="mt-1 text-sm text-ink">Interested in your service…</p>
      </div>
    </div>
  )
}

function MetaVerifiedBadge() {
  return (
    <div className="mb-5 inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[#0081FB]/20 bg-white/90 px-3 py-1.5 shadow-soft backdrop-blur-sm sm:mb-6">
      <img src="/meta.png" alt="" className="h-4 w-4 shrink-0 object-contain" aria-hidden />
      <span className="text-[11px] font-semibold tracking-wide text-[#0081FB]">Meta Verified</span>
    </div>
  )
}

export function LandingHero() {
  return (
    <>
      <section className="bg-hero-gradient bg-grid-light relative min-h-screen overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-20">
        <LandingNavbar variant="light" />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <Reveal>
            <MetaVerifiedBadge />
            <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-6xl">
              One inbox, <span className="text-accent-gradient">every conversation.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-muted sm:mt-6 sm:text-lg">
              Responza AI brings WhatsApp and Instagram into a single workspace with AI that suggests replies,
              translates messages, and helps you respond faster.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center">
              <LandingButton to="/auth?mode=register" variant="primary" showChevron className="w-full sm:w-auto">
                Start free trial
              </LandingButton>
              <LandingButton
                to="/auth?mode=login"
                variant="ghost"
                className="!text-ink-muted hover:!text-ink w-full sm:w-auto"
              >
                Sign in
              </LandingButton>
            </div>
            <p className="mt-4 text-xs text-ink-faint">
              No credit card required · 3-day free trial · Plans from ₹499/month
            </p>
          </Reveal>
          <Reveal delay={150} className="mx-auto w-full max-w-md lg:max-w-none">
            <HeroVisual />
          </Reveal>
        </div>
      </section>

      <section className="border-y border-border bg-surface-muted py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-center text-[10px] font-medium tracking-widest text-ink-faint uppercase">
              Integrations
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-5 sm:mt-12 sm:gap-6">
              {LANDING_PLATFORMS.map(({ platform, label, logo }, index) => (
                <Reveal key={platform} delay={index * 80} className="inline-block">
                  <div
                    className={`flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-white p-3 ring-1 sm:h-24 sm:w-24 sm:p-4 ${PLATFORM_RING[platform]} ${PLATFORM_GLOW[platform]} hover-lift`}
                  >
                    <img
                      src={logo}
                      alt={label}
                      className={landingPlatformLogoClass(platform)}
                      style={
                        platform === 'indiamart' || platform === 'tally' || platform === 'shopify'
                          ? { maxHeight: 44 }
                          : { height: 44, width: 44 }
                      }
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
