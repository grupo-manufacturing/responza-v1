import api from '@/shared/api/client'

export type AgentSettings = {
  organizationId: string
  enabled: boolean
  confidenceThreshold: number
  businessHoursEnabled: boolean
  businessHoursTimezone: string
  businessHoursStart: string
  businessHoursEnd: string
  createdAt: string
  updatedAt: string
}

export type UpdateAgentSettingsInput = {
  enabled?: boolean
  confidenceThreshold?: number
  businessHoursEnabled?: boolean
  businessHoursTimezone?: string
  businessHoursStart?: string
  businessHoursEnd?: string
}

export const AgentService = {
  async getSettings(): Promise<AgentSettings> {
    const { data } = await api.get<{ settings: AgentSettings }>('/agent/settings')
    return data.settings
  },

  async updateSettings(input: UpdateAgentSettingsInput): Promise<AgentSettings> {
    const { data } = await api.patch<{ settings: AgentSettings }>('/agent/settings', input)
    return data.settings
  },
}
