import { PLAN_FEATURES, PLAY_STORE_URL, PRICING_PLANS } from '@/features/landing/constants'
import { CheckIcon, LandingButton, PlayIcon, Reveal, SectionHeading } from '@/shared/ui/brand-ui'

type BillingPlanInterval = 'monthly' | 'yearly'

function billingIntervalSuffix(interval: BillingPlanInterval): string {
  return interval === 'yearly' ? '/year' : '/month'
}

function conversationQuotaLabel(interval: BillingPlanInterval, limit: number): string {
  const period = interval === 'yearly' ? 'year' : 'month'
  return `${limit.toLocaleString('en-IN')} conversations / ${period}`
}

function formatInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function LandingPricing() {
  return (
    <section id="pricing" className="relative scroll-mt-16 overflow-hidden py-20 sm:py-28">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[34rem] bg-[radial-gradient(ellipse_60%_55%_at_50%_100%,rgb(52_224_161/0.16),transparent)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Pricing"
          title={
            <>
              Simple pricing. <span className="text-accent-gradient">Every feature included.</span>
            </>
          }
          description="Pick monthly or save with annual. Only the conversation quota changes, never the features."
        />

        <div className="mx-auto mt-14 grid max-w-4xl gap-5 md:grid-cols-2">
          {PRICING_PLANS.map((plan, index) => (
            <Reveal key={plan.key} delay={index * 110}>
              <div
                className={[
                  'relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card-lg)] p-7 sm:p-8',
                  plan.highlight
                    ? 'border border-accent/40 bg-[linear-gradient(160deg,rgb(52_224_161/0.14),rgb(164_147_255/0.08)_55%,rgb(255_255_255/0.02))] shadow-[0_30px_90px_-30px_rgb(52_224_161/0.45)]'
                    : 'card-surface',
                ].join(' ')}
              >
                {plan.highlight && (
                  <div
                    className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-white/[0.07]"
                    style={{ animation: 'sheen 6s ease-in-out infinite' }}
                    aria-hidden
                  />
                )}

                <div className="relative flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-ink">{plan.label}</h3>
                  {plan.badge !== null && (
                    <span className="rounded-full bg-brand px-3 py-1 text-[11px] font-semibold tracking-wide text-black">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <p className="relative mt-5 flex items-end gap-1.5">
                  <span className="text-5xl font-semibold tracking-[-0.04em] text-ink">{formatInr(plan.amountInr)}</span>
                  <span className="pb-1.5 text-sm text-ink-muted">{billingIntervalSuffix(plan.interval)}</span>
                </p>
                <p className="relative mt-1 text-xs text-ink-faint">
                  {conversationQuotaLabel(plan.interval, plan.conversationLimit)} · GST included
                </p>
                <p className="relative mt-5 text-sm leading-relaxed text-ink-muted">{plan.description}</p>

                <ul className="relative mt-7 space-y-3.5 border-t border-border-dark pt-7">
                  {PLAN_FEATURES.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-on-dark">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                        <CheckIcon className="h-3 w-3" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="relative mt-auto pt-9">
                  <LandingButton
                    to={PLAY_STORE_URL}
                    variant={plan.highlight ? 'accent' : 'secondary'}
                    size="lg"
                    className="w-full"
                  >
                    <PlayIcon className="h-5 w-5" />
                    Start free trial
                  </LandingButton>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p className="mx-auto mt-8 max-w-xl text-center text-xs leading-relaxed text-ink-faint">
            New accounts get a free trial. Subscriptions are billed through Google Play and renew until you cancel.
            Pricing may change before the public launch.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
