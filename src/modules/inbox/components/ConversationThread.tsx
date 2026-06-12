import { Spinner } from '@/components/ui/Spinner'
import { MessageStatusIndicator } from '@/modules/inbox/components/MessageStatusIndicator'
import { formatInboxTimestamp } from '@/modules/inbox/inbox.constants'
import type { IntegrationPlatform } from '@/modules/integrations/integrations.constants'
import type { Conversation, Message } from '@/modules/inbox/inbox.service'

const CHAT_BACKGROUND_CLASS = "bg-[url('/chat-bg.jpg')] bg-repeat bg-auto"

type ConversationThreadProps = {
  readonly conversation: Conversation | null
  readonly messages: Message[]
  readonly loading: boolean
  readonly platform?: IntegrationPlatform | null
}

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

export function ConversationThread({
  conversation,
  messages,
  loading,
  platform = null,
}: ConversationThreadProps) {
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
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {messages.length === 0 && (
            <p className="py-8 text-center text-sm text-neutral-500">
              No messages in this conversation yet.
            </p>
          )}

          <div className="space-y-3">
            {messages.map((message) => {
              const isOutbound = message.direction === 'outbound'

              return (
                <div
                  key={message.id}
                  className={['flex', isOutbound ? 'justify-end' : 'justify-start'].join(' ')}
                >
                  <div
                    className={[
                      'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm',
                      isOutbound
                        ? outboundBubbleClass(platform)
                        : 'border border-neutral-200 bg-white text-neutral-900',
                      message.status === 'failed' ? 'ring-2 ring-red-300' : '',
                    ].join(' ')}
                  >
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
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
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
