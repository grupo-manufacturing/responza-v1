export function AssistantTypingIndicator() {
  return (
    <div
      className="flex justify-start animate-message-in"
      role="status"
      aria-label="Assistant is typing"
    >
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-border/80 bg-gradient-to-br from-white via-white to-accent/5 px-4 py-3 shadow-soft">
        <span className="h-2 w-2 rounded-full bg-ink-muted animate-typing-dot" />
        <span className="h-2 w-2 rounded-full bg-ink-muted animate-typing-dot [animation-delay:160ms]" />
        <span className="h-2 w-2 rounded-full bg-ink-muted animate-typing-dot [animation-delay:320ms]" />
      </div>
    </div>
  )
}
