import api from '@/shared/api/client'

import type { ConversationListItem } from '@/features/inbox/api/inbox.service'

export interface DashboardStats {
  totalConversations: number
  conversationsByPlatform: {
    whatsapp: number
    instagram: number
  }
  avgResponseTimeSeconds: number | null
}

export interface DashboardResponse {
  stats: DashboardStats
  needsReply: ConversationListItem[]
  toNudge: ConversationListItem[]
}

export class DashboardService {
  static async getDashboard(): Promise<DashboardResponse> {
    const response = await api.get<{
      stats: DashboardStats
      needsReply: ConversationListItem[]
      toNudge: ConversationListItem[]
    }>('/dashboard')

    return {
      stats: response.data.stats,
      needsReply: response.data.needsReply,
      toNudge: response.data.toNudge,
    }
  }
}
