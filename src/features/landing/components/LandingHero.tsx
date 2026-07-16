import { useEffect, useMemo, useState } from 'react'

import {
  LANDING_AVATARS,
  LANDING_PLATFORMS,
  NAV_LINKS,
  PLATFORM_GLOW,
  PLATFORM_RING,
  landingPlatformLogoClass,
} from '@/features/landing/constants'
import {
  composerSendButtonClass,
  inboundBubbleClass,
  inboxThreadBackgroundClass,
  listItemSelectedClass,
  outboundBubbleClass,
  platformTabActiveClass,
} from '@/features/inbox/lib/inbox-ui'
import type { IntegrationPlatform } from '@/features/integrations/constants'
import { LandingButton, LandingLogo, ProfilePhoto, Reveal, SectionBadge } from '@/shared/ui/brand-ui'

type HeroPlatformFilter = IntegrationPlatform | 'all'

type HeroMockMessage = {
  readonly id: string
  readonly direction: 'inbound' | 'outbound'
  readonly content: string
  readonly time: string
}

type HeroMockConversation = {
  readonly id: string
  readonly name: string
  readonly avatar: string
  readonly platform: IntegrationPlatform
  readonly preview: string
  readonly messages: readonly HeroMockMessage[]
  readonly aiSuggestions: readonly string[]
  readonly draft: string
}

const HERO_PLATFORM_FILTERS: readonly HeroPlatformFilter[] = ['all', 'whatsapp', 'instagram']

const HERO_CONVERSATIONS: readonly HeroMockConversation[] = [
  {
    id: 'priya',
    name: 'Priya Sharma',
    avatar: LANDING_AVATARS.priya,
    platform: 'whatsapp',
    preview: 'Thanks for the quote…',
    draft: 'Happy to send the proposal today.',
    aiSuggestions: ['Happy to send the quote today.'],
    messages: [
      {
        id: 'p1',
        direction: 'inbound',
        content: 'Hi! Can I get a quote for your premium plan?',
        time: '10:42',
      },
      {
        id: 'p2',
        direction: 'outbound',
        content: 'Of course — Premium is ₹4,999/year with 30k conversations.',
        time: '10:43',
      },
      {
        id: 'p3',
        direction: 'inbound',
        content: 'Thanks for the quote… that works for us.',
        time: '10:45',
      },
    ],
  },
  {
    id: 'alex',
    name: 'Alex Chen',
    avatar: LANDING_AVATARS.alex,
    platform: 'instagram',
    preview: 'Do you ship internationally?',
    draft: 'Yes — we ship worldwide. Share your city?',
    aiSuggestions: ['Yes, we ship worldwide!'],
    messages: [
      {
        id: 'a1',
        direction: 'inbound',
        content: 'Loved your reel — do you ship internationally?',
        time: '10:20',
      },
      {
        id: 'a2',
        direction: 'outbound',
        content: 'Thanks! Yes, we ship to most countries.',
        time: '10:22',
      },
      {
        id: 'a3',
        direction: 'inbound',
        content: 'Perfect — I’m in Singapore.',
        time: '10:28',
      },
    ],
  },
  {
    id: 'maya',
    name: 'Maya Patel',
    avatar: LANDING_AVATARS.maya,
    platform: 'whatsapp',
    preview: 'Interested in a demo…',
    draft: 'Happy to walk you through a quick demo.',
    aiSuggestions: ['Happy to schedule a quick demo.'],
    messages: [
      {
        id: 'm1',
        direction: 'inbound',
        content: 'Interested in your service for our support team.',
        time: '9:58',
      },
      {
        id: 'm2',
        direction: 'outbound',
        content: 'Great — Responza unifies WhatsApp + Instagram in one inbox.',
        time: '10:01',
      },
    ],
  },
  {
    id: 'natasha',
    name: 'Natasha Roy',
    avatar: LANDING_AVATARS.natasha,
    platform: 'instagram',
    preview: 'Can you help with pricing?',
    draft: 'Sure — Basic starts at ₹499/month.',
    aiSuggestions: ['Sure — happy to share pricing.'],
    messages: [
      {
        id: 'n1',
        direction: 'inbound',
        content: 'Can you help with pricing for a small team?',
        time: '9:40',
      },
      {
        id: 'n2',
        direction: 'outbound',
        content: 'Absolutely — Basic is ₹499/month with a 3-day free trial.',
        time: '9:42',
      },
    ],
  },
]

function platformFilterLabel(filter: HeroPlatformFilter): string {
  if (filter === 'all') return 'All'
  if (filter === 'whatsapp') return 'WhatsApp'
  return 'Instagram'
}

