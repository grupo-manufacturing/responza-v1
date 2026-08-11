import { useEffect, useRef, useState } from 'react'

import { KnowledgeService } from '@/features/agent/api/knowledge.service'
import { getApiErrorMessage } from '@/shared/utils/api-error'
import { Alert } from '@/shared/ui/primitives/Alert'
import { Spinner } from '@/shared/ui/primitives/Spinner'
import { AppButton, APP_INPUT_CLASS, AppCard } from '@/shared/ui/app-ui'

type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  isFallback?: boolean
  sources?: Array<{
    source_type: string
    source_ref: string | null
    similarity: number
  }>
}

const EXAMPLE_QUESTIONS = [
  'What does this business do?',
  'What products or services are offered?',
  'What is mentioned on their Instagram?',
  "What is the weather in Tokyo?",
]

type AgentChatPanelProps = {
  readonly businessName: string
  readonly disabled?: boolean
}

export function AgentChatPanel({ businessName, disabled = false }: AgentChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  async function submitQuestion(question: string) {
    const trimmed = question.trim()
    if (trimmed.length === 0 || isLoading || disabled) {
      return
    }

    setError(null)
    setInput('')

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
    }

    setMessages((current) => [...current, userMessage])
    setIsLoading(true)

    try {
      const response = await KnowledgeService.ask(trimmed)
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: response.answer,
          isFallback: response.is_fallback,
          sources: response.sources.map((source) => ({
            source_type: source.source_type,
            source_ref: source.source_ref,
            similarity: source.similarity,
          })),
        },
      ])
    } catch (askError) {
      setError(getApiErrorMessage(askError, 'Failed to get an answer.'))
    } finally {
      setIsLoading(false)
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void submitQuestion(input)
  }

  return (
    <AppCard className="flex min-h-[28rem] flex-col overflow-hidden !p-0">
      <div className="border-b border-border bg-surface-muted/60 px-5 py-4">
        <p className="text-sm font-medium text-ink">Chat with {businessName}</p>
        <p className="mt-1 text-xs text-ink-muted">Answers are grounded only in your business knowledge base.</p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto bg-white/40 px-5 py-4">
        {disabled && (
          <Alert variant="warning">Your agent is still building. Check back in a few minutes.</Alert>
        )}

        {!disabled && messages.length === 0 && (
          <div className="space-y-3 rounded-[var(--radius-card)] border border-dashed border-border bg-surface-muted/40 p-4">
            <p className="text-sm text-ink-muted">Try one of these:</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_QUESTIONS.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => void submitQuestion(question)}
                  className="rounded-[var(--radius-pill)] border border-border bg-white px-3 py-1.5 text-xs text-ink-muted transition hover:border-accent/40 hover:text-ink"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={[
                'max-w-[85%] rounded-2xl px-4 py-3 text-sm',
                message.role === 'user'
                  ? 'bg-ink text-on-dark'
                  : message.isFallback
                    ? 'border border-amber-200 bg-amber-50 text-amber-950'
                    : 'border border-border bg-white text-ink shadow-soft',
              ].join(' ')}
            >
              <p className="whitespace-pre-wrap leading-6">{message.content}</p>
              {message.role === 'assistant' &&
                message.sources !== undefined &&
                message.sources.length > 0 && (
                  <div className="mt-3 space-y-1 border-t border-border/60 pt-3 text-xs text-ink-muted">
                    {message.sources.map((source, index) => (
                      <p key={`${source.source_type}-${index}`}>
                        Source: {source.source_type}
                        {source.source_ref !== null ? ` (${source.source_ref})` : ''} · similarity{' '}
                        {source.similarity.toFixed(4)}
                      </p>
                    ))}
                  </div>
                )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-2xl border border-border bg-white px-4 py-3">
              <Spinner size="sm" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t border-border bg-white px-4 py-4">
        {error !== null && (
          <div className="mb-3">
            <Alert variant="error">{error}</Alert>
          </div>
        )}
        <div className="flex gap-3">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask a question about your business..."
            disabled={isLoading || disabled}
            className={APP_INPUT_CLASS}
          />
          <AppButton type="submit" disabled={isLoading || disabled || input.trim().length === 0}>
            Send
          </AppButton>
        </div>
      </form>
    </AppCard>
  )
}
