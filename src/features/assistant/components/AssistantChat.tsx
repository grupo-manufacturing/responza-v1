import { useEffect, useRef, useState } from 'react'

import {
  AssistantMessageList,
  type AssistantChatMessage,
} from '@/features/assistant/components/AssistantMessageList'
import { AssistantChatInput } from '@/features/assistant/components/AssistantChatInput'
import { AssistantTypingIndicator } from '@/features/assistant/components/AssistantTypingIndicator'
import { SuggestedPrompts } from '@/features/assistant/components/SuggestedPrompts'
import {
  getAssistantAskErrorMessage,
  useAssistantAsk,
} from '@/features/assistant/hooks/useAssistantAsk'
import { ASSISTANT_CHAT_PANEL_HEIGHT_CLASS } from '@/features/assistant/constants'
import { useToast } from '@/shared/ui/toast'

function createMessageId(): string {
  return crypto.randomUUID()
}

function AssistantSparkIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z"
      />
    </svg>
  )
}

type AssistantChatProps = {
  readonly className?: string
}

export function AssistantChat({ className = '' }: AssistantChatProps) {
  const [messages, setMessages] = useState<AssistantChatMessage[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const askMutation = useAssistantAsk()
  const toast = useToast()

  const isLoading = askMutation.isPending

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isLoading])

  async function handleAsk(question: string) {
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
      toast.error(getAssistantAskErrorMessage(nextError))
    }
  }

  const showEmptyState = messages.length === 0 && !isLoading

  return (
    <div
      className={[
        'relative flex flex-col min-h-0 overflow-hidden rounded-[var(--radius-card-lg)]',
        'border border-border/80 bg-white shadow-card animate-step-in',
        ASSISTANT_CHAT_PANEL_HEIGHT_CLASS,
        className,
      ].join(' ')}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgb(143_181_176_/_0.16),transparent_55%),radial-gradient(ellipse_50%_40%_at_100%_100%,rgb(196_164_132_/_0.08),transparent_50%)]"
      />

      <div
        ref={scrollRef}
        className={[
          'relative flex-1 min-h-0 px-3 py-5',
          showEmptyState
            ? 'overflow-hidden'
            : 'overflow-y-auto overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
        ].join(' ')}
      >
        <div
          className={[
            'flex w-full flex-col',
            showEmptyState ? 'h-full' : 'min-h-0',
          ].join(' ')}
        >
          {showEmptyState && (
            <div className="flex h-full flex-col items-center justify-center gap-7 py-4 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/15 via-accent-soft/20 to-accent-warm/15 text-accent shadow-soft ring-1 ring-accent/15">
                  <AssistantSparkIcon />
                </div>
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-ink">
                    Ask about your integrations
                  </h2>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-muted">
                    Get counts, find conversations that need attention, and check what is connected.
                  </p>
                </div>
              </div>
              <SuggestedPrompts disabled={isLoading} onSelect={handleAsk} />
            </div>
          )}

          <AssistantMessageList messages={messages} />

          {isLoading && (
            <div className="mt-4">
              <AssistantTypingIndicator />
            </div>
          )}
        </div>
      </div>

      <AssistantChatInput disabled={isLoading} onSubmit={handleAsk} />
    </div>
  )
}
