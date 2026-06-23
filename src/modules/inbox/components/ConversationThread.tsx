import { useEffect, useRef, useState } from 'react'

import { Spinner } from '@/components/ui/Spinner'
import { AiService } from '@/modules/ai/ai.service'
import { MessageMedia } from '@/modules/inbox/components/MessageMedia'
import { MessageStatusIndicator } from '@/modules/inbox/components/MessageStatusIndicator'
import { ReactionPicker } from '@/modules/inbox/components/ReactionPicker'
import { TranslateMessageButton } from '@/modules/inbox/components/TranslateMessageButton'
import { formatInboxTimestamp } from '@/modules/inbox/inbox.constants'
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

const CHAT_BACKGROUND_CLASS = "bg-[url('/chat-bg.jpg')] bg-repeat bg-auto"

type ConversationThreadProps = {
  readonly conversation: Conversation | null
  readonly messages: Message[]
  readonly loading: boolean
  readonly platform?: IntegrationPlatform | null
  readonly reactDisabled?: boolean
  readonly onReact?: (messageId: string, emoji: string | null) => Promise<void>
}

type MessageTranslationState =
  | { status: 'loading' }
  | { status: 'success'; translated: string; showOriginal: boolean }
  | { status: 'error'; message: string }

const MESSAGE_ACTIONS_HEIGHT_CLASS = 'pt-9'

function outboundBubbleClass(platform: IntegrationPlatform | null | undefined): string {
  if (platform === 'whatsapp') {
    return 'bg-[#DCF8C6] text-neutral-900'
  }

  return 'bg-neutral-900 text-white'
}

function outboundMetaClass(platform: IntegrationPlatform | null | undefined): string {
  if (platform === 'whatsapp') {
    return 'text-neutral-500'
  }

  return 'text-neutral-300'
}

function MessageReactions({ message }: { readonly message: Message }) {
  if (message.customerReaction === null && message.agentReaction === null) {
    return null
  }

  return (
    <div className="absolute -top-2 right-1 z-10 inline-flex items-center gap-0.5 rounded-full border border-neutral-200 bg-white px-1.5 py-0.5 text-sm shadow-sm">
      {message.customerReaction !== null && <span>{message.customerReaction}</span>}
      {message.agentReaction !== null && <span>{message.agentReaction}</span>}
    </div>
  )
}

export function ConversationThread({
  conversation,
  messages,
  loading,
  platform = null,
  reactDisabled = false,
  onReact,
}: ConversationThreadProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const previousMessageCountRef = useRef(messages.length)
  const [translations, setTranslations] = useState<Record<string, MessageTranslationState>>({})

  useEffect(() => {
    setTranslations({})
  }, [conversation?.id])

  useEffect(() => {
    const container = scrollRef.current
    if (container === null) {
      previousMessageCountRef.current = messages.length
      return
    }

    const grew = messages.length > previousMessageCountRef.current
    previousMessageCountRef.current = messages.length

    if (!grew) {
      return
    }

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight

    if (distanceFromBottom < 120) {
      container.scrollTop = container.scrollHeight
    }
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
    <div className={['flex min-h-0 flex-1 flex-col', CHAT_BACKGROUND_CLASS].join(' ')}>
      {loading && (
        <div className="flex flex-1 items-center justify-center py-16">
          <Spinner />
        </div>
      )}

      {!loading && conversation === null && (
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
          <p className="text-sm font-bold text-black-500">
            Messages will appear here once you open a conversation.
          </p>
        </div>
      )}

      {!loading && conversation !== null && (
        <div
          ref={scrollRef}
          className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-4 pt-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {messages.length === 0 && (
            <p className="py-8 text-center text-sm text-neutral-500">
              No messages in this conversation yet.
            </p>
          )}

          <div className="space-y-4">
            {messages.map((message) => {
              const isOutbound = message.direction === 'outbound'
              const canReact =
                !reactDisabled &&
                !isOutbound &&
                message.platformMessageId !== null &&
                onReact !== undefined
              const canTranslate =
                isTranslatableMessageContent(message.content, message.contentType)
              const showActions = canReact || canTranslate
              const hasReactions =
                message.customerReaction !== null || message.agentReaction !== null
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
                        showActions ? MESSAGE_ACTIONS_HEIGHT_CLASS : '',
                        hasReactions ? 'mt-2' : '',
                      ].join(' ')}
                    >
                      {showActions && (
                        <div className="absolute top-0 right-0 z-20 flex items-center gap-0.5 rounded-full border border-neutral-200 bg-white p-0.5 shadow-sm opacity-0 transition-opacity group-hover:opacity-100">
                          {canReact && (
                            <ReactionPicker
                              disabled={reactDisabled}
                              onSelect={(emoji) => {
                                const nextEmoji = emoji === message.agentReaction ? null : emoji
                                void onReact(message.id, nextEmoji)
                              }}
                            />
                          )}
                          {canTranslate && (
                            <TranslateMessageButton
                              disabled={reactDisabled}
                              loading={isTranslating}
                              onTranslate={() => {
                                void handleTranslate(message.id)
                              }}
                            />
                          )}
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
                            : 'border border-neutral-200 bg-white text-neutral-900',
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
                            isOutbound ? outboundMetaClass(platform) : 'text-neutral-400',
                          ].join(' ')}
                        >
                          {isOutbound && (
                            <MessageStatusIndicator status={message.status} platform={platform} />
                          )}
                          <span>{formatInboxTimestamp(message.createdAt)}</span>
                        </div>
                      </div>

                      <MessageReactions message={message} />
                    </div>

                    {isShowingTranslation && (
                      <button
                        type="button"
                        onClick={() => handleShowOriginal(message.id)}
                        className="mt-1 self-start text-xs font-medium text-neutral-500 transition-colors hover:text-neutral-800"
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
