import api from '@/shared/api/client'

import type { IntegrationPlatform, IntegrationStatus } from '@/features/integrations/constants'

export interface Integration {
  id?: string
  platform: IntegrationPlatform
  status: IntegrationStatus
}

export interface WhatsAppConnectSummary {
  display_name: string | null
  profile_picture_url: string | null
}

export interface InstagramConnectSummary {
  business_account_id: string
  user_id: string
  username: string | null
  profile_picture_url: string | null
}

export interface ConnectWhatsAppPayload {
  code: string
  session_info: {
    phone_number_id: string
    waba_id: string
    business_id?: string
  }
}

export interface ConnectInstagramPayload {
  code: string
  redirect_uri?: string
  session_info?: {
    business_account_id: string
    user_id: string
    username?: string
  }
}

export interface ListIntegrationsResponse {
  integrations: Integration[]
}

export interface ConnectIntegrationResponse {
  integration: Integration & { id: string }
  whatsapp?: WhatsAppConnectSummary
  instagram?: InstagramConnectSummary
}

export interface DisconnectIntegrationResponse {
  integration: Integration & { id: string }
}

export interface WhatsAppStatusResponse {
  connected: boolean
  whatsapp: WhatsAppConnectSummary | null
}

export interface InstagramStatusResponse {
  connected: boolean
  instagram: InstagramConnectSummary | null
}

export class IntegrationsService {
  static async listIntegrations(): Promise<ListIntegrationsResponse> {
    const response = await api.get<ListIntegrationsResponse>('/integrations')
    return response.data
  }

  static async connectIntegration(
    platform: IntegrationPlatform,
    payload: ConnectWhatsAppPayload | ConnectInstagramPayload | Record<string, never> = {},
  ): Promise<ConnectIntegrationResponse> {
    const response = await api.post<ConnectIntegrationResponse>(
      `/integrations/${platform}/connect`,
      payload,
    )
    return response.data
  }

  static async disconnectIntegration(
    platform: IntegrationPlatform,
  ): Promise<DisconnectIntegrationResponse> {
    const response = await api.delete<DisconnectIntegrationResponse>(`/integrations/${platform}`)
    return response.data
  }

  static async getWhatsAppStatus(): Promise<WhatsAppStatusResponse> {
    const response = await api.get<WhatsAppStatusResponse>('/integrations/whatsapp/status')
    return response.data
  }

  static async getInstagramStatus(): Promise<InstagramStatusResponse> {
    const response = await api.get<InstagramStatusResponse>('/integrations/instagram/status')
    return response.data
  }
}
