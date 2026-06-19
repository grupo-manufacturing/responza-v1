import { useEffect, useState } from 'react'

import { IntegrationsRequired } from '@/components/common/IntegrationsRequired'
import { SubscriptionRequired } from '@/components/common/SubscriptionRequired'
import { Alert } from '@/components/ui/Alert'
import { Spinner } from '@/components/ui/Spinner'
import { AiService, type ConversationAnalyticsResponse } from '@/modules/ai/ai.service'
import { ConversationAnalyticsPanel } from '@/modules/inbox/components/ConversationAnalyticsPanel'
import { ConversationList } from '@/modules/inbox/components/ConversationList'
import { ConversationThread } from '@/modules/inbox/components/ConversationThread'
import { ConversationThreadHeader } from '@/modules/inbox/components/ConversationThreadHeader'
import { MessageComposer } from '@/modules/inbox/components/MessageComposer'
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
import { upsertThreadMessage } from '@/modules/inbox/lib/mergeInboxCache'
import { InboxService, type Message } from '@/modules/inbox/inbox.service'
import { useSubscriptionGate } from '@/shared/hooks/useSubscriptionGate'
import { useSession } from '@/shared/hooks/useSession'
import { SessionStorage } from '@/shared/session/storage'
import { getApiErrorDetails, getApiErrorMessage } from '@/shared/utils/api-error'

const LIST_COLUMN_CLASS = 'w-full lg:w-[280px] lg:shrink-0'

type SendMessageErrorDetails = {
  message?: Message
}

export function InboxPage() {
  const [platformFilter, setPlatformFilter] = useState<InboxPlatformFilter>('all')
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const { subscriptionRequired, handleError } = useSubscriptionGate()
  const { me } = useSession()
  const [sendError, setSendError] = useState<string | null>(null)
  const [mobileShowThread, setMobileShowThread] = useState(false)
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

  const conversations = conversationsQuery.data?.conversations ?? []
  const listLoading = conversationsQuery.isLoading
  const threadLoading = threadQuery.isLoading && selectedConversationId !== null
  const activeConversation = threadQuery.data?.conversation ?? null
  const participants = threadQuery.data?.participants ?? []
  const messages = threadQuery.data?.messages ?? []

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
        (current: Awaited<ReturnType<typeof InboxService.getConversation>> | undefined) => {
          if (!current) return current
          return {
            ...current,
            messages: current.messages.map((item) =>
              item.id === messageId ? result.message : item,
            ),
          }
        },
      )
    } catch (err) {
      setSendError(getApiErrorMessage(err, 'Could not react to message. Please try again.'))
    }
  }

  const handleSendMessage = async (content: string) => {
    if (selectedConversationId === null) {
      return
    }

    setSending(true)
    setSendError(null)

    try {
      const result = await InboxService.sendMessage(selectedConversationId, { content })

      upsertThreadMessage(queryClient, selectedConversationId, result.message)

      queryClient.setQueryData(
        inboxKeys.conversations(platformFilter),
        (current: Awaited<ReturnType<typeof InboxService.listConversations>> | undefined) => {
          if (!current) return current
          return {
            conversations: current.conversations.map((item) =>
              item.id === selectedConversationId
                ? {
                    ...item,
                    lastMessage: result.message.content,
                    lastMessageAt: result.message.createdAt,
                  }
                : item,
            ),
          }
        },
      )
    } catch (err) {
      const details = getApiErrorDetails<SendMessageErrorDetails>(err)
      if (details?.message) {
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

  if (subscriptionRequired) {
    return <SubscriptionRequired />
  }

  if (integrationsRequired) {
    return <IntegrationsRequired />
  }

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col">
      {error !== null && (
        <Alert variant="error" className="mb-3 shrink-0">
          {error}
        </Alert>
      )}

      <div className="flex min-h-0 flex-1 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="flex min-h-0 flex-1">
          <div
            className={[
              LIST_COLUMN_CLASS,
              'flex min-h-0 flex-col border-neutral-200 lg:border-r',
              mobileShowThread ? 'hidden lg:flex' : 'flex',
            ].join(' ')}
          >
            <div className="flex shrink-0 border-b border-neutral-200 px-3 py-2.5">
              <PlatformTabs value={platformFilter} onChange={handlePlatformFilterChange} />
            </div>

            {listLoading ? (
              <div className="flex flex-1 items-center justify-center py-16">
                <Spinner />
              </div>
            ) : (
              <ConversationList
                conversations={conversations}
                selectedId={selectedConversationId}
                onSelect={(item) => handleSelectConversation(item.id)}
              />
            )}
          </div>

          <div
            className={[
              'relative flex min-h-0 min-w-0 flex-1 flex-col',
              mobileShowThread ? 'flex' : 'hidden lg:flex',
            ].join(' ')}
          >
            <div className="flex shrink-0 border-b border-neutral-200 px-4 py-2.5">
              <ConversationThreadHeader
                conversation={activeConversation}
                participants={participants}
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
