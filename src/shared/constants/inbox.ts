import type { IntegrationPlatform } from '@/shared/constants/integrations'

export type InboxPlatform = IntegrationPlatform

export type InboxPlatformFilter = InboxPlatform | 'all'

export const INBOX_PLATFORM_FILTERS: { value: InboxPlatformFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'indiamart', label: 'IndiaMART' },
]

export function platformLabel(platform: InboxPlatform | null | undefined): string {
  if (platform === null || platform === undefined) {
    return 'Unknown'
  }

  return INBOX_PLATFORM_FILTERS.find((entry) => entry.value === platform)?.label ?? platform
}
