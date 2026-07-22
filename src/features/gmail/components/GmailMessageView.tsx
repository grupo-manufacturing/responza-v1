import { GmailMessageHeader } from '@/features/gmail/components/GmailMessageHeader'
import type { GmailMessageDetail } from '@/features/gmail/api/gmail.types'
import { AppButton } from '@/shared/ui/app-ui'
import { Spinner } from '@/shared/ui/primitives/Spinner'

type GmailMessageViewProps = {
  message: GmailMessageDetail | null
  loading: boolean
  error: string | null
  onBack?: () => void
  onRetry?: () => void
  onReply?: () => void
}

export function GmailMessageView({
  message,
  loading,
  error,
  onBack,
  onRetry,
  onReply,
}: GmailMessageViewProps) {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <GmailMessageHeader message={message} onBack={onBack} />

      <div className="min-h-0 flex-1 overflow-y-auto bg-white/70">
        {loading && (
          <div className="flex h-full items-center justify-center py-12">
            <Spinner />
          </div>
        )}

        {!loading && error !== null && (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-6 py-12 text-center">
            <p className="text-sm text-ink-muted">{error}</p>
            {onRetry !== undefined && (
              <AppButton variant="secondary" onClick={onRetry}>
                Try again
              </AppButton>
            )}
          </div>
        )}

        {!loading && error === null && message === null && (
          <div className="flex h-full flex-col items-center justify-center px-6 py-12 text-center">
            <p className="text-sm text-ink-muted">Select an email to read it here.</p>
          </div>
        )}

        {!loading && error === null && message !== null && (
          <div className="p-4 sm:p-6">
            {onReply !== undefined && (
              <div className="mb-4">
                <AppButton
                  variant="secondary"
                  onClick={onReply}
                  className="!border-[#C5221F]/20 !text-[#C5221F] hover:!bg-[#C5221F]/5"
                >
                  Reply
                </AppButton>
              </div>
            )}
            <iframe
              title={message.subject}
              sandbox=""
              srcDoc={message.bodyHtml}
              className="min-h-[420px] w-full rounded-xl border border-border bg-white"
            />
          </div>
        )}
      </div>
    </div>
  )
}
