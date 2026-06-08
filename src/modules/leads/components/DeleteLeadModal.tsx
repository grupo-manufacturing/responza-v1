import { useEffect, useState } from 'react'

import { Modal } from '@/components/ui/Modal'
import LeadsService, { type Lead } from '@/shared/services/leads.service'
import { getApiErrorMessage } from '@/shared/utils/api-error'

type DeleteLeadModalProps = {
  open: boolean
  lead: Lead | null
  onClose: () => void
  onDeleted: (leadId: string) => void
}

export function DeleteLeadModal({ open, lead, onClose, onDeleted }: DeleteLeadModalProps) {
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setError(null)
      setDeleting(false)
    }
  }, [open, lead?.id])

  const handleDelete = async () => {
    if (lead === null) {
      return
    }

    setError(null)
    setDeleting(true)

    try {
      await LeadsService.deleteLead(lead.id)
      onDeleted(lead.id)
      onClose()
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not delete lead. Please try again.'))
    } finally {
      setDeleting(false)
    }
  }

  if (lead === null) {
    return null
  }

  return (
    <Modal open={open} onClose={onClose} title="Delete lead" description="This action cannot be undone.">
      <p className="text-sm text-neutral-700">
        Permanently delete <span className="font-semibold text-neutral-900">{lead.name}</span>?
      </p>

      {error !== null && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          disabled={deleting}
          onClick={() => void handleDelete()}
          className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {deleting ? 'Deleting…' : 'Delete permanently'}
        </button>
        <button
          type="button"
          disabled={deleting}
          onClick={onClose}
          className="flex-1 rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </Modal>
  )
}
