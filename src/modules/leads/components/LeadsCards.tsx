import { leadStatusLabel } from '@/modules/leads/leads.constants'
import type { Lead } from '@/modules/leads/leads.service'

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
        <article
          key={lead.id}
          className="flex flex-col rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
        >
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-neutral-900">{lead.name}</h3>
              <p className="mt-1 text-sm text-neutral-600">
                {[lead.email, lead.phone].filter(Boolean).join(' · ') || 'No contact info'}
              </p>
            </div>
            <LeadRowActions lead={lead} onView={onView} onEdit={onEdit} onDelete={onDelete} />
          </div>
          <div className="mt-auto flex items-center justify-between gap-2 border-t border-neutral-100 pt-3 text-sm">
            <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-800">
              {leadStatusLabel(lead.status)}
            </span>
            <span className="text-neutral-500">{new Date(lead.createdAt).toLocaleDateString()}</span>
          </div>
        </article>
      ))}
    </div>
  )
}
