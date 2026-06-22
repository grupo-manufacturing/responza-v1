import { useCallback, useEffect, useState } from 'react'

import { Alert } from '@/components/ui/Alert'
import { SpinnerSection } from '@/components/ui/Spinner'
import {
  SubscriptionService,
  type BillingPlanPublic,
  type SubscriptionDetails,
} from '@/modules/settings/subscription.service'
import { openRazorpaySubscriptionCheckout } from '@/modules/settings/lib/razorpayCheckout'
import { clearSessionCache, loadSession } from '@/shared/hooks/useSession'
import { SessionStorage } from '@/shared/session/storage'
import {
  subscriptionBadgeClass,
  subscriptionBadgeText,
  subscriptionPlanLabel,
} from '@/shared/utils/subscription-display'
import { getApiErrorMessage } from '@/shared/utils/api-error'

function formatInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function SubscriptionPanel() {
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(null)
  const [plans, setPlans] = useState<BillingPlanPublic[]>([])
  const [checkoutAvailable, setCheckoutAvailable] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [busyPlanKey, setBusyPlanKey] = useState<string | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)

  const reload = useCallback(async () => {
    const [subscriptionData, plansData] = await Promise.all([
      SubscriptionService.getSubscription(),
      SubscriptionService.getPlans(),
    ])
    setSubscription(subscriptionData)
    setPlans(plansData.plans)
    setCheckoutAvailable(plansData.checkoutAvailable)
  }, [])

  useEffect(() => {
    let cancelled = false

    void reload()
      .catch(() => {
        if (!cancelled) setError('Could not load subscription details.')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [reload])

  const handleSubscribe = async (plan: BillingPlanPublic) => {
    setActionError(null)
    setSuccessMessage(null)
    setBusyPlanKey(plan.key)

    try {
      const { checkout } = await SubscriptionService.createCheckout(plan.key)
      const organization = SessionStorage.getStoredOrganization()

      await openRazorpaySubscriptionCheckout({
        keyId: checkout.keyId,
        subscriptionId: checkout.subscriptionId,
        planLabel: plan.label,
        customerName: organization?.name,
        customerEmail: organization?.email,
        onSuccess: () => {
          setSuccessMessage(
            subscription?.isTrialing
              ? 'Payment method saved. Billing starts when your trial ends.'
              : 'Payment authorized. Your subscription will activate shortly.',
          )
          clearSessionCache()
          void loadSession()
          void reload()
        },
        onDismiss: () => {
          setBusyPlanKey(null)
        },
      })
    } catch (checkoutError) {
      setActionError(getApiErrorMessage(checkoutError, 'Could not start checkout. Please try again.'))
    } finally {
      setBusyPlanKey(null)
    }
  }

  const handleCancel = async () => {
    setActionError(null)
    setSuccessMessage(null)
    setIsCancelling(true)

    try {
      await SubscriptionService.cancelSubscription(true)
      setSuccessMessage('Subscription cancelled. You will keep access until the current period ends.')
      clearSessionCache()
      void loadSession()
      await reload()
    } catch (cancelError) {
      setActionError(getApiErrorMessage(cancelError, 'Could not cancel subscription. Please try again.'))
    } finally {
      setIsCancelling(false)
    }
  }

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
  const showPlanPicker = !subscription.isPaid
  const canCancel = subscription.isPaid && subscription.status === 'active'

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-neutral-900">Subscription & billing</h2>
        <p className="mt-1 text-sm text-neutral-500">
          Manage your plan, trial status, and billing details.
        </p>
      </div>

      {actionError !== null && (
        <Alert variant="error" className="mb-4">
          {actionError}
        </Alert>
      )}

      {successMessage !== null && (
        <Alert variant="success" className="mb-4">
          {successMessage}
        </Alert>
      )}

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
                  : 'Subscribe to restore access.'}
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
          {subscription.subscriptionPeriodEndsAt !== null && (
            <li className="flex gap-2">
              <span className="font-medium text-neutral-900">Current period ends</span>
              <span>— {new Date(subscription.subscriptionPeriodEndsAt).toLocaleDateString()}</span>
            </li>
          )}
          <li className="flex gap-2">
            <span className="font-medium text-neutral-900">Billing</span>
            <span>— Razorpay (GST inclusive)</span>
          </li>
        </ul>

        {subscription.isTrialing && (
          <p className="mt-6 text-sm text-neutral-600">
            Conversations are unlimited during your free trial.
          </p>
        )}

        {subscription.conversationQuotaEnforced &&
          subscription.conversationLimit !== null &&
          subscription.conversationsUsed !== null && (
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-neutral-900">Conversations this period</span>
                <span className="text-neutral-600">
                  {subscription.conversationsUsed.toLocaleString('en-IN')} /{' '}
                  {subscription.conversationLimit.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full bg-neutral-900 transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      (subscription.conversationsUsed / subscription.conversationLimit) * 100,
                    )}%`,
                  }}
                />
              </div>
              {subscription.conversationsRemaining !== null &&
                subscription.conversationsRemaining <= 0 && (
                  <Alert variant="warning" className="mt-4">
                    You have reached your monthly conversation limit. Upgrade your plan to start new
                    conversations. You can still reply in existing threads.
                  </Alert>
                )}
            </div>
          )}

        {canCancel && (
          <button
            type="button"
            onClick={() => void handleCancel()}
            disabled={isCancelling}
            className="mt-8 w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCancelling ? 'Cancelling...' : 'Cancel subscription'}
          </button>
        )}
      </div>

      {showPlanPicker && (
        <div className="mt-8">
          <h3 className="text-base font-semibold text-neutral-900">Choose a plan</h3>
          <p className="mt-1 text-sm text-neutral-500">
            All plans include the same features. Only conversation volume differs.
          </p>

          {!checkoutAvailable && (
            <Alert variant="warning" className="mt-4">
              Razorpay checkout is not configured on the server yet.
            </Alert>
          )}

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {plans.map((plan) => {
              const isBusy = busyPlanKey === plan.key

              return (
                <div
                  key={plan.key}
                  className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
                >
                  <p className="text-sm font-semibold text-neutral-900">{plan.label}</p>
                  <p className="mt-2 text-2xl font-bold text-neutral-900">
                    {formatInr(plan.amountInr)}
                    <span className="text-sm font-medium text-neutral-500">/month</span>
                  </p>
                  <p className="mt-2 text-sm text-neutral-600">
                    {plan.conversationLimit.toLocaleString('en-IN')} conversations / month
                  </p>
                  <button
                    type="button"
                    disabled={!checkoutAvailable || isBusy || busyPlanKey !== null}
                    onClick={() => void handleSubscribe(plan)}
                    className="mt-5 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400"
                  >
                    {isBusy ? 'Opening checkout...' : `Subscribe to ${plan.label}`}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
