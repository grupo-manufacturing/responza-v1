import type { Lead } from '@/modules/leads/leads.service'

const iconButtonClassName =
  'inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink'

const deleteIconButtonClassName =
  'inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-red-50 hover:text-red-600'

type LeadRowActionsProps = {
  lead: Lead
  onView: (lead: Lead) => void
  onEdit: (lead: Lead) => void
  onDelete: (lead: Lead) => void
}

export function LeadRowActions({ lead, onView, onEdit, onDelete }: LeadRowActionsProps) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        aria-label={`View ${lead.name}`}
        onClick={() => onView(lead)}
        className={iconButtonClassName}
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      </button>
      <button
        type="button"
        aria-label={`Edit ${lead.name}`}
        onClick={() => onEdit(lead)}
        className={iconButtonClassName}
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      </button>
      <button
        type="button"
        aria-label={`Delete ${lead.name}`}
        onClick={() => onDelete(lead)}
        className={deleteIconButtonClassName}
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  )
}
