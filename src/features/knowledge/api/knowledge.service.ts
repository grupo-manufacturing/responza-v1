import api from '@/shared/api/client'

export type AgentStatus = 'ready' | 'building' | 'not_built' | 'failed'

export type AgentStatusResponse = {
  status: AgentStatus
  chunkCount: number
  lastError: string | null
  lastBuiltAt: string | null
}

export class KnowledgeService {
  static async getAgentStatus(): Promise<AgentStatusResponse> {
    const response = await api.get<AgentStatusResponse>('/knowledge/agent-status')
    return response.data
  }
}
