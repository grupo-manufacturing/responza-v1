export function ProChip({ className = '' }: { readonly className?: string }) {
  return (
    <span
      className={[
        'inline-flex shrink-0 items-center rounded-[var(--radius-pill)] border border-accent-violet/25 bg-accent-violet/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-accent-violet uppercase',
        className,
      ].join(' ')}
    >
      PRO
    </span>
  )
}
