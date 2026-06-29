import { leadStatusLabel } from '@/modules/leads/leads.constants'
import type { Lead } from '@/modules/leads/leads.service'
import { LEADS_STATUS_BADGE_CLASS } from '@/modules/leads/leads-ui'
import { AppCard } from '@/shared/ui/app-ui'

import { LeadRowActions } from './LeadRowActions'

type LeadsCardsProps = {
  leads: Lead[]
  onView: (lead: Lead) => void
  onEdit: (lead: Lead) => void
  onDelete: (lead: Lead) => void
}

export function LeadsCards({ leads, onView, onEdit, onDelete }: LeadsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {leads.map((lead) => (
        <AppCard key={lead.id} padding="compact" className="hover-lift flex flex-col">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-ink">{lead.name}</h3>
              <p className="mt-1 text-sm text-ink-muted">
                {[lead.email, lead.phone].filter(Boolean).join(' · ') || 'No contact info'}
              </p>
            </div>
            <LeadRowActions lead={lead} onView={onView} onEdit={onEdit} onDelete={onDelete} />
          </div>
          <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3 text-sm">
            <span className={LEADS_STATUS_BADGE_CLASS}>{leadStatusLabel(lead.status)}</span>
            <span className="text-ink-faint">{new Date(lead.createdAt).toLocaleDateString()}</span>
          </div>
        </AppCard>
      ))}
    </div>
  )
}
