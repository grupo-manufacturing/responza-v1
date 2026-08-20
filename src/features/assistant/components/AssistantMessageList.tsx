import { parseAssistantMessageContent } from '@/features/assistant/lib/parseAssistantLinks'

export type AssistantChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

type AssistantMessageListProps = {
  readonly messages: AssistantChatMessage[]
}

function UserBubble({ content }: { readonly content: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] rounded-2xl rounded-br-md bg-ink px-4 py-2.5 text-sm leading-relaxed text-on-dark shadow-soft">
        {content}
      </div>
    </div>
  )
}

function AssistantBubble({ content }: { readonly content: string }) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-border bg-white/95 px-4 py-2.5 text-sm leading-relaxed text-ink shadow-card">
        <p className="whitespace-pre-wrap">{parseAssistantMessageContent(content)}</p>
      </div>
    </div>
  )
}

export function AssistantMessageList({ messages }: AssistantMessageListProps) {
  if (messages.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {messages.map((message) =>
        message.role === 'user' ? (
          <UserBubble key={message.id} content={message.content} />
        ) : (
          <AssistantBubble key={message.id} content={message.content} />
        ),
      )}
    </div>
  )
}
