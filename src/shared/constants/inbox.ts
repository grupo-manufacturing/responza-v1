import {
  INTEGRATION_PLATFORM_LABELS,
  INTEGRATION_PLATFORM_LOGOS,
  type IntegrationPlatform,
} from '@/shared/constants/integrations'

export type InboxPlatformFilter = IntegrationPlatform | 'all'

export type MessageDirection = 'inbound' | 'outbound'

export const INBOX_PLATFORM_FILTERS: InboxPlatformFilter[] = [
  'all',
  'whatsapp',
  'instagram',
  'indiamart',
]

export function inboxPlatformFilterLabel(filter: InboxPlatformFilter): string {
  if (filter === 'all') {
    return 'All'
  }

  return INTEGRATION_PLATFORM_LABELS[filter]
}

export function inboxPlatformLabel(platform: IntegrationPlatform): string {
  return INTEGRATION_PLATFORM_LABELS[platform]
}

export function inboxPlatformLogo(platform: IntegrationPlatform): string {
  return INTEGRATION_PLATFORM_LOGOS[platform]
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
