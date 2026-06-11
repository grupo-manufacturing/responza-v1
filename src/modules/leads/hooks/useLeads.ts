import { useCallback, useEffect, useMemo, useState } from 'react'

import type { LeadStatus } from '@/modules/leads/leads.constants'
import { LeadsService, type Lead } from '@/modules/leads/leads.service'
import { useSubscriptionGate } from '@/shared/hooks/useSubscriptionGate'
import { upsertByKey } from '@/shared/utils/upsert'
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

export function useLeads(statusFilter: LeadStatus | '') {
  const [leads, setLeads] = useState<Lead[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { subscriptionRequired, handleError, reset } = useSubscriptionGate()

  const loadLeads = useCallback(async () => {
    setLoading(true)
    setError(null)
    reset()

    try {
      const result = await LeadsService.listLeads({
        status: statusFilter === '' ? undefined : statusFilter,
      })
      setLeads(result.leads)
    } catch (err) {
      if (handleError(err)) {
        setLeads([])
        return
      }

      setError(getApiErrorMessage(err, 'Could not load leads. Please try again.'))
      setLeads([])
    } finally {
      setLoading(false)
    }
  }, [handleError, reset, statusFilter])

  useEffect(() => {
    void loadLeads()
  }, [loadLeads])

  const displayedLeads = useMemo(
    () => leads.filter((lead) => matchesSearchQuery(lead, searchQuery)),
    [leads, searchQuery],
  )

  const handleLeadCreated = (lead: Lead) => {
    setLeads((current) => upsertByKey(current, lead, 'id'))
  }

  const handleLeadUpdated = (lead: Lead) => {
    setLeads((current) => upsertByKey(current, lead, 'id'))
  }

  const handleLeadDeleted = (leadId: string) => {
    setLeads((current) => current.filter((lead) => lead.id !== leadId))
  }

  return {
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
  }
}
