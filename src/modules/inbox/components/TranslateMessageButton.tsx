import { Spinner } from '@/components/ui/Spinner'

type TranslateMessageButtonProps = {
  readonly disabled: boolean
  readonly loading: boolean
  readonly onTranslate: () => void
}

function TranslateIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 015.372-.028m0 0a48.408 48.408 0 014.5 0m-4.5 0v2.25m0-2.25h4.5m-9 0H3m2.25 0v2.25M3 8.25h2.25m13.5 0H21m-2.25 0v2.25m0-2.25h-4.5"
      />
    </svg>
  )
}

export function TranslateMessageButton({
  disabled,
  loading,
  onTranslate,
}: TranslateMessageButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      aria-label={loading ? 'Translating message' : 'Translate message'}
      title="Translate message"
      onClick={onTranslate}
      className="inline-flex h-7 w-7 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {loading ? <Spinner size="sm" variant="muted" /> : <TranslateIcon />}
    </button>
  )
}
