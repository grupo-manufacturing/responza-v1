export const LEAD_STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'proposalSent', label: 'Proposal sent' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
] as const

export type LeadStatus = (typeof LEAD_STATUS_OPTIONS)[number]['value']

export function leadStatusLabel(status: LeadStatus): string {
  const match = LEAD_STATUS_OPTIONS.find((option) => option.value === status)
  return match?.label ?? status
}
