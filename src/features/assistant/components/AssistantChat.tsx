import { useEffect, useRef, useState } from 'react'

import {
  AssistantMessageList,
  type AssistantChatMessage,
} from '@/features/assistant/components/AssistantMessageList'
import { AssistantChatInput } from '@/features/assistant/components/AssistantChatInput'
import { SuggestedPrompts } from '@/features/assistant/components/SuggestedPrompts'
import {
  getAssistantAskErrorMessage,
  useAssistantAsk,
} from '@/features/assistant/hooks/useAssistantAsk'
import { Alert } from '@/shared/ui/primitives/Alert'
import { SpinnerSection } from '@/shared/ui/primitives/Spinner'
import { APP_PANEL_HEIGHT_CLASS } from '@/layouts/app-layout.constants'

function createMessageId(): string {
  return crypto.randomUUID()
}

type AssistantChatProps = {
  readonly className?: string
}

export function AssistantChat({ className = '' }: AssistantChatProps) {
  const [messages, setMessages] = useState<AssistantChatMessage[]>([])
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const askMutation = useAssistantAsk()

  const isLoading = askMutation.isPending

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isLoading])

  async function handleAsk(question: string) {
    setError(null)
    setMessages((current) => [
      ...current,
      { id: createMessageId(), role: 'user', content: question },
    ])

    try {
      const result = await askMutation.mutateAsync(question)
      setMessages((current) => [
        ...current,
        { id: createMessageId(), role: 'assistant', content: result.answer },
      ])
    } catch (nextError) {
      setError(getAssistantAskErrorMessage(nextError))
    }
  }

  const showEmptyState = messages.length === 0 && !isLoading

  return (
    <div
      className={[
        'flex flex-col overflow-hidden rounded-[var(--radius-card-lg)] border border-border bg-surface/40 shadow-card',
        APP_PANEL_HEIGHT_CLASS,
        className,
      ].join(' ')}
    >
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto flex min-h-full max-w-3xl flex-col">
          {showEmptyState && (
            <div className="my-auto space-y-6 py-8 text-center">
              <div>
                <h2 className="text-lg font-semibold text-ink">Ask about your integrations</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  Get counts, find conversations that need attention, and check what is connected.
                </p>
              </div>
              <SuggestedPrompts disabled={isLoading} onSelect={handleAsk} />
            </div>
          )}

          <AssistantMessageList messages={messages} />

          {isLoading && (
            <div className="mt-4">
              <SpinnerSection minHeightClassName="min-h-[4rem]" />
            </div>
          )}

          {error !== null && (
            <div className="mt-4">
              <Alert variant="error">{error}</Alert>
            </div>
          )}
        </div>
      </div>

      <AssistantChatInput disabled={isLoading} onSubmit={handleAsk} />
    </div>
  )
}
