export function leadsToolbarButtonClass(active: boolean): string {
  return [
    'relative inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-colors',
    active
      ? 'border-accent bg-accent/12 text-accent'
      : 'border-border bg-white/80 text-ink-muted hover:border-accent/25 hover:bg-surface-muted hover:text-ink',
  ].join(' ')
}

export const LEADS_STATUS_BADGE_CLASS =
  'inline-flex items-center rounded-[var(--radius-pill)] border border-border bg-surface-muted px-2.5 py-1 text-xs font-medium leading-none text-ink-muted'

export const LEADS_POPOVER_PANEL_CLASS =
  'absolute right-0 z-20 mt-2 rounded-[var(--radius-card)] border border-border bg-white p-4 shadow-card'
