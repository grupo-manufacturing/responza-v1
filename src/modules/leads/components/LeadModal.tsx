import { useState } from 'react'

import { Alert } from '@/components/ui/Alert'
import { Modal } from '@/components/ui/Modal'
import { leadStatusLabel } from '@/modules/leads/leads.constants'
import { LeadsService, type Lead } from '@/modules/leads/leads.service'
import { getApiErrorMessage } from '@/shared/utils/api-error'

import { LeadFormFields } from './LeadFormFields'
import { emptyLeadFormValues, leadToFormValues, type LeadFormValues } from './lead-form'
import type { LeadModalMode } from '../hooks/useLeadModal'

type LeadModalProps = {
  mode: LeadModalMode | null
  lead: Lead | null
  onClose: () => void
  onCreated: (lead: Lead) => void
  onUpdated: (lead: Lead) => void
  onDeleted: (leadId: string) => void
  onDeleteRequest: (lead: Lead) => void
}

type LeadModalFormProps = {
  mode: 'create' | 'edit'
  lead: Lead | null
  initialValues: LeadFormValues
  onClose: () => void
  onCreated: (lead: Lead) => void
  onUpdated: (lead: Lead) => void
  onDeleteRequest: (lead: Lead) => void
}

function LeadModalForm({
  mode,
  lead,
  initialValues,
  onClose,
  onCreated,
  onUpdated,
  onDeleteRequest,
}: LeadModalFormProps) {
  const [values, setValues] = useState(initialValues)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isCreate = mode === 'create'

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      if (isCreate) {
        const { lead: created } = await LeadsService.createLead({
          name: values.name.trim(),
          email: values.email.trim() || undefined,
          phone: values.phone.trim() || undefined,
          notes: values.notes.trim() || undefined,
          status: values.status,
        })
        onCreated(created)
      } else if (lead !== null) {
        const { lead: updated } = await LeadsService.updateLead(lead.id, {
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          notes: values.notes.trim(),
          status: values.status,
        })
        onUpdated(updated)
      }
      onClose()
    } catch (err) {
      setError(
        getApiErrorMessage(
          err,
          isCreate
            ? 'Could not create lead. Check the form and try again.'
            : 'Could not save changes. Check the form and try again.',
        ),
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={isCreate ? 'New lead' : 'Edit lead'}
      description={isCreate ? 'Add a prospect manually.' : lead?.name}
    >
      <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
        <LeadFormFields
          idPrefix={isCreate ? 'create-lead' : 'edit-lead'}
          values={values}
          onChange={setValues}
        />

        {error !== null && <Alert variant="error">{error}</Alert>}

        <div className="flex flex-col gap-2 pt-2">
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="submit"
              disabled={submitting || values.name.trim().length === 0}
              className="flex-1 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Saving…' : isCreate ? 'Create lead' : 'Save changes'}
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
          {!isCreate && lead !== null && (
            <button
              type="button"
              disabled={submitting}
              onClick={() => onDeleteRequest(lead)}
              className="w-full rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
            >
              Delete lead
            </button>
          )}
        </div>
      </form>
    </Modal>
  )
}

export function LeadModal({
  mode,
  lead,
  onClose,
  onCreated,
  onUpdated,
  onDeleted,
  onDeleteRequest,
}: LeadModalProps) {
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  if (mode === null) {
    return null
  }

  if (mode === 'view' && lead !== null) {
    return (
      <Modal open onClose={onClose} title={lead.name} description="Lead details">
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
            onClick={() => onDeleteRequest(lead)}
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

  if (mode === 'delete' && lead !== null) {
    const handleDelete = async () => {
      setDeleteError(null)
      setDeleting(true)

      try {
        await LeadsService.deleteLead(lead.id)
        onDeleted(lead.id)
        onClose()
      } catch (err) {
        setDeleteError(getApiErrorMessage(err, 'Could not delete lead. Please try again.'))
      } finally {
        setDeleting(false)
      }
    }

    return (
      <Modal open onClose={onClose} title="Delete lead" description="This action cannot be undone.">
        <p className="text-sm text-neutral-700">
          Permanently delete <span className="font-semibold text-neutral-900">{lead.name}</span>?
        </p>

        {deleteError !== null && <Alert variant="error" className="mt-4">{deleteError}</Alert>}

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

  if (mode === 'create') {
    return (
      <LeadModalForm
        key="create"
        mode="create"
        lead={null}
        initialValues={emptyLeadFormValues()}
        onClose={onClose}
        onCreated={onCreated}
        onUpdated={onUpdated}
        onDeleteRequest={onDeleteRequest}
      />
    )
  }

  if (mode === 'edit' && lead !== null) {
    return (
      <LeadModalForm
        key={`edit-${lead.id}`}
        mode="edit"
        lead={lead}
        initialValues={leadToFormValues(lead)}
        onClose={onClose}
        onCreated={onCreated}
        onUpdated={onUpdated}
        onDeleteRequest={onDeleteRequest}
      />
    )
  }

  return null
}
