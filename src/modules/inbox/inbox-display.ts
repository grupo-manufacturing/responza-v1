import { platformLabel } from '@/shared/constants/inbox'
import type { Conversation, MessageSnippet, Participant } from '@/shared/services/inbox.service'

export function formatInboxTime(iso: string | null): string {
  if (iso === null) {
    return ''
  }

  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const now = new Date()
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()

  if (isToday) {
    return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
  }

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function getParticipantLabel(participant: Participant | undefined): string {
  if (participant === undefined) {
    return 'Unknown contact'
  }

  if (participant.displayName !== null && participant.displayName.trim().length > 0) {
    return participant.displayName
  }

  return participant.platformUserId
}

export function getConversationTitle(conversation: Conversation): string {
  const participant = conversation.participants?.[0]
  if (participant !== undefined) {
    return getParticipantLabel(participant)
  }

  return conversation.externalId
}

export function getMessagePreview(message: MessageSnippet | null | undefined): string {
  if (message === null || message === undefined) {
    return 'No messages yet'
  }

  if (message.body !== null && message.body.trim().length > 0) {
    return message.body
  }

  if (message.contentType !== 'text') {
    return `[${message.contentType}]`
  }

  return 'Empty message'
}

export function getConversationPlatformLabel(conversation: Conversation): string {
  return platformLabel(conversation.platform)
}
