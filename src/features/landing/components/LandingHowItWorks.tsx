import { HOW_IT_WORKS, PLAY_STORE_URL } from '@/features/landing/constants'
import { PhoneMockup, PhoneScreenImage, PlayStoreButton, Reveal, SectionHeading } from '@/shared/ui/brand-ui'

export function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="relative scroll-mt-16 overflow-hidden border-y border-border-dark py-20 sm:py-28">
      <div
        className="pointer-events-none absolute top-1/2 right-0 h-[32rem] w-[32rem] -translate-y-1/2 translate-x-1/3 rounded-full bg-glow-mint/15 blur-[130px]"
        aria-hidden
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:px-8">
        <div>
          <SectionHeading
            align="left"
            badge="How it works"
            title={
              <>
                Up and running in <span className="text-accent-gradient">minutes.</span>
              </>
            }
            description="No developer setup, no spreadsheets. Install, connect and start replying faster."
          />

          <ol className="mt-12 space-y-4">
            {HOW_IT_WORKS.map((item, index) => (
              <Reveal key={item.step} delay={index * 90}>
                <li className="card-surface hover-lift flex gap-5 rounded-[var(--radius-card)] p-5 sm:p-6">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-sm font-semibold text-accent tabular-nums">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-ink">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-muted sm:text-base">{item.description}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={300} className="mt-10">
            <PlayStoreButton href={PLAY_STORE_URL} />
          </Reveal>
        </div>

        <Reveal delay={120} className="mx-auto w-[260px] sm:w-[300px]">
          <PhoneMockup glow="rgb(52 224 161 / 0.35)" className="animate-float-gentle">
            <PhoneScreenImage
              src="/mockups/app-integrations.webp"
              alt="Responza integrations screen with Instagram connected and WhatsApp Business ready to connect"
            />
          </PhoneMockup>
        </Reveal>
      </div>
    </section>
  )
}