function PlatformGlyph({ platform }: { readonly platform: IntegrationPlatform }) {
  const src = platform === 'whatsapp' ? '/whatsapp.png' : '/instagram.png'
  const label = platform === 'whatsapp' ? 'WhatsApp' : 'Instagram'
  return <img src={src} alt={label} className="h-3.5 w-3.5 object-contain" />
}

function SendIcon() {
  return (
    <svg className="h-4 w-4 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
      />
    </svg>
  )
}

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

function HeroVisual() {
  const [platformFilter, setPlatformFilter] = useState<HeroPlatformFilter>('all')
  const [selectedId, setSelectedId] = useState(HERO_CONVERSATIONS[0].id)

  const visibleConversations = useMemo(
    () =>
      HERO_CONVERSATIONS.filter(
        (conversation) => platformFilter === 'all' || conversation.platform === platformFilter,
      ),
    [platformFilter],
  )

  useEffect(() => {
    if (visibleConversations.some((conversation) => conversation.id === selectedId)) return
    const next = visibleConversations[0]
    if (next) setSelectedId(next.id)
  }, [selectedId, visibleConversations])

  const selected =
    visibleConversations.find((conversation) => conversation.id === selectedId) ??
    visibleConversations[0] ??
    HERO_CONVERSATIONS[0]

  const threadMessages = selected.messages.slice(-2)
  const aiSuggestion = selected.aiSuggestions[0]

  return (
    <div className="relative mx-auto w-full min-w-0 max-w-md sm:max-w-xl lg:max-w-none">
      <div
        className="pointer-events-none absolute -inset-3 rounded-[1.75rem] bg-[radial-gradient(ellipse_at_center,rgb(91_138_133/0.16),transparent_65%)] blur-2xl sm:-inset-6 sm:rounded-[2rem] lg:-inset-8"
        aria-hidden
      />

      <div
        className="relative overflow-hidden rounded-2xl border border-border/80 bg-white/95 shadow-[0_24px_60px_-28px_rgb(15_23_42/0.35)] backdrop-blur-sm sm:rounded-[1.5rem]"
        aria-hidden
      >
        <div className="flex flex-col gap-3 px-3 pt-3 pb-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-4 sm:pt-4 sm:pb-3 lg:px-5">
          <p className="shrink-0 text-sm font-semibold tracking-tight text-ink">Inbox</p>
          <div className="flex min-w-0 gap-1.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {HERO_PLATFORM_FILTERS.map((filter) => {
              const isActive = platformFilter === filter
              return (
                <button
                  key={filter}
                  type="button"
                  tabIndex={-1}
                  aria-pressed={isActive}
                  onClick={() => setPlatformFilter(filter)}
                  className={[
                    'shrink-0 rounded-[var(--radius-pill)] px-2.5 py-1 text-[11px] font-medium whitespace-nowrap transition-all duration-200',
                    platformTabActiveClass(filter, isActive),
                  ].join(' ')}
                >
                  {platformFilterLabel(filter)}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto px-3 pb-2.5 [-ms-overflow-style:none] [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden sm:px-4">
          {visibleConversations.map((conversation) => {
            const isSelected = conversation.id === selected.id
            return (
              <button
                key={conversation.id}
                type="button"
                tabIndex={-1}
                onClick={() => setSelectedId(conversation.id)}
                className={[
                  'flex shrink-0 items-center gap-2 rounded-2xl px-2.5 py-2 transition-colors',
                  isSelected ? 'bg-ink text-on-dark' : 'bg-surface-muted/70 text-ink',
                ].join(' ')}
              >
                <ProfilePhoto src={conversation.avatar} alt="" size="sm" />
                <span className="text-[11px] font-medium">{conversation.name.split(' ')[0]}</span>
                <PlatformGlyph platform={conversation.platform} />
              </button>
            )
          })}
        </div>

        <div className="flex min-h-[17.5rem] border-t border-border/70 sm:min-h-[20rem] md:min-h-[22rem]">
          <div className="hidden w-40 shrink-0 flex-col border-r border-border/70 bg-surface-muted/30 md:flex lg:w-48 xl:w-52">
            {visibleConversations.map((conversation) => {
              const isSelected = conversation.id === selected.id
              return (
                <button
                  key={conversation.id}
                  type="button"
                  tabIndex={-1}
                  onClick={() => setSelectedId(conversation.id)}
                  className={[
                    'flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors lg:gap-3 lg:px-3.5 lg:py-3',
                    listItemSelectedClass(conversation.platform, isSelected),
                  ].join(' ')}
                >
                  <div className="relative shrink-0">
                    <ProfilePhoto src={conversation.avatar} alt="" />
                    <span className="absolute -right-0.5 -bottom-0.5 rounded-full bg-white p-px shadow-soft">
                      <PlatformGlyph platform={conversation.platform} />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-ink">{conversation.name}</p>
                    <p className="mt-0.5 truncate text-[11px] text-ink-muted">{conversation.preview}</p>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center gap-2.5 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3">
              <div className="relative shrink-0">
                <ProfilePhoto src={selected.avatar} alt="" />
                <span className="absolute -right-0.5 -bottom-0.5 rounded-full bg-white p-px shadow-soft">
                  <PlatformGlyph platform={selected.platform} />
                </span>
              </div>
              <p className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{selected.name}</p>
              <span className="flex shrink-0 items-center gap-1.5 rounded-[var(--radius-pill)] bg-ink/95 px-2 py-0.5 text-[10px] text-on-dark">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-soft" />
                Live
              </span>
            </div>

            <div
              className={`flex flex-1 flex-col justify-end gap-2.5 overflow-hidden px-3 py-3 sm:gap-3 sm:px-4 sm:py-4 ${inboxThreadBackgroundClass(selected.platform)}`}
            >
              {threadMessages.map((message) => {
                const isOutbound = message.direction === 'outbound'
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOutbound ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={[
                        'max-w-[88%] rounded-2xl px-3 py-2 text-xs leading-relaxed sm:max-w-[80%] sm:px-3.5 sm:py-2.5 sm:text-[13px]',
                        isOutbound
                          ? `${outboundBubbleClass(selected.platform)} rounded-br-md`
                          : `${inboundBubbleClass()} rounded-bl-md`,
                      ].join(' ')}
                    >
                      {message.content}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="space-y-2 border-t border-border/70 bg-white/90 px-3 py-2.5 backdrop-blur-sm sm:space-y-2.5 sm:px-4 sm:py-3">
              {aiSuggestion ? (
                <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-accent-violet/20 bg-accent-violet/8 px-2.5 py-1.5 text-[10px] text-ink sm:px-3 sm:text-[11px]">
                  <span className="shrink-0 font-medium text-accent-violet">AI</span>
                  <span className="truncate text-ink-muted">{aiSuggestion}</span>
                </div>
              ) : null}
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="min-w-0 flex-1 rounded-full border border-border bg-surface-muted/40 px-3 py-2 sm:px-4 sm:py-2.5">
                  <p className="truncate text-xs text-ink-muted sm:text-sm">{selected.draft}</p>
                </div>
                <div
                  className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full sm:h-10 sm:w-10 ${composerSendButtonClass(true, selected.platform)}`}
                >
                  <SendIcon />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetaVerifiedBadge() {
  return (
    <div className="mb-4 inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[#0081FB]/20 bg-white/90 px-3 py-1.5 shadow-soft backdrop-blur-sm sm:mb-5 md:mb-6">
      <img src="/meta.png" alt="" className="h-4 w-4 shrink-0 object-contain" aria-hidden />
      <span className="text-[11px] font-semibold tracking-wide text-[#0081FB]">Meta Verified</span>
    </div>
  )
}

export function LandingHero() {
  return (
    <>
      <section className="bg-hero-gradient bg-grid-light relative overflow-x-hidden pt-24 pb-14 sm:pt-28 sm:pb-16 md:min-h-[100svh] md:pb-20 lg:pt-32">
        <LandingNavbar variant="light" />
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 sm:gap-10 sm:px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:gap-12 lg:px-8">
          <Reveal className="flex min-w-0 flex-col items-center text-center lg:items-start lg:text-left">
            <MetaVerifiedBadge />
            <h1 className="text-[1.75rem] leading-tight font-semibold tracking-tight text-ink sm:text-4xl md:text-5xl lg:text-6xl">
              One inbox, <span className="text-accent-gradient">every conversation.</span>
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink-muted sm:mt-5 sm:text-base md:mt-6 md:text-lg">
              Responza AI brings WhatsApp and Instagram into a single workspace with AI that suggests replies,
              translates messages, and helps you respond faster.
            </p>
            <div className="mt-6 flex w-full max-w-sm flex-col gap-3 sm:mt-8 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center lg:justify-start">
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
          <Reveal delay={150} className="mx-auto w-full min-w-0 max-w-md sm:max-w-xl lg:max-w-none">
            <HeroVisual />
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
              WhatsApp and Instagram are live today — more platforms are on the way.
            </p>
          </Reveal>

          <div className="mt-10 sm:mt-12 md:mt-14">
            <Reveal>
              <p className="text-center text-[10px] font-medium tracking-widest text-ink-faint uppercase">
                Available now
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
                            src={logo}
                            alt={label}
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
                  Coming soon
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
                          src={logo}
                          alt={label}
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
