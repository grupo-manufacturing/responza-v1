import api from '@/shared/api/client'

import type { LeadStatus } from '@/shared/constants/leads'

export interface Lead {
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

export interface ListLeadsParams {
  status?: LeadStatus
}

export interface ListLeadsResponse {
  leads: Lead[]
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
}

export interface UpdateLeadPayload {
  name?: string
  email?: string
  phone?: string
  notes?: string
  status?: LeadStatus
}

export class LeadsService {
  static async listLeads(params: ListLeadsParams = {}): Promise<ListLeadsResponse> {
    const response = await api.get<ListLeadsResponse>('/leads', { params })
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
