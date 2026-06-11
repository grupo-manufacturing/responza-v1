import api from '@/shared/api/client'

import {
  leadStatusFromApi,
  leadStatusToApi,
  type LeadStatus,
} from './leads.constants'

interface ApiLead {
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

function mapLeadFromApi(raw: ApiLead): Lead {
  return {
    ...raw,
    status: leadStatusFromApi(raw.status),
  }
}

function mapCreatePayload(payload: CreateLeadPayload): Record<string, unknown> {
  return {
    ...payload,
    status: payload.status !== undefined ? leadStatusToApi(payload.status) : undefined,
  }
}

function mapUpdatePayload(payload: UpdateLeadPayload): Record<string, unknown> {
  return {
    ...payload,
    status: payload.status !== undefined ? leadStatusToApi(payload.status) : undefined,
  }
}

export class LeadsService {
  static async listLeads(params: ListLeadsParams = {}): Promise<ListLeadsResponse> {
    const apiParams =
      params.status !== undefined ? { status: leadStatusToApi(params.status) } : undefined
    const response = await api.get<{ leads: ApiLead[] }>('/leads', { params: apiParams })
    return { leads: response.data.leads.map(mapLeadFromApi) }
  }

  static async createLead(payload: CreateLeadPayload): Promise<LeadResponse> {
    const response = await api.post<{ lead: ApiLead }>('/leads', mapCreatePayload(payload))
    return { lead: mapLeadFromApi(response.data.lead) }
  }

  static async updateLead(id: string, payload: UpdateLeadPayload): Promise<LeadResponse> {
    const response = await api.patch<{ lead: ApiLead }>(`/leads/${id}`, mapUpdatePayload(payload))
    return { lead: mapLeadFromApi(response.data.lead) }
  }

  static async deleteLead(id: string): Promise<void> {
    await api.delete(`/leads/${id}`)
  }
}
