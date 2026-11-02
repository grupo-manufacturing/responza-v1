import { SEO_PAGES } from '@/shared/seo/seo.constants'
import { usePageMeta } from '@/shared/seo/usePageMeta'
import { LandingButton, LandingLogo } from '@/shared/ui/brand-ui'

export function NotFoundPage() {
  usePageMeta(SEO_PAGES.notFound)

  return (
    <div className="flex min-h-screen flex-col bg-surface-light">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-4xl items-center px-4 py-4 sm:px-6">
          <LandingLogo variant="light" />
        </div>
      </header>

      <main className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
        <p className="text-xs font-medium tracking-wide text-ink-faint uppercase">404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Page not found</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted sm:text-base">
          The page you are looking for doesn’t exist or may have been moved.
        </p>
        <LandingButton to="/" variant="primary" showChevron className="mt-8">
          Back to home
        </LandingButton>
      </main>
    </div>
  )
}
