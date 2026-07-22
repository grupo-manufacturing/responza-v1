import { useQuery } from '@tanstack/react-query'

import { GmailService } from '@/features/gmail/api/gmail.service'
import { gmailKeys } from '@/features/gmail/constants'

export function useGmailMessage(messageId: string | null, enabled: boolean) {
  return useQuery({
    queryKey: gmailKeys.message(messageId ?? ''),
    queryFn: () => GmailService.getMessage(messageId!),
    enabled: enabled && messageId !== null && messageId.length > 0,
    refetchOnWindowFocus: false,
  })
}
