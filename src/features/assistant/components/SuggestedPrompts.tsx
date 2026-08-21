import { ASSISTANT_SUGGESTED_PROMPTS } from '@/features/assistant/constants'

type SuggestedPromptsProps = {
  readonly disabled: boolean
  readonly onSelect: (prompt: string) => void
}

export function SuggestedPrompts({ disabled, onSelect }: SuggestedPromptsProps) {
  return (
    <div className="flex max-w-xl flex-wrap justify-center gap-2">
      {ASSISTANT_SUGGESTED_PROMPTS.map((prompt) => (
        <button
          key={prompt}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(prompt)}
          className={[
            'rounded-[var(--radius-pill)] border border-border/80 bg-white/90 px-3.5 py-2',
            'text-xs font-medium text-ink-muted shadow-soft',
            'transition-all duration-200',
            'hover:-translate-y-0.5 hover:border-accent/35 hover:bg-accent/5 hover:text-ink hover:shadow-card',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-soft',
          ].join(' ')}
        >
          {prompt}
        </button>
      ))}
    </div>
  )
}
