import type { LeadStatus } from '@/modules/leads/leads.constants'
import type { Lead } from '@/modules/leads/leads.service'
import { APP_INPUT_CLASS, APP_TEXTAREA_CLASS } from '@/shared/ui/app-ui'

export const leadInputClassName = APP_INPUT_CLASS

export const leadTextareaClassName = `${APP_TEXTAREA_CLASS} mt-1`

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
