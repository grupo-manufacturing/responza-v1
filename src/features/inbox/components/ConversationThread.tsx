import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { Spinner } from '@/shared/ui/primitives/Spinner'
import { AiService } from '@/features/ai/api/ai.service'
import { MessageMedia } from '@/features/inbox/components/MessageMedia'
import { MessageStatusIndicator } from '@/features/inbox/components/MessageStatusIndicator'
import { TranslateMessageButton } from '@/features/inbox/components/TranslateMessageButton'
import { formatInboxTimestamp } from '@/features/inbox/constants'
import {
  inboundBubbleClass,
  inboxThreadBackgroundClass,
  outboundBubbleClass,
  outboundMetaClass,
} from '@/features/inbox/lib/inbox-ui'
import {
  formatMessageListPreview,
  inferMediaContentTypeFromPlaceholder,
  isMediaContentType,
  isMediaPlaceholderContent,
  mediaUnavailableLabel,
} from '@/features/inbox/lib/inbox.preview'
import { isTranslatableMessageContent } from '@/features/inbox/lib/translation'
import type { IntegrationPlatform } from '@/features/integrations/constants'
import type { Conversation, Message } from '@/features/inbox/api/inbox.service'
import { getApiErrorMessage } from '@/shared/utils/api-error'
import { useToast } from '@/shared/ui/toast'

type ConversationThreadProps = {
  readonly conversation: Conversation | null
  readonly messages: Message[]
  readonly loading: boolean
  readonly hasMoreOlder: boolean
  readonly loadingOlder: boolean
  readonly onLoadOlder: () => void
  readonly platform?: IntegrationPlatform | null
  readonly actionsDisabled?: boolean
}

type MessageTranslationState =
  | { status: 'loading' }
  | { status: 'success'; translated: string; showOriginal: boolean }

const MESSAGE_ACTIONS_HEIGHT_CLASS = 'pt-9'

