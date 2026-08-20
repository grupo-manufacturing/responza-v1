import { ASSISTANT_SUGGESTED_PROMPTS } from '@/features/assistant/constants'

type SuggestedPromptsProps = {
  readonly disabled: boolean
  readonly onSelect: (prompt: string) => void
}

export function SuggestedPrompts({ disabled, onSelect }: SuggestedPromptsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {ASSISTANT_SUGGESTED_PROMPTS.map((prompt) => (
        <button
          key={prompt}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(prompt)}
          className="rounded-[var(--radius-pill)] border border-border bg-white/90 px-3.5 py-2 text-xs font-medium text-ink-muted transition-colors hover:border-accent/30 hover:bg-accent/5 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          {prompt}
        </button>
      ))}
    </div>
  )
}
