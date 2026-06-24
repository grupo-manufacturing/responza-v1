import type { MediaContentType } from '@/modules/inbox/inbox.preview'
import { formatMessageListPreview } from '@/modules/inbox/inbox.preview'

export const OUTBOUND_MEDIA_MAX_BYTES = 2 * 1024 * 1024

const IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const VIDEO_MIME_TYPES = new Set(['video/mp4', 'video/3gpp', 'video/quicktime'])
const AUDIO_MIME_TYPES = new Set([
  'audio/aac',
  'audio/mp4',
  'audio/mpeg',
  'audio/amr',
  'audio/ogg',
  'audio/opus',
])
const DOCUMENT_MIME_TYPES = new Set([
  'text/plain',
  'application/pdf',
  'application/msword',
  'application/vnd.ms-excel',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
])

const EXTENSION_TO_CONTENT_TYPE: Record<string, MediaContentType> = {
  jpg: 'image',
  jpeg: 'image',
  png: 'image',
  webp: 'image',
  gif: 'image',
  mp4: 'video',
  mov: 'video',
  '3gp': 'video',
  aac: 'audio',
  m4a: 'audio',
  mp3: 'audio',
  amr: 'audio',
  ogg: 'audio',
  opus: 'audio',
  txt: 'document',
  pdf: 'document',
  doc: 'document',
  docx: 'document',
  xls: 'document',
  xlsx: 'document',
  ppt: 'document',
  pptx: 'document',
}

export const OUTBOUND_MEDIA_ACCEPT =
  'image/jpeg,image/png,image/webp,image/gif,video/mp4,video/3gpp,video/quicktime,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt'

function normalizeMimeType(mimeType: string): string {
  return mimeType.split(';')[0]?.trim().toLowerCase() ?? ''
}

function inferContentTypeFromFilename(filename: string): MediaContentType | null {
  const extension = filename.includes('.') ? filename.split('.').pop()?.toLowerCase() : undefined
  if (extension === undefined || extension.length === 0) {
    return null
  }

  return EXTENSION_TO_CONTENT_TYPE[extension] ?? null
}

export function inferOutboundMediaContentType(file: File): MediaContentType | null {
  const mimeType = normalizeMimeType(file.type)
  if (IMAGE_MIME_TYPES.has(mimeType)) return 'image'
  if (VIDEO_MIME_TYPES.has(mimeType)) return 'video'
  if (AUDIO_MIME_TYPES.has(mimeType)) return 'audio'
  if (DOCUMENT_MIME_TYPES.has(mimeType)) return 'document'

  return inferContentTypeFromFilename(file.name)
}

export function validateOutboundMediaFile(
  file: File,
): { valid: true; contentType: MediaContentType } | { valid: false; message: string } {
  if (file.size === 0) {
    return { valid: false, message: 'The selected file is empty.' }
  }

  if (file.size > OUTBOUND_MEDIA_MAX_BYTES) {
    return { valid: false, message: 'Files must be 2 MB or smaller.' }
  }

  const contentType = inferOutboundMediaContentType(file)
  if (contentType === null) {
    return { valid: false, message: 'This file type is not supported.' }
  }

  return { valid: true, contentType }
}

export function attachmentPreviewLabel(contentType: MediaContentType, filename: string): string {
  const trimmed = filename.trim()
  if (trimmed.length > 0) {
    return trimmed
  }

  return formatMessageListPreview('', contentType)
}

export function canPreviewAttachmentLocally(contentType: MediaContentType): boolean {
  return contentType === 'image' || contentType === 'video' || contentType === 'audio'
}
