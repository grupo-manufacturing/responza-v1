import { useEffect, useRef, useState } from 'react'

import { INTEGRATION_PLATFORM_LOGOS } from '@/features/integrations/constants'
import { LANDING_AVATARS, LANDING_FEATURES } from '@/features/landing/constants'
import { ProfilePhoto, Reveal, SectionDivider } from '@/shared/ui/brand-ui'

type FeatureId = (typeof LANDING_FEATURES)[number]['id']

function MockupShellDark({ children }: { readonly children: React.ReactNode }) {
  return (
    <div className="glass-dark rounded-[var(--radius-card-lg)] bg-gradient-to-br from-white/6 to-accent/5 p-4 shadow-card sm:p-5">
      <div className="mb-4 flex gap-2">
        <div className="h-2 w-2 rounded-full bg-red-400/70" />
        <div className="h-2 w-2 rounded-full bg-amber-400/70" />
        <div className="h-2 w-2 rounded-full bg-emerald-400/70" />
      </div>
      {children}
    </div>
  )
}

function InboxVisual() {
  return (
    <MockupShellDark>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-on-dark">Inbox</p>
        <div className="flex gap-1.5">
          {(['All', 'WhatsApp', 'Instagram'] as const).map((tab, index) => (
            <span
              key={tab}
              className={[
                'rounded-[var(--radius-pill)] px-2.5 py-1 text-[10px] font-medium',
                index === 0 ? 'bg-on-dark text-ink' : 'bg-white/5 text-on-dark-muted',
              ].join(' ')}
            >
              {tab}
            </span>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        {[
          {
            name: 'Priya Sharma',
            platform: 'whatsapp' as const,
            preview: 'Thanks for the quote — can we discuss…',
            avatar: LANDING_AVATARS.priya,
            active: true,
          },
          {
            name: 'Alex Chen',
            platform: 'instagram' as const,
            preview: 'Do you ship internationally?',
            avatar: LANDING_AVATARS.alex,
            active: false,
          },
          {
            name: 'Maya Patel',
            platform: 'whatsapp' as const,
            preview: 'Interested in a demo for our team…',
            avatar: LANDING_AVATARS.maya,
            active: false,
          },
        ].map((row) => (
          <div
            key={row.name}
            className={[
              'flex items-center gap-3 rounded-xl px-3 py-2.5',
              row.active ? 'bg-white/10 ring-1 ring-accent/25' : 'bg-white/4',
            ].join(' ')}
          >
            <div className="relative shrink-0">
              <ProfilePhoto src={row.avatar} alt={row.name} />
              <span className="absolute -right-0.5 -bottom-0.5 rounded-full bg-surface-dark p-px">
                <img
                  src={INTEGRATION_PLATFORM_LOGOS[row.platform]}
                  alt=""
                  className="h-3 w-3 object-contain"
                />
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-on-dark">{row.name}</p>
              <p className="truncate text-xs text-on-dark-muted">{row.preview}</p>
            </div>
            {row.active ? <span className="h-2 w-2 shrink-0 rounded-full bg-accent animate-pulse-soft" /> : null}
          </div>
        ))}
      </div>
    </MockupShellDark>
  )
}

function RepliesVisual() {
  return (
    <MockupShellDark>
      <div className="flex items-start gap-3">
        <ProfilePhoto src={LANDING_AVATARS.priya} alt="Priya Sharma" />
        <div className="min-w-0 flex-1 rounded-2xl rounded-tl-md border border-border-dark bg-white/5 px-3.5 py-2.5">
          <p className="text-sm leading-relaxed text-on-dark">
            Hi! Can I get a quote for your premium plan?
          </p>
        </div>
      </div>
      <p className="mt-5 text-[10px] font-medium tracking-widest text-on-dark-muted uppercase">
        Suggested replies
      </p>
      <div className="mt-2.5 space-y-2">
        {[
          'Of course — Premium is ₹4,999/year with 30k conversations.',
          'Happy to send a detailed quote today. Want a call too?',
        ].map((suggestion) => (
          <div
            key={suggestion}
            className="rounded-2xl border border-accent-violet/25 bg-accent-violet/10 px-3.5 py-2.5 text-sm leading-relaxed text-on-dark"
          >
            {suggestion}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 border-t border-border-dark pt-3">
        <div className="min-w-0 flex-1 rounded-full border border-border-dark bg-white/5 px-3.5 py-2">
          <p className="truncate text-xs text-on-dark-muted">Of course — Premium is ₹4,999/year…</p>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-violet text-white">
          <svg className="h-4 w-4 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </div>
      </div>
    </MockupShellDark>
  )
}

function TranslationVisual() {
  return (
    <MockupShellDark>
      <p className="text-xs text-on-dark-muted">Incoming message (Hindi)</p>
      <p className="mt-1.5 text-sm text-on-dark">क्या आप कल मिल सकते हैं?</p>
      <div className="mt-4 rounded-xl border border-accent-warm/25 bg-accent-warm/10 p-3.5">
        <p className="text-xs font-medium text-accent-warm">Translated</p>
        <p className="mt-1.5 text-sm text-on-dark">Can we meet tomorrow?</p>
      </div>
      <div className="mt-3 rounded-xl border border-accent-violet/25 bg-gradient-to-br from-accent/15 to-accent-violet/10 p-3.5">
        <p className="text-xs font-medium text-accent-soft">Suggested reply</p>
        <p className="mt-1.5 text-sm leading-relaxed text-on-dark-muted">
          Yes! I&apos;m free tomorrow afternoon. Does 3 PM work for you?
        </p>
      </div>
    </MockupShellDark>
  )
}

function AnalyticsVisual() {
  return (
    <MockupShellDark>
      <p className="text-xs font-medium text-on-dark-muted">Conversation summary</p>
      <p className="mt-2 text-sm leading-relaxed text-on-dark">
        Customer wants to schedule a meeting about Premium. Recommended next step: confirm a time slot
        and share pricing.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {[
          { label: 'Meeting', tone: 'border-accent/30 bg-accent/10 text-accent-soft' },
          { label: 'Follow-up', tone: 'border-border-dark bg-white/5 text-on-dark-muted' },
          { label: 'Urgent', tone: 'border-accent-warm/30 bg-accent-warm/10 text-accent-warm' },
        ].map((tag) => (
          <span
            key={tag.label}
            className={`rounded-[var(--radius-pill)] border px-2.5 py-0.5 text-xs ${tag.tone}`}
          >
            {tag.label}
          </span>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2 border-t border-border-dark pt-4">
        {[
          { value: '2.4m', label: 'Avg reply' },
          { value: '86%', label: 'Resolved' },
          { value: '12', label: 'Open' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl bg-white/5 px-2.5 py-3 text-center">
            <p className="text-sm font-semibold text-on-dark">{stat.value}</p>
            <p className="mt-0.5 text-[10px] text-on-dark-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </MockupShellDark>
  )
}

function FeatureVisual({ id }: { readonly id: FeatureId }) {
  switch (id) {
    case 'inbox':
      return <InboxVisual />
    case 'replies':
      return <RepliesVisual />
    case 'translation':
      return <TranslationVisual />
    case 'analytics':
      return <AnalyticsVisual />
  }
}

export function LandingFeatures() {
  const [activeIndex, setActiveIndex] = useState(0)
  const panelRefs = useRef<Array<HTMLElement | null>>([])

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)')

    const observePanels = () => {
      const panels = panelRefs.current.filter((panel): panel is HTMLElement => panel !== null)
      if (!media.matches || panels.length === 0) return () => {}

      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

          const top = visible[0]
          if (!top) return

          const index = panels.indexOf(top.target as HTMLElement)
          if (index >= 0) setActiveIndex(index)
        },
        {
          root: null,
          // Prefer the panel centered in the viewport
          rootMargin: '-40% 0px -40% 0px',
          threshold: [0, 0.25, 0.5, 0.75, 1],
        },
      )

      for (const panel of panels) observer.observe(panel)
      return () => observer.disconnect()
    }

    let cleanup = observePanels()
    const onChange = () => {
      cleanup()
      cleanup = observePanels()
    }

    media.addEventListener('change', onChange)
    return () => {
      cleanup()
      media.removeEventListener('change', onChange)
    }
  }, [])

  const activeFeature = LANDING_FEATURES[activeIndex] ?? LANDING_FEATURES[0]

  return (
    <section id="features" className="relative bg-grid-dark py-20 text-on-dark sm:py-28">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute top-[12%] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-accent/8 blur-3xl" />
        <div className="absolute right-0 bottom-[18%] h-72 w-72 rounded-full bg-accent-violet/8 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <Reveal>
          <SectionDivider label="Features" variant="dark" />
          <h2 className="mt-10 text-2xl font-semibold tracking-tight sm:text-4xl">
            Everything you need to reply with{' '}
            <span className="text-accent-gradient-dark">clarity and speed.</span>
          </h2>
          <p className="mt-6 text-base leading-relaxed text-on-dark-muted">
            One inbox for WhatsApp and Instagram, plus AI that suggests replies, translates messages, and
            surfaces what matters.
          </p>
        </Reveal>
      </div>

      {/* Mobile: feature cards — UI mockups are desktop */}
      <div className="relative mx-auto mt-12 grid max-w-xl gap-3 px-4 sm:mt-14 sm:gap-4 sm:px-6 lg:hidden">
        {LANDING_FEATURES.map((feature, index) => (
          <Reveal key={feature.id} delay={index * 60}>
            <article className="glass-dark rounded-[var(--radius-card-lg)] border border-border-dark px-5 py-5 sm:px-6 sm:py-6">
              <h3 className="text-lg font-semibold tracking-tight sm:text-xl">
                {feature.title}{' '}
                <span className="text-accent-gradient-dark">{feature.titleAccent}</span>
              </h3>
            </article>
          </Reveal>
        ))}
      </div>

      {/* Desktop: fixed left line + physically scrolling UIs on the right */}
      <div className="relative mx-auto mt-16 hidden max-w-6xl grid-cols-2 items-start gap-12 px-6 lg:grid xl:gap-16 xl:px-8">
        <div className="sticky top-0 flex h-screen items-center self-start">
          <h3
            key={activeFeature.id}
            className="animate-step-in max-w-md text-3xl font-semibold tracking-tight xl:text-4xl"
          >
            {activeFeature.title}{' '}
            <span className="text-accent-gradient-dark">{activeFeature.titleAccent}</span>
          </h3>
        </div>

        <div>
          {LANDING_FEATURES.map((feature, index) => (
            <div
              key={feature.id}
              ref={(node) => {
                panelRefs.current[index] = node
              }}
              className="flex min-h-screen items-center py-8"
            >
              <div className="w-full">
                <FeatureVisual id={feature.id} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}



