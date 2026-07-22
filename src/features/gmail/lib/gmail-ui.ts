export const GMAIL_SHELL_CLASS =
  'glass-light flex min-h-0 flex-1 overflow-hidden rounded-[var(--radius-card-lg)] border border-border shadow-card'

export const GMAIL_PANEL_HEADER_CLASS = 'shrink-0 border-b border-border px-3 py-2.5 sm:px-4'

export const GMAIL_LIST_COLUMN_CLASS = 'w-full lg:w-[340px] lg:shrink-0'

export const GMAIL_SCROLL_AREA_CLASS =
  'overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'

export function gmailListItemSelectedClass(isSelected: boolean): string {
  if (!isSelected) {
    return 'hover:bg-surface-muted/70'
  }

  return 'bg-[#C5221F]/8 border-l-2 border-[#C5221F]'
}
