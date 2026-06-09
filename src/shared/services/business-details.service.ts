import api from '@/shared/api/client'

import type {
  AiRestrictions,
  CommonConversationTypes,
  CustomerMessageLanguage,
  CustomerTone,
} from '@/shared/constants/business-details'

export interface BusinessDetailsProfile {
  organizationId: string
  brandAndProducts: string | null
  customerTone: CustomerTone | null
  sampleCustomerReply: string | null
  commonConversationTypes: CommonConversationTypes | null
  customerMessageLanguage: CustomerMessageLanguage | null
  signaturePhrases: string | null
  aiRestrictions: AiRestrictions | null
  completed: boolean
  completedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface CompleteBusinessDetailsPayload {
  brandAndProducts: string
  customerTone: CustomerTone
  sampleCustomerReply: string
  commonConversationTypes: CommonConversationTypes
  customerMessageLanguage: CustomerMessageLanguage
  signaturePhrases: string
  aiRestrictions: AiRestrictions
}

export interface BusinessDetailsResponse {
  profile: BusinessDetailsProfile
}

export class BusinessDetailsService {
  static async getBusinessDetails(): Promise<BusinessDetailsResponse> {
    const response = await api.get<BusinessDetailsResponse>('/business-details')
    return response.data
  }

  static async completeBusinessDetails(
    data: CompleteBusinessDetailsPayload,
  ): Promise<BusinessDetailsResponse> {
    const response = await api.post<BusinessDetailsResponse>('/business-details/complete', data)
    return response.data
  }
}

export default BusinessDetailsService
