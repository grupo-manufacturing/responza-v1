import { useEffect, useState } from 'react'

import {
  LANDING_PLATFORMS,
  NAV_LINKS,
  PLATFORM_GLOW,
  PLATFORM_RING,
  WAITLIST_HREF,
  landingPlatformLogoClass,
} from '@/features/landing/constants'
import { LandingButton, LandingLogo, Reveal, SectionBadge } from '@/shared/ui/brand-ui'

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
            <LandingButton to={WAITLIST_HREF} variant="primary" showChevron className="px-4">
              Join waitlist
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
              <LandingButton to={WAITLIST_HREF} variant="primary" showChevron className="w-full" onClick={closeMenu}>
                Join waitlist
              </LandingButton>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

function MetaVerifiedBadge() {
  return (
    <div className="mb-4 inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[#0081FB]/20 bg-white/90 px-3 py-1.5 shadow-soft backdrop-blur-sm sm:mb-5 md:mb-6">
      <img
        src="/meta-icon.webp"
        alt="Meta logo"
        width={16}
        height={16}
        className="h-4 w-4 shrink-0 object-contain"
        aria-hidden
      />
      <span className="text-[11px] font-semibold tracking-wide text-[#0081FB]">Meta Verified</span>
    </div>
  )
}

function ComingSoonBadge() {
  return (
    <div className="mb-4 inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-accent/25 bg-white/90 px-3 py-1.5 shadow-soft backdrop-blur-sm sm:mb-5 md:mb-6">
      <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-soft" aria-hidden />
      <span className="text-[11px] font-semibold tracking-wide text-accent">Coming soon</span>
    </div>
  )
}

export function LandingHero() {
  return (
    <>
      <section className="bg-hero-gradient bg-grid-light relative flex items-center overflow-x-hidden pt-28 pb-20 sm:pt-32 sm:pb-24 md:min-h-[100svh]">
        <LandingNavbar variant="light" />
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
          <Reveal className="flex min-w-0 flex-col items-center text-center">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <MetaVerifiedBadge />
              <ComingSoonBadge />
            </div>
            <h1 className="text-[2rem] leading-tight font-semibold tracking-tight text-ink sm:text-5xl md:text-6xl lg:text-[4rem]">
              Every customer chat, <span className="text-accent-gradient">in your pocket.</span>
            </h1>
            <p className="mt-4 text-base font-medium tracking-tight text-ink sm:mt-5 sm:text-lg md:text-xl">
              The WhatsApp &amp; Instagram inbox app for Indian businesses.
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted sm:mt-4 sm:text-base md:text-lg">
              Responza brings WhatsApp and Instagram into one mobile app, with AI draft replies,
              instant translation and chat summaries, so you can answer customers from anywhere.
            </p>
            <div className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:items-center sm:justify-center">
              <LandingButton to={WAITLIST_HREF} variant="primary" showChevron className="w-full py-2.5 sm:w-auto">
                Join the waitlist
              </LandingButton>
            </div>
            <p className="mt-4 text-xs text-ink-faint">Coming soon · Be the first to know</p>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-x-hidden border-y border-border bg-surface-light py-14 sm:py-16 md:py-24">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(91_138_133/0.08),transparent_60%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <SectionBadge variant="light" tone="teal">
              Integrations
            </SectionBadge>
            <h2 className="mt-4 text-xl font-semibold tracking-tight text-ink sm:text-2xl md:text-3xl">
              Connect the channels your customers already use.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted sm:text-base">
              WhatsApp and Instagram are supported from day one. IndiaMART, Tally, Gmail and more
              are on the roadmap.
            </p>
          </Reveal>

          <div className="mt-10 sm:mt-12 md:mt-14">
            <Reveal>
              <p className="text-center text-[10px] font-medium tracking-widest text-ink-faint uppercase">
                At launch
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-5">
                {LANDING_PLATFORMS.filter(({ platform }) => platform === 'whatsapp' || platform === 'instagram').map(
                  ({ platform, label, logo }, index) => (
                    <Reveal key={platform} delay={index * 70} className="inline-block">
                      <div
                        className={[
                          'flex w-[5.25rem] flex-col items-center gap-1.5 rounded-2xl border border-border bg-white px-2.5 py-3 shadow-soft transition-shadow duration-300 sm:w-[5.75rem] sm:px-3 sm:py-3.5 md:w-24',
                          PLATFORM_RING[platform],
                          'ring-1',
                          PLATFORM_GLOW[platform],
                          'hover:shadow-card',
                        ].join(' ')}
                      >
                        <div className="flex h-9 w-9 items-center justify-center sm:h-10 sm:w-10 md:h-11 md:w-11">
                          <img
                            src={logo.src}
                            alt={`${label} logo`}
                            width={36}
                            height={36}
                            loading="lazy"
                            decoding="async"
                            className={landingPlatformLogoClass(platform)}
                            style={{ height: 36, width: 36 }}
                          />
                        </div>
                        <span className="text-[11px] font-medium text-ink">{label}</span>
                      </div>
                    </Reveal>
                  ),
                )}
              </div>
            </Reveal>

            <Reveal delay={120} className="mt-8 sm:mt-10 md:mt-12">
              <div className="mx-auto flex max-w-xl items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <p className="shrink-0 text-[10px] font-medium tracking-widest text-ink-faint uppercase">
                  On the roadmap
                </p>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 md:gap-4">
                {LANDING_PLATFORMS.filter(
                  ({ platform }) => platform !== 'whatsapp' && platform !== 'instagram',
                ).map(({ platform, label, logo }, index) => (
                  <Reveal key={platform} delay={140 + index * 60} className="inline-block">
                    <div
                      className={[
                        'flex w-[4.75rem] flex-col items-center gap-2 rounded-2xl border border-border/80 bg-white/80 px-2 py-3 sm:w-[5.5rem] sm:px-2.5 sm:py-3.5 md:w-24 md:px-3 md:py-4',
                        PLATFORM_RING[platform],
                        'ring-1',
                      ].join(' ')}
                    >
                      <div className="flex h-9 w-9 items-center justify-center opacity-80 sm:h-10 sm:w-10 md:h-11 md:w-11">
                        <img
                          src={logo.src}
                          alt={`${label} logo`}
                          width={logo.width}
                          height={logo.height}
                          loading="lazy"
                          decoding="async"
                          className={landingPlatformLogoClass(platform)}
                          style={
                            platform === 'indiamart' || platform === 'tally' || platform === 'shopify'
                              ? { maxHeight: 36 }
                              : { height: 36, width: 36 }
                          }
                        />
                      </div>
                      <span className="text-center text-[10px] font-medium text-ink-muted sm:text-[11px]">
                        {label}
                      </span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
