import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { NAV_LINKS, PLAY_STORE_URL, WAITLIST_HREF } from '@/features/landing/constants'
import { LEGAL_FOOTER_LINKS } from '@/features/landing/legal.constants'
import { LandingButton, LandingLogo, PlayIcon, ThemeToggle, Wordmark } from '@/shared/ui/brand-ui'

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    if (!menuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    const onResize = () => {
      if (window.matchMedia('(min-width: 1024px)').matches) setMenuOpen(false)
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
          'glass-strong mx-auto max-w-6xl rounded-2xl shadow-soft lg:rounded-[var(--radius-pill)]',
          menuOpen ? 'shadow-card' : '',
        ].join(' ')}
      >
        <div className="flex h-14 items-center gap-3 px-4 sm:gap-4 sm:px-6">
          <div className="min-w-0 shrink-0">
            <LandingLogo className="h-[13px] sm:h-[15px]" />
          </div>

          <nav className="hidden items-center justify-center gap-7 lg:flex lg:flex-1" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-on-dark-muted transition-colors hover:text-on-dark"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <ThemeToggle />
            <LandingButton to={PLAY_STORE_URL} variant="primary" className="py-2">
              <PlayIcon className="h-4 w-4" />
              Get the app
            </LandingButton>
          </div>

          <ThemeToggle className="ml-auto lg:hidden" />
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="inline-flex shrink-0 rounded-lg p-2 text-on-dark-muted touch-manipulation hover:text-on-dark lg:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="site-mobile-nav"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div id="site-mobile-nav" className="border-t border-border-dark px-4 py-3 lg:hidden">
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="rounded-lg px-3 py-3 text-[15px] text-on-dark-muted hover:bg-ink/5 hover:text-on-dark"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="mt-3 flex flex-col gap-2 border-t border-border-dark pt-3">
              <LandingButton to={PLAY_STORE_URL} variant="primary" className="w-full" onClick={closeMenu}>
                <PlayIcon className="h-4 w-4" />
                Join open testing
              </LandingButton>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-border-dark bg-surface-dark">
      <div
        className="pointer-events-none absolute -bottom-40 left-1/2 h-72 w-[48rem] -translate-x-1/2 rounded-full bg-glow-mint/15 blur-[110px]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-10 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Wordmark className="h-[17px]" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-on-dark-muted">
              One AI inbox for WhatsApp Business and Instagram. Reply faster, never miss a customer.
            </p>
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-border-dark bg-ink/[0.04] px-4 py-2 text-sm text-on-dark transition-colors hover:bg-ink/10"
            >
              <PlayIcon className="h-4 w-4" />
              Open testing on Google Play
            </a>
          </div>

          <FooterColumn title="Product">
            <a href="/#features">Features</a>
            <a href="/#how-it-works">How it works</a>
            <a href="/#pricing">Pricing</a>
            <a href="/#faqs">FAQs</a>
            <Link to="/blog">Blog</Link>
          </FooterColumn>

          <FooterColumn title="Get started">
            <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer">
              Google Play (open testing)
            </a>
            <a href={WAITLIST_HREF}>Join the waitlist</a>
            <a href="mailto:contact@responza.in">contact@responza.in</a>
          </FooterColumn>

          <FooterColumn title="Legal">
            {LEGAL_FOOTER_LINKS.map((link) => (
              <Link key={link.to} to={link.to}>
                {link.label}
              </Link>
            ))}
          </FooterColumn>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-border-dark pt-8 text-xs leading-relaxed text-ink-faint">
          <p>
            Responza is an independent product by Grupo Technologies Private Limited and is not endorsed or sponsored by
            Meta, WhatsApp or Instagram. WhatsApp, Instagram and Meta are trademarks of Meta Platforms, Inc.
          </p>
          <p>© {new Date().getFullYear()} Responza AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, children }: { readonly title: string; readonly children: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm font-medium text-on-dark">{title}</p>
      <div className="mt-4 flex flex-col gap-3 text-sm text-on-dark-muted [&_a]:transition-colors [&_a]:hover:text-accent">
        {children}
      </div>
    </div>
  )
}
