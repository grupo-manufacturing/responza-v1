import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { APP_PANEL_HEIGHT_CLASS } from '@/layouts/app-layout.constants'

import { IntegrationsRequired } from '@/shared/ui/gates/IntegrationsRequired'
import { SubscriptionRequired } from '@/shared/ui/gates/SubscriptionRequired'
import { Spinner, SpinnerSection } from '@/shared/ui/primitives/Spinner'
import { useToast } from '@/shared/ui/toast'
import { AiService, type ConversationAnalyticsResponse } from '@/features/ai/api/ai.service'
import { ConversationAnalyticsPanel } from '@/features/inbox/components/ConversationAnalyticsPanel'
import { ConversationList } from '@/features/inbox/components/ConversationList'
import { ConversationThread } from '@/features/inbox/components/ConversationThread'
import { ConversationThreadHeader } from '@/features/inbox/components/ConversationThreadHeader'
import { MessageComposer, type SendComposerInput } from '@/features/inbox/components/MessageComposer'
import {
  messagingPlatformLabel,
  messagingPlatformLogo,
  type MessagingPlatform,
} from '@/features/inbox/constants'
import {
  inboxKeys,
  isIntegrationsRequiredError,
  useInboxConversations,
  useInboxQueryClient,
  useInboxThread,
} from '@/features/inbox/hooks/useInboxQueries'
import { useInboxRealtime } from '@/features/inbox/hooks/useInboxRealtime'
import { replaceOptimisticThreadMessage } from '@/features/inbox/lib/mergeInboxCache'
import {
  bumpConversationInList,
  flattenConversations,
  flattenThreadMessages,
  type ConversationsInfiniteData,
  type ThreadInfiniteData,
  updateThreadFirstPage,
} from '@/features/inbox/lib/inboxQueryData'
import { formatMessageListPreview } from '@/features/inbox/lib/inbox.preview'
import { INBOX_PANEL_HEADER_CLASS, INBOX_SHELL_CLASS } from '@/features/inbox/lib/inbox-ui'
import { InboxService, type Message } from '@/features/inbox/api/inbox.service'
import { useSubscriptionGate } from '@/shared/hooks/useSubscriptionGate'
import { useIntegrationsGate } from '@/shared/hooks/useIntegrationsGate'
import { useSession } from '@/shared/hooks/useSession'
import { SessionStorage } from '@/shared/session/storage'
import { getApiErrorDetails, getApiErrorMessage } from '@/shared/utils/api-error'
import { canAccessAiAnalytics } from '@/shared/utils/subscription-access'

const LIST_COLUMN_CLASS = 'w-full lg:w-[300px] lg:shrink-0'

type SendMessageErrorDetails = {
  message?: Message
}

type ChannelInboxViewProps = {
  platform: MessagingPlatform
}

