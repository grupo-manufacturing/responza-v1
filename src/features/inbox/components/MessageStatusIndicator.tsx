import type { MessageStatus } from '@/features/inbox/constants'

type MessageStatusIndicatorProps = {
  readonly status: MessageStatus
}

function ClockIcon({ className }: { readonly className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="8" strokeWidth={2} />
      <path strokeLinecap="round" strokeWidth={2} d="M12 8v4l2.5 1.5" />
    </svg>
  )
}

function SingleCheck({ className }: { readonly className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  )
}

const SENT_CHECK_CLASS = 'h-3.5 w-3.5 text-ink-faint'
const READ_CHECK_CLASS = 'h-3.5 w-3.5 text-[#53bdeb]'

export function MessageStatusIndicator({ status }: MessageStatusIndicatorProps) {
  if (status === 'pending') {
    return <ClockIcon className={SENT_CHECK_CLASS} />
  }

  if (status === 'sent') {
    return <SingleCheck className={SENT_CHECK_CLASS} />
  }

  if (status === 'read') {
    return (
      <span className="inline-flex items-center -space-x-1.5" aria-label="Read">
        <SingleCheck className={READ_CHECK_CLASS} />
        <SingleCheck className={READ_CHECK_CLASS} />
      </span>
    )
  }

  if (status === 'failed') {
    return <span className="font-medium text-red-600">Failed</span>
  }

  return null
}
