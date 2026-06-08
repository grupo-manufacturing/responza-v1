import type { LeadStatus } from '@/shared/constants/leads'
import type { Lead } from '@/shared/services/leads.service'

export const leadInputClassName =
  'mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900'

export type LeadFormValues = {
  name: string
  email: string
  phone: string
  notes: string
  status: LeadStatus
}

export function leadToFormValues(lead: Lead): LeadFormValues {
  return {
    name: lead.name,
    email: lead.email ?? '',
    phone: lead.phone ?? '',
    notes: lead.notes ?? '',
    status: lead.status,
  }
}

export function emptyLeadFormValues(status: LeadStatus = 'new'): LeadFormValues {
  return {
    name: '',
    email: '',
    phone: '',
    notes: '',
    status,
  }
}

export function formatLeadSource(source: string): string {
  if (source === 'manual') {
    return 'Manual'
  }
  return source.charAt(0).toUpperCase() + source.slice(1)
}
