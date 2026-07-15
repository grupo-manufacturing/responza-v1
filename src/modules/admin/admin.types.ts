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
