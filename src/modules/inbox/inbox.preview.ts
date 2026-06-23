import type { MessageContentType } from '@/modules/inbox/inbox.constants'

export type MediaContentType = Exclude<MessageContentType, 'text'>

const MEDIA_CONTENT_TYPES = new Set<MessageContentType>(['image', 'video', 'audio', 'document'])

const MEDIA_PREVIEW_LABELS: Record<MediaContentType, string> = {
  image: 'Photo',
  video: 'Video',
  audio: 'Audio',
  document: 'Document',
}

const MEDIA_UNAVAILABLE_LABELS: Record<MediaContentType, string> = {
  image: 'Image unavailable',
  video: 'Video unavailable',
  audio: 'Audio unavailable',
  document: 'Document unavailable',
}

export function isMediaContentType(
  contentType: MessageContentType,
): contentType is MediaContentType {
  return MEDIA_CONTENT_TYPES.has(contentType)
}

export function isMediaPlaceholderContent(content: string): boolean {
  const trimmed = content.trim()
  return trimmed.startsWith('(non-text:') || trimmed.startsWith('(attachment:')
}

export function inferMediaContentTypeFromPlaceholder(content: string): MediaContentType | null {
  const trimmed = content.trim()

  for (const prefix of ['(attachment:', '(non-text:'] as const) {
    if (!trimmed.startsWith(prefix) || !trimmed.endsWith(')')) {
      continue
    }

    const type = trimmed.slice(prefix.length, -1).trim()
    if (type === 'file') {
      return 'document'
    }

    if (isMediaContentType(type as MessageContentType)) {
      return type as MediaContentType
    }
  }

  return null
}

export function formatMessageListPreview(
  content: string,
  contentType: MessageContentType,
): string {
  if (!isMediaContentType(contentType)) {
    const inferred = inferMediaContentTypeFromPlaceholder(content)
    if (inferred !== null) {
      return MEDIA_PREVIEW_LABELS[inferred]
    }

    return content
  }

  const caption = content.trim()
  if (caption.length > 0 && !isMediaPlaceholderContent(caption)) {
    return caption
  }

  return MEDIA_PREVIEW_LABELS[contentType]
}

export function mediaUnavailableLabel(contentType: MediaContentType): string {
  return MEDIA_UNAVAILABLE_LABELS[contentType]
}
