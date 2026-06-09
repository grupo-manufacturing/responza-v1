import api from '@/shared/api/client'

import type { IntegrationPlatform, IntegrationStatus } from '@/shared/constants/integrations'

export interface Integration {
  id?: string
  platform: IntegrationPlatform
  status: IntegrationStatus
}

export interface ListIntegrationsResponse {
  integrations: Integration[]
}

export interface ConnectIntegrationResponse {
  integration: Integration & { id: string }
}

export interface DisconnectIntegrationResponse {
  integration: Integration & { id: string }
}

export class IntegrationsService {
  static async listIntegrations(): Promise<ListIntegrationsResponse> {
    const response = await api.get<ListIntegrationsResponse>('/integrations')
    return response.data
  }

  static async connectIntegration(
    platform: IntegrationPlatform,
  ): Promise<ConnectIntegrationResponse> {
    const response = await api.post<ConnectIntegrationResponse>(`/integrations/${platform}/connect`, {})
    return response.data
  }

  static async disconnectIntegration(
    platform: IntegrationPlatform,
  ): Promise<DisconnectIntegrationResponse> {
    const response = await api.delete<DisconnectIntegrationResponse>(`/integrations/${platform}`)
    return response.data
  }
}

export default IntegrationsService
