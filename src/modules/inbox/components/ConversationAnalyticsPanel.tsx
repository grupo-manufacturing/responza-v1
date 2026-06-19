import { Spinner } from '@/components/ui/Spinner'
import type { ConversationAnalyticsResponse } from '@/modules/ai/ai.service'

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
  if (score >= 70) {
    return 'text-emerald-600'
  }

  if (score >= 40) {
    return 'text-amber-600'
  }

  return 'text-neutral-500'
}

function leadScoreBarTone(score: number): string {
  if (score >= 70) {
    return 'bg-emerald-500'
  }

  if (score >= 40) {
    return 'bg-amber-500'
  }

  return 'bg-neutral-400'
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
        'absolute inset-y-0 right-0 z-20 flex w-1/2 flex-col border-l border-neutral-200 bg-white shadow-[-8px_0_24px_rgba(0,0,0,0.06)] transition-transform duration-300 ease-out',
        open ? 'translate-x-0' : 'pointer-events-none translate-x-full',
      ].join(' ')}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-neutral-900">AI Analytics</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close analytics panel"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <Spinner size="md" variant="muted" label="Analyzing conversation..." />
          </div>
        )}

        {!loading && error !== null && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        {!loading && error === null && data !== null && (
          <div className="space-y-5">
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Lead Score
              </h3>
              <div className="mt-2 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
                <div className="flex items-end justify-between gap-3">
                  <p className={['text-3xl font-bold tabular-nums', leadScoreTone(data.leadScore)].join(' ')}>
                    {data.leadScore}
                  </p>
                  <span className="pb-1 text-xs text-neutral-500">out of 100</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-neutral-200">
                  <div
                    className={['h-full rounded-full transition-all', leadScoreBarTone(data.leadScore)].join(' ')}
                    style={{ width: `${data.leadScore}%` }}
                  />
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Suggested Actions
              </h3>
              <ol className="mt-2 space-y-2">
                {data.suggestedActions.map((action, index) => (
                  <li
                    key={`${index}-${action.slice(0, 24)}`}
                    className="flex gap-2.5 rounded-xl border border-violet-200/80 bg-violet-50/60 px-3 py-2.5 text-sm text-violet-950"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-semibold text-white">
                      {index + 1}
                    </span>
                    <span className="min-w-0 leading-snug">{action}</span>
                  </li>
                ))}
              </ol>
            </section>

            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Customer History
              </h3>
              <p className="mt-2 rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm leading-relaxed text-neutral-800">
                {data.customerHistory}
              </p>
            </section>

            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Conversation Summary
              </h3>
              <p className="mt-2 rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm leading-relaxed text-neutral-800">
                {data.conversationSummary}
              </p>
            </section>
          </div>
        )}
      </div>
    </aside>
  )
}
