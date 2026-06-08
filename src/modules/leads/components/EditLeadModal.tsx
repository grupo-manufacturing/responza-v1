import { useEffect, useState } from 'react'

import { Modal } from '@/components/ui/Modal'
import LeadsService, { type Lead } from '@/shared/services/leads.service'
import { getApiErrorMessage } from '@/shared/utils/api-error'

import { LeadFormFields } from './LeadFormFields'
import { leadToFormValues, type LeadFormValues } from './lead-form'

type EditLeadModalProps = {
  open: boolean
  lead: Lead | null
  onClose: () => void
  onUpdated: (lead: Lead) => void
  onDelete: (lead: Lead) => void
}

export function EditLeadModal({ open, lead, onClose, onUpdated, onDelete }: EditLeadModalProps) {
  const [values, setValues] = useState<LeadFormValues | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && lead !== null) {
      setValues(leadToFormValues(lead))
      setError(null)
      setSubmitting(false)
    }
  }, [open, lead])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (lead === null || values === null) {
      return
    }

    setError(null)
    setSubmitting(true)

    try {
      const { lead: updated } = await LeadsService.updateLead(lead.id, {
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        notes: values.notes.trim(),
        status: values.status,
      })
      onUpdated(updated)
      onClose()
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not save changes. Check the form and try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  if (lead === null || values === null) {
    return null
  }

  return (
    <Modal open={open} onClose={onClose} title="Edit lead" description={lead.name}>
      <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
        <LeadFormFields idPrefix="edit-lead" values={values} onChange={setValues} />

        {error !== null && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <div className="flex flex-col gap-2 pt-2">
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="submit"
              disabled={submitting || values.name.trim().length === 0}
              className="flex-1 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Saving…' : 'Save changes'}
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={onClose}
              className="flex-1 rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
          <button
            type="button"
            disabled={submitting}
            onClick={() => onDelete(lead)}
            className="w-full rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
          >
            Delete lead
          </button>
        </div>
      </form>
    </Modal>
  )
}
