import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { SubscriptionRequired } from '@/components/common/SubscriptionRequired'
import { Alert } from '@/components/ui/Alert'
import { SpinnerSection } from '@/components/ui/Spinner'
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
import { AppButton, AppCard, AppPage, AppPageHeader } from '@/shared/ui/app-ui'

function LeadsEmptyState({
  message,
  actionLabel,
  onAction,
}: {
  readonly message: string
  readonly actionLabel: string
  readonly onAction: () => void
}) {
  return (
    <AppCard className="border-dashed py-12 text-center">
      <p className="text-ink-muted">{message}</p>
      <button
        type="button"
        onClick={onAction}
        className="mt-3 text-sm font-medium text-accent underline-offset-2 hover:underline"
      >
        {actionLabel}
      </button>
    </AppCard>
  )
}

export function LeadsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState<LeadsFilterState>({ status: '' })
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [layoutMode, setLayoutMode] = useState<LeadsLayoutMode>('table')
  const modal = useLeadModal()
  const openedLeadFromUrl = useRef(false)

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

  useEffect(() => {
    if (loading) {
      return
    }

    const leadId = searchParams.get('lead')
    if (leadId === null) {
      openedLeadFromUrl.current = false
      return
    }

    if (openedLeadFromUrl.current) {
      return
    }

    const lead = leads.find((item) => item.id === leadId)
    if (lead === undefined) {
      return
    }

    openedLeadFromUrl.current = true
    modal.openView(lead)
    setSearchParams({}, { replace: true })
  }, [leads, loading, modal.openView, searchParams, setSearchParams])

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
    <AppPage className="max-w-5xl">
      <AppPageHeader
        title="Leads"
        description="Manage prospects you add manually."
        action={
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
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
            <AppButton onClick={modal.openCreate} className="h-10 shrink-0">
              New lead
            </AppButton>
          </div>
        }
      />

      {loading && <SpinnerSection minHeightClassName="min-h-[40vh]" />}

      {!loading && error !== null && <Alert variant="error">{error}</Alert>}

      {!loading && error === null && leads.length === 0 && !hasActiveFilters && !hasSearch && (
        <LeadsEmptyState
          message="No leads yet."
          actionLabel="Create your first lead"
          onAction={modal.openCreate}
        />
      )}

      {!loading && error === null && leads.length === 0 && (hasActiveFilters || hasSearch) && (
        <LeadsEmptyState
          message="No leads match your filters."
          actionLabel="Clear search and filters"
          onAction={() => {
            setSearchQuery('')
            setFilters({ status: '' })
          }}
        />
      )}

      {!loading && error === null && leads.length > 0 && displayedLeads.length === 0 && (
        <LeadsEmptyState
          message="No leads match your search."
          actionLabel="Clear search"
          onAction={() => setSearchQuery('')}
        />
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
    </AppPage>
  )
}
