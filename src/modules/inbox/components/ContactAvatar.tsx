import { useState } from 'react'

import { displayNameInitials } from '@/shared/utils/display-name'

type ContactAvatarProps = {
  readonly displayName: string
  readonly avatarUrl?: string | null
  readonly size?: 'sm' | 'md'
}

const sizeClasses = {
  sm: 'h-10 w-10 text-sm',
  md: 'h-9 w-9 text-sm',
} as const

export function ContactAvatar({ displayName, avatarUrl, size = 'sm' }: ContactAvatarProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = avatarUrl !== null && avatarUrl !== undefined && avatarUrl.length > 0 && !imageFailed

  return (
    <div
      className={[
        'flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-900 font-medium text-white',
        sizeClasses[size],
      ].join(' ')}
      aria-hidden
    >
      {showImage ? (
        <img
          src={avatarUrl}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span>{displayNameInitials(displayName)}</span>
      )}
    </div>
  )
}
