type AdminOverview = {
  organizationCount: number
  trialCount: number
  activeCount: number
  expiredCount: number
  conversationsToday: number
  conversationsThisWeek: number
}

type AdminOrganization = {
  id: string
  email: string
  name: string
  plan: string
  status: string
  storedStatus: string
  trialEndsAt: string
  subscriptionPeriodEndsAt: string | null
  razorpayCustomerId: string | null
  razorpaySubscriptionId: string | null
  conversationLimit: number | null
  emailVerified: boolean
  createdAt: string
  whatsappConnected: boolean
  instagramConnected: boolean
}

export type AdminDashboardResponse = {
  overview: AdminOverview
  organizations: AdminOrganization[]
}

export type AdminAffiliate = {
  id: string
  name: string
  code: string
  notes: string | null
  isActive: boolean
  referralCount: number
  activePaidReferralCount: number
  createdAt: string
  updatedAt: string
}

export type AdminAffiliateReferral = {
  id: string
  email: string
  name: string
  plan: string
  status: string
  conversationLimit: number | null
  referredAt: string | null
  createdAt: string
}

export type AdminAffiliatesListResponse = {
  affiliates: AdminAffiliate[]
}

export type AdminAffiliateReferralsResponse = {
  affiliate: AdminAffiliate
  referrals: AdminAffiliateReferral[]
}

