export const GMAIL_MESSAGES_PAGE_SIZE = 20

export const gmailKeys = {
  connection: ['gmail', 'connection'] as const,
  messages: ['gmail', 'messages'] as const,
  message: (id: string) => ['gmail', 'message', id] as const,
}

export function formatGmailTimestamp(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const now = new Date()
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()

  if (isToday) {
    return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
  }

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function formatGmailDetailTimestamp(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function formatGmailSender(from: string): string {
  const trimmed = from.trim()
  if (trimmed.length === 0) {
    return 'Unknown sender'
  }

  const nameMatch = trimmed.match(/^(.+?)\s*<[^>]+>$/)
  if (nameMatch !== null && nameMatch[1] !== undefined) {
    return nameMatch[1].replace(/^["']|["']$/g, '').trim() || trimmed
  }

  return trimmed
}

export function extractEmailAddress(value: string): string {
  const trimmed = value.trim()
  const angleMatch = trimmed.match(/<([^>]+)>/)
  if (angleMatch !== null && angleMatch[1] !== undefined) {
    return angleMatch[1].trim()
  }

  return trimmed
}

export function buildReplyDefaults(message: { from: string; subject: string }) {
  const subject = message.subject.trim()
  return {
    to: extractEmailAddress(message.from),
    subject: /^re:/i.test(subject) ? subject : `Re: ${subject}`,
  }
}

export type GmailComposeMode = 'compose' | 'reply'

export type GmailComposeState = {
  mode: GmailComposeMode
  replyMessageId?: string
  to: string
  subject: string
  body: string
}
