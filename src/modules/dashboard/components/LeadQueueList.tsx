import { Link } from 'react-router-dom'

import { leadStatusLabel } from '@/modules/leads/leads.constants'
import type { DashboardLead } from '@/modules/dashboard/dashboard.service'
import { formatInboxTimestamp } from '@/modules/inbox/inbox.constants'

const MAX_VISIBLE_ITEMS = 5

type LeadQueueListProps = {
  readonly leads: DashboardLead[]
  readonly emptyMessage: string
}

export function LeadQueueList({ leads, emptyMessage }: LeadQueueListProps) {
  if (leads.length === 0) {
    return (
      <div className="flex h-full items-center justify-center px-6 py-10 text-center">
        <p className="text-sm text-neutral-600">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <ul className="divide-y divide-neutral-100">
      {leads.slice(0, MAX_VISIBLE_ITEMS).map((lead) => (
        <li key={lead.id}>
          <div className="flex items-center gap-3 px-5 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-sm font-medium text-white">
              {lead.name.trim().charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-medium text-neutral-900">{lead.name}</p>
                <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700">
                  {leadStatusLabel(lead.status)}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-neutral-500">
                Updated {formatInboxTimestamp(lead.updatedAt)}
              </p>
            </div>

            <Link
              to={`/leads?lead=${lead.id}`}
              className="shrink-0 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-900 transition-colors hover:bg-neutral-50"
            >
              Open
            </Link>
          </div>
        </li>
      ))}
    </ul>
  )
}
