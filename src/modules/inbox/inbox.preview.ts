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

export function formatMessageListPreview(
  content: string,
  contentType: MessageContentType,
): string {
  if (!isMediaContentType(contentType)) {
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
