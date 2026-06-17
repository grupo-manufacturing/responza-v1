import { useRef, useState } from 'react'

import { Spinner } from '@/components/ui/Spinner'
import { AiService } from '@/modules/ai/ai.service'
import { EmojiPicker } from '@/modules/inbox/components/EmojiPicker'
import type { IntegrationPlatform } from '@/modules/integrations/integrations.constants'
import { getApiErrorMessage } from '@/shared/utils/api-error'

type MessageComposerProps = {
  readonly disabled: boolean
  readonly sending: boolean
  readonly platform?: IntegrationPlatform | null
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

function RewriteIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
      />
    </svg>
  )
}

function composerPlaceholder(disabled: boolean): string {
  if (disabled) {
    return 'Select a conversation to reply'
  }

  return 'Type a message…'
}

function sendButtonClass(canSend: boolean, platform: IntegrationPlatform | null | undefined): string {
  if (!canSend) {
    return 'bg-neutral-200 text-neutral-400'
  }

  if (platform === 'whatsapp') {
    return 'bg-[#128C7E] text-white hover:bg-[#0f7a6d]'
  }

  if (platform === 'instagram') {
    return 'bg-gradient-to-r from-[#405DE6] to-[#E1306C] text-white hover:from-[#405DE6]/90 hover:to-[#E1306C]/90'
  }

  return 'bg-neutral-900 text-white hover:bg-neutral-800'
}

function insertAtCursor(textarea: HTMLTextAreaElement, value: string): string {
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const next = `${textarea.value.slice(0, start)}${value}${textarea.value.slice(end)}`
  const cursor = start + value.length

  requestAnimationFrame(() => {
    textarea.selectionStart = cursor
    textarea.selectionEnd = cursor
    textarea.focus()
  })

  return next
}

export function MessageComposer({ disabled, sending, platform = null, onSend }: MessageComposerProps) {
  const [content, setContent] = useState('')
  const [rewriting, setRewriting] = useState(false)
  const [rewriteError, setRewriteError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const canSend = !disabled && !sending && !rewriting && content.trim().length > 0
  const canRewrite = !disabled && !sending && !rewriting && content.trim().length > 0

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const trimmed = content.trim()
    if (trimmed.length === 0 || disabled || sending || rewriting) {
      return
    }

    await onSend(trimmed)
    setContent('')
    setRewriteError(null)
  }

  const handleRewrite = async () => {
    const trimmed = content.trim()
    if (trimmed.length === 0 || disabled || sending || rewriting) {
      return
    }

    setRewriting(true)
    setRewriteError(null)

    try {
      const { rewritten } = await AiService.rewriteDraft(trimmed)
      setContent(rewritten)
      requestAnimationFrame(() => {
        textareaRef.current?.focus()
      })
    } catch (err: unknown) {
      setRewriteError(getApiErrorMessage(err, 'Could not rewrite message. Please try again.'))
    } finally {
      setRewriting(false)
    }
  }

  const handleEmojiSelect = (emoji: string) => {
    const textarea = textareaRef.current
    if (textarea === null || disabled || sending || rewriting) {
      setContent((current) => `${current}${emoji}`)
      return
    }

    setContent(insertAtCursor(textarea, emoji))
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
          'flex items-center gap-1 rounded-xl border border-neutral-300 bg-white px-2 py-1.5 transition-colors focus-within:border-neutral-900',
          disabled || sending || rewriting ? 'bg-neutral-50' : '',
          platform === 'whatsapp' ? 'focus-within:border-[#128C7E]' : '',
          platform === 'instagram' ? 'focus-within:border-[#E1306C]' : '',
        ].join(' ')}
      >
        <EmojiPicker disabled={disabled || sending || rewriting} onSelect={handleEmojiSelect} />
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(event) => {
            setContent(event.target.value)
            setRewriteError(null)
          }}
          placeholder={composerPlaceholder(disabled)}
          disabled={disabled || sending || rewriting}
          rows={1}
          className="min-h-[36px] max-h-28 flex-1 resize-none border-0 bg-transparent py-1.5 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 disabled:cursor-not-allowed"
        />
        <button
          type="button"
          onClick={() => {
            void handleRewrite()
          }}
          disabled={!canRewrite}
          aria-label={rewriting ? 'Rewriting message' : 'Rewrite message'}
          title="Rewrite message"
          className={[
            'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-neutral-500 transition-colors',
            canRewrite
              ? 'hover:bg-neutral-100 hover:text-neutral-900'
              : 'cursor-not-allowed opacity-40',
          ].join(' ')}
        >
          {rewriting ? <Spinner size="sm" variant="muted" /> : <RewriteIcon />}
        </button>
        <button
          type="submit"
          disabled={!canSend}
          aria-label={sending ? 'Sending message' : 'Send message'}
          className={[
            'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors',
            sendButtonClass(canSend, platform),
            'disabled:cursor-not-allowed',
          ].join(' ')}
        >
          {sending ? <Spinner size="sm" variant="muted" /> : <SendIcon />}
        </button>
      </div>
      {rewriteError !== null && (
        <p className="mt-2 text-xs text-red-600" role="alert">
          {rewriteError}
        </p>
      )}
    </form>
  )
}
