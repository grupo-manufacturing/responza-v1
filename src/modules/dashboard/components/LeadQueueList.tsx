import { Link } from 'react-router-dom'

import type { DashboardLead } from '@/modules/dashboard/dashboard.service'
import { leadStatusLabel } from '@/modules/leads/leads.constants'
import { formatInboxTimestamp } from '@/modules/inbox/inbox.constants'

const MAX_VISIBLE_ITEMS = 5

const QUEUE_ACTION_CLASS =
  'inline-flex items-center rounded-[var(--radius-pill)] border border-border bg-white/80 px-3 py-1.5 text-xs font-medium leading-none text-ink transition-colors hover:border-accent/30 hover:bg-accent/5 hover:text-accent'

const STATUS_BADGE_CLASS =
  'inline-flex items-center rounded-[var(--radius-pill)] border border-border bg-surface-muted px-2 py-1 text-xs font-medium leading-none text-ink-muted'

type LeadQueueListProps = {
  readonly leads: DashboardLead[]
  readonly emptyMessage: string
}

export function LeadQueueList({ leads, emptyMessage }: LeadQueueListProps) {
  if (leads.length === 0) {
    return (
      <div className="flex h-full items-center justify-center px-6 py-10 text-center">
        <p className="text-sm text-ink-muted">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <ul className="divide-y divide-border">
      {leads.slice(0, MAX_VISIBLE_ITEMS).map((lead) => (
        <li key={lead.id}>
          <div className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-surface-muted/60">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-soft via-accent to-accent-violet text-sm font-medium text-white">
              {lead.name.trim().charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{lead.name}</p>
              <p className="mt-0.5 text-xs text-ink-faint">
                Updated {formatInboxTimestamp(lead.updatedAt)}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <span className={STATUS_BADGE_CLASS}>{leadStatusLabel(lead.status)}</span>
              <Link to={`/leads?lead=${lead.id}`} className={QUEUE_ACTION_CLASS}>
                Open
              </Link>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
