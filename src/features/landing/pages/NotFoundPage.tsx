import { SEO_PAGES } from '@/shared/seo/seo.constants'
import { usePageMeta } from '@/shared/seo/usePageMeta'
import { LandingButton } from '@/shared/ui/brand-ui'
import { SiteFooter, SiteHeader } from '@/shared/ui/site-chrome'

export function NotFoundPage() {
  usePageMeta(SEO_PAGES.notFound)

  return (
    <div className="flex min-h-screen flex-col bg-surface-light">
      <SiteHeader />

      <main className="relative mx-auto flex max-w-xl flex-1 flex-col items-center justify-center px-4 py-40 text-center sm:px-6">
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-glow-mint/15 blur-[100px]"
          aria-hidden
        />
        <p className="relative text-8xl font-semibold tracking-[-0.06em] text-accent-gradient sm:text-9xl">404</p>
        <h1 className="relative mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Page not found</h1>
        <p className="relative mt-3 text-sm leading-relaxed text-ink-muted sm:text-base">
          The page you are looking for doesn’t exist or may have been moved.
        </p>
        <LandingButton to="/" variant="primary" size="lg" showChevron className="relative mt-8">
          Back to home
        </LandingButton>
      </main>

      <SiteFooter />
    </div>
  )
}
