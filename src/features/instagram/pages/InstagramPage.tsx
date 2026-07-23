import { ChannelInboxView } from '@/features/inbox/components/ChannelInboxView'
import { INSTAGRAM_PLATFORM } from '@/features/instagram/constants'

export function InstagramPage() {
  return <ChannelInboxView platform={INSTAGRAM_PLATFORM} />
}
