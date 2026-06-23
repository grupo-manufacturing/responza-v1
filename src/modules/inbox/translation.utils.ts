export function isTranslatableMessageContent(
  content: string,
  contentType: 'text' | 'image' | 'video' | 'audio' | 'document' = 'text',
): boolean {
  if (contentType !== 'text') {
    return false
  }

  const trimmed = content.trim()
  if (trimmed.length === 0) {
    return false
  }

  if (trimmed.startsWith('(non-text:')) {
    return false
  }

  if (trimmed.startsWith('(attachment:')) {
    return false
  }

  return true
}
