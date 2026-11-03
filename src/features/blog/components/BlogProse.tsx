import { Link } from 'react-router-dom'

type ChildrenProps = { readonly children: React.ReactNode }

export function BlogH2({ children }: ChildrenProps) {
  return <h2 className="pt-4 text-2xl font-semibold tracking-tight text-ink sm:text-[1.75rem]">{children}</h2>
}

export function BlogH3({ children }: ChildrenProps) {
  return <h3 className="pt-2 text-lg font-semibold text-ink">{children}</h3>
}

export function BlogP({ children }: ChildrenProps) {
  return <p className="text-base leading-relaxed text-ink-muted sm:text-[1.0625rem]">{children}</p>
}

export function BlogList({ children, ordered = false }: ChildrenProps & { readonly ordered?: boolean }) {
  const className = [
    'space-y-2 pl-6 text-base leading-relaxed text-ink-muted marker:text-accent sm:text-[1.0625rem]',
    ordered ? 'list-decimal' : 'list-disc',
  ].join(' ')
  return ordered ? <ol className={className}>{children}</ol> : <ul className={className}>{children}</ul>
}

export function BlogStrong({ children }: ChildrenProps) {
  return <strong className="font-semibold text-ink">{children}</strong>
}

/** Same-site link. Hash targets on the landing page need a full navigation to scroll correctly. */
export function BlogLink({ to, children }: ChildrenProps & { readonly to: string }) {
  const className = 'font-medium text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent'
  if (to.includes('#')) {
    return (
      <a href={to} className={className}>
        {children}
      </a>
    )
  }
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  )
}

export function BlogCallout({ children }: ChildrenProps) {
  return (
    <div className="rounded-xl border border-accent/25 bg-accent/5 px-5 py-4 text-base leading-relaxed text-ink sm:text-[1.0625rem]">
      {children}
    </div>
  )
}
