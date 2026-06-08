import { useEffect, useState } from 'react'

import { Modal } from '@/components/ui/Modal'
import LeadsService, { type Lead } from '@/shared/services/leads.service'
import { getApiErrorMessage } from '@/shared/utils/api-error'

import { LeadFormFields } from './LeadFormFields'
import { emptyLeadFormValues } from './lead-form'

type CreateLeadModalProps = {
  open: boolean
  onClose: () => void
  onCreated: (lead: Lead) => void
}

export function CreateLeadModal({ open, onClose, onCreated }: CreateLeadModalProps) {
  const [values, setValues] = useState(emptyLeadFormValues)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setValues(emptyLeadFormValues())
      setError(null)
      setSubmitting(false)
    }
  }, [open])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const { lead } = await LeadsService.createLead({
        name: values.name.trim(),
        email: values.email.trim() || undefined,
        phone: values.phone.trim() || undefined,
        notes: values.notes.trim() || undefined,
        status: values.status,
      })
      onCreated(lead)
      onClose()
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not create lead. Check the form and try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="New lead" description="Add a prospect manually.">
      <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
        <LeadFormFields idPrefix="create-lead" values={values} onChange={setValues} />

        {error !== null && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <div className="flex flex-col gap-2 pt-2 sm:flex-row">
          <button
            type="submit"
            disabled={submitting || values.name.trim().length === 0}
            className="flex-1 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Saving…' : 'Create lead'}
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
      </form>
    </Modal>
  )
}
