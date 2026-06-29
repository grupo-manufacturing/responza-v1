import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { IntegrationsRequired } from '@/components/common/IntegrationsRequired'
import { SubscriptionRequired } from '@/components/common/SubscriptionRequired'
import { Alert } from '@/components/ui/Alert'
import { Spinner } from '@/components/ui/Spinner'
import { AiService, type ConversationAnalyticsResponse } from '@/modules/ai/ai.service'
import { ConversationAnalyticsPanel } from '@/modules/inbox/components/ConversationAnalyticsPanel'
import { ConversationList } from '@/modules/inbox/components/ConversationList'
import { ConversationThread } from '@/modules/inbox/components/ConversationThread'
import { ConversationThreadHeader } from '@/modules/inbox/components/ConversationThreadHeader'
import { MessageComposer, type SendComposerInput } from '@/modules/inbox/components/MessageComposer'
import { PlatformTabs } from '@/modules/inbox/components/PlatformTabs'
import type { InboxPlatformFilter } from '@/modules/inbox/inbox.constants'
import type { IntegrationPlatform } from '@/modules/integrations/integrations.constants'
import {
  inboxKeys,
  isIntegrationsRequiredError,
  useInboxConversations,
  useInboxQueryClient,
  useInboxThread,
} from '@/modules/inbox/hooks/useInboxQueries'
import { useInboxRealtime } from '@/modules/inbox/hooks/useInboxRealtime'
import { replaceOptimisticThreadMessage, upsertThreadMessage } from '@/modules/inbox/lib/mergeInboxCache'
import {
  bumpConversationInList,
  flattenConversations,
  flattenThreadMessages,
  type ConversationsInfiniteData,
  type ThreadInfiniteData,
  updateThreadFirstPage,
} from '@/modules/inbox/lib/inboxQueryData'
import { formatMessageListPreview } from '@/modules/inbox/inbox.preview'
import { INBOX_PANEL_HEADER_CLASS, INBOX_SHELL_CLASS } from '@/modules/inbox/inbox-ui'
import { InboxService, type Message } from '@/modules/inbox/inbox.service'
import { useSubscriptionGate } from '@/shared/hooks/useSubscriptionGate'
import { useSession } from '@/shared/hooks/useSession'
import { SessionStorage } from '@/shared/session/storage'
import { getApiErrorDetails, getApiErrorMessage } from '@/shared/utils/api-error'

const LIST_COLUMN_CLASS = 'w-full lg:w-[300px] lg:shrink-0'

type SendMessageErrorDetails = {
  message?: Message
}

