import { useCallback, useEffect, useState } from 'react'

import { ConversationList } from '@/modules/inbox/components/ConversationList'
import { ConversationThread } from '@/modules/inbox/components/ConversationThread'
import { ConversationThreadHeader } from '@/modules/inbox/components/ConversationThreadHeader'
import { SubscriptionRequired } from '@/components/common/SubscriptionRequired'
import { IntegrationsRequired } from '@/modules/inbox/components/IntegrationsRequired'
import { MessageComposer } from '@/modules/inbox/components/MessageComposer'
import { PlatformTabs } from '@/modules/inbox/components/PlatformTabs'
import { Spinner } from '@/components/ui/Spinner'
import type { InboxPlatformFilter } from '@/shared/constants/inbox'
import type { IntegrationPlatform } from '@/shared/constants/integrations'
import InboxService, {
  type Conversation,
  type ConversationListItem,
  type Message,
  type Participant,
} from '@/shared/services/inbox.service'
import {
  getApiErrorCode,
  getApiErrorDetails,
  getApiErrorMessage,
  isSubscriptionRequiredError,
} from '@/shared/utils/api-error'

const LIST_COLUMN_CLASS = 'w-full lg:w-[280px] lg:shrink-0'
const LIST_REFRESH_MS = 8000
const THREAD_REFRESH_MS = 5000

type SendMessageErrorDetails = {
  message?: Message
}

export function InboxPage() {
  const [platformFilter, setPlatformFilter] = useState<InboxPlatformFilter>('all')
  const [conversations, setConversations] = useState<ConversationListItem[]>([])
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [listLoading, setListLoading] = useState(true)
  const [threadLoading, setThreadLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [integrationsRequired, setIntegrationsRequired] = useState(false)
  const [subscriptionRequired, setSubscriptionRequired] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mobileShowThread, setMobileShowThread] = useState(false)

  const loadConversations = useCallback(async (filter: InboxPlatformFilter, options?: { silent?: boolean }) => {
    if (!options?.silent) {
      setListLoading(true)
    }
    setError(null)
    setIntegrationsRequired(false)
    setSubscriptionRequired(false)

    try {
      const result = await InboxService.listConversations({
        platform: filter === 'all' ? undefined : filter,
      })
      setConversations(result.conversations)
    } catch (err) {
      if (isSubscriptionRequiredError(err)) {
        setSubscriptionRequired(true)
        setConversations([])
        return
      }

      if (getApiErrorCode(err) === 'INTEGRATIONS_REQUIRED') {
        setIntegrationsRequired(true)
        setConversations([])
        return
      }

      if (!options?.silent) {
        setError(getApiErrorMessage(err, 'Could not load conversations. Please try again.'))
        setConversations([])
      }
    } finally {
      if (!options?.silent) {
        setListLoading(false)
      }
    }
  }, [])

  const loadConversation = useCallback(async (conversationId: string, options?: { silent?: boolean }) => {
    if (!options?.silent) {
      setThreadLoading(true)
    }
    setError(null)

    try {
      const result = await InboxService.getConversation(conversationId)
      setActiveConversation(result.conversation)
      setParticipants(result.participants)
      setMessages(result.messages)
    } catch (err) {
      if (isSubscriptionRequiredError(err)) {
        setSubscriptionRequired(true)
        return
      }

      if (getApiErrorCode(err) === 'INTEGRATIONS_REQUIRED') {
        setIntegrationsRequired(true)
        return
      }

      if (!options?.silent) {
        setError(getApiErrorMessage(err, 'Could not load conversation. Please try again.'))
        setActiveConversation(null)
        setParticipants([])
        setMessages([])
      }
    } finally {
      if (!options?.silent) {
        setThreadLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    setSelectedConversationId(null)
    setActiveConversation(null)
    setParticipants([])
    setMessages([])
    setMobileShowThread(false)
    void loadConversations(platformFilter)
  }, [loadConversations, platformFilter])

  useEffect(() => {
    if (selectedConversationId === null) {
      return
    }

    void loadConversation(selectedConversationId)
  }, [loadConversation, selectedConversationId])

  useEffect(() => {
    if (integrationsRequired) {
      return
    }

    const intervalId = window.setInterval(() => {
      void loadConversations(platformFilter, { silent: true })
    }, LIST_REFRESH_MS)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [integrationsRequired, loadConversations, platformFilter])

  useEffect(() => {
    if (selectedConversationId === null || integrationsRequired) {
      return
    }

    const intervalId = window.setInterval(() => {
      void loadConversation(selectedConversationId, { silent: true })
    }, THREAD_REFRESH_MS)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [integrationsRequired, loadConversation, selectedConversationId])

  const handleSelectConversation = (conversation: ConversationListItem) => {
    setThreadLoading(true)
    setSelectedConversationId(conversation.id)
    setMobileShowThread(true)
  }

  const handleSendMessage = async (content: string) => {
    if (selectedConversationId === null) {
      return
    }

    setSending(true)
    setError(null)

    try {
      const result = await InboxService.sendMessage(selectedConversationId, { content })
      setMessages((current) => [...current, result.message])
      setConversations((current) =>
        current.map((item) =>
          item.id === selectedConversationId
            ? {
                ...item,
                lastMessage: result.message.content,
                lastMessageAt: result.message.createdAt,
              }
            : item,
        ),
      )
    } catch (err) {
      const details = getApiErrorDetails<SendMessageErrorDetails>(err)
      if (details?.message) {
        setMessages((current) => [...current, details.message!])
      }

      setError(getApiErrorMessage(err, 'Could not send message. Please try again.'))
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
        <p className="mb-3 shrink-0 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="flex shrink-0 border-b border-neutral-200">
          <div
            className={[
              LIST_COLUMN_CLASS,
              'flex w-full items-center border-neutral-200 px-3 py-2.5 lg:border-r',
              mobileShowThread ? 'hidden lg:flex' : 'flex',
            ].join(' ')}
          >
            <PlatformTabs value={platformFilter} onChange={setPlatformFilter} />
          </div>

          <div
            className={[
              'flex min-w-0 flex-1 items-center px-4 py-2.5',
              mobileShowThread ? 'flex' : 'hidden lg:flex',
            ].join(' ')}
          >
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
            />
          </div>
        </div>

        <div className="flex min-h-0 flex-1">
          <section
            className={[
              LIST_COLUMN_CLASS,
              'flex min-h-0 flex-col border-neutral-200 lg:border-r',
              mobileShowThread ? 'hidden lg:flex' : 'flex',
            ].join(' ')}
          >
            {listLoading ? (
              <div className="flex flex-1 items-center justify-center py-16">
                <Spinner />
              </div>
            ) : (
              <ConversationList
                conversations={conversations}
                selectedId={selectedConversationId}
                onSelect={handleSelectConversation}
              />
            )}
          </section>

          <section
            className={[
              'flex min-h-0 min-w-0 flex-1 flex-col',
              mobileShowThread ? 'flex' : 'hidden lg:flex',
            ].join(' ')}
          >
            <ConversationThread
              conversation={activeConversation}
              messages={messages}
              loading={threadLoading}
              platform={activePlatform}
            />
            <MessageComposer
              disabled={selectedConversationId === null || threadLoading}
              sending={sending}
              platform={activePlatform}
              onSend={handleSendMessage}
            />
          </section>
        </div>
      </div>
    </div>
  )
}
