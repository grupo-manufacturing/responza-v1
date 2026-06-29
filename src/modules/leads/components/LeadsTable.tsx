import { leadStatusLabel } from '@/modules/leads/leads.constants'
import type { Lead } from '@/modules/leads/leads.service'
import { LEADS_STATUS_BADGE_CLASS } from '@/modules/leads/leads-ui'
import { AppCard } from '@/shared/ui/app-ui'

import { LeadRowActions } from './LeadRowActions'

type LeadsTableProps = {
  leads: Lead[]
  onView: (lead: Lead) => void
  onEdit: (lead: Lead) => void
  onDelete: (lead: Lead) => void
}

export function LeadsTable({ leads, onView, onEdit, onDelete }: LeadsTableProps) {
  return (
    <AppCard padding="none" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-surface-muted/80">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-ink-muted">Name</th>
              <th className="px-4 py-3 text-left font-medium text-ink-muted">Email</th>
              <th className="px-4 py-3 text-left font-medium text-ink-muted">Phone</th>
              <th className="px-4 py-3 text-left font-medium text-ink-muted">Status</th>
              <th className="px-4 py-3 text-right font-medium text-ink-muted">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {leads.map((lead) => (
              <tr key={lead.id} className="transition-colors hover:bg-surface-muted/50">
                <td className="px-4 py-3 font-medium text-ink">{lead.name}</td>
                <td className="px-4 py-3 text-ink-muted">{lead.email ?? '—'}</td>
                <td className="px-4 py-3 text-ink-muted">{lead.phone ?? '—'}</td>
                <td className="px-4 py-3">
                  <span className={LEADS_STATUS_BADGE_CLASS}>{leadStatusLabel(lead.status)}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end">
                    <LeadRowActions lead={lead} onView={onView} onEdit={onEdit} onDelete={onDelete} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppCard>
  )
}
