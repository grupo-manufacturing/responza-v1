export function subscriptionPlanLabel(status: string, plan: string): string {
  if (status === 'trialing') return 'Free trial'
  if (status === 'active') return plan === 'free' ? 'Free plan' : plan
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
  if (status === 'active') return 'bg-neutral-900 text-white ring-neutral-900'
  if (status === 'trialing') return 'bg-neutral-100 text-neutral-800 ring-neutral-300'
  return 'bg-neutral-100 text-neutral-500 ring-neutral-200'
}

export function subscriptionBadgeText(status: string, hasAccess: boolean): string {
  if (!hasAccess) return 'Expired'
  if (status === 'trialing') return 'Trial active'
  if (status === 'active') return 'Active'
  return 'Inactive'
}
