import { useState } from 'react'

import { ASSISTANT_QUESTION_MAX_LENGTH } from '@/features/assistant/constants'
import { APP_TEXTAREA_CLASS } from '@/shared/ui/app-ui'

type AssistantChatInputProps = {
  readonly disabled: boolean
  readonly onSubmit: (question: string) => void
}

function SendIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
      />
    </svg>
  )
}

export function AssistantChatInput({ disabled, onSubmit }: AssistantChatInputProps) {
  const [question, setQuestion] = useState('')

  const trimmed = question.trim()
  const canSubmit = trimmed.length > 0 && !disabled

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!canSubmit) {
      return
    }

    onSubmit(trimmed)
    setQuestion('')
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      if (canSubmit) {
        onSubmit(trimmed)
        setQuestion('')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-border bg-white/80 px-4 py-4 backdrop-blur-sm">
      <div className="flex w-full items-end">
        <div className="relative flex-1">
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            maxLength={ASSISTANT_QUESTION_MAX_LENGTH}
            rows={1}
            placeholder="Ask about your conversations and integrations…"
            className={`${APP_TEXTAREA_CLASS} min-h-[44px] max-h-32 py-3 pr-12`}
          />
          <button
            type="submit"
            disabled={!canSubmit}
            aria-label="Send message"
            className={[
              'absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center',
              'rounded-xl bg-ink text-on-dark shadow-soft',
              'hover:bg-ink/90',
              'disabled:cursor-not-allowed disabled:opacity-50',
            ].join(' ')}
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </form>
  )
}
