import type { MessagingPlatform } from '@/features/inbox/constants'

export const INSTAGRAM_PLATFORM: MessagingPlatform = 'instagram'

export const instagramKeys = {
  conversations: ['instagram', 'conversations'] as const,
}
