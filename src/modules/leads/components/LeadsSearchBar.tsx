import { useEffect, useRef, useState } from 'react'

import { Select, type SelectOption } from '@/components/ui/Select'
import { LEAD_STATUS_OPTIONS, type LeadStatus } from '@/shared/constants/leads'

const STATUS_FILTER_OPTIONS: readonly SelectOption<LeadStatus | ''>[] = [
  { value: '', label: 'All statuses' },
  ...LEAD_STATUS_OPTIONS,
]

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

const toolbarButtonClassName = (active: boolean) =>
  [
    'relative inline-flex h-10 w-10 items-center justify-center rounded-lg ring-1 transition-colors',
    active
      ? 'bg-neutral-900 text-white ring-neutral-900'
      : 'bg-neutral-100 text-neutral-500 ring-neutral-200/80 hover:bg-neutral-200/80 hover:text-neutral-900',
  ].join(' ')

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

  const selectLayoutMode = (mode: LeadsLayoutMode) => {
    onLayoutModeChange(mode)
    setLayoutMenuOpen(false)
  }

  const clearFilters = () => {
    onFiltersChange({ status: '' })
    onFiltersOpenChange(false)
  }

  return (
    <div className="flex w-full min-w-0 items-center gap-2 sm:w-auto">
      <div className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-lg bg-neutral-100 px-3 ring-1 ring-neutral-200/80 sm:w-72 sm:flex-none lg:w-80">
        <svg
          className="h-4 w-4 shrink-0 text-neutral-400"
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
          placeholder="Search..."
          className="min-w-0 flex-1 bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
        />
      </div>

      <div className="relative shrink-0">
        <button
          ref={layoutButtonRef}
          type="button"
          onClick={() => {
            setLayoutMenuOpen((open) => !open)
            onFiltersOpenChange(false)
          }}
          aria-label="Change layout"
          aria-expanded={layoutMenuOpen}
          className={toolbarButtonClassName(layoutMenuOpen)}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
        </button>

        {layoutMenuOpen && (
          <div
            ref={layoutPanelRef}
            className="absolute right-0 z-20 mt-2 w-48 rounded-xl border border-neutral-200 bg-white py-1 shadow-lg"
            role="menu"
            aria-label="Layout options"
          >
            <button
              type="button"
              role="menuitemradio"
              aria-checked={layoutMode === 'table'}
              onClick={() => selectLayoutMode('table')}
              className={[
                'flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors',
                layoutMode === 'table'
                  ? 'bg-neutral-100 font-medium text-neutral-900'
                  : 'text-neutral-700 hover:bg-neutral-50',
              ].join(' ')}
            >
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
              Table view
            </button>
            <button
              type="button"
              role="menuitemradio"
              aria-checked={layoutMode === 'cards'}
              onClick={() => selectLayoutMode('cards')}
              className={[
                'flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors',
                layoutMode === 'cards'
                  ? 'bg-neutral-100 font-medium text-neutral-900'
                  : 'text-neutral-700 hover:bg-neutral-50',
              ].join(' ')}
            >
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              Cards view
            </button>
          </div>
        )}
      </div>

      <div className="relative shrink-0">
        <button
          ref={filterButtonRef}
          type="button"
          onClick={() => {
            onFiltersOpenChange(!filtersOpen)
            setLayoutMenuOpen(false)
          }}
          aria-label="Filter leads"
          aria-expanded={filtersOpen}
          className={toolbarButtonClassName(filtersOpen || activeFilterCount > 0)}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          {activeFilterCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-neutral-900 ring-1 ring-neutral-200">
              {activeFilterCount}
            </span>
          )}
        </button>

        {filtersOpen && (
          <div
            ref={filterPanelRef}
            className="absolute right-0 z-20 mt-2 w-64 rounded-xl border border-neutral-200 bg-white p-4 shadow-lg"
            role="dialog"
            aria-label="Lead filters"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-neutral-900">Filters</p>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-medium text-neutral-600 underline-offset-2 hover:text-neutral-900 hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            <Select<LeadStatus | ''>
              label="Status"
              value={filters.status}
              onChange={(status) => onFiltersChange({ status })}
              options={STATUS_FILTER_OPTIONS}
            />
          </div>
        )}
      </div>
    </div>
  )
}
