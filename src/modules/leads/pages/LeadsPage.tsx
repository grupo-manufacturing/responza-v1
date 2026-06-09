import { useCallback, useEffect, useMemo, useState } from 'react'

import { CreateLeadModal } from '@/modules/leads/components/CreateLeadModal'
import { DeleteLeadModal } from '@/modules/leads/components/DeleteLeadModal'
import { EditLeadModal } from '@/modules/leads/components/EditLeadModal'
import {
  LeadsSearchBar,
  type LeadsFilterState,
  type LeadsLayoutMode,
} from '@/modules/leads/components/LeadsSearchBar'
import { ViewLeadModal } from '@/modules/leads/components/ViewLeadModal'
import { Spinner } from '@/components/ui/Spinner'
import { leadStatusLabel } from '@/shared/constants/leads'
import LeadsService, { type Lead } from '@/shared/services/leads.service'
import { getApiErrorMessage } from '@/shared/utils/api-error'

function matchesSearchQuery(lead: Lead, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (normalized.length === 0) {
    return true
  }

  const haystack = [lead.name, lead.email, lead.phone, lead.notes]
    .filter((value): value is string => typeof value === 'string' && value.length > 0)
    .join(' ')
    .toLowerCase()

  return haystack.includes(normalized)
}

function upsertLead(leads: Lead[], updated: Lead): Lead[] {
  const index = leads.findIndex((lead) => lead.id === updated.id)
  if (index === -1) {
    return [updated, ...leads]
  }
  return leads.map((lead) => (lead.id === updated.id ? updated : lead))
}

const iconButtonClassName =
  'inline-flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900'

const deleteIconButtonClassName =
  'inline-flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-red-50 hover:text-red-600'

type LeadRowActionsProps = {
  lead: Lead
  onView: (lead: Lead) => void
  onEdit: (lead: Lead) => void
  onDelete: (lead: Lead) => void
}

function LeadRowActions({ lead, onView, onEdit, onDelete }: LeadRowActionsProps) {
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

export function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [filters, setFilters] = useState<LeadsFilterState>({ status: '' })
  const [searchQuery, setSearchQuery] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [layoutMode, setLayoutMode] = useState<LeadsLayoutMode>('table')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [createOpen, setCreateOpen] = useState(false)
  const [viewLead, setViewLead] = useState<Lead | null>(null)
  const [editLead, setEditLead] = useState<Lead | null>(null)
  const [deleteLead, setDeleteLead] = useState<Lead | null>(null)

  const statusFilter = filters.status

  const loadLeads = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await LeadsService.listLeads({
        status: statusFilter === '' ? undefined : statusFilter,
      })

      setLeads(result.leads)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not load leads. Please try again.'))
      setLeads([])
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    void loadLeads()
  }, [loadLeads])

  const displayedLeads = useMemo(
    () => leads.filter((lead) => matchesSearchQuery(lead, searchQuery)),
    [leads, searchQuery],
  )

  const hasActiveFilters = statusFilter !== ''
  const hasSearch = searchQuery.trim().length > 0

  const handleLeadCreated = (lead: Lead) => {
    setLeads((current) => upsertLead(current, lead))
  }

  const handleLeadUpdated = (lead: Lead) => {
    setLeads((current) => upsertLead(current, lead))
    setViewLead((current) => (current?.id === lead.id ? lead : current))
  }

  const openDeleteLead = (lead: Lead) => {
    setDeleteLead(lead)
    setViewLead((current) => (current?.id === lead.id ? null : current))
    setEditLead((current) => (current?.id === lead.id ? null : current))
  }

  const handleLeadDeleted = (leadId: string) => {
    setLeads((current) => current.filter((lead) => lead.id !== leadId))
    setViewLead((current) => (current?.id === leadId ? null : current))
    setEditLead((current) => (current?.id === leadId ? null : current))
    setDeleteLead(null)
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Leads</h1>
          <p className="mt-1 text-sm text-neutral-600">Manage prospects you add manually.</p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto lg:shrink-0">
          <LeadsSearchBar
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            filters={filters}
            onFiltersChange={setFilters}
            filtersOpen={filtersOpen}
            onFiltersOpenChange={setFiltersOpen}
            layoutMode={layoutMode}
            onLayoutModeChange={setLayoutMode}
          />
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-neutral-900 px-4 text-sm font-medium text-white transition-colors hover:bg-neutral-800 sm:px-5"
          >
            New Lead
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}

      {!loading && error !== null && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      {!loading && error === null && leads.length === 0 && !hasActiveFilters && !hasSearch && (
        <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-12 text-center">
          <p className="text-neutral-700">No leads yet.</p>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="mt-3 text-sm font-medium text-neutral-900 underline underline-offset-2"
          >
            Create your first lead
          </button>
        </div>
      )}

      {!loading && error === null && leads.length === 0 && (hasActiveFilters || hasSearch) && (
        <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-12 text-center">
          <p className="text-neutral-700">No leads match your filters.</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('')
              setFilters({ status: '' })
            }}
            className="mt-3 text-sm font-medium text-neutral-900 underline underline-offset-2"
          >
            Clear search and filters
          </button>
        </div>
      )}

      {!loading && error === null && leads.length > 0 && displayedLeads.length === 0 && (
        <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-12 text-center">
          <p className="text-neutral-700">No leads match your search.</p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="mt-3 text-sm font-medium text-neutral-900 underline underline-offset-2"
          >
            Clear search
          </button>
        </div>
      )}

      {!loading && error === null && displayedLeads.length > 0 && layoutMode === 'table' && (
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
              {displayedLeads.map((lead) => (
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
                      <LeadRowActions
                        lead={lead}
                        onView={setViewLead}
                        onEdit={setEditLead}
                        onDelete={openDeleteLead}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && error === null && displayedLeads.length > 0 && layoutMode === 'cards' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayedLeads.map((lead) => (
            <article
              key={lead.id}
              className="flex flex-col rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-neutral-900">{lead.name}</h3>
                  <p className="mt-1 text-sm text-neutral-600">
                    {[lead.email, lead.phone].filter(Boolean).join(' · ') || 'No contact info'}
                  </p>
                </div>
                <LeadRowActions
                  lead={lead}
                  onView={setViewLead}
                  onEdit={setEditLead}
                  onDelete={openDeleteLead}
                />
              </div>
              <div className="mt-auto flex items-center justify-between gap-2 border-t border-neutral-100 pt-3 text-sm">
                <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-800">
                  {leadStatusLabel(lead.status)}
                </span>
                <span className="text-neutral-500">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}


      <CreateLeadModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={handleLeadCreated}
      />
      <ViewLeadModal
        open={viewLead !== null}
        lead={viewLead}
        onClose={() => setViewLead(null)}
        onDelete={openDeleteLead}
      />
      <EditLeadModal
        open={editLead !== null}
        lead={editLead}
        onClose={() => setEditLead(null)}
        onUpdated={handleLeadUpdated}
        onDelete={openDeleteLead}
      />
      <DeleteLeadModal
        open={deleteLead !== null}
        lead={deleteLead}
        onClose={() => setDeleteLead(null)}
        onDeleted={handleLeadDeleted}
      />
    </div>
  )
}
