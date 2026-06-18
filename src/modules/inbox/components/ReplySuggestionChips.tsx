type ReplySuggestionChipsProps = {
  readonly suggestions: string[]
  readonly disabled?: boolean
  readonly onSelect: (suggestion: string) => void
  readonly onDismiss: () => void
}

function DismissSuggestionsIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

export function ReplySuggestionChips({
  suggestions,
  disabled = false,
  onSelect,
  onDismiss,
}: ReplySuggestionChipsProps) {
  if (suggestions.length === 0) {
    return null
  }

  return (
    <div className="flex items-start gap-2">
      <div className="grid min-w-0 flex-1 grid-cols-2 gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={`${index}-${suggestion.slice(0, 24)}`}
            type="button"
            onClick={() => {
              onSelect(suggestion)
            }}
            disabled={disabled}
            className={[
              'min-w-0 rounded-2xl border border-violet-200/90 bg-violet-50/95 px-2.5 py-1.5 text-left text-[11px] leading-snug text-violet-900 shadow-sm backdrop-blur-sm transition-colors',
              disabled
                ? 'cursor-not-allowed opacity-50'
                : 'hover:border-violet-300 hover:bg-violet-100/95',
            ].join(' ')}
          >
            <span className="line-clamp-3">{suggestion}</span>
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss suggestions"
        title="Dismiss suggestions"
        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-neutral-200/80 bg-white/90 text-neutral-500 shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-neutral-700"
      >
        <DismissSuggestionsIcon />
      </button>
    </div>
  )
}
