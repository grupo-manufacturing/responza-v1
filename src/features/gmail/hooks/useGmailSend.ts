import { useMutation, useQueryClient } from '@tanstack/react-query'

import { GmailService } from '@/features/gmail/api/gmail.service'
import { gmailKeys } from '@/features/gmail/constants'

export function useGmailSend() {
  const queryClient = useQueryClient()

  const sendMutation = useMutation({
    mutationFn: GmailService.sendMessage,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: gmailKeys.messages })
    },
  })

  const replyMutation = useMutation({
    mutationFn: ({ messageId, body }: { messageId: string; body: string }) =>
      GmailService.replyToMessage(messageId, { body }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: gmailKeys.messages })
    },
  })

  return {
    sendMutation,
    replyMutation,
    sending: sendMutation.isPending || replyMutation.isPending,
  }
}
