import { Spinner } from '@/components/ui/Spinner'
import type { ConversationAnalyticsResponse } from '@/modules/ai/ai.service'
import { INBOX_ICON_BUTTON_CLASS } from '@/modules/inbox/inbox-ui'

type ConversationAnalyticsPanelProps = {
  readonly open: boolean
  readonly loading: boolean
  readonly data: ConversationAnalyticsResponse | null
  readonly error: string | null
  readonly onClose: () => void
}

function CloseIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function leadScoreTone(score: number): string {
  if (score >= 70) return 'text-emerald-600'
  if (score >= 40) return 'text-amber-600'
  return 'text-ink-muted'
}

export function ConversationAnalyticsPanel({
  open,
  loading,
  data,
  error,
  onClose,
}: ConversationAnalyticsPanelProps) {
  return (
    <aside
      aria-hidden={!open}
      className={[
        'glass-light absolute inset-y-0 right-0 z-20 flex w-full max-w-md flex-col border-l border-border shadow-card transition-transform duration-300 ease-out sm:w-1/2',
        open ? 'translate-x-0' : 'pointer-events-none translate-x-full',
      ].join(' ')}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold text-ink">AI Analytics</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close analytics panel"
          className={INBOX_ICON_BUTTON_CLASS}
        >
          <CloseIcon />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <Spinner size="md" variant="muted" />
          </div>
        )}

        {!loading && error !== null && (
          <p className="rounded-xl border border-red-200/80 bg-red-50 px-3 py-2.5 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        {!loading && error === null && data !== null && (
          <div className="space-y-5">
            <section>
              <h3 className="text-xs font-medium tracking-wide text-ink-faint uppercase">Lead score</h3>
              <div className="mt-2 rounded-[var(--radius-card)] border border-border bg-surface-muted/60 px-4 py-3">
                <div className="flex items-end justify-between gap-3">
                  <p className={['text-3xl font-bold tabular-nums', leadScoreTone(data.leadScore)].join(' ')}>
                    {data.leadScore}
                  </p>
                  <span className="pb-1 text-xs text-ink-faint">out of 100</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-[var(--radius-pill)] bg-border">
                  <div
                    className="h-full rounded-[var(--radius-pill)] bg-gradient-to-r from-accent-soft via-accent to-accent-violet transition-all"
                    style={{ width: `${data.leadScore}%` }}
                  />
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xs font-medium tracking-wide text-ink-faint uppercase">Suggested actions</h3>
              <ol className="mt-2 space-y-2">
                {data.suggestedActions.map((action, index) => (
                  <li
                    key={`${index}-${action.slice(0, 24)}`}
                    className="flex gap-2.5 rounded-xl border border-accent-violet/20 bg-accent-violet/8 px-3 py-2.5 text-sm text-ink"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-violet text-xs font-semibold text-white">
                      {index + 1}
                    </span>
                    <span className="min-w-0 leading-snug">{action}</span>
                  </li>
                ))}
              </ol>
            </section>

            <section>
              <h3 className="text-xs font-medium tracking-wide text-ink-faint uppercase">Customer history</h3>
              <p className="mt-2 rounded-xl border border-border bg-white/80 px-3 py-2.5 text-sm leading-relaxed text-ink-muted">
                {data.customerHistory}
              </p>
            </section>

            <section>
              <h3 className="text-xs font-medium tracking-wide text-ink-faint uppercase">Conversation summary</h3>
              <p className="mt-2 rounded-xl border border-border bg-white/80 px-3 py-2.5 text-sm leading-relaxed text-ink-muted">
                {data.conversationSummary}
              </p>
            </section>
          </div>
        )}
      </div>
    </aside>
  )
}
