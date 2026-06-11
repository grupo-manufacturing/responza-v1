import { useState } from 'react'

import { SubscriptionRequired } from '@/components/common/SubscriptionRequired'
import { Alert } from '@/components/ui/Alert'
import { Spinner } from '@/components/ui/Spinner'
import { LeadModal } from '@/modules/leads/components/LeadModal'
import { LeadsCards } from '@/modules/leads/components/LeadsCards'
import {
  LeadsSearchBar,
  type LeadsFilterState,
  type LeadsLayoutMode,
} from '@/modules/leads/components/LeadsSearchBar'
import { LeadsTable } from '@/modules/leads/components/LeadsTable'
import { useLeadModal } from '@/modules/leads/hooks/useLeadModal'
import { useLeads } from '@/modules/leads/hooks/useLeads'

export function LeadsPage() {
  const [filters, setFilters] = useState<LeadsFilterState>({ status: '' })
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [layoutMode, setLayoutMode] = useState<LeadsLayoutMode>('table')
  const modal = useLeadModal()

  const {
    leads,
    displayedLeads,
    searchQuery,
    setSearchQuery,
    loading,
    error,
    subscriptionRequired,
    handleLeadCreated,
    handleLeadUpdated,
    handleLeadDeleted,
  } = useLeads(filters.status)

  const hasActiveFilters = filters.status !== ''
  const hasSearch = searchQuery.trim().length > 0

  const handleDeleted = (leadId: string) => {
    handleLeadDeleted(leadId)
    modal.close()
  }

  if (subscriptionRequired) {
    return <SubscriptionRequired />
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
            onClick={modal.openCreate}
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

      {!loading && error !== null && <Alert variant="error">{error}</Alert>}

      {!loading && error === null && leads.length === 0 && !hasActiveFilters && !hasSearch && (
        <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-12 text-center">
          <p className="text-neutral-700">No leads yet.</p>
          <button
            type="button"
            onClick={modal.openCreate}
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
        <LeadsTable
          leads={displayedLeads}
          onView={modal.openView}
          onEdit={modal.openEdit}
          onDelete={modal.openDelete}
        />
      )}

      {!loading && error === null && displayedLeads.length > 0 && layoutMode === 'cards' && (
        <LeadsCards
          leads={displayedLeads}
          onView={modal.openView}
          onEdit={modal.openEdit}
          onDelete={modal.openDelete}
        />
      )}

      <LeadModal
        mode={modal.mode}
        lead={modal.lead}
        onClose={modal.close}
        onCreated={handleLeadCreated}
        onUpdated={handleLeadUpdated}
        onDeleted={handleDeleted}
        onDeleteRequest={modal.switchToDelete}
      />
    </div>
  )
}
