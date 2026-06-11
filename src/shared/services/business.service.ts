import api from '@/shared/api/client'

import type {
  AiRestrictions,
  CommonConversationTypes,
  CustomerMessageLanguage,
  CustomerTone,
} from '@/shared/constants/business'

export interface BusinessProfile {
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

export interface CompleteBusinessPayload {
  brandAndProducts: string
  customerTone: CustomerTone
  sampleCustomerReply: string
  commonConversationTypes: CommonConversationTypes
  customerMessageLanguage: CustomerMessageLanguage
  signaturePhrases: string
  aiRestrictions: AiRestrictions
}

export interface BusinessResponse {
  profile: BusinessProfile
}

export class BusinessService {
  static async getBusiness(): Promise<BusinessResponse> {
    const response = await api.get<BusinessResponse>('/business')
    return response.data
  }

  static async completeBusiness(data: CompleteBusinessPayload): Promise<BusinessResponse> {
    const response = await api.post<BusinessResponse>('/business/complete', data)
    return response.data
  }
}

export default BusinessService
