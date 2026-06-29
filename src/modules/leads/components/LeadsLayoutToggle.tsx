import { LEADS_POPOVER_PANEL_CLASS, leadsToolbarButtonClass } from '@/modules/leads/leads-ui'

import type { LeadsLayoutMode } from './LeadsSearchBar'

type LeadsLayoutToggleProps = {
  layoutMode: LeadsLayoutMode
  open: boolean
  panelRef: React.RefObject<HTMLDivElement | null>
  buttonRef: React.RefObject<HTMLButtonElement | null>
  onToggle: () => void
  onSelect: (mode: LeadsLayoutMode) => void
}

export function LeadsLayoutToggle({
  layoutMode,
  open,
  panelRef,
  buttonRef,
  onToggle,
  onSelect,
}: LeadsLayoutToggleProps) {
  return (
    <div className="relative shrink-0">
      <button
        ref={buttonRef}
        type="button"
        onClick={onToggle}
        aria-label="Change layout"
        aria-expanded={open}
        className={leadsToolbarButtonClass(open)}
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

      {open && (
        <div
          ref={panelRef}
          className={`${LEADS_POPOVER_PANEL_CLASS} w-48 !p-1`}
          role="menu"
          aria-label="Layout options"
        >
          {(['table', 'cards'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              role="menuitemradio"
              aria-checked={layoutMode === mode}
              onClick={() => onSelect(mode)}
              className={[
                'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                layoutMode === mode
                  ? 'bg-accent/10 font-medium text-accent'
                  : 'text-ink-muted hover:bg-surface-muted hover:text-ink',
              ].join(' ')}
            >
              {mode === 'table' ? 'Table view' : 'Cards view'}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
