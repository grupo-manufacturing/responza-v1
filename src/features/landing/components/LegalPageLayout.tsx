import { SiteFooter, SiteHeader } from '@/shared/ui/site-chrome'

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
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-4 pt-32 pb-16 sm:px-6 sm:pt-40 sm:pb-24">
        <p className="text-xs font-medium tracking-[0.16em] text-accent uppercase">Legal</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.035em] text-ink sm:text-5xl">{title}</h1>
        <p className="mt-4 text-sm text-ink-muted">
          {dateLabel}: {lastUpdated}
        </p>

        <div className="mt-12 space-y-10 border-t border-border-dark pt-10">{children}</div>
      </main>

      <SiteFooter />
    </div>
  )
}
