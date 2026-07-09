import { Link } from 'react-router-dom'

import { PLAN_FEATURES, PRICING_PLANS } from '../landing.constants'
import { Reveal } from '../landing-ui'
import {
  billingIntervalSuffix,
  conversationQuotaLabel,
  type BillingPlanInterval,
} from '@/shared/utils/billing-display'

function formatInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function CheckIcon({ className }: { readonly className: string }) {
  return (
    <svg className={`h-4 w-4 shrink-0 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  )
}

function PricingCard({
  label,
  description,
  amountInr,
  conversationLimit,
  interval,
  highlight = false,
  freeTrial = false,
}: {
  readonly label: string
  readonly description: string
  readonly amountInr: number
  readonly conversationLimit: number
  readonly interval: BillingPlanInterval
  readonly highlight?: boolean
  readonly freeTrial?: boolean
}) {
  const mutedClass = highlight ? 'text-on-dark-muted' : 'text-ink-muted'
  const faintClass = highlight ? 'text-on-dark-muted' : 'text-ink-faint'
  const checkClass = highlight ? 'text-accent-soft' : 'text-accent'
  const quotaPeriodLabel = interval === 'yearly' ? 'Annual quota' : 'Monthly quota'

  return (
    <article
      className={[
        'hover-lift relative flex h-full flex-col rounded-[var(--radius-card-lg)] border p-6 sm:p-7',
        highlight
          ? 'z-10 border-accent/35 bg-gradient-to-b from-ink via-ink to-surface-dark text-on-dark shadow-card ring-1 ring-accent/25'
          : 'border-border bg-white shadow-soft',
      ].join(' ')}
    >
      {highlight && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-[var(--radius-pill)] bg-accent px-3 py-1 text-[10px] font-semibold tracking-wide text-white uppercase">
          Best value
        </span>
      )}
      <div className="flex items-start justify-between gap-2">
        <p className={`text-sm font-semibold tracking-wide uppercase ${mutedClass}`}>{label}</p>
        {freeTrial && (
          <span className="shrink-0 rounded-[var(--radius-pill)] border border-accent/25 bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
            3-day trial
          </span>
        )}
      </div>
      <p className={`mt-2 text-sm leading-relaxed ${mutedClass}`}>{description}</p>
      <div className="mt-4">
        <p className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {formatInr(amountInr)}
          <span className={`text-sm font-normal ${faintClass}`}>{billingIntervalSuffix(interval)}</span>
        </p>
        <p className={`mt-1 text-xs ${faintClass}`}>GST inclusive</p>
      </div>
      <div
        className={[
          'mt-4 rounded-xl px-3 py-2.5',
          highlight ? 'border border-accent/20 bg-white/5' : 'border border-accent/15 bg-accent/5',
        ].join(' ')}
      >
        <p className={`text-xs font-medium uppercase tracking-wide ${highlight ? 'text-accent-soft' : 'text-accent'}`}>
          {quotaPeriodLabel}
        </p>
        <p className={`mt-0.5 text-sm font-medium ${highlight ? 'text-on-dark' : 'text-ink'}`}>
          {conversationQuotaLabel(interval, conversationLimit)}
        </p>
      </div>
      <ul className="mt-5 flex-1 space-y-2.5">
        {PLAN_FEATURES.map((feature) => (
          <li key={feature} className={`flex items-start gap-2 text-sm ${mutedClass}`}>
            <CheckIcon className={`mt-0.5 ${checkClass}`} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Link
        to="/auth?mode=register"
        className={[
          'mt-6 inline-flex h-11 items-center justify-center rounded-[var(--radius-pill)] text-sm font-medium transition-colors',
          highlight ? 'bg-on-dark text-ink hover:bg-on-dark/90' : 'bg-ink text-on-dark hover:bg-ink/90',
        ].join(' ')}
      >
        {freeTrial ? 'Start free trial' : 'Get started'}
      </Link>
    </article>
  )
}

export function LandingPricing() {
  return (
    <section id="pricing" className="bg-surface-muted py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
            Two simple plans. Every feature included.
          </h2>
          <p className="mt-4 text-base text-ink-muted">
            Start with a 3-day free trial, then choose Basic monthly or Responza Annual. Same powerful
            inbox, AI tools, and lead management — only conversation volume changes.
          </p>
        </Reveal>

        <div className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-3 text-center text-sm text-ink-muted">
          <span className="rounded-[var(--radius-pill)] border border-border bg-white px-3 py-1.5 shadow-soft">
            Basic · {formatInr(499)}/month · 1,000 conversations
          </span>
          <span className="rounded-[var(--radius-pill)] border border-accent/20 bg-accent/5 px-3 py-1.5 text-ink">
            Responza Annual · {formatInr(4_999)}/year · 30,000 conversations / year
          </span>
        </div>

        <div className="mt-12 grid items-stretch gap-5 sm:mt-16 sm:grid-cols-2 sm:gap-6 lg:mx-auto lg:max-w-4xl">
          {PRICING_PLANS.map((plan, index) => (
            <Reveal key={plan.key} delay={index * 80} className="h-full">
              <PricingCard
                label={plan.label}
                description={plan.description}
                amountInr={plan.amountInr}
                conversationLimit={plan.conversationLimit}
                interval={plan.interval}
                highlight={plan.highlight}
                freeTrial={plan.freeTrial}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
