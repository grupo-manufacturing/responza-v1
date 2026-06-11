import { leadStatusLabel } from '@/modules/leads/leads.constants'
import type { Lead } from '@/modules/leads/leads.service'

import { LeadRowActions } from './LeadRowActions'

type LeadsTableProps = {
  leads: Lead[]
  onView: (lead: Lead) => void
  onEdit: (lead: Lead) => void
  onDelete: (lead: Lead) => void
}

export function LeadsTable({ leads, onView, onEdit, onDelete }: LeadsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <table className="min-w-full divide-y divide-neutral-200 text-sm">
        <thead className="bg-neutral-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-neutral-700">Name</th>
            <th className="px-4 py-3 text-left font-medium text-neutral-700">Email</th>
            <th className="px-4 py-3 text-left font-medium text-neutral-700">Phone</th>
            <th className="px-4 py-3 text-left font-medium text-neutral-700">Status</th>
            <th className="px-4 py-3 text-right font-medium text-neutral-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-neutral-50">
              <td className="px-4 py-3 font-medium text-neutral-900">{lead.name}</td>
              <td className="px-4 py-3 text-neutral-600">{lead.email ?? '—'}</td>
              <td className="px-4 py-3 text-neutral-600">{lead.phone ?? '—'}</td>
              <td className="px-4 py-3">
                <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-800">
                  {leadStatusLabel(lead.status)}
                </span>
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
  )
}
