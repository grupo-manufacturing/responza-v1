import { Link } from 'react-router-dom'

import { LEGAL_FOOTER_LINKS } from '@/modules/landing/legal.constants'
import { LandingLogo } from '@/modules/landing/landing-ui'

type LegalPageLayoutProps = {
  readonly title: string
  readonly lastUpdated: string
  readonly children: React.ReactNode
}

function LegalSection({
  title,
  children,
}: {
  readonly title: string
  readonly children: React.ReactNode
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-ink-muted">{children}</div>
    </section>
  )
}

export function LegalSectionBlock({ title, children }: { readonly title: string; readonly children: React.ReactNode }) {
  return <LegalSection title={title}>{children}</LegalSection>
}

export function LegalSubsection({ title, children }: { readonly title: string; readonly children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="text-base font-medium text-ink">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

export function LegalSubsubsection({ title, children }: { readonly title: string; readonly children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-ink">{title}</h4>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

export function LegalList({ items }: { readonly items: readonly string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

export function LegalPageLayout({
  title,
  lastUpdated,
  dateLabel = 'Last updated',
  children,
}: LegalPageLayoutProps & { readonly dateLabel?: string }) {
  return (
    <div className="min-h-screen bg-surface-light">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <LandingLogo variant="light" />
          <Link to="/" className="text-sm font-medium text-ink-muted transition-colors hover:text-ink">
            Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="text-xs font-medium tracking-wide text-ink-faint uppercase">Legal</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{title}</h1>
        <p className="mt-3 text-sm text-ink-muted">
          {dateLabel}: {lastUpdated}
        </p>

        <div className="mt-10 space-y-8">{children}</div>
      </main>

      <footer className="border-t border-border bg-white py-8">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-6">
          <p className="text-xs text-ink-faint">© {new Date().getFullYear()} Responza AI. All rights reserved.</p>
          <nav className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
            {LEGAL_FOOTER_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-ink-muted transition-colors hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  )
}
