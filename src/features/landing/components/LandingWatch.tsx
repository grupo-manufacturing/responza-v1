import {
  LANDING_YOUTUBE_SHORT_EMBED_URL,
  LANDING_YOUTUBE_SHORT_URL,
} from '@/features/landing/constants'
import { Reveal, SectionBadge } from '@/shared/ui/brand-ui'

export function LandingWatch() {
  return (
    <section id="watch" className="relative overflow-hidden bg-surface-light py-20 sm:py-28">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(91_138_133/0.08),transparent_60%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionBadge variant="light" tone="teal">
            Watch
          </SectionBadge>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
            See Responza in{' '}
            <span className="text-accent-gradient">action.</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-muted">
            A quick look at how teams manage WhatsApp and Instagram in one workspace, with AI drafts
            that stay under your control.
          </p>
        </Reveal>

        <Reveal delay={120} className="mx-auto mt-10 flex max-w-sm justify-center sm:mt-14">
          <div className="w-full max-w-[20rem]">
            <div className="rounded-[2rem] border border-border bg-ink p-2 shadow-card ring-1 ring-accent/15 sm:rounded-[2.25rem] sm:p-2.5">
              <div className="relative aspect-[9/16] overflow-hidden rounded-[1.5rem] bg-surface-dark sm:rounded-[1.75rem]">
                <iframe
                  title="About Responza: YouTube Short"
                  src={LANDING_YOUTUBE_SHORT_EMBED_URL}
                  className="absolute inset-0 h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            </div>

            <p className="mt-4 text-center text-xs text-ink-faint">
              Prefer YouTube?{' '}
              <a
                href={LANDING_YOUTUBE_SHORT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-ink-muted underline-offset-2 transition-colors hover:text-accent hover:underline"
              >
                Open the Short
              </a>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
