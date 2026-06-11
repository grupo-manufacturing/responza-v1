export const LEAD_STATUS_VALUES = [
  'new',
  'contacted',
  'qualified',
  'proposal_sent',
  'won',
  'lost',
] as const

export type LeadStatus = (typeof LEAD_STATUS_VALUES)[number]

export const LEAD_STATUS_OPTIONS = [
  { value: 'new' as const, label: 'New' },
  { value: 'contacted' as const, label: 'Contacted' },
  { value: 'qualified' as const, label: 'Qualified' },
  { value: 'proposal_sent' as const, label: 'Proposal sent' },
  { value: 'won' as const, label: 'Won' },
  { value: 'lost' as const, label: 'Lost' },
]

const STATUS_TO_API: Record<LeadStatus, string> = {
  new: 'new',
  contacted: 'contacted',
  qualified: 'qualified',
  proposal_sent: 'proposalSent',
  won: 'won',
  lost: 'lost',
}

const STATUS_FROM_API: Record<string, LeadStatus> = {
  new: 'new',
  contacted: 'contacted',
  qualified: 'qualified',
  proposalSent: 'proposal_sent',
  won: 'won',
  lost: 'lost',
}

export function leadStatusToApi(status: LeadStatus): string {
  return STATUS_TO_API[status]
}

export function leadStatusFromApi(status: string): LeadStatus {
  const mapped = STATUS_FROM_API[status]
  if (mapped === undefined) {
    throw new Error(`Invalid lead status: ${status}`)
  }

  return mapped
}

export function leadStatusLabel(status: LeadStatus): string {
  const match = LEAD_STATUS_OPTIONS.find((option) => option.value === status)
  return match?.label ?? status
}
