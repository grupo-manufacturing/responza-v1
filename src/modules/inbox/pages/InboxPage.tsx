import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { ConversationList } from '@/modules/inbox/components/ConversationList'
import { MessageThread } from '@/modules/inbox/components/MessageThread'
import { SpinnerSection } from '@/components/ui/Spinner'
import type { InboxPlatformFilter } from '@/shared/constants/inbox'
import InboxService, { type Conversation, type Message } from '@/shared/services/inbox.service'
import { getApiErrorMessage, isIntegrationsRequiredError } from '@/shared/utils/api-error'

function upsertConversation(conversations: Conversation[], updated: Conversation): Conversation[] {
  const index = conversations.findIndex((entry) => entry.id === updated.id)
  if (index === -1) {
    return [updated, ...conversations]
  }

  return conversations.map((entry) => (entry.id === updated.id ? { ...entry, ...updated } : entry))
}

export function InboxPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [platformFilter, setPlatformFilter] = useState<InboxPlatformFilter>('all')
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [integrationsRequired, setIntegrationsRequired] = useState(false)
  const [mobileShowThread, setMobileShowThread] = useState(false)

  const selectedConversation =
    conversations.find((conversation) => conversation.id === selectedId) ?? null

  const loadConversations = useCallback(
    async (options: { append?: boolean; cursor?: string } = {}) => {
      setError(null)
      setIntegrationsRequired(false)

      try {
        const result = await InboxService.listInbox({
          limit: 20,
          cursor: options.cursor,
          platform: platformFilter === 'all' ? undefined : platformFilter,
        })

        setConversations((current) =>
          options.append ? [...current, ...result.conversations] : result.conversations,
        )
        setNextCursor(result.page.nextCursor)
      } catch (err) {
        if (isIntegrationsRequiredError(err)) {
          setIntegrationsRequired(true)
          return
        }

        setError(getApiErrorMessage(err, 'Could not load inbox. Please try again.'))
      }
    },
    [platformFilter],
  )

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setSelectedId(null)
    setMobileShowThread(false)

    void loadConversations().finally(() => {
      if (!cancelled) {
        setLoading(false)
      }
    })

    return () => {
      cancelled = true
    }
  }, [loadConversations])

  useEffect(() => {
    if (selectedId === null) {
      setMessages([])
      return
    }

    let cancelled = false
    setLoadingMessages(true)

    void InboxService.listMessages(selectedId, { limit: 50 })
      .then((result) => {
        if (!cancelled) {
          setMessages(result.messages)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getApiErrorMessage(err, 'Could not load messages.'))
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingMessages(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [selectedId])

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedId(conversation.id)
    setMobileShowThread(true)

    void InboxService.getConversation(conversation.id)
      .then(({ conversation: full }) => {
        setConversations((current) => upsertConversation(current, full))
      })
      .catch(() => {
        /* list entry is enough */
      })
  }

  const handleMessageSent = (message: Message) => {
    setMessages((current) => [message, ...current])
    void loadConversations()
  }

  const handleLoadMore = async () => {
    if (nextCursor === null || loadingMore) {
      return
    }

    setLoadingMore(true)
    try {
      await loadConversations({ append: true, cursor: nextCursor })
    } finally {
      setLoadingMore(false)
    }
  }

  if (loading) {
    return <SpinnerSection label="Loading inbox..." minHeightClassName="min-h-[50vh]" />
  }

  if (integrationsRequired) {
    return (
      <div className="mx-auto max-w-lg rounded-xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-neutral-900">Connect a platform first</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Inbox is available after you connect at least one integration (WhatsApp, Instagram, or
          IndiaMART).
        </p>
        <Link
          to="/integrations"
          className="mt-6 inline-flex rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
        >
          Go to Integrations
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-7rem)] max-w-6xl flex-col">
      <div className="mb-4 shrink-0">
        <h1 className="text-2xl font-semibold text-neutral-900">Inbox</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Conversations from your connected channels in one place.
        </p>
      </div>

      {error !== null && (
        <p className="mb-4 shrink-0 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-neutral-200 shadow-sm">
        <div className="grid h-full grid-cols-1 lg:grid-cols-[320px_1fr]">
          <div className={mobileShowThread ? 'hidden lg:block' : 'block h-full min-h-0'}>
            <ConversationList
              conversations={conversations}
              selectedId={selectedId}
              loading={loading}
              loadingMore={loadingMore}
              hasMore={nextCursor !== null}
              platformFilter={platformFilter}
              onPlatformFilterChange={setPlatformFilter}
              onSelect={handleSelectConversation}
              onLoadMore={() => void handleLoadMore()}
            />
          </div>

          <div className={mobileShowThread ? 'block h-full min-h-0' : 'hidden lg:block'}>
            <MessageThread
              conversation={selectedConversation}
              messages={messages}
              loadingMessages={loadingMessages}
              onBack={() => setMobileShowThread(false)}
              onMessageSent={handleMessageSent}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
