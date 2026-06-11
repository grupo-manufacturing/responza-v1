import { useEffect, useState } from 'react'

import { SpinnerSection } from '@/components/ui/Spinner'
import {
  subscriptionBadgeClass,
  subscriptionBadgeText,
  subscriptionPlanLabel,
} from '@/shared/utils/subscription-display'
import { SubscriptionService, type SubscriptionDetails } from '@/modules/settings/subscription.service'

export function SubscriptionPanel() {
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    void SubscriptionService.getSubscription()
      .then((data) => {
        if (!cancelled) setSubscription(data)
      })
      .catch(() => {
        if (!cancelled) setError('Could not load subscription details.')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (isLoading) {
    return <SpinnerSection label="Loading subscription..." minHeightClassName="min-h-[20rem]" />
  }

  if (error !== null || subscription === null) {
    return (
      <div className="max-w-2xl rounded-2xl border border-red-100 bg-red-50/50 p-6 text-sm text-red-600">
        {error ?? 'Subscription unavailable.'}
      </div>
    )
  }

  const planTitle = subscriptionPlanLabel(subscription.status, subscription.plan)
  const trialDays =
    subscription.daysRemainingInTrial !== null
      ? `${subscription.daysRemainingInTrial} day${subscription.daysRemainingInTrial === 1 ? '' : 's'} left`
      : null

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-neutral-900">Subscription & billing</h2>
        <p className="mt-1 text-sm text-neutral-500">
          Manage your plan, trial status, and billing details.
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-start justify-between gap-4 border-b border-neutral-100 pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Current plan</p>
            <p className="mt-1 text-xl font-semibold text-neutral-900">{planTitle}</p>
            <p className="mt-1 text-sm text-neutral-600">
              {subscription.isTrialing && trialDays !== null
                ? `Full access during your trial — ${trialDays}.`
                : subscription.hasAccess
                  ? 'Full access on your current plan.'
                  : 'Upgrade to restore access.'}
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${subscriptionBadgeClass(subscription.status)}`}
          >
            {subscriptionBadgeText(subscription.status, subscription.hasAccess)}
          </span>
        </div>

        <ul className="mt-6 space-y-3 text-sm text-neutral-600">
          <li className="flex gap-2">
            <span className="font-medium text-neutral-900">Plan</span>
            <span>— {subscription.plan}</span>
          </li>
          <li className="flex gap-2">
            <span className="font-medium text-neutral-900">Status</span>
            <span>— {subscription.status}</span>
          </li>
          {subscription.isTrialing && (
            <li className="flex gap-2">
              <span className="font-medium text-neutral-900">Trial ends</span>
              <span>— {new Date(subscription.trialEndsAt).toLocaleDateString()}</span>
            </li>
          )}
          <li className="flex gap-2">
            <span className="font-medium text-neutral-900">Billing</span>
            <span>— Stripe checkout coming soon</span>
          </li>
        </ul>

        <button
          type="button"
          disabled
          className="mt-8 w-full cursor-not-allowed rounded-xl bg-neutral-100 px-4 py-3 text-sm font-semibold text-neutral-400"
        >
          Upgrade plan (coming soon)
        </button>
      </div>
    </div>
  )
}
