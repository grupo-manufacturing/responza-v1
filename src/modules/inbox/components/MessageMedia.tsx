import { useState } from 'react'

import type { IntegrationPlatform } from '@/modules/integrations/integrations.constants'

type MessageMediaProps = {
  readonly mediaUrl: string
  readonly alt: string
  readonly isOutbound: boolean
  readonly platform?: IntegrationPlatform | null
}

function imageBorderClass(isOutbound: boolean, platform: IntegrationPlatform | null | undefined): string {
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

export function MessageMedia({ mediaUrl, alt, isOutbound, platform = null }: MessageMediaProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return <p className="text-sm italic opacity-80">Could not load image</p>
  }

  return (
    <a href={mediaUrl} target="_blank" rel="noreferrer" className="block">
      <img
        src={mediaUrl}
        alt={alt}
        className={[
          'max-h-72 max-w-full rounded-lg object-cover',
          imageBorderClass(isOutbound, platform),
        ].join(' ')}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </a>
  )
}
