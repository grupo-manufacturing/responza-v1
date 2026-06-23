import type { MessageContentType } from '@/modules/inbox/inbox.constants'
import { isMediaPlaceholderContent } from '@/modules/inbox/inbox.preview'

export function isTranslatableMessageContent(
  content: string,
  contentType: MessageContentType = 'text',
): boolean {
  if (contentType !== 'text') {
    return false
  }

  const trimmed = content.trim()
  if (trimmed.length === 0) {
    return false
  }

  if (isMediaPlaceholderContent(trimmed)) {
    return false
  }

  return true
}
