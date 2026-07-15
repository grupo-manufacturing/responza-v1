type ConnectedAccountProfileProps = {
  displayName: string | null
  profilePictureUrl: string | null
  fallbackInitial: string
  avatarClassName?: string
}

export function ConnectedAccountProfile({
  displayName,
  profilePictureUrl,
  fallbackInitial,
  avatarClassName = 'bg-surface-muted text-ink-muted',
}: ConnectedAccountProfileProps) {
  const initial = fallbackInitial.charAt(0).toUpperCase()

  return (
    <div className="flex items-center gap-3">
      {profilePictureUrl !== null ? (
        <img
          src={profilePictureUrl}
          alt=""
          className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-white"
        />
      ) : (
        <div
          className={[
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
            avatarClassName,
          ].join(' ')}
        >
          {initial}
        </div>
      )}
      <p className="truncate text-sm font-medium text-ink">{displayName ?? 'Connected account'}</p>
    </div>
  )
}
