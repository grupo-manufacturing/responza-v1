import {
  INTEGRATION_PLATFORM_LABELS,
  type IntegrationPlatform,
} from '@/modules/integrations/integrations.constants'

export type InboxPlatformFilter = IntegrationPlatform | 'all'

export type MessageDirection = 'inbound' | 'outbound'

export type MessageStatus = 'pending' | 'sent' | 'failed' | 'read'

export type MessageContentType = 'text' | 'image' | 'video' | 'audio' | 'document'

export const INBOX_PLATFORM_FILTERS: InboxPlatformFilter[] = [
  'all',
  'whatsapp',
  'instagram',
]

export const REPLY_SUGGESTION_CHIP_COUNT = 2

export function inboxPlatformFilterLabel(filter: InboxPlatformFilter): string {
  if (filter === 'all') {
    return 'All'
  }

  return INTEGRATION_PLATFORM_LABELS[filter]
}

export function formatInboxTimestamp(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const now = new Date()
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()

  if (isToday) {
    return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
  }

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}
