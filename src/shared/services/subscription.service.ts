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
}

export class SubscriptionService {
  static async getSubscription(): Promise<SubscriptionDetails> {
    const response = await api.get<{ subscription: SubscriptionDetails }>('/subscription')
    return response.data.subscription
  }
}

export default SubscriptionService
