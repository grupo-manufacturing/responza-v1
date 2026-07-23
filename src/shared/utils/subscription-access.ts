import type { SubscriptionDetails } from '@/features/settings/api/subscription.service'

export type SubscriptionLike = Pick<SubscriptionDetails, 'isTrialing' | 'hasAccess'>

export function isTrialSubscription(
  subscription: SubscriptionLike | null | undefined,
): boolean {
  return subscription?.isTrialing === true
}

export function canAccessAiAnalytics(
  subscription: SubscriptionLike | null | undefined,
): boolean {
  return !isTrialSubscription(subscription)
}

export function resolveDefaultAppPath(
  subscription: SubscriptionLike | null | undefined,
): '/whatsapp' | '/dashboard' {
  return isTrialSubscription(subscription) ? '/whatsapp' : '/dashboard'
}

export function resolvePostAuthPath(
  businessDetailsCompleted: boolean,
  subscription: SubscriptionLike | null | undefined,
): string {
  if (!businessDetailsCompleted) {
    return '/business'
  }

  return resolveDefaultAppPath(subscription)
}

export function sanitizePostAuthDestination(
  path: string,
  subscription: SubscriptionLike | null | undefined,
): string {
  if (path === '/dashboard' && isTrialSubscription(subscription)) {
    return '/whatsapp'
  }

  return path
}
