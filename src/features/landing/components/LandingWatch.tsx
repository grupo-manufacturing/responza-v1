import {
  LANDING_YOUTUBE_SHORT_EMBED_URL,
  LANDING_YOUTUBE_SHORT_URL,
} from '@/features/landing/constants'
import { PhoneMockup, Reveal, SectionHeading } from '@/shared/ui/brand-ui'

export function LandingWatch() {
  return (
    <section id="watch" className="relative scroll-mt-16 overflow-hidden border-y border-border-dark py-20 sm:py-28">
      <div
        className="pointer-events-none absolute top-1/2 left-0 h-[30rem] w-[30rem] -translate-x-1/3 -translate-y-1/2 rounded-full bg-glow-violet/15 blur-[130px]"
        aria-hidden
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
        <Reveal className="mx-auto w-[250px] sm:w-[290px] lg:order-1">
          <PhoneMockup glow="rgb(164 147 255 / 0.4)">
            <iframe
              title="About Responza: YouTube Short"
              src={LANDING_YOUTUBE_SHORT_EMBED_URL}
              className="absolute inset-0 h-full w-full border-0 bg-black"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </PhoneMockup>
        </Reveal>

        <div className="lg:order-2">
          <SectionHeading
            align="left"
            badge="Watch"
            tone="violet"
            title={
              <>
                See Responza <span className="text-accent-gradient">in action.</span>
              </>
            }
            description="A quick look at how Responza brings WhatsApp and Instagram together, with AI drafts that stay under your control."
          />
          <Reveal delay={120}>
            <p className="mt-8 text-sm text-ink-faint">
              Prefer YouTube?{' '}
              <a
                href={LANDING_YOUTUBE_SHORT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-on-dark underline decoration-ink/25 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
              >
                Open the Short
              </a>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
