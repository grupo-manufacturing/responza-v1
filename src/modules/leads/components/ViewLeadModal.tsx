import { Modal } from '@/components/ui/Modal'
import { leadStatusLabel } from '@/shared/constants/leads'
import type { Lead } from '@/shared/services/leads.service'

import { formatLeadSource } from './lead-form'

type ViewLeadModalProps = {
  open: boolean
  lead: Lead | null
  onClose: () => void
  onDelete: (lead: Lead) => void
}

export function ViewLeadModal({ open, lead, onClose, onDelete }: ViewLeadModalProps) {
  if (lead === null) {
    return null
  }

  return (
    <Modal open={open} onClose={onClose} title={lead.name} description="Lead details">
      <dl className="space-y-4 text-sm">
        <div>
          <dt className="font-medium text-neutral-500">Status</dt>
          <dd className="mt-1">
            <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-800">
              {leadStatusLabel(lead.status)}
            </span>
          </dd>
        </div>
        <div>
          <dt className="font-medium text-neutral-500">Email</dt>
          <dd className="mt-1 text-neutral-900">{lead.email ?? '—'}</dd>
        </div>
        <div>
          <dt className="font-medium text-neutral-500">Phone</dt>
          <dd className="mt-1 text-neutral-900">{lead.phone ?? '—'}</dd>
        </div>
        <div>
          <dt className="font-medium text-neutral-500">Notes</dt>
          <dd className="mt-1 whitespace-pre-wrap text-neutral-900">{lead.notes ?? '—'}</dd>
        </div>
        <div>
          <dt className="font-medium text-neutral-500">Source</dt>
          <dd className="mt-1 text-neutral-900">{formatLeadSource(lead.source)}</dd>
        </div>
        {lead.conversationId !== null && (
          <div>
            <dt className="font-medium text-neutral-500">Conversation</dt>
            <dd className="mt-1 font-mono text-xs text-neutral-700">{lead.conversationId}</dd>
          </div>
        )}
        <div>
          <dt className="font-medium text-neutral-500">Created</dt>
          <dd className="mt-1 text-neutral-900">{new Date(lead.createdAt).toLocaleString()}</dd>
        </div>
        <div>
          <dt className="font-medium text-neutral-500">Last updated</dt>
          <dd className="mt-1 text-neutral-900">{new Date(lead.updatedAt).toLocaleString()}</dd>
        </div>
      </dl>

      <div className="mt-6 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => onDelete(lead)}
          className="w-full rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          Delete lead
        </button>
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50"
        >
          Close
        </button>
      </div>
    </Modal>
  )
}