export function InboxPage() {
  const [searchParams] = useSearchParams()
  const initialConversationId = searchParams.get('conversation')

  const [platformFilter, setPlatformFilter] = useState<InboxPlatformFilter>('all')
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(initialConversationId)
  const [sending, setSending] = useState(false)
  const { subscriptionRequired, handleError } = useSubscriptionGate()
  const { me } = useSession()
  const [sendError, setSendError] = useState<string | null>(null)
  const [mobileShowThread, setMobileShowThread] = useState(initialConversationId !== null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [analyticsOpen, setAnalyticsOpen] = useState(false)
  const [analyticsData, setAnalyticsData] = useState<ConversationAnalyticsResponse | null>(null)
  const [analyticsError, setAnalyticsError] = useState<string | null>(null)
  const queryClient = useInboxQueryClient()

  const queriesEnabled = !subscriptionRequired

  const conversationsQuery = useInboxConversations(platformFilter, queriesEnabled)
  const threadQuery = useInboxThread(selectedConversationId, queriesEnabled)

  const organizationId = me?.organization.id ?? SessionStorage.getStoredOrganization()?.id ?? null

  useInboxRealtime({
    organizationId,
    selectedConversationId,
    enabled: queriesEnabled,
  })

  useEffect(() => {
    if (conversationsQuery.error) {
      handleError(conversationsQuery.error)
    }
  }, [conversationsQuery.error, handleError])

  useEffect(() => {
    if (threadQuery.error) {
      handleError(threadQuery.error)
    }
  }, [handleError, threadQuery.error])

  useEffect(() => {
    setAnalyticsOpen(false)
    setAnalyticsData(null)
    setAnalyticsError(null)
    setAnalyticsLoading(false)
  }, [selectedConversationId])

  const integrationsRequired =
    queriesEnabled &&
    ((conversationsQuery.error !== null && isIntegrationsRequiredError(conversationsQuery.error)) ||
      (threadQuery.error !== null && isIntegrationsRequiredError(threadQuery.error)))

  const listError =
    conversationsQuery.error !== null &&
    !subscriptionRequired &&
    !isIntegrationsRequiredError(conversationsQuery.error)
      ? getApiErrorMessage(conversationsQuery.error, 'Could not load conversations. Please try again.')
      : null

  const threadError =
    threadQuery.error !== null &&
    !subscriptionRequired &&
    !isIntegrationsRequiredError(threadQuery.error)
      ? getApiErrorMessage(threadQuery.error, 'Could not load conversation. Please try again.')
      : null

  const error = sendError ?? listError ?? threadError

  const handlePlatformFilterChange = (filter: InboxPlatformFilter) => {
    setPlatformFilter(filter)
    setSelectedConversationId(null)
    setMobileShowThread(false)
  }

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

    setAnalyticsLoading(true)
    setAnalyticsError(null)
    setAnalyticsOpen(true)

    try {
      const result = await AiService.analyzeConversation(selectedConversationId)
      setAnalyticsData(result)
    } catch (err: unknown) {
      setAnalyticsData(null)
      setAnalyticsError(
        getApiErrorMessage(err, 'Could not generate conversation analytics. Please try again.'),
      )
    } finally {
      setAnalyticsLoading(false)
    }
  }

  const handleReactToMessage = async (messageId: string, emoji: string | null) => {
    if (selectedConversationId === null) {
      return
    }

    setSendError(null)

    try {
      const result = await InboxService.reactToMessage(selectedConversationId, messageId, { emoji })

      queryClient.setQueryData(
        inboxKeys.thread(selectedConversationId),
        (current: ThreadInfiniteData | undefined) => {
          if (current === undefined || current.pages.length === 0) {
            return current
          }

          return updateThreadFirstPage(current, (page) => ({
            ...page,
            messages: page.messages.map((item) =>
              item.id === messageId ? result.message : item,
            ),
          }))
        },
      )
    } catch (err) {
      setSendError(getApiErrorMessage(err, 'Could not react to message. Please try again.'))
    }
  }

  const handleSendMessage = async (input: SendComposerInput) => {
    if (selectedConversationId === null || organizationId === null) {
      return
    }

    setSending(true)
    setSendError(null)

    const optimisticId =
      input.attachment !== undefined ? `optimistic-${Date.now()}` : null
    const optimisticPreviewUrl = input.attachment?.previewUrl ?? null

    if (optimisticId !== null && input.attachment !== undefined && threadFirstPage !== undefined) {
      const optimisticMessage: Message = {
        id: optimisticId,
        organizationId,
        conversationId: selectedConversationId,
        participantId: null,
        direction: 'outbound',
        platformMessageId: null,
        content: input.content,
        contentType: input.attachment.contentType,
        mediaUrl: optimisticPreviewUrl,
        mimeType: input.attachment.file.type || null,
        status: 'pending',
        customerReaction: null,
        agentReaction: null,
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
    }

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

      if (optimisticId !== null) {
        replaceOptimisticThreadMessage(
          queryClient,
          selectedConversationId,
          optimisticId,
          result.message,
        )
      } else {
        upsertThreadMessage(queryClient, selectedConversationId, result.message)
      }

      queryClient.setQueryData(
        inboxKeys.conversations(platformFilter),
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

      if (optimisticId !== null) {
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
                messages: page.messages.filter((message) => message.id !== optimisticId),
              }))
            },
          )
        }
      } else if (details?.message) {
        upsertThreadMessage(queryClient, selectedConversationId, details.message)
      }

      setSendError(getApiErrorMessage(err, 'Could not send message. Please try again.'))
    } finally {
      setSending(false)
    }
  }

  const selectedListItem =
    selectedConversationId !== null
      ? conversations.find((item) => item.id === selectedConversationId)
      : undefined

  const activePlatform: IntegrationPlatform | null = selectedListItem?.platform ?? null
  const subscription = me?.subscription ?? SessionStorage.getStoredSubscription()
  const conversationLimitReached =
    subscription?.conversationQuotaEnforced === true &&
    subscription.conversationsRemaining !== null &&
    subscription.conversationsRemaining <= 0

  if (subscriptionRequired) {
    return <SubscriptionRequired />
  }

  if (integrationsRequired) {
    return <IntegrationsRequired />
  }

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col">
      {conversationLimitReached && (
        <Alert variant="warning" className="mb-3 shrink-0">
          Monthly conversation limit reached. Upgrade your plan to start new conversations. You can
          still reply in existing threads.
        </Alert>
      )}

      {error !== null && (
        <Alert variant="error" className="mb-3 shrink-0">
          {error}
        </Alert>
      )}

      <div className={INBOX_SHELL_CLASS}>
        <div className="flex min-h-0 flex-1">
          <div
            className={[
              LIST_COLUMN_CLASS,
              'flex min-h-0 flex-col border-border lg:border-r',
              mobileShowThread ? 'hidden lg:flex' : 'flex',
            ].join(' ')}
          >
            <div className={INBOX_PANEL_HEADER_CLASS}>
              <PlatformTabs value={platformFilter} onChange={handlePlatformFilterChange} />
            </div>

            {listLoading ? (
              <div className="flex flex-1 items-center justify-center py-16">
                <Spinner />
              </div>
            ) : (
              <div className="flex min-h-0 flex-1 flex-col">
                <ConversationList
                conversations={conversations}
                selectedId={selectedConversationId}
                hasMore={conversationsQuery.hasNextPage ?? false}
                loadingMore={listLoadingMore}
                onLoadMore={handleLoadMoreConversations}
                onSelect={(item) => handleSelectConversation(item.id)}
              />
              </div>
            )}
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
              reactDisabled={
                activePlatform === 'indiamart' || activePlatform === null || threadLoading
              }
              onReact={handleReactToMessage}
            />
            <MessageComposer
              conversationId={selectedConversationId}
              disabled={selectedConversationId === null || threadLoading}
              sending={sending}
              platform={activePlatform}
              onSend={handleSendMessage}
            />
            <ConversationAnalyticsPanel
              open={analyticsOpen}
              loading={analyticsLoading}
              data={analyticsData}
              error={analyticsError}
              onClose={() => setAnalyticsOpen(false)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
