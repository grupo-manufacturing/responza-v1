import api from '@/shared/api/client'

import { leadStatusFromApi, type LeadStatus } from '@/modules/leads/leads.constants'
import type { ConversationListItem } from '@/modules/inbox/inbox.service'

interface ApiDashboardLead {
  id: string
  organizationId: string
  name: string
  email: string | null
  phone: string | null
  notes: string | null
  status: string
  createdAt: string
  updatedAt: string
}

export interface DashboardLead {
  id: string
  organizationId: string
  name: string
  email: string | null
  phone: string | null
  notes: string | null
  status: LeadStatus
  createdAt: string
  updatedAt: string
}

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
  leadsToFollowUp: DashboardLead[]
}

function mapLeadFromApi(raw: ApiDashboardLead): DashboardLead {
  return {
    ...raw,
    status: leadStatusFromApi(raw.status),
  }
}

export class DashboardService {
  static async getDashboard(): Promise<DashboardResponse> {
    const response = await api.get<{
      stats: DashboardStats
      needsReply: ConversationListItem[]
      toNudge: ConversationListItem[]
      leadsToFollowUp: ApiDashboardLead[]
    }>('/dashboard')

    return {
      stats: response.data.stats,
      needsReply: response.data.needsReply,
      toNudge: response.data.toNudge,
      leadsToFollowUp: response.data.leadsToFollowUp.map(mapLeadFromApi),
    }
  }
}