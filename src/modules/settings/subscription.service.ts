import api from '@/shared/api/client'

export interface SubscriptionDetails {
  plan: string
  status: string
  hasAccess: boolean
  isTrialing: boolean
  isPaid: boolean
  trialStartedAt: string
  trialEndsAt: string
  subscriptionPeriodEndsAt: string | null
  daysRemainingInTrial: number | null
  requiresPayment: boolean
  conversationQuotaEnforced: boolean
  conversationLimit: number | null
  conversationsUsed: number | null
  conversationsRemaining: number | null
}

export type BillingPlanPublic = {
  key: string
  label: string
  conversationLimit: number
  amountPaise: number
  amountInr: number
  currency: 'INR'
  interval: 'monthly' | 'yearly'
}

export type BillingPlansCatalog = {
  plans: BillingPlanPublic[]
  razorpayConfigured: boolean
  checkoutAvailable: boolean
  razorpayMode: 'test' | 'live' | 'unknown'
}

type CheckoutSession = {
  keyId: string
  subscriptionId: string
  shortUrl: string | null
  status: string
  startAt: number | null
}

export type CheckoutResponse = {
  checkout: CheckoutSession
  plan: BillingPlanPublic
}

export class SubscriptionService {
  static async getSubscription(): Promise<SubscriptionDetails> {
    const response = await api.get<{ subscription: SubscriptionDetails }>('/subscription')
    return response.data.subscription
  }

  static async getPlans(): Promise<BillingPlansCatalog> {
    const response = await api.get<BillingPlansCatalog>('/subscription/plans')
    return response.data
  }

  static async createCheckout(planKey: string): Promise<CheckoutResponse> {
    const response = await api.post<CheckoutResponse>('/subscription/checkout', { plan: planKey })
    return response.data
  }

  static async cancelSubscription(cancelAtCycleEnd = true): Promise<{
    razorpayStatus: string
    cancelAtCycleEnd: boolean
  }> {
    const response = await api.post<{ razorpayStatus: string; cancelAtCycleEnd: boolean }>(
      '/subscription/cancel',
      { cancelAtCycleEnd },
    )
    return response.data
  }

  static async syncFromRazorpay(): Promise<SubscriptionDetails> {
    const response = await api.post<{ subscription: SubscriptionDetails }>('/subscription/sync')
    return response.data.subscription
  }
}
