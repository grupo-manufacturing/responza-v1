import { ChannelInboxView } from '@/features/inbox/components/ChannelInboxView'
import { WHATSAPP_PLATFORM } from '@/features/whatsapp/constants'

export function WhatsAppPage() {
  return <ChannelInboxView platform={WHATSAPP_PLATFORM} />
}
