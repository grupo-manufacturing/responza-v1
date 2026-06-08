import api from '@/shared/api/client'

import type { LeadStatus } from '@/shared/constants/leads'

export interface Lead {
  id: string
  organizationId: string
  conversationId: string | null
  assignedTo: string | null
  name: string
  email: string | null
  phone: string | null
  notes: string | null
  source: string
  status: LeadStatus
  metadata: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface ListLeadsParams {
  limit?: number
  cursor?: string
  status?: LeadStatus
}

export interface ListLeadsResponse {
  leads: Lead[]
  page: {
    nextCursor: string | null
    limit: number
  }
}

export interface LeadResponse {
  lead: Lead
}

export interface CreateLeadPayload {
  name: string
  email?: string
  phone?: string
  notes?: string
  status?: LeadStatus
  metadata?: Record<string, unknown>
}

export interface UpdateLeadPayload {
  name?: string
  email?: string
  phone?: string
  notes?: string
  status?: LeadStatus
  metadata?: Record<string, unknown>
}

export class LeadsService {
  static async listLeads(params: ListLeadsParams = {}): Promise<ListLeadsResponse> {
    const response = await api.get<ListLeadsResponse>('/leads', { params })
    return response.data
  }

  static async getLead(id: string): Promise<LeadResponse> {
    const response = await api.get<LeadResponse>(`/leads/${id}`)
    return response.data
  }

  static async createLead(payload: CreateLeadPayload): Promise<LeadResponse> {
    const response = await api.post<LeadResponse>('/leads', payload)
    return response.data
  }

  static async updateLead(id: string, payload: UpdateLeadPayload): Promise<LeadResponse> {
    const response = await api.patch<LeadResponse>(`/leads/${id}`, payload)
    return response.data
  }

  static async deleteLead(id: string): Promise<void> {
    await api.delete(`/leads/${id}`)
  }
}

export default LeadsService
