export type BillingPlanInterval = 'monthly' | 'yearly'

const PLAN_LABELS: Record<string, string> = {
  basic: 'Basic',
  premium: 'Responza Annual',
  free: 'Free',
}

export function billingIntervalSuffix(interval: BillingPlanInterval): string {
  return interval === 'yearly' ? '/year' : '/month'
}

export function conversationQuotaLabel(interval: BillingPlanInterval, limit: number): string {
  const period = interval === 'yearly' ? 'year' : 'month'
  return `${limit.toLocaleString('en-IN')} conversations / ${period}`
}

export function formatPlanLabel(plan: string): string {
  return PLAN_LABELS[plan] ?? plan
}

export function formatInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function planBillingInterval(planKey: string): BillingPlanInterval {
  return planKey === 'premium' ? 'yearly' : 'monthly'
}
