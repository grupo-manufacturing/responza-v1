import { useInboxConversations } from '@/features/inbox/hooks/useInboxQueries'
import { INSTAGRAM_PLATFORM } from '@/features/instagram/constants'

export function useInstagramConversations(enabled: boolean) {
  return useInboxConversations(INSTAGRAM_PLATFORM, enabled)
}
