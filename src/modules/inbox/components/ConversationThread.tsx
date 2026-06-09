import { Spinner } from '@/components/ui/Spinner'
import { formatInboxTimestamp } from '@/shared/constants/inbox'
import type { Conversation, Message } from '@/shared/services/inbox.service'

const CHAT_BACKGROUND_CLASS = "bg-[url('/chat-bg.jpg')] bg-repeat bg-auto"

type ConversationThreadProps = {
  readonly conversation: Conversation | null
  readonly messages: Message[]
  readonly loading: boolean
}

export function ConversationThread({ conversation, messages, loading }: ConversationThreadProps) {
  return (
    <div className={['flex min-h-0 flex-1 flex-col', CHAT_BACKGROUND_CLASS].join(' ')}>
      {loading && (
        <div className="flex flex-1 items-center justify-center py-16">
          <Spinner />
        </div>
      )}

      {!loading && conversation === null && (
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
          <p className="text-sm text-black-500 font-bold">
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
                        ? 'bg-neutral-900 text-white'
                        : 'border border-neutral-200 bg-white text-neutral-900',
                    ].join(' ')}
                  >
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
                    <p
                      className={[
                        'mt-1 text-xs',
                        isOutbound ? 'text-neutral-300' : 'text-neutral-400',
                      ].join(' ')}
                    >
                      {formatInboxTimestamp(message.createdAt)}
                    </p>
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
