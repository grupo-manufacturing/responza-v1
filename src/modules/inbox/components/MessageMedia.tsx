import { useState } from 'react'

import type { MediaContentType } from '@/modules/inbox/inbox.preview'
import type { IntegrationPlatform } from '@/modules/integrations/integrations.constants'

type MessageMediaProps = {
  readonly mediaUrl: string
  readonly contentType: MediaContentType
  readonly label: string
  readonly isOutbound: boolean
  readonly platform?: IntegrationPlatform | null
}

function mediaBorderClass(
  isOutbound: boolean,
  platform: IntegrationPlatform | null | undefined,
): string {
  if (isOutbound && platform === 'whatsapp') {
    return 'border border-[#b8e0b0]'
  }

  if (isOutbound && platform === 'instagram') {
    return 'border border-neutral-300'
  }

  if (platform === 'instagram') {
    return 'border border-[#E1306C]/30'
  }

  return 'border border-neutral-200'
}

function mediaLoadErrorLabel(contentType: MediaContentType): string {
  switch (contentType) {
    case 'image':
      return 'Could not load image'
    case 'video':
      return 'Could not load video'
    case 'audio':
      return 'Could not load audio'
    case 'document':
      return 'Could not open document'
  }
}

export function MessageMedia({
  mediaUrl,
  contentType,
  label,
  isOutbound,
  platform = null,
}: MessageMediaProps) {
  const [failed, setFailed] = useState(false)
  const borderClass = mediaBorderClass(isOutbound, platform)

  if (failed) {
    return <p className="text-sm italic opacity-80">{mediaLoadErrorLabel(contentType)}</p>
  }

  if (contentType === 'image') {
    return (
      <a href={mediaUrl} target="_blank" rel="noreferrer" className="block">
        <img
          src={mediaUrl}
          alt={label}
          className={['max-h-72 max-w-full rounded-lg object-cover', borderClass].join(' ')}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      </a>
    )
  }

  if (contentType === 'video') {
    return (
      <video
        src={mediaUrl}
        controls
        preload="metadata"
        className={['max-h-72 max-w-full rounded-lg', borderClass].join(' ')}
        onError={() => setFailed(true)}
      >
        <a href={mediaUrl} target="_blank" rel="noreferrer" className="text-sm underline">
          Open video
        </a>
      </video>
    )
  }

  if (contentType === 'audio') {
    return (
      <audio
        src={mediaUrl}
        controls
        preload="metadata"
        className="w-full min-w-[220px]"
        onError={() => setFailed(true)}
      >
        <a href={mediaUrl} target="_blank" rel="noreferrer" className="text-sm underline">
          Open audio
        </a>
      </audio>
    )
  }

  return (
    <a
      href={mediaUrl}
      target="_blank"
      rel="noreferrer"
      className={[
        'inline-flex max-w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium underline-offset-2 hover:underline',
        borderClass,
        isOutbound ? 'text-inherit' : 'text-neutral-900',
      ].join(' ')}
    >
      <span aria-hidden="true">📄</span>
      <span className="truncate">{label}</span>
    </a>
  )
}
