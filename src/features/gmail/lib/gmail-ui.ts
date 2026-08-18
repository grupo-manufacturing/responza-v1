import {
  INBOX_PANEL_HEADER_CLASS,
  INBOX_SHELL_CLASS,
  INBOX_SCROLL_AREA_CLASS,
} from '@/features/inbox/lib/inbox-ui'

export const GMAIL_SHELL_CLASS = INBOX_SHELL_CLASS

export const GMAIL_PANEL_HEADER_CLASS = INBOX_PANEL_HEADER_CLASS

export const GMAIL_LIST_COLUMN_CLASS = 'w-full lg:w-[340px] lg:shrink-0'

export const GMAIL_SCROLL_AREA_CLASS = INBOX_SCROLL_AREA_CLASS

export function gmailListItemSelectedClass(isSelected: boolean): string {
  if (!isSelected) {
    return 'hover:bg-surface-muted/70'
  }

  return 'bg-[#C5221F]/8 border-l-2 border-[#C5221F]'
}
