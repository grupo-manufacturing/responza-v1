import { Select, type SelectOption } from '@/components/ui/Select'
import { LEAD_STATUS_OPTIONS, type LeadStatus } from '@/modules/leads/leads.constants'

import type { LeadsFilterState } from './LeadsSearchBar'

const STATUS_FILTER_OPTIONS: readonly SelectOption<LeadStatus | ''>[] = [
  { value: '', label: 'All statuses' },
  ...LEAD_STATUS_OPTIONS,
]

const toolbarButtonClassName = (active: boolean) =>
  [
    'relative inline-flex h-10 w-10 items-center justify-center rounded-lg ring-1 transition-colors',
    active
      ? 'bg-neutral-900 text-white ring-neutral-900'
      : 'bg-neutral-100 text-neutral-500 ring-neutral-200/80 hover:bg-neutral-200/80 hover:text-neutral-900',
  ].join(' ')

type LeadsFilterPopoverProps = {
  filters: LeadsFilterState
  open: boolean
  activeFilterCount: number
  panelRef: React.RefObject<HTMLDivElement | null>
  buttonRef: React.RefObject<HTMLButtonElement | null>
  onToggle: () => void
  onFiltersChange: (filters: LeadsFilterState) => void
  onClear: () => void
}

export function LeadsFilterPopover({
  filters,
  open,
  activeFilterCount,
  panelRef,
  buttonRef,
  onToggle,
  onFiltersChange,
  onClear,
}: LeadsFilterPopoverProps) {
  return (
    <div className="relative shrink-0">
      <button
        ref={buttonRef}
        type="button"
        onClick={onToggle}
        aria-label="Filter leads"
        aria-expanded={open}
        className={toolbarButtonClassName(open || activeFilterCount > 0)}
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

      {open && (
        <div
          ref={panelRef}
          className="absolute right-0 z-20 mt-2 w-64 rounded-xl border border-neutral-200 bg-white p-4 shadow-lg"
          role="dialog"
          aria-label="Lead filters"
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-neutral-900">Filters</p>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={onClear}
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
  )
}
