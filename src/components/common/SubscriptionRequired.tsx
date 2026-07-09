import { AppButtonLink, AppGateCard } from '@/shared/ui/app-ui'

type SubscriptionRequiredProps = {
  readonly variant?: 'expired' | 'pro'
  readonly embedded?: boolean
}

const COPY = {
  expired: {
    title: 'Your free trial has ended',
    description: 'Subscribe to continue using Responza AI.',
  },
  pro: {
    title: 'Upgrade to unlock this feature',
    description: 'This is a Pro feature. Subscribe to access Dashboard insights and AI Analytics.',
  },
} as const

export function SubscriptionRequired({ variant = 'expired', embedded = false }: SubscriptionRequiredProps) {
  const copy = COPY[variant]

  if (embedded) {
    return (
      <div className="px-2 py-10 text-center">
        <h2 className="text-base font-semibold text-ink sm:text-lg">{copy.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{copy.description}</p>
        <AppButtonLink to="/settings?tab=subscription" className="mt-6">
          View subscription
        </AppButtonLink>
      </div>
    )
  }

  return (
    <AppGateCard
      title={copy.title}
      description={copy.description}
      actionLabel="View subscription"
      actionTo="/settings?tab=subscription"
    />
  )
}
