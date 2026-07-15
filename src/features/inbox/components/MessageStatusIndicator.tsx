import { Spinner } from '@/shared/ui/primitives/Spinner'
import type { MessageStatus } from '@/features/inbox/constants'
import type { IntegrationPlatform } from '@/features/integrations/constants'

type MessageStatusIndicatorProps = {
  readonly status: MessageStatus
  readonly platform?: IntegrationPlatform | null
}

function SingleCheck({ className }: { readonly className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  )
}

function sentCheckClass(platform: IntegrationPlatform | null | undefined): string {
  if (platform === 'whatsapp') {
    return 'h-3.5 w-3.5 text-ink-faint'
  }

  return 'h-3.5 w-3.5 text-ink-faint'
}

function readCheckClass(): string {
  return 'h-3.5 w-3.5 text-[#53bdeb]'
}

export function MessageStatusIndicator({ status, platform = null }: MessageStatusIndicatorProps) {
  if (status === 'pending') {
    return <Spinner size="sm" variant="muted" />
  }

  if (status === 'sent') {
    return <SingleCheck className={sentCheckClass(platform)} />
  }

  if (status === 'read') {
    return (
      <span className="inline-flex items-center -space-x-1.5" aria-label="Read">
        <SingleCheck className={readCheckClass()} />
        <SingleCheck className={readCheckClass()} />
      </span>
    )
  }

  if (status === 'failed') {
    return <span className="font-medium text-red-600">Failed</span>
  }

  return null
}
