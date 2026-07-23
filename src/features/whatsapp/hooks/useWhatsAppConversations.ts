import { useInboxConversations } from '@/features/inbox/hooks/useInboxQueries'
import { WHATSAPP_PLATFORM } from '@/features/whatsapp/constants'

export function useWhatsAppConversations(enabled: boolean) {
  return useInboxConversations(WHATSAPP_PLATFORM, enabled)
}
