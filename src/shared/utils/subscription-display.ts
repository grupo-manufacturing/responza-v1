import { formatPlanLabel } from '@/shared/utils/billing-display'

export function subscriptionPlanLabel(status: string, plan: string): string {
  if (status === 'trialing') return 'Free trial'
  if (status === 'active') return plan === 'free' ? 'Free plan' : formatPlanLabel(plan)
  if (status === 'expired') return 'Trial ended'
  return 'No active plan'
}

export function subscriptionStatusLabel(status: string): string {
  if (status === 'trialing') return 'Free trial'
  if (status === 'active') return 'Active plan'
  if (status === 'expired') return 'Trial ended'
  return 'Subscription'
}

export function subscriptionBadgeClass(status: string): string {
  if (status === 'active') return 'border border-accent/25 bg-accent/10 text-accent ring-accent/15'
  if (status === 'trialing') return 'border border-accent-warm/25 bg-accent-warm/10 text-accent-warm ring-accent-warm/15'
  return 'border border-border bg-surface-muted text-ink-muted ring-border'
}

export function subscriptionBadgeText(status: string, hasAccess: boolean): string {
  if (!hasAccess) return 'Expired'
  if (status === 'trialing') return 'Trial active'
  if (status === 'active') return 'Active'
  return 'Inactive'
}
