import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

import { isMessagingPlatform } from '@/features/inbox/constants'

const MARKDOWN_LINK_PATTERN = /\[([^\]]+)\]\((\/[^)]+)\)/g

const INTERNAL_PATH_PATTERNS = [
  /^\/whatsapp\?conversation=[^&\s]+$/,
  /^\/instagram\?conversation=[^&\s]+$/,
  /^\/gmail\?message=[^&\s]+$/,
  /^\/integrations$/,
] as const

function isSafeInternalPath(path: string): boolean {
  if (!path.startsWith('/')) {
    return false
  }

  return INTERNAL_PATH_PATTERNS.some((pattern) => pattern.test(path))
}

function assistantLinkClassName(): string {
  return 'font-medium text-accent underline decoration-accent/30 underline-offset-2 hover:decoration-accent'
}

function renderPlainTextWithPaths(text: string, keyPrefix: string): ReactNode[] {
  const pathPattern =
    /(\/(?:whatsapp\?conversation=[^&\s]+|instagram\?conversation=[^&\s]+|gmail\?message=[^&\s]+|integrations))/g
  const parts = text.split(pathPattern)

  return parts.map((part, index) => {
    if (!part.startsWith('/')) {
      return part
    }

    if (!isSafeInternalPath(part)) {
      return part
    }

    const label = linkLabelForPath(part)
    return (
      <Link key={`${keyPrefix}-path-${index}`} to={part} className={assistantLinkClassName()}>
        {label}
      </Link>
    )
  })
}

function linkLabelForPath(path: string): string {
  const conversationMatch = path.match(/^\/(whatsapp|instagram)\?conversation=(.+)$/)
  if (conversationMatch !== null) {
    const platform = conversationMatch[1]
    if (isMessagingPlatform(platform)) {
      return `Open in ${platform === 'whatsapp' ? 'WhatsApp' : 'Instagram'}`
    }
  }

  if (path.startsWith('/gmail?message=')) {
    return 'Open in Gmail'
  }

  if (path === '/integrations') {
    return 'Integrations'
  }

  return 'Open'
}

function renderTextNode(text: string, keyPrefix: string): ReactNode[] {
  if (text.length === 0) {
    return []
  }

  return renderPlainTextWithPaths(text, keyPrefix)
}

export function parseAssistantMessageContent(content: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let lastIndex = 0
  let matchIndex = 0

  for (const match of content.matchAll(MARKDOWN_LINK_PATTERN)) {
    const matchStart = match.index ?? 0
    const label = match[1] ?? ''
    const href = match[2] ?? ''

    if (matchStart > lastIndex) {
      nodes.push(...renderTextNode(content.slice(lastIndex, matchStart), `text-${matchIndex}`))
    }

    if (isSafeInternalPath(href)) {
      nodes.push(
        <Link
          key={`link-${matchIndex}`}
          to={href}
          className={assistantLinkClassName()}
        >
          {label}
        </Link>,
      )
    } else {
      nodes.push(`[${label}](${href})`)
    }

    lastIndex = matchStart + match[0].length
    matchIndex += 1
  }

  if (lastIndex < content.length) {
    nodes.push(...renderTextNode(content.slice(lastIndex), `tail-${matchIndex}`))
  }

  return nodes
}
