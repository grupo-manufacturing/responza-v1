import { useState } from 'react'

import type { IntegrationPlatform } from '@/features/integrations/constants'
import { displayNameInitials } from '@/shared/utils/display-name'

type ContactAvatarProps = {
  readonly displayName: string
  readonly avatarUrl?: string | null
  readonly size?: 'sm' | 'md'
  readonly platform?: IntegrationPlatform
}

const sizeClasses = {
  sm: 'h-10 w-10 text-sm',
  md: 'h-9 w-9 text-sm',
} as const

function avatarBackgroundClass(platform: IntegrationPlatform | undefined): string {
  if (platform === 'whatsapp') {
    return 'bg-brand-whatsapp'
  }

  if (platform === 'instagram') {
    return 'bg-gradient-to-br from-[#833AB4] to-brand-instagram'
  }

  return 'bg-gradient-to-br from-accent-soft via-accent to-accent-violet'
}

export function ContactAvatar({
  displayName,
  avatarUrl,
  size = 'sm',
  platform,
}: ContactAvatarProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = avatarUrl !== null && avatarUrl !== undefined && avatarUrl.length > 0 && !imageFailed

  return (
    <div
      className={[
        'flex shrink-0 items-center justify-center overflow-hidden rounded-full font-medium text-white',
        avatarBackgroundClass(platform),
        sizeClasses[size],
      ].join(' ')}
      aria-hidden
    >
      {showImage ? (
        <img
          src={avatarUrl}
          alt=""
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span>{displayNameInitials(displayName)}</span>
      )}
    </div>
  )
}
