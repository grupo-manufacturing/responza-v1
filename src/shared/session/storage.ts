import type { SubscriptionDetails } from '@/modules/settings/subscription.service'

const ORGANIZATION_STORAGE_KEY = 'organization'
const SUBSCRIPTION_STORAGE_KEY = 'subscription'
const BUSINESS_DETAILS_COMPLETED_KEY = 'businessDetailsCompleted'

export type TranslationLanguage =
  | 'hindi'
  | 'bengali'
  | 'telugu'
  | 'marathi'
  | 'tamil'
  | 'gujarati'
  | 'kannada'
  | 'malayalam'
  | 'punjabi'
  | 'odia'

export type StoredOrganization = {
  id: string
  email: string
  name: string
  plan: string
  preferredTranslationLanguage: TranslationLanguage | null
  emailVerified: boolean
  agentEnabled: boolean
  agentDailyLimit: number
  agentRepliesUsedToday: number
}

export type StoredBusinessDetails = {
  completed: boolean
  completedAt: string | null
}

export class SessionStorage {
  static saveTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
  }

  static saveSessionProfile(session: {
    organization: StoredOrganization
    subscription: SubscriptionDetails
    businessDetails: StoredBusinessDetails
  }): void {
    localStorage.setItem(ORGANIZATION_STORAGE_KEY, JSON.stringify(session.organization))
    localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(session.subscription))
    localStorage.setItem(BUSINESS_DETAILS_COMPLETED_KEY, String(session.businessDetails.completed))
  }

  static isBusinessDetailsCompleted(): boolean {
    return localStorage.getItem(BUSINESS_DETAILS_COMPLETED_KEY) === 'true'
  }

  static setBusinessDetailsCompleted(completed: boolean): void {
    localStorage.setItem(BUSINESS_DETAILS_COMPLETED_KEY, String(completed))
  }

  static getStoredOrganization(): StoredOrganization | null {
    const raw = localStorage.getItem(ORGANIZATION_STORAGE_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as StoredOrganization
    } catch {
      return null
    }
  }

  static getStoredSubscription(): SubscriptionDetails | null {
    const raw = localStorage.getItem(SUBSCRIPTION_STORAGE_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as SubscriptionDetails
    } catch {
      return null
    }
  }

  static clearTokens(): void {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem(ORGANIZATION_STORAGE_KEY)
    localStorage.removeItem(SUBSCRIPTION_STORAGE_KEY)
    localStorage.removeItem(BUSINESS_DETAILS_COMPLETED_KEY)
  }

  static isAuthenticated(): boolean {
    return localStorage.getItem('accessToken') !== null
  }
}
