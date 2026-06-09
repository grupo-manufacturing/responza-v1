import type { IntegrationPlatform } from '@/shared/constants/integrations'

export function formatInboxContactDisplayName(
  platform: IntegrationPlatform,
  displayName: string,
): string {
  const trimmed = displayName.trim()

  if (trimmed.length === 0) {
    if (platform === 'instagram') {
      return 'Instagram User'
    }

    if (platform === 'whatsapp') {
      return 'WhatsApp Contact'
    }

    return 'Contact'
  }

  if (platform === 'instagram') {
    return trimmed.startsWith('@') ? trimmed : `@${trimmed}`
  }

  return trimmed
}

export function conversationListSelectedBorderClass(
  platform: IntegrationPlatform,
  isSelected: boolean,
): string {
  if (!isSelected) {
    return ''
  }

  if (platform === 'whatsapp') {
    return 'border-l-2 border-[#25D366]'
  }

  if (platform === 'instagram') {
    return 'border-l-2 border-[#E1306C]'
  }

  return 'border-l-2 border-neutral-900'
}
