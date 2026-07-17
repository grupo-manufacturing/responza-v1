import { Reveal, SectionBadge } from '@/shared/ui/brand-ui'

const AFFILIATE_STEPS = [
  {
    step: '01',
    title: 'Get your code',
    description: 'Apply to join. We create a unique referral code for you to share with your audience.',
  },
  {
    step: '02',
    title: 'Share Responza',
    description: 'Promote the product. People enter your code on the last step of business onboarding.',
  },
  {
    step: '03',
    title: 'Earn every month',
    description: '₹50 for each referred business that keeps an active paid subscription — paid monthly.',
  },
] as const

export function LandingAffiliate() {
  return (
    <section id="affiliate" className="relative overflow-hidden bg-grid-dark py-20 text-on-dark sm:py-28">
      <div
        className="pointer-events-none absolute top-1/3 left-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-0 bottom-1/4 h-64 w-64 rounded-full bg-accent-violet/8 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionBadge variant="dark" tone="teal">
            Affiliate
          </SectionBadge>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-4xl">
            Earn by sharing Responza with your{' '}
            <span className="text-accent-gradient-dark">audience.</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-on-dark-muted">
            Built for creators and influencers. Share your referral code, help businesses unify WhatsApp
            and Instagram — and earn ₹50 every month for each active paid signup.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-3 sm:gap-5">
          {AFFILIATE_STEPS.map((item, index) => (
            <Reveal key={item.step} delay={index * 80}>
              <article className="glass-dark h-full rounded-[var(--radius-card-lg)] p-5 sm:p-6">
                <p className="text-xs font-semibold tracking-widest text-accent-soft">{item.step}</p>
                <h3 className="mt-3 text-lg font-semibold tracking-tight text-on-dark">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-on-dark-muted">{item.description}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} className="mx-auto mt-12 max-w-2xl text-center sm:mt-14">
          <p className="text-sm text-on-dark-muted">
            Payouts are for <span className="text-on-dark">active paid subscriptions</span> only — trials
            don’t count. Interested in joining?
          </p>
          <a
            href="mailto:contact@responza.in?subject=Affiliate%20program%20application"
            className="mt-5 inline-flex items-center justify-center gap-1.5 rounded-[var(--radius-pill)] bg-on-dark px-5 py-2 text-sm font-medium text-ink transition-all duration-200 hover:bg-on-dark/90"
          >
            Apply as an affiliate
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </Reveal>
      </div>
    </section>
  )
}