export function ChannelInboxView({ platform }: ChannelInboxViewProps) {
  const [searchParams] = useSearchParams()
  const initialConversationId = searchParams.get('conversation')

  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(initialConversationId)
  const { subscriptionRequired, handleError } = useSubscriptionGate()
  const { integrationsLoading, integrationsRequired } = useIntegrationsGate(subscriptionRequired)
  const { me } = useSession()
  const toast = useToast()
  const limitToastShownRef = useRef(false)
  const [mobileShowThread, setMobileShowThread] = useState(initialConversationId !== null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [analyticsOpen, setAnalyticsOpen] = useState(false)
  const [analyticsLocked, setAnalyticsLocked] = useState(false)
  const [analyticsData, setAnalyticsData] = useState<ConversationAnalyticsResponse | null>(null)
  const [analyticsError, setAnalyticsError] = useState<string | null>(null)
  const queryClient = useInboxQueryClient()

  const queriesEnabled =
    !subscriptionRequired && !integrationsRequired && !integrationsLoading

  const conversationsQuery = useInboxConversations(platform, queriesEnabled)
  const threadQuery = useInboxThread(selectedConversationId, queriesEnabled)

  const organizationId = me?.organization.id ?? SessionStorage.getStoredOrganization()?.id ?? null
  const subscription = me?.subscription ?? SessionStorage.getStoredSubscription()
  const conversationLimitReached =
    subscription?.conversationQuotaEnforced === true &&
    subscription.conversationsRemaining !== null &&
    subscription.conversationsRemaining <= 0

  useInboxRealtime({
    organizationId,
    selectedConversationId,
    enabled: queriesEnabled,
  })

  useEffect(() => {
    setSelectedConversationId(initialConversationId)
    setMobileShowThread(initialConversationId !== null)
  }, [initialConversationId, platform])

  useEffect(() => {
    if (conversationsQuery.error) {
      handleError(conversationsQuery.error)
      if (
        !subscriptionRequired &&
        !isIntegrationsRequiredError(conversationsQuery.error)
      ) {
        toast.error(
          getApiErrorMessage(conversationsQuery.error, 'Could not load conversations. Please try again.'),
        )
      }
    }
  }, [conversationsQuery.error, handleError, subscriptionRequired, toast])

  useEffect(() => {
    if (threadQuery.error) {
      handleError(threadQuery.error)
      if (!subscriptionRequired && !isIntegrationsRequiredError(threadQuery.error)) {
        toast.error(
          getApiErrorMessage(threadQuery.error, 'Could not load conversation. Please try again.'),
        )
      }
    }
  }, [handleError, subscriptionRequired, threadQuery.error, toast])

  useEffect(() => {
    if (!conversationLimitReached || limitToastShownRef.current) {
      return
    }

    limitToastShownRef.current = true
    toast.info(
      'Conversation limit reached for this billing period. Upgrade your plan to start new conversations. You can still reply in existing threads.',
    )
  }, [conversationLimitReached, toast])

  useEffect(() => {
    setAnalyticsOpen(false)
    setAnalyticsLocked(false)
    setAnalyticsData(null)
    setAnalyticsError(null)
    setAnalyticsLoading(false)
  }, [selectedConversationId])

  const integrationsRequiredFromApi =
    queriesEnabled &&
    ((conversationsQuery.error !== null && isIntegrationsRequiredError(conversationsQuery.error)) ||
      (threadQuery.error !== null && isIntegrationsRequiredError(threadQuery.error)))

  const conversations = flattenConversations(conversationsQuery.data)
  const listLoading = conversationsQuery.isLoading
  const listLoadingMore = conversationsQuery.isFetchingNextPage

  const threadFirstPage = threadQuery.data?.pages[0]
  const threadLoading = threadQuery.isLoading && selectedConversationId !== null
  const threadLoadingOlder = threadQuery.isFetchingNextPage
  const activeConversation = threadFirstPage?.conversation ?? null
  const participants = threadFirstPage?.participants ?? []
  const messages = flattenThreadMessages(threadQuery.data)
  const hasMoreOlder = threadQuery.hasNextPage ?? false

  const agentDraft = useMemo(() => {
    let latestInbound: (typeof messages)[number] | null = null

    for (let index = messages.length - 1; index >= 0; index -= 1) {
      if (messages[index].direction === 'inbound') {
        latestInbound = messages[index]
        break
      }
    }

    if (latestInbound === null) {
      return null
    }

    const reply = latestInbound.suggestedReply
    if (reply === null || reply.trim().length === 0) {
      return null
    }

    const inboundIndex = messages.findIndex((message) => message.id === latestInbound.id)
    if (inboundIndex === -1) {
      return null
    }
    const hasOutboundAfter = messages
      .slice(inboundIndex + 1)
      .some((message) => message.direction === 'outbound')

    if (hasOutboundAfter) {
      return null
    }

    return {
      messageId: latestInbound.id,
      reply: reply.trim(),
    }
  }, [messages])

  const handleLoadMoreConversations = useCallback(() => {
    if (!conversationsQuery.hasNextPage || conversationsQuery.isFetchingNextPage) {
      return
    }

    void conversationsQuery.fetchNextPage()
  }, [conversationsQuery])

  const handleLoadOlderMessages = useCallback(() => {
    if (!threadQuery.hasNextPage || threadQuery.isFetchingNextPage) {
      return
    }

    void threadQuery.fetchNextPage()
  }, [threadQuery])

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId)
    setMobileShowThread(true)
  }

  const handleAnalyzeConversation = async () => {
    if (selectedConversationId === null || analyticsLoading || threadLoading) {
      return
    }

    setAnalyticsOpen(true)

    if (!canAccessAiAnalytics(subscription)) {
      setAnalyticsLocked(true)
      setAnalyticsData(null)
      setAnalyticsError(null)
      setAnalyticsLoading(false)
      return
    }

    setAnalyticsLocked(false)
    setAnalyticsLoading(true)
    setAnalyticsError(null)

    try {
      const result = await AiService.analyzeConversation(selectedConversationId)
      setAnalyticsData(result)
    } catch (err: unknown) {
      setAnalyticsData(null)
      setAnalyticsError(
        getApiErrorMessage(err, 'Could not generate conversation analytics. Please try again.'),
      )
      toast.error(
        getApiErrorMessage(err, 'Could not generate conversation analytics. Please try again.'),
      )
    } finally {
      setAnalyticsLoading(false)
    }
  }

  const handleSendMessage = (input: SendComposerInput) => {
    if (selectedConversationId === null || organizationId === null) {
      return
    }

    const optimisticId = `optimistic-${Date.now()}`
    const optimisticPreviewUrl = input.attachment?.previewUrl ?? null
    const contentType = input.attachment?.contentType ?? 'text'

    const optimisticMessage: Message = {
      id: optimisticId,
      organizationId,
      conversationId: selectedConversationId,
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
      inboxKeys.thread(selectedConversationId),
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

    queryClient.setQueryData(
      inboxKeys.conversations(platform),
      (current: ConversationsInfiniteData | undefined) => {
        if (current === undefined) {
          return current
        }

        return bumpConversationInList(current, selectedConversationId, {
          lastMessage: formatMessageListPreview(input.content, contentType),
          lastMessageAt: optimisticMessage.createdAt,
        })
      },
    )

    void (async () => {
      try {
        const result =
          input.attachment !== undefined
            ? await (async () => {
                const uploaded = await InboxService.uploadOutboundMedia(selectedConversationId, {
                  file: input.attachment!.file,
                  contentType: input.attachment!.contentType,
                  filename: input.attachment!.file.name,
                })

                return InboxService.sendMessage(selectedConversationId, {
                  content: input.content,
                  contentType: input.attachment!.contentType,
                  storagePath: uploaded.media.storagePath,
                  mimeType: uploaded.media.mimeType,
                  fileSizeBytes: uploaded.media.fileSizeBytes,
                  filename: uploaded.media.filename ?? input.attachment!.file.name,
                })
              })()
            : await InboxService.sendMessage(selectedConversationId, { content: input.content })

        replaceOptimisticThreadMessage(
          queryClient,
          selectedConversationId,
          optimisticId,
          result.message,
        )

        queryClient.setQueryData(
          inboxKeys.conversations(platform),
          (current: ConversationsInfiniteData | undefined) => {
            if (current === undefined) {
              return current
            }

            return bumpConversationInList(current, selectedConversationId, {
              lastMessage: formatMessageListPreview(
                result.message.content,
                result.message.contentType,
              ),
              lastMessageAt: result.message.createdAt,
            })
          },
        )
      } catch (err) {
        const details = getApiErrorDetails<SendMessageErrorDetails>(err)

        if (details?.message) {
          replaceOptimisticThreadMessage(
            queryClient,
            selectedConversationId,
            optimisticId,
            details.message,
          )
        } else {
          queryClient.setQueryData(
            inboxKeys.thread(selectedConversationId),
            (current: ThreadInfiniteData | undefined) => {
              if (current === undefined || current.pages.length === 0) {
                return current
              }

              return updateThreadFirstPage(current, (page) => ({
                ...page,
                messages: page.messages.map((message) =>
                  message.id === optimisticId ? { ...message, status: 'failed' as const } : message,
                ),
              }))
            },
          )
        }

        toast.error(getApiErrorMessage(err, 'Could not send message. Please try again.'))
      }
    })()
  }

  const selectedListItem =
    selectedConversationId !== null
      ? conversations.find((item) => item.id === selectedConversationId)
      : undefined

  const activePlatform = selectedListItem?.platform ?? platform

  if (subscriptionRequired) {
    return <SubscriptionRequired />
  }

  if (integrationsLoading) {
    return <SpinnerSection minHeightClassName="min-h-[50vh]" />
  }

  if (integrationsRequired || integrationsRequiredFromApi) {
    return <IntegrationsRequired />
  }

  return (
    <div className={`flex flex-col ${APP_PANEL_HEIGHT_CLASS}`}>
      {listLoading ? (
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div className={`${INBOX_SHELL_CLASS} animate-step-in`}>
          <div className="flex min-h-0 flex-1">
            <div
              className={[
                LIST_COLUMN_CLASS,
                'flex min-h-0 flex-col border-border lg:border-r',
                mobileShowThread ? 'hidden lg:flex' : 'flex',
              ].join(' ')}
            >
              <div className={INBOX_PANEL_HEADER_CLASS}>
                <div className="flex items-center gap-2.5">
                  <img
                    src={messagingPlatformLogo(platform)}
                    alt=""
                    className="h-6 w-6 object-contain"
                  />
                  <h1 className="text-sm font-semibold text-ink">{messagingPlatformLabel(platform)}</h1>
                </div>
              </div>

              <ConversationList
                conversations={conversations}
                selectedId={selectedConversationId}
                hasMore={conversationsQuery.hasNextPage ?? false}
                loadingMore={listLoadingMore}
                onLoadMore={handleLoadMoreConversations}
                onSelect={(item) => handleSelectConversation(item.id)}
              />
            </div>

            <div
              className={[
                'relative flex min-h-0 min-w-0 flex-1 flex-col',
                mobileShowThread ? 'flex' : 'hidden lg:flex',
              ].join(' ')}
            >
              <div className={INBOX_PANEL_HEADER_CLASS}>
                <ConversationThreadHeader
                  conversation={activeConversation}
                  participants={participants}
                  platform={activePlatform}
                  pendingContact={
                    threadLoading && selectedListItem !== undefined
                      ? {
                          displayName: selectedListItem.displayName,
                          avatarUrl: selectedListItem.avatarUrl,
                        }
                      : null
                  }
                  onBack={() => setMobileShowThread(false)}
                  analyticsLoading={analyticsLoading}
                  analyticsDisabled={selectedConversationId === null || threadLoading}
                  onAnalyze={() => {
                    void handleAnalyzeConversation()
                  }}
                />
              </div>

              <ConversationThread
                conversation={activeConversation}
                messages={messages}
                loading={threadLoading}
                hasMoreOlder={hasMoreOlder}
                loadingOlder={threadLoadingOlder}
                onLoadOlder={handleLoadOlderMessages}
                platform={activePlatform}
                actionsDisabled={threadLoading}
              />
              {selectedConversationId !== null && (
                <MessageComposer
                  conversationId={selectedConversationId}
                  disabled={threadLoading}
                  platform={activePlatform}
                  agentDraft={agentDraft}
                  onSend={handleSendMessage}
                />
              )}
              <ConversationAnalyticsPanel
                open={analyticsOpen}
                loading={analyticsLoading}
                locked={analyticsLocked}
                data={analyticsData}
                error={analyticsError}
                onClose={() => setAnalyticsOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
