import { INTEGRATION_PLATFORM_LOGOS } from '@/modules/integrations/integrations.constants'

import { AI_FEATURES, LANDING_AVATARS } from '../landing.constants'
import { ProfilePhoto, Reveal, SectionBadge, SectionDivider } from '../landing-ui'

function MockupShell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`hover-lift rounded-[var(--radius-card-lg)] border border-border bg-gradient-to-br from-white to-surface-muted p-4 shadow-card ${className}`}
    >
      {children}
    </div>
  )
}

function MockupShellDark({ children }: { children: React.ReactNode }) {
  return (
    <div className="hover-lift glass-dark rounded-[var(--radius-card-lg)] bg-gradient-to-br from-white/6 to-accent/5 p-4 shadow-card">
      {children}
    </div>
  )
}

function InboxVisual() {
  return (
    <MockupShell>
      <div className="mb-3 flex gap-2">
        <div className="h-2 w-2 rounded-full bg-red-400/70" />
        <div className="h-2 w-2 rounded-full bg-amber-400/70" />
        <div className="h-2 w-2 rounded-full bg-emerald-400/70" />
      </div>
      <div className="space-y-2">
        {[
          { name: 'Priya Sharma', platform: 'whatsapp' as const, unread: true, avatar: LANDING_AVATARS.priya },
          { name: 'Alex Chen', platform: 'instagram' as const, unread: false, avatar: LANDING_AVATARS.alex },
          { name: 'Maya Patel', platform: 'whatsapp' as const, unread: false, avatar: LANDING_AVATARS.maya },
        ].map((row, i) => (
          <div
            key={row.name}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${i === 0 ? 'bg-white shadow-soft ring-1 ring-accent/15' : 'bg-white/60'}`}
          >
            <ProfilePhoto src={row.avatar} alt={row.name} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-sm font-medium text-ink">{row.name}</p>
                <img src={INTEGRATION_PLATFORM_LOGOS[row.platform]} alt="" className="h-3.5 w-3.5 object-contain" />
              </div>
              <p className="truncate text-xs text-ink-muted">Thanks for the quote — can we discuss…</p>
            </div>
            {row.unread && <span className="h-2 w-2 shrink-0 rounded-full bg-accent animate-pulse-soft" />}
          </div>
        ))}
      </div>
    </MockupShell>
  )
}

function AiFeaturesVisual() {
  return (
    <MockupShellDark>
      <p className="text-xs text-on-dark-muted">Incoming message (Hindi)</p>
      <p className="mt-1.5 text-sm text-on-dark">क्या आप कल मिल सकते हैं?</p>
      <div className="mt-3 rounded-xl border border-accent-warm/25 bg-accent-warm/10 p-3">
        <p className="text-xs font-medium text-accent-warm">Translated</p>
        <p className="mt-1 text-sm text-on-dark-muted">Can we meet tomorrow?</p>
      </div>
      <div className="mt-3 rounded-xl border border-accent-violet/25 bg-gradient-to-br from-accent/15 to-accent-violet/10 p-3">
        <p className="text-xs font-medium text-accent-soft">Suggested reply</p>
        <p className="mt-1.5 text-sm leading-relaxed text-on-dark-muted">
          Yes! I&apos;m free tomorrow afternoon. Does 3 PM work for you?
        </p>
      </div>
      <div className="mt-4 border-t border-border-dark pt-3">
        <p className="text-xs font-medium text-on-dark-muted">Conversation summary</p>
        <p className="mt-1.5 text-sm leading-relaxed text-on-dark-muted">
          Customer wants to schedule a meeting. Recommended next step: confirm time slot.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
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
      </div>
    </MockupShellDark>
  )
}

function LeadsVisual() {
  return (
    <MockupShellDark>
      {[
        { name: 'Rahul Mehta', status: 'Hot lead', tone: 'bg-emerald-500/15 text-emerald-300/90' },
        { name: 'Sneha Kapoor', status: 'Follow up', tone: 'bg-accent-warm/15 text-accent-warm' },
      ].map((lead) => (
        <div
          key={lead.name}
          className="flex items-center justify-between gap-3 border-b border-border-dark py-3 last:border-0"
        >
          <div className="flex min-w-0 items-center gap-2">
            <img src={INTEGRATION_PLATFORM_LOGOS.whatsapp} alt="" className="h-4 w-4 shrink-0 object-contain" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-on-dark">{lead.name}</p>
              <p className="text-xs text-on-dark-muted">2h ago</p>
            </div>
          </div>
          <span className={`shrink-0 rounded-[var(--radius-pill)] px-2.5 py-0.5 text-[10px] font-medium ${lead.tone}`}>
            {lead.status}
          </span>
        </div>
      ))}
    </MockupShellDark>
  )
}

function FeatureBlock({
  variant,
  badge,
  badgeTone = 'teal',
  title,
  description,
  visual,
  reverse = false,
}: {
  readonly variant: 'light' | 'dark'
  readonly badge: string
  readonly badgeTone?: 'default' | 'teal' | 'warm' | 'violet'
  readonly title: React.ReactNode
  readonly description: React.ReactNode
  readonly visual: React.ReactNode
  readonly reverse?: boolean
}) {
  const isDark = variant === 'dark'
  const sectionClass = isDark ? 'bg-grid-dark text-on-dark' : 'bg-surface-light text-ink'
  const descClass = isDark ? 'text-on-dark-muted' : 'text-ink-muted'

  return (
    <section className={`relative overflow-hidden py-16 sm:py-28 ${sectionClass}`}>
      {isDark && (
        <div
          className={`pointer-events-none absolute ${reverse ? 'right-0' : 'left-0'} top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-accent-violet/8 blur-3xl`}
          aria-hidden
        />
      )}
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal className={reverse ? 'order-2 lg:order-2' : 'order-2 lg:order-1'} delay={reverse ? 120 : 0}>
            {visual}
          </Reveal>
          <Reveal className={reverse ? 'order-1 lg:order-1' : 'order-1 lg:order-2'} delay={reverse ? 0 : 120}>
            <SectionBadge variant={variant} tone={badgeTone}>
              {badge}
            </SectionBadge>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
            <div className={`mt-4 space-y-4 text-base leading-relaxed ${descClass}`}>{description}</div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export function LandingFeatures() {
  return (
    <>
      <section id="features" className="relative overflow-hidden bg-grid-dark py-20 sm:py-28">
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal>
            <SectionDivider label="Features" variant="dark" />
            <h2 className="mt-10 text-2xl font-semibold tracking-tight text-on-dark sm:text-4xl">
              Responza brings together all your customer conversations — and uses{' '}
              <span className="text-accent-gradient-dark">AI</span> to help you respond with clarity and speed.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-on-dark-muted">
              Whether messages arrive on WhatsApp or Instagram, your team sees one inbox, one history, and one
              place to act — without switching between apps.
            </p>
          </Reveal>
        </div>
      </section>

      <FeatureBlock
        variant="light"
        badge="Unified inbox"
        badgeTone="teal"
        title={
          <>
            All your messages in <span className="text-accent-gradient">one place.</span>
          </>
        }
        description={
          <p>
            WhatsApp and Instagram conversations arrive in a single inbox — sorted by latest activity, with
            platform context always visible.
          </p>
        }
        visual={<InboxVisual />}
      />

      <section className="relative overflow-hidden bg-grid-dark py-16 text-on-dark sm:py-28">
        <div
          className="pointer-events-none absolute right-0 top-1/3 h-72 w-72 rounded-full bg-accent-violet/10 blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <SectionBadge variant="dark" tone="violet">
              AI
            </SectionBadge>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-4xl">
              Reply smarter with <span className="text-accent-gradient-dark">built-in AI.</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid items-start gap-8 lg:mt-16 lg:grid-cols-2 lg:gap-12">
            <div className="order-2 space-y-4 lg:order-1">
              {AI_FEATURES.map((feature, index) => (
                <Reveal key={feature.label} delay={index * 80}>
                  <article className="glass-dark hover-lift rounded-[var(--radius-card-lg)] p-5 sm:p-6">
                    <SectionBadge variant="dark" tone={feature.tone}>
                      {feature.label}
                    </SectionBadge>
                    <h3 className="mt-3 text-base font-medium text-on-dark sm:text-lg">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-on-dark-muted">{feature.description}</p>
                  </article>
                </Reveal>
              ))}
            </div>
            <Reveal className="order-1 lg:sticky lg:top-28 lg:order-2" delay={120}>
              <AiFeaturesVisual />
            </Reveal>
          </div>
        </div>
      </section>

      <FeatureBlock
        variant="dark"
        badge="Lead management"
        badgeTone="teal"
        title={
          <>
            Track every prospect from <span className="text-accent-gradient-dark">first message</span> to close.
          </>
        }
        description={
          <p>
            Add notes, update status, and follow up without losing context. Leads stay linked to the
            conversations that created them.
          </p>
        }
        visual={<LeadsVisual />}
        reverse
      />
    </>
  )
}
