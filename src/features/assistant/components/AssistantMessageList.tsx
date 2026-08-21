import type { ReactNode } from 'react'

import { parseAssistantMessageContent } from '@/features/assistant/lib/parseAssistantLinks'

export type AssistantChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

type AssistantMessageListProps = {
  readonly messages: AssistantChatMessage[]
}

function AssistantAvatar() {
  return (
    <div
      className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-accent-soft/30 text-accent ring-1 ring-accent/15"
      aria-hidden
    >
      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.75}
          d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
        />
      </svg>
    </div>
  )
}

function UserBubble({ content }: { readonly content: string }) {
  return (
    <div className="flex justify-end animate-message-in">
      <div className="max-w-[92%] rounded-2xl rounded-br-md bg-ink px-3.5 py-2.5 text-sm leading-relaxed text-on-dark shadow-soft">
        {content}
      </div>
    </div>
  )
}

function renderInline(text: string): ReactNode {
  return <>{parseAssistantMessageContent(text)}</>
}

function stripNumberedPrefix(line: string): string | null {
  const m1 = line.match(/^\s*\d+\.\)\s+(.*)$/) // 1.) Item
  if (m1 !== null) return m1[1]

  const m2 = line.match(/^\s*\d+\.\s+(.*)$/) // 1. Item
  if (m2 !== null) return m2[1]

  const m3 = line.match(/^\s*\d+\)\s+(.*)$/) // 1) Item
  if (m3 !== null) return m3[1]

  return null
}

function stripBulletPrefix(line: string): string | null {
  const m = line.match(/^\s*[-*•]\s+(.*)$/)
  return m?.[1] ?? null
}

function renderAssistantBlocks(content: string): ReactNode[] {
  const lines = content.split(/\r?\n/)
  const blocks: ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    if (trimmed.length === 0) {
      i += 1
      continue
    }

    const numberedItem = stripNumberedPrefix(line)
    if (numberedItem !== null) {
      const items: string[] = []
      while (i < lines.length) {
        const current = lines[i]
        const next = stripNumberedPrefix(current)
        if (next === null) break
        items.push(next)
        i += 1
      }

      blocks.push(
        <ol key={`ol-${i}`} className="list-decimal space-y-1.5 pl-5">
          {items.map((item, idx) => (
            <li key={`li-${idx}`} className="leading-relaxed marker:text-accent">
              {renderInline(item)}
            </li>
          ))}
        </ol>,
      )

      continue
    }

    const bulletItem = stripBulletPrefix(line)
    if (bulletItem !== null) {
      const items: string[] = []
      while (i < lines.length) {
        const current = lines[i]
        const next = stripBulletPrefix(current)
        if (next === null) break
        items.push(next)
        i += 1
      }

      blocks.push(
        <ul key={`ul-${i}`} className="list-disc space-y-1.5 pl-5">
          {items.map((item, idx) => (
            <li key={`bli-${idx}`} className="leading-relaxed marker:text-accent">
              {renderInline(item)}
            </li>
          ))}
        </ul>,
      )

      continue
    }

    // paragraph: collect until blank line or start of a list
    const paragraphLines: string[] = []
    while (i < lines.length) {
      const current = lines[i]
      const currentTrimmed = current.trim()
      if (currentTrimmed.length === 0) break
      if (stripNumberedPrefix(current) !== null) break
      if (stripBulletPrefix(current) !== null) break

      paragraphLines.push(current)
      i += 1
    }

    blocks.push(
      <p key={`p-${i}`} className="leading-relaxed">
        {paragraphLines.map((pLine, idx) => (
          <span key={idx}>
            {idx === 0 ? null : <br />}
            {renderInline(pLine)}
          </span>
        ))}
      </p>,
    )
  }

  return blocks
}

function AssistantBubble({ content }: { readonly content: string }) {
  return (
    <div className="flex items-start gap-2.5 animate-message-in">
      <AssistantAvatar />
      <div className="max-w-[92%] rounded-2xl rounded-bl-md border border-border/70 bg-gradient-to-br from-white via-white to-surface-muted/80 px-3.5 py-2.5 text-sm leading-relaxed text-ink shadow-soft">
        <div className="space-y-2.5">{renderAssistantBlocks(content)}</div>
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
