import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { useToast } from '@/shared/ui/toast'
import type { SendComposerInput } from '@/features/inbox/components/MessageComposer'
import type { MessagingPlatform } from '@/features/inbox/constants'
import { inboxKeys } from '@/features/inbox/hooks/useInboxQueries'
import { replaceOptimisticThreadMessage } from '@/features/inbox/lib/mergeInboxCache'
import {
  bumpConversationInList,
  type ConversationsInfiniteData,
  type ThreadInfiniteData,
  updateThreadFirstPage,
} from '@/features/inbox/lib/inboxQueryData'
import { formatMessageListPreview } from '@/features/inbox/lib/inbox.preview'
import { InboxService, type Message } from '@/features/inbox/api/inbox.service'
import { getApiErrorDetails, getApiErrorMessage } from '@/shared/utils/api-error'

type SendMessageErrorDetails = {
  message?: Message
}

type UseSendInboxMessageInput = {
  readonly platform: MessagingPlatform
  readonly organizationId: string | null
  readonly conversationId: string | null
}

export function useSendInboxMessage({
  platform,
  organizationId,
  conversationId,
}: UseSendInboxMessageInput) {
  const queryClient = useQueryClient()
  const toast = useToast()

  const sendMessage = useCallback(
    (input: SendComposerInput) => {
      if (conversationId === null || organizationId === null) {
        return
      }

      const optimisticId = `optimistic-${Date.now()}`
      const optimisticPreviewUrl = input.attachment?.previewUrl ?? null
      const contentType = input.attachment?.contentType ?? 'text'

      const bumpConversationLastMessage = (
        content: string,
        messageContentType: typeof contentType,
        lastMessageAt: string,
      ) => {
        queryClient.setQueryData(
          inboxKeys.conversations(platform),
          (current: ConversationsInfiniteData | undefined) => {
            if (current === undefined) {
              return current
            }

            return bumpConversationInList(current, conversationId, {
              lastMessage: formatMessageListPreview(content, messageContentType),
              lastMessageAt,
            })
          },
        )
      }

      const optimisticMessage: Message = {
        id: optimisticId,
        organizationId,
        conversationId,
        participantId: null,
        direction: 'outbound',
        platformMessageId: null,
        content: input.content,
        contentType,
        mediaUrl: optimisticPreviewUrl,
        mimeType: input.attachment?.file.type || null,
        status: 'pending',
        suggestedReply: null,
        createdAt: new Date().toISOString(),
      }

      queryClient.setQueryData(
        inboxKeys.thread(conversationId),
        (current: ThreadInfiniteData | undefined) => {
          if (current === undefined || current.pages.length === 0) {
            return current
          }

          return updateThreadFirstPage(current, (page) => ({
            ...page,
            messages: [...page.messages, optimisticMessage],
          }))
        },
      )

      bumpConversationLastMessage(input.content, contentType, optimisticMessage.createdAt)

      void (async () => {
        try {
          const result =
            input.attachment !== undefined
              ? await (async () => {
                  const uploaded = await InboxService.uploadOutboundMedia(conversationId, {
                    file: input.attachment!.file,
                    contentType: input.attachment!.contentType,
                    filename: input.attachment!.file.name,
                  })

                  return InboxService.sendMessage(conversationId, {
                    content: input.content,
                    contentType: input.attachment!.contentType,
                    storagePath: uploaded.media.storagePath,
                    mimeType: uploaded.media.mimeType,
                    fileSizeBytes: uploaded.media.fileSizeBytes,
                    filename: uploaded.media.filename ?? input.attachment!.file.name,
                  })
                })()
              : await InboxService.sendMessage(conversationId, { content: input.content })

          replaceOptimisticThreadMessage(queryClient, conversationId, optimisticId, result.message)

          bumpConversationLastMessage(
            result.message.content,
            result.message.contentType,
            result.message.createdAt,
          )
        } catch (err) {
          const details = getApiErrorDetails<SendMessageErrorDetails>(err)

          if (details?.message) {
            replaceOptimisticThreadMessage(
              queryClient,
              conversationId,
              optimisticId,
              details.message,
            )
          } else {
            queryClient.setQueryData(
              inboxKeys.thread(conversationId),
              (current: ThreadInfiniteData | undefined) => {
                if (current === undefined || current.pages.length === 0) {
                  return current
                }

                return updateThreadFirstPage(current, (page) => ({
                  ...page,
                  messages: page.messages.map((message) =>
                    message.id === optimisticId
                      ? { ...message, status: 'failed' as const }
                      : message,
                  ),
                }))
              },
            )
          }

          toast.error(getApiErrorMessage(err, 'Could not send message. Please try again.'))
        }
      })()
    },
    [conversationId, organizationId, platform, queryClient, toast],
  )

  return { sendMessage }
}
