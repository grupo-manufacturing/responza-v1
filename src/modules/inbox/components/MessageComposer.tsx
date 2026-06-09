import { useState } from 'react'

import { Spinner } from '@/components/ui/Spinner'

type MessageComposerProps = {
  readonly disabled: boolean
  readonly sending: boolean
  readonly onSend: (content: string) => Promise<void>
}

function SendIcon() {
  return (
    <svg
      className="h-4 w-4 rotate-90"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
      />
    </svg>
  )
}

export function MessageComposer({ disabled, sending, onSend }: MessageComposerProps) {
  const [content, setContent] = useState('')
  const canSend = !disabled && !sending && content.trim().length > 0

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const trimmed = content.trim()
    if (trimmed.length === 0 || disabled || sending) {
      return
    }

    await onSend(trimmed)
    setContent('')
  }

  return (
    <form
      onSubmit={(event) => {
        void handleSubmit(event)
      }}
      className="border-t border-neutral-200 bg-white px-4 py-3"
    >
      <div
        className={[
          'flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 py-1.5 transition-colors focus-within:border-neutral-900',
          disabled || sending ? 'bg-neutral-50' : '',
        ].join(' ')}
      >
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder={disabled ? 'Select a conversation to reply' : 'Type a message...'}
          disabled={disabled || sending}
          rows={1}
          className="min-h-[36px] max-h-28 flex-1 resize-none border-0 bg-transparent py-1.5 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={!canSend}
          aria-label={sending ? 'Sending message' : 'Send message'}
          className={[
            'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors',
            canSend
              ? 'bg-neutral-900 text-white hover:bg-neutral-800'
              : 'bg-neutral-200 text-neutral-400',
            'disabled:cursor-not-allowed',
          ].join(' ')}
        >
          {sending ? <Spinner size="sm" variant="muted" /> : <SendIcon />}
        </button>
      </div>
    </form>
  )
}
