import { AppGateCard } from '@/shared/ui/app-ui'

export function SubscriptionRequired() {
  return (
    <AppGateCard
      title="Your free trial has ended"
      description="Subscribe to continue using Responza."
      actionLabel="View subscription"
      actionTo="/settings?tab=subscription"
    />
  )
}
