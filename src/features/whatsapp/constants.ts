import type { MessagingPlatform } from '@/features/inbox/constants'

export const WHATSAPP_PLATFORM: MessagingPlatform = 'whatsapp'

export const whatsappKeys = {
  conversations: ['whatsapp', 'conversations'] as const,
}
