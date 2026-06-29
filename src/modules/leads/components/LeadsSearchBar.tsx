import { useEffect, useRef, useState } from 'react'

import { APP_INPUT_CLASS } from '@/shared/ui/app-ui'

import { LeadsFilterPopover } from './LeadsFilterPopover'
import { LeadsLayoutToggle } from './LeadsLayoutToggle'
import type { LeadStatus } from '@/modules/leads/leads.constants'

export type LeadsFilterState = {
  status: LeadStatus | ''
}

export type LeadsLayoutMode = 'table' | 'cards'

type LeadsSearchBarProps = {
  searchQuery: string
  onSearchQueryChange: (value: string) => void
  filters: LeadsFilterState
  onFiltersChange: (filters: LeadsFilterState) => void
  filtersOpen: boolean
  onFiltersOpenChange: (open: boolean) => void
  layoutMode: LeadsLayoutMode
  onLayoutModeChange: (mode: LeadsLayoutMode) => void
}

export function LeadsSearchBar({
  searchQuery,
  onSearchQueryChange,
  filters,
  onFiltersChange,
  filtersOpen,
  onFiltersOpenChange,
  layoutMode,
  onLayoutModeChange,
}: LeadsSearchBarProps) {
  const filterPanelRef = useRef<HTMLDivElement>(null)
  const layoutPanelRef = useRef<HTMLDivElement>(null)
  const filterButtonRef = useRef<HTMLButtonElement>(null)
  const layoutButtonRef = useRef<HTMLButtonElement>(null)
  const [layoutMenuOpen, setLayoutMenuOpen] = useState(false)

  const activeFilterCount = filters.status === '' ? 0 : 1
  const popoverOpen = filtersOpen || layoutMenuOpen

  useEffect(() => {
    if (!popoverOpen) {
      return
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Node)) {
        return
      }

      const inside =
        filterPanelRef.current?.contains(target) ||
        layoutPanelRef.current?.contains(target) ||
        filterButtonRef.current?.contains(target) ||
        layoutButtonRef.current?.contains(target)

      if (inside) {
        return
      }

      onFiltersOpenChange(false)
      setLayoutMenuOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [popoverOpen, onFiltersOpenChange])

  return (
    <div className="flex w-full min-w-0 items-center gap-2 sm:w-auto">
      <div className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-xl border border-border bg-white/80 px-3 sm:w-72 sm:flex-none lg:w-80">
        <svg
          className="h-4 w-4 shrink-0 text-ink-faint"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder="Search leads..."
          className={`${APP_INPUT_CLASS} !border-0 !bg-transparent !p-0 !shadow-none !ring-0 focus:!ring-0`}
        />
      </div>

      <LeadsLayoutToggle
        layoutMode={layoutMode}
        open={layoutMenuOpen}
        panelRef={layoutPanelRef}
        buttonRef={layoutButtonRef}
        onToggle={() => {
          setLayoutMenuOpen((open) => !open)
          onFiltersOpenChange(false)
        }}
        onSelect={(mode) => {
          onLayoutModeChange(mode)
          setLayoutMenuOpen(false)
        }}
      />

      <LeadsFilterPopover
        filters={filters}
        open={filtersOpen}
        activeFilterCount={activeFilterCount}
        panelRef={filterPanelRef}
        buttonRef={filterButtonRef}
        onToggle={() => {
          onFiltersOpenChange(!filtersOpen)
          setLayoutMenuOpen(false)
        }}
        onFiltersChange={onFiltersChange}
        onClear={() => {
          onFiltersChange({ status: '' })
          onFiltersOpenChange(false)
        }}
      />
    </div>
  )
}
