import api from '@/shared/api/client'

import type { IntegrationPlatform, IntegrationStatus } from '@/shared/constants/integrations'

export interface IntegrationMetadata {
  phoneNumberId?: string
  wabaId?: string
  businessId?: string
}

export interface Integration {
  platform: IntegrationPlatform
  status: IntegrationStatus
  connectedAt: string | null
  disconnectedAt: string | null
  updatedAt: string | null
  metadata?: IntegrationMetadata
}

export interface AvailablePlatform {
  platform: IntegrationPlatform
  label: string
}

export interface ListIntegrationsResponse {
  integrations: Integration[]
  availablePlatforms: AvailablePlatform[]
}

export interface IntegrationResponse {
  integration: Integration
}

export interface WhatsAppConnectPayload {
  code: string
  session_info: {
    phone_number_id: string
    waba_id: string
    business_id?: string
  }
}

export class IntegrationsService {
  static async listIntegrations(): Promise<ListIntegrationsResponse> {
    const response = await api.get<ListIntegrationsResponse>('/integrations')
    return response.data
  }

  static async connectIntegration(
    platform: IntegrationPlatform,
    body: WhatsAppConnectPayload | Record<string, never> = {},
  ): Promise<IntegrationResponse> {
    const response = await api.post<IntegrationResponse>(`/integrations/${platform}/connect`, body)
    return response.data
  }

  static async connectWhatsApp(payload: WhatsAppConnectPayload): Promise<IntegrationResponse> {
    return IntegrationsService.connectIntegration('whatsapp', payload)
  }

  static async disconnectIntegration(platform: IntegrationPlatform): Promise<IntegrationResponse> {
    const response = await api.delete<IntegrationResponse>(`/integrations/${platform}`)
    return response.data
  }
}

export default IntegrationsService
