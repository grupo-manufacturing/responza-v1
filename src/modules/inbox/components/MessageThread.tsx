import { useEffect, useRef, useState } from 'react'

import InboxService, { type Conversation, type Message } from '@/shared/services/inbox.service'
import { getApiErrorMessage } from '@/shared/utils/api-error'

import { formatInboxTime, getConversationPlatformLabel, getConversationTitle } from '@/modules/inbox/inbox-display'

type MessageThreadProps = {
  conversation: Conversation | null
  messages: Message[]
  loadingMessages: boolean
  onBack?: () => void
  onMessageSent: (message: Message) => void
}

export function MessageThread({
  conversation,
  messages,
  loadingMessages,
  onBack,
  onMessageSent,
}: MessageThreadProps) {
  const [draft, setDraft] = useState('')
  const [sendError, setSendError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setDraft('')
    setSendError(null)
  }, [conversation?.id])

  useEffect(() => {
    const node = scrollRef.current
    if (node !== null) {
      node.scrollTop = node.scrollHeight
    }
  }, [messages, conversation?.id])

  if (conversation === null) {
    return (
      <div className="flex h-full min-h-[20rem] items-center justify-center bg-neutral-50 p-6 text-center">
        <div>
          <p className="text-sm font-medium text-neutral-900">Select a conversation</p>
          <p className="mt-1 text-sm text-neutral-500">Choose a thread from the list on the left.</p>
        </div>
      </div>
    )
  }

  const title = getConversationTitle(conversation)

  const handleSend = async (event: React.FormEvent) => {
    event.preventDefault()
    const body = draft.trim()
    if (body.length === 0 || sending) {
      return
    }

    setSendError(null)
    setSending(true)

    try {
      const { message } = await InboxService.sendMessage(conversation.id, { body })
      onMessageSent(message)
      setDraft('')
    } catch (err) {
      setSendError(getApiErrorMessage(err, 'Could not send message. Please try again.'))
    } finally {
      setSending(false)
    }
  }

  const chronologicalMessages = [...messages].reverse()

  return (
    <div className="flex h-full min-h-0 flex-col bg-neutral-50">
      <div className="flex shrink-0 items-center gap-3 border-b border-neutral-200 bg-white px-4 py-3">
        {onBack !== undefined && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 lg:hidden"
            aria-label="Back to conversations"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-sm font-semibold text-neutral-700">
          {title.charAt(0).toUpperCase()}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-neutral-900">{title}</p>
          <p className="truncate text-xs text-neutral-500">
            {getConversationPlatformLabel(conversation)}
          </p>
        </div>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {loadingMessages && (
          <p className="text-center text-sm text-neutral-500">Loading messages…</p>
        )}

        {!loadingMessages && chronologicalMessages.length === 0 && (
          <p className="text-center text-sm text-neutral-500">No messages yet. Say hello below.</p>
        )}

        <div className="flex flex-col gap-3">
          {chronologicalMessages.map((message) => {
            const outbound = message.direction === 'outbound'
            return (
              <div
                key={message.id}
                className={['flex', outbound ? 'justify-end' : 'justify-start'].join(' ')}
              >
                <div
                  className={[
                    'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm',
                    outbound
                      ? 'rounded-br-md bg-neutral-900 text-white'
                      : 'rounded-bl-md border border-neutral-200 bg-white text-neutral-900',
                  ].join(' ')}
                >
                  <p className="whitespace-pre-wrap break-words">{message.body ?? `[${message.contentType}]`}</p>
                  <div
                    className={[
                      'mt-1 flex items-center gap-2 text-[10px]',
                      outbound ? 'text-neutral-300' : 'text-neutral-400',
                    ].join(' ')}
                  >
                    <span>{formatInboxTime(message.createdAt)}</span>
                    {outbound && <span>{message.status}</span>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <form
        onSubmit={(event) => void handleSend(event)}
        className="shrink-0 border-t border-neutral-200 bg-white p-4"
      >
        {sendError !== null && (
          <p className="mb-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {sendError}
          </p>
        )}

        <div className="flex gap-2">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Type a message…"
            rows={2}
            disabled={sending}
            className="min-h-[2.75rem] flex-1 resize-none rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 disabled:bg-neutral-50"
          />
          <button
            type="submit"
            disabled={sending || draft.trim().length === 0}
            className="self-end rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sending ? '…' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  )
}