export function ConversationThread({
  conversation,
  messages,
  loading,
  hasMoreOlder,
  loadingOlder,
  onLoadOlder,
  platform = null,
  actionsDisabled = false,
}: ConversationThreadProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const previousMessageCountRef = useRef(messages.length)
  const previousMessageIdsRef = useRef<string[]>(messages.map((message) => message.id))
  const firstMessageIdRef = useRef<string | null>(messages[0]?.id ?? null)
  const pendingOlderScrollRef = useRef(false)
  const scrollHeightBeforeOlderLoadRef = useRef(0)
  const scrollTopBeforeOlderLoadRef = useRef(0)
  const seededConversationIdRef = useRef<string | null>(null)
  const [enteringMessageIds, setEnteringMessageIds] = useState<Set<string>>(() => new Set())
  const [translations, setTranslations] = useState<Record<string, MessageTranslationState>>({})
  const toast = useToast()

  useEffect(() => {
    setTranslations({})
    firstMessageIdRef.current = null
    previousMessageCountRef.current = 0
    previousMessageIdsRef.current = []
    seededConversationIdRef.current = null
    setEnteringMessageIds(new Set())
  }, [conversation?.id])

  useEffect(() => {
    const container = scrollRef.current
    if (container === null || conversation === null || loading) {
      return
    }

    container.scrollTop = container.scrollHeight
  }, [conversation?.id, loading])

  useEffect(() => {
    if (loadingOlder) {
      const container = scrollRef.current
      if (container !== null) {
        scrollHeightBeforeOlderLoadRef.current = container.scrollHeight
        scrollTopBeforeOlderLoadRef.current = container.scrollTop
        pendingOlderScrollRef.current = true
      }
      return
    }

    if (!hasMoreOlder) {
      return
    }

    const container = scrollRef.current
    if (container === null) {
      return
    }

    const handleScroll = () => {
      if (loadingOlder || container.scrollTop > 80) {
        return
      }

      onLoadOlder()
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [conversation?.id, hasMoreOlder, loadingOlder, onLoadOlder])

  useLayoutEffect(() => {
    const container = scrollRef.current
    if (container === null) {
      previousMessageCountRef.current = messages.length
      previousMessageIdsRef.current = messages.map((message) => message.id)
      firstMessageIdRef.current = messages[0]?.id ?? null
      return
    }

    const firstMessageId = messages[0]?.id ?? null
    const currentIds = messages.map((message) => message.id)
    const prependedOlder =
      pendingOlderScrollRef.current &&
      firstMessageIdRef.current !== null &&
      firstMessageId !== firstMessageIdRef.current

    if (prependedOlder) {
      const heightDelta =
        container.scrollHeight - scrollHeightBeforeOlderLoadRef.current
      container.scrollTop = scrollTopBeforeOlderLoadRef.current + heightDelta
      pendingOlderScrollRef.current = false
      previousMessageIdsRef.current = currentIds
    } else {
      const previousIds = previousMessageIdsRef.current
      const previousIdSet = new Set(previousIds)
      const addedIds = currentIds.filter((id) => !previousIdSet.has(id))
      const removedOptimistic =
        previousIds.some((id) => id.startsWith('optimistic-')) &&
        !currentIds.some((id) => id.startsWith('optimistic-'))

      const shouldAnimate =
        seededConversationIdRef.current === conversation?.id &&
        addedIds.length > 0 &&
        !removedOptimistic

      const grew = messages.length > previousMessageCountRef.current || addedIds.length > 0
      if (grew) {
        const distanceFromBottom =
          container.scrollHeight - container.scrollTop - container.clientHeight
        const atEnd = distanceFromBottom < 120

        if (atEnd) {
          if (shouldAnimate) {
            setEnteringMessageIds(new Set(addedIds))
          }
          container.scrollTo({ top: container.scrollHeight, behavior: shouldAnimate ? 'smooth' : 'auto' })
        }
      }

      previousMessageIdsRef.current = currentIds
    }

    if (conversation?.id !== undefined && seededConversationIdRef.current !== conversation.id) {
      seededConversationIdRef.current = conversation.id
    }

    previousMessageCountRef.current = messages.length
    firstMessageIdRef.current = firstMessageId
  }, [conversation?.id, messages])

  const handleTranslate = async (messageId: string) => {
    setTranslations((current) => ({
      ...current,
      [messageId]: { status: 'loading' },
    }))

    try {
      const result = await AiService.translateMessage(messageId)
      setTranslations((current) => ({
        ...current,
        [messageId]: { status: 'success', translated: result.translated, showOriginal: false },
      }))
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Could not translate this message.'))
      setTranslations((current) => {
        const next = { ...current }
        delete next[messageId]
        return next
      })
    }
  }

  const handleShowOriginal = (messageId: string) => {
    setTranslations((current) => {
      const state = current[messageId]
      if (state?.status !== 'success') {
        return current
      }

      return {
        ...current,
        [messageId]: { ...state, showOriginal: true },
      }
    })
  }

  return (
    <div className={['flex min-h-0 flex-1 flex-col', inboxThreadBackgroundClass(platform)].join(' ')}>
      {loading && (
        <div className="flex flex-1 items-center justify-center py-16">
          <Spinner />
        </div>
      )}

      {!loading && conversation === null && (
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
          <p className="text-sm text-ink-muted">
            Messages will appear here once you open a conversation.
          </p>
        </div>
      )}

      {!loading && conversation !== null && (
        <div
          ref={scrollRef}
          className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-4 pt-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {loadingOlder && (
            <div className="mb-4 flex justify-center">
              <Spinner size="sm" variant="muted" />
            </div>
          )}

          {messages.length === 0 && (
            <p className="py-8 text-center text-sm text-ink-muted">
              No messages in this conversation yet.
            </p>
          )}

          <div className="space-y-4">
            {messages.map((message) => {
              const isOutbound = message.direction === 'outbound'
              const canTranslate =
                isTranslatableMessageContent(message.content, message.contentType)
              const translation = translations[message.id]
              const isTranslating = translation?.status === 'loading'
              const isShowingTranslation =
                translation?.status === 'success' && !translation.showOriginal
              const displayContent = isShowingTranslation
                ? translation.translated
                : message.content
              const mediaContentType = isMediaContentType(message.contentType)
                ? message.contentType
                : inferMediaContentTypeFromPlaceholder(message.content)
              const isMediaMessage = mediaContentType !== null
              const hasMedia = isMediaMessage && message.mediaUrl !== null
              const trimmedContent = displayContent.trim()
              const hasCaption =
                trimmedContent.length > 0 &&
                (!isMediaMessage || !isMediaPlaceholderContent(trimmedContent))
              const mediaLabel = isMediaMessage
                ? hasCaption
                  ? trimmedContent
                  : formatMessageListPreview('', mediaContentType)
                : trimmedContent

              return (
                <div
                  key={message.id}
                  className={[
                    'flex',
                    isOutbound ? 'justify-end' : 'justify-start',
                    enteringMessageIds.has(message.id) ? 'animate-message-in' : '',
                  ].join(' ')}
                >
                  <div
                    className={[
                      'flex max-w-[80%] flex-col',
                      isOutbound ? 'items-end' : 'items-start',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        'group relative w-full',
                        canTranslate ? MESSAGE_ACTIONS_HEIGHT_CLASS : '',
                      ].join(' ')}
                    >
                      {canTranslate && (
                        <div className="absolute top-0 right-0 z-20 flex items-center gap-0.5 rounded-full border border-border bg-white/95 p-0.5 shadow-soft opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                          <TranslateMessageButton
                            disabled={actionsDisabled}
                            loading={isTranslating}
                            onTranslate={() => {
                              void handleTranslate(message.id)
                            }}
                          />
                        </div>
                      )}

                      <div
                        className={[
                          'rounded-2xl text-sm',
                          hasMedia &&
                            !hasCaption &&
                            mediaContentType !== null &&
                            mediaContentType !== 'document'
                            ? 'p-1.5'
                            : 'px-4 py-2.5',
                          isOutbound
                            ? outboundBubbleClass(platform)
                            : inboundBubbleClass(),
                          message.status === 'failed' ? 'ring-2 ring-red-300' : '',
                        ].join(' ')}
                      >
                        {hasMedia && mediaContentType !== null && (
                          <MessageMedia
                            mediaUrl={message.mediaUrl!}
                            contentType={mediaContentType}
                            label={mediaLabel}
                            isOutbound={isOutbound}
                            platform={platform}
                          />
                        )}

                        {isMediaMessage && !hasMedia && mediaContentType !== null && (
                          <p className="text-sm italic opacity-80">
                            {mediaUnavailableLabel(mediaContentType)}
                          </p>
                        )}

                        {hasCaption && mediaContentType !== 'document' && (
                          <p
                            className={[
                              'whitespace-pre-wrap break-words',
                              hasMedia ? 'mt-2' : '',
                            ].join(' ')}
                          >
                            {displayContent}
                          </p>
                        )}

                        <div
                          className={[
                            'mt-1 flex items-center justify-end gap-1.5 text-xs',
                            isOutbound ? outboundMetaClass(platform) : 'text-ink-faint',
                          ].join(' ')}
                        >
                          {isOutbound && (
                            <MessageStatusIndicator status={message.status} />
                          )}
                          <span>{formatInboxTimestamp(message.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {isShowingTranslation && (
                      <button
                        type="button"
                        onClick={() => handleShowOriginal(message.id)}
                        className="mt-1 self-start text-xs font-medium text-accent transition-colors hover:underline"
                      >
                        Show original
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
