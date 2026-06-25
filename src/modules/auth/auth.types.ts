import type { SubscriptionDetails } from '@/modules/settings/subscription.service'
import type { StoredBusinessDetails, StoredOrganization } from '@/shared/session/storage'

export type AuthFormData = {
  email: string
  password: string
  name: string
}

export type AuthSession = {
  accessToken: string
  refreshToken: string
  expiresIn: number
  organization: StoredOrganization
  subscription: SubscriptionDetails
  businessDetails: StoredBusinessDetails
}

export type MeResponse = {
  organization: StoredOrganization
  subscription: SubscriptionDetails
  businessDetails: StoredBusinessDetails
}

export type RegisterPendingResponse = {
  requiresVerification: true
  email: string
}

export function isRegisterPending(
  response: AuthSession | RegisterPendingResponse,
): response is RegisterPendingResponse {
  return 'requiresVerification' in response && response.requiresVerification === true
}
