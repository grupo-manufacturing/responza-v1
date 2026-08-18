import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { APP_PANEL_HEIGHT_CLASS } from '@/layouts/app-layout.constants'

import { IntegrationsRequired } from '@/shared/ui/gates/IntegrationsRequired'
import { SubscriptionRequired } from '@/shared/ui/gates/SubscriptionRequired'
import { Spinner, SpinnerSection } from '@/shared/ui/primitives/Spinner'
import { useToast } from '@/shared/ui/toast'
import { ConversationAnalyticsPanel } from '@/features/inbox/components/ConversationAnalyticsPanel'
import { ConversationList } from '@/features/inbox/components/ConversationList'
import { ConversationThread } from '@/features/inbox/components/ConversationThread'
import { ConversationThreadHeader } from '@/features/inbox/components/ConversationThreadHeader'
import { MessageComposer } from '@/features/inbox/components/MessageComposer'
import {
  isMessagingPlatform,
  messagingPlatformLabel,
  messagingPlatformLogo,
  type MessagingPlatform,
} from '@/features/inbox/constants'
import { useConversationAnalytics } from '@/features/inbox/hooks/useConversationAnalytics'
import {
  isIntegrationsRequiredError,
  useInboxConversations,
  useInboxThread,
} from '@/features/inbox/hooks/useInboxQueries'
import { useInboxQueryErrorToast } from '@/features/inbox/hooks/useInboxQueryErrorToast'
import { useInboxRealtime } from '@/features/inbox/hooks/useInboxRealtime'
import { useSendInboxMessage } from '@/features/inbox/hooks/useSendInboxMessage'
import {
  flattenConversations,
  flattenThreadMessages,
} from '@/features/inbox/lib/inboxQueryData'
import { INBOX_PANEL_HEADER_CLASS, INBOX_SHELL_CLASS } from '@/features/inbox/lib/inbox-ui'
import { useSubscriptionGate } from '@/shared/hooks/useSubscriptionGate'
import { useIntegrationsGate } from '@/shared/hooks/useIntegrationsGate'
import { useSession } from '@/shared/hooks/useSession'
import { SessionStorage } from '@/shared/session/storage'

const LIST_COLUMN_CLASS = 'w-full lg:w-[300px] lg:shrink-0'

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

  const inboxQueryErrors = useMemo(
    () => [
      {
        error: conversationsQuery.error,
        fallbackMessage: 'Could not load conversations. Please try again.',
      },
      {
        error: threadQuery.error,
        fallbackMessage: 'Could not load conversation. Please try again.',
      },
    ],
    [conversationsQuery.error, threadQuery.error],
  )

  useInboxQueryErrorToast({
    subscriptionRequired,
    handleError,
    queryErrors: inboxQueryErrors,
  })

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
    if (!conversationLimitReached || limitToastShownRef.current) {
      return
    }

    limitToastShownRef.current = true
    toast.info(
      'Conversation limit reached for this billing period. Upgrade your plan to start new conversations. You can still reply in existing threads.',
    )
  }, [conversationLimitReached, toast])

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

  const analytics = useConversationAnalytics({
    conversationId: selectedConversationId,
    threadLoading,
    subscription,
  })

  const { sendMessage } = useSendInboxMessage({
    platform,
    organizationId,
    conversationId: selectedConversationId,
  })

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

  const selectedListItem =
    selectedConversationId !== null
      ? conversations.find((item) => item.id === selectedConversationId)
      : undefined

  const listPlatform = selectedListItem?.platform
  const activePlatform: MessagingPlatform =
    listPlatform !== undefined && isMessagingPlatform(listPlatform) ? listPlatform : platform

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
                  analyticsLoading={analytics.loading}
                  analyticsDisabled={selectedConversationId === null || threadLoading}
                  onAnalyze={() => {
                    void analytics.analyze()
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
                  onSend={sendMessage}
                />
              )}
              <ConversationAnalyticsPanel
                open={analytics.open}
                loading={analytics.loading}
                locked={analytics.locked}
                data={analytics.data}
                onClose={analytics.close}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
