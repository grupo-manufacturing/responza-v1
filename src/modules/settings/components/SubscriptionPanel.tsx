import { useCallback, useEffect, useState } from 'react'

import { Alert } from '@/components/ui/Alert'
import { SpinnerSection } from '@/components/ui/Spinner'
import {
  SubscriptionService,
  type BillingPlanPublic,
  type SubscriptionDetails,
} from '@/modules/settings/subscription.service'
import { openRazorpaySubscriptionCheckout } from '@/modules/settings/lib/razorpayCheckout'
import { AppButton, AppCard, AppProgressBar } from '@/shared/ui/app-ui'
import { SectionBadge } from '@/shared/ui/brand-ui'
import { clearSessionCache, loadSession } from '@/shared/hooks/useSession'
import { SessionStorage } from '@/shared/session/storage'
import {
  subscriptionBadgeClass,
  subscriptionBadgeText,
  subscriptionPlanLabel,
} from '@/shared/utils/subscription-display'
import {
  billingIntervalSuffix,
  conversationQuotaLabel,
  formatPlanLabel,
} from '@/shared/utils/billing-display'

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
  const [razorpayMode, setRazorpayMode] = useState<'test' | 'live' | 'unknown'>('unknown')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [busyPlanKey, setBusyPlanKey] = useState<string | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)

  const reload = useCallback(async () => {
    let subscriptionData = await SubscriptionService.getSubscription()
    const plansData = await SubscriptionService.getPlans()

    if (subscriptionData.isTrialing) {
      try {
        subscriptionData = await SubscriptionService.syncFromRazorpay()
      } catch {
        // No paid Razorpay subscription to sync yet.
      }
    }

    setSubscription(subscriptionData)
    setPlans(plansData.plans)
    setCheckoutAvailable(plansData.checkoutAvailable)
    setRazorpayMode(plansData.razorpayMode)
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
          void (async () => {
            setSuccessMessage('Payment successful. Your subscription is now active.')
            try {
              await SubscriptionService.syncFromRazorpay()
            } catch {
              // Webhook may still apply the update if sync fails.
            }
            clearSessionCache()
            void loadSession()
            void reload()
          })()
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
    return <SpinnerSection minHeightClassName="min-h-[20rem]" />
  }

  if (error !== null || subscription === null) {
    return <Alert variant="error">{error ?? 'Subscription unavailable.'}</Alert>
  }

  const planTitle = subscriptionPlanLabel(subscription.status, subscription.plan)
  const trialDays =
    subscription.daysRemainingInTrial !== null
      ? `${subscription.daysRemainingInTrial} day${subscription.daysRemainingInTrial === 1 ? '' : 's'} left`
      : null
  const showPlanPicker = !subscription.isPaid
  const canCancel = subscription.isPaid && subscription.status === 'active'

  const quotaPercent =
    subscription.conversationLimit !== null &&
    subscription.conversationsUsed !== null &&
    subscription.conversationLimit > 0
      ? Math.min(100, (subscription.conversationsUsed / subscription.conversationLimit) * 100)
      : 0

  return (
    <div className="max-w-3xl space-y-8">
      {razorpayMode === 'test' && (
        <Alert variant="warning">
          Razorpay is in <strong>test mode</strong>. Checkout uses test cards only — no real charges.
          Switch to live keys in your server environment when you are ready to bill customers.
        </Alert>
      )}
      {actionError !== null && <Alert variant="error">{actionError}</Alert>}
      {successMessage !== null && <Alert variant="success">{successMessage}</Alert>}

      <AppCard>
        <div className="flex items-start justify-between gap-4 border-b border-border pb-6">
          <div>
            <p className="text-xs font-medium tracking-wide text-ink-faint uppercase">Current plan</p>
            <p className="mt-1 text-xl font-semibold text-ink">{planTitle}</p>
            <p className="mt-1 text-sm text-ink-muted">
              {subscription.isTrialing && trialDays !== null
                ? `Full access during your trial — ${trialDays}.`
                : subscription.hasAccess
                  ? 'Full access on your current plan.'
                  : 'Subscribe to restore access.'}
            </p>
          </div>
          <span
            className={`rounded-[var(--radius-pill)] px-3 py-1 text-xs font-medium ring-1 ${subscriptionBadgeClass(subscription.status)}`}
          >
            {subscriptionBadgeText(subscription.status, subscription.hasAccess)}
          </span>
        </div>

        <ul className="mt-6 space-y-3 text-sm text-ink-muted">
          <li className="flex gap-2">
            <span className="font-medium text-ink">Plan</span>
            <span>{formatPlanLabel(subscription.plan)}</span>
          </li>
          <li className="flex gap-2">
            <span className="font-medium text-ink">Status</span>
            <span>{subscription.status}</span>
          </li>
          {subscription.isTrialing && (
            <li className="flex gap-2">
              <span className="font-medium text-ink">Trial ends</span>
              <span>{new Date(subscription.trialEndsAt).toLocaleDateString()}</span>
            </li>
          )}
          {subscription.subscriptionPeriodEndsAt !== null && (
            <li className="flex gap-2">
              <span className="font-medium text-ink">Current period ends</span>
              <span>{new Date(subscription.subscriptionPeriodEndsAt).toLocaleDateString()}</span>
            </li>
          )}
          <li className="flex gap-2">
            <span className="font-medium text-ink">Billing</span>
            <span>GST inclusive</span>
          </li>
        </ul>

        {subscription.isTrialing && (
          <p className="mt-6 text-sm text-ink-muted">
            Conversations are unlimited during your free trial.
          </p>
        )}

        {subscription.conversationQuotaEnforced &&
          subscription.conversationLimit !== null &&
          subscription.conversationsUsed !== null && (
            <div className="mt-6">
              <AppProgressBar
                value={quotaPercent}
                label={`${subscription.conversationsUsed.toLocaleString('en-IN')} / ${subscription.conversationLimit.toLocaleString('en-IN')} conversations this billing period`}
              />
              {subscription.conversationsRemaining !== null &&
                subscription.conversationsRemaining <= 0 && (
                  <Alert variant="warning" className="mt-4">
                    You have reached your conversation limit for this billing period. Upgrade your plan
                    to start new conversations. You can still reply in existing threads.
                  </Alert>
                )}
            </div>
          )}

        {canCancel && (
          <AppButton
            type="button"
            variant="secondary"
            onClick={() => void handleCancel()}
            disabled={isCancelling}
            className="mt-8 w-full"
          >
            {isCancelling ? 'Cancelling...' : 'Cancel subscription'}
          </AppButton>
        )}
      </AppCard>

      {showPlanPicker && (
        <div>
          <h3 className="text-base font-semibold text-ink">Choose a plan</h3>
          <p className="mt-1 text-sm text-ink-muted">
            All plans include the same features. Only conversation volume differs.
            {subscription.isTrialing && ' Your first payment is charged immediately when you subscribe.'}
          </p>

          {!checkoutAvailable && (
            <Alert variant="warning" className="mt-4">
              Checkout is not available yet. Please try again later.
            </Alert>
          )}

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {plans.map((plan) => {
              const isBusy = busyPlanKey === plan.key
              const isPremium = plan.key === 'premium'

              return (
                <AppCard
                  key={plan.key}
                  padding="compact"
                  className={[
                    'hover-lift flex flex-col',
                    isPremium ? 'border-accent/30 ring-1 ring-accent/15' : '',
                  ].join(' ')}
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-ink">{plan.label}</p>
                    {plan.key === 'basic' && (
                      <SectionBadge variant="light" tone="teal">
                        3-day trial
                      </SectionBadge>
                    )}
                    {isPremium && (
                      <SectionBadge variant="light" tone="violet">
                        Annual
                      </SectionBadge>
                    )}
                  </div>
                  <p className="text-2xl font-bold tracking-tight text-ink">
                    {formatInr(plan.amountInr)}
                    <span className="text-sm font-medium text-ink-muted">
                      {billingIntervalSuffix(plan.interval)}
                    </span>
                  </p>
                  <p className="mt-2 text-sm text-ink-muted">
                    {conversationQuotaLabel(plan.interval, plan.conversationLimit)}
                  </p>
                  <AppButton
                    type="button"
                    disabled={!checkoutAvailable || isBusy || busyPlanKey !== null}
                    onClick={() => void handleSubscribe(plan)}
                    className="mt-5 w-full"
                  >
                    {isBusy ? 'Opening checkout...' : `Subscribe to ${plan.label}`}
                  </AppButton>
                </AppCard>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
