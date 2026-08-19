export const GMAIL_LIST_COLUMN_CLASS = 'w-full lg:w-[340px] lg:shrink-0'

export const GMAIL_PRIMARY_BUTTON_CLASS = '!bg-[#C5221F] hover:!bg-[#A91B1B]'

export const GMAIL_REPLY_BUTTON_CLASS =
  '!border-[#C5221F]/20 !text-[#C5221F] hover:!bg-[#C5221F]/5'

export const GMAIL_AVATAR_CLASS =
  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C5221F]/10 text-sm font-semibold text-[#C5221F]'

export function gmailListItemSelectedClass(isSelected: boolean): string {
  if (!isSelected) {
    return 'hover:bg-surface-muted/70'
  }

  return 'bg-[#C5221F]/8 border-l-2 border-[#C5221F]'
}
