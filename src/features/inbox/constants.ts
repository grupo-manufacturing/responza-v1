import {
  INTEGRATION_PLATFORM_LABELS,
  INTEGRATION_PLATFORM_LOGOS,
  type IntegrationPlatform,
} from '@/features/integrations/constants'

export type MessagingPlatform = Extract<IntegrationPlatform, 'whatsapp' | 'instagram'>

export const MESSAGING_PLATFORMS: MessagingPlatform[] = ['whatsapp', 'instagram']

export type MessageDirection = 'inbound' | 'outbound'

export type MessageStatus = 'pending' | 'sent' | 'failed' | 'read'

export type MessageContentType = 'text' | 'image' | 'video' | 'audio' | 'document'

export const REPLY_SUGGESTION_CHIP_COUNT = 2

export function messagingPlatformPath(platform: MessagingPlatform): string {
  return `/${platform}`
}

export function messagingConversationPath(
  platform: MessagingPlatform,
  conversationId: string,
): string {
  return `${messagingPlatformPath(platform)}?conversation=${encodeURIComponent(conversationId)}`
}

export function messagingPlatformLabel(platform: MessagingPlatform): string {
  return INTEGRATION_PLATFORM_LABELS[platform]
}

export function messagingPlatformLogo(platform: MessagingPlatform): string {
  return INTEGRATION_PLATFORM_LOGOS[platform]
}

export function isMessagingPlatform(value: string): value is MessagingPlatform {
  return value === 'whatsapp' || value === 'instagram'
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
