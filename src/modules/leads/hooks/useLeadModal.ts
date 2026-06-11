import { useState } from 'react'

import type { Lead } from '@/modules/leads/leads.service'

export type LeadModalMode = 'create' | 'view' | 'edit' | 'delete'

export function useLeadModal() {
  const [mode, setMode] = useState<LeadModalMode | null>(null)
  const [lead, setLead] = useState<Lead | null>(null)

  const openCreate = () => {
    setLead(null)
    setMode('create')
  }

  const openView = (target: Lead) => {
    setLead(target)
    setMode('view')
  }

  const openEdit = (target: Lead) => {
    setLead(target)
    setMode('edit')
  }

  const openDelete = (target: Lead) => {
    setLead(target)
    setMode('delete')
  }

  const close = () => {
    setMode(null)
    setLead(null)
  }

  const switchToDelete = (target: Lead) => {
    setLead(target)
    setMode('delete')
  }

  return {
    mode,
    lead,
    openCreate,
    openView,
    openEdit,
    openDelete,
    close,
    switchToDelete,
    isOpen: mode !== null,
  }
}
