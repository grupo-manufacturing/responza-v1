import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { Spinner } from '@/components/ui/Spinner'
import { AiService } from '@/modules/ai/ai.service'
import { MessageMedia } from '@/modules/inbox/components/MessageMedia'
import { MessageStatusIndicator } from '@/modules/inbox/components/MessageStatusIndicator'
import { TranslateMessageButton } from '@/modules/inbox/components/TranslateMessageButton'
import { formatInboxTimestamp } from '@/modules/inbox/inbox.constants'
import {
  inboundBubbleClass,
  inboxThreadBackgroundClass,
  outboundBubbleClass,
  outboundMetaClass,
} from '@/modules/inbox/inbox-ui'
import {
  formatMessageListPreview,
  inferMediaContentTypeFromPlaceholder,
  isMediaContentType,
  isMediaPlaceholderContent,
  mediaUnavailableLabel,
} from '@/modules/inbox/inbox.preview'
import { isTranslatableMessageContent } from '@/modules/inbox/translation.utils'
import type { IntegrationPlatform } from '@/modules/integrations/integrations.constants'
import type { Conversation, Message } from '@/modules/inbox/inbox.service'
import { getApiErrorMessage } from '@/shared/utils/api-error'

type ConversationThreadProps = {
  readonly conversation: Conversation | null
  readonly messages: Message[]
  readonly loading: boolean
  readonly hasMoreOlder: boolean
  readonly loadingOlder: boolean
  readonly onLoadOlder: () => void
  readonly platform?: IntegrationPlatform | null
  readonly actionsDisabled?: boolean
  readonly aiEnabled?: boolean
}

type MessageTranslationState =
  | { status: 'loading' }
  | { status: 'success'; translated: string; showOriginal: boolean }
  | { status: 'error'; message: string }

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
  aiEnabled = true,
}: ConversationThreadProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const previousMessageCountRef = useRef(messages.length)
  const firstMessageIdRef = useRef<string | null>(messages[0]?.id ?? null)
  const pendingOlderScrollRef = useRef(false)
  const scrollHeightBeforeOlderLoadRef = useRef(0)
  const scrollTopBeforeOlderLoadRef = useRef(0)
  const [translations, setTranslations] = useState<Record<string, MessageTranslationState>>({})

  useEffect(() => {
    setTranslations({})
    firstMessageIdRef.current = null
    previousMessageCountRef.current = 0
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
      firstMessageIdRef.current = messages[0]?.id ?? null
      return
    }

    const firstMessageId = messages[0]?.id ?? null
    const prependedOlder =
      pendingOlderScrollRef.current &&
      firstMessageIdRef.current !== null &&
      firstMessageId !== firstMessageIdRef.current

    if (prependedOlder) {
      const heightDelta =
        container.scrollHeight - scrollHeightBeforeOlderLoadRef.current
      container.scrollTop = scrollTopBeforeOlderLoadRef.current + heightDelta
      pendingOlderScrollRef.current = false
    } else {
      const grew = messages.length > previousMessageCountRef.current
      if (grew) {
        const distanceFromBottom =
          container.scrollHeight - container.scrollTop - container.clientHeight

        if (distanceFromBottom < 120) {
          container.scrollTop = container.scrollHeight
        }
      }
    }

    previousMessageCountRef.current = messages.length
    firstMessageIdRef.current = firstMessageId
  }, [messages])

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
      setTranslations((current) => ({
        ...current,
        [messageId]: {
          status: 'error',
          message: getApiErrorMessage(err, 'Could not translate this message.'),
        },
      }))
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
                aiEnabled &&
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
                  className={['flex', isOutbound ? 'justify-end' : 'justify-start'].join(' ')}
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

                        {translation?.status === 'error' && (
                          <p className="mt-2 text-xs text-red-600">{translation.message}</p>
                        )}

                        <div
                          className={[
                            'mt-1 flex items-center justify-end gap-1.5 text-xs',
                            isOutbound ? outboundMetaClass(platform) : 'text-ink-faint',
                          ].join(' ')}
                        >
                          {isOutbound && (
                            <MessageStatusIndicator status={message.status} platform={platform} />
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
