import { useState } from 'react'

import { LANDING_FAQS, PLAY_STORE_URL } from '@/features/landing/constants'
import { PhoneMockup, PhoneScreenImage, PlayStoreButton, Reveal, SectionHeading } from '@/shared/ui/brand-ui'

import { WaitlistForm } from './WaitlistForm'

export function LandingClosing() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <>
      <section id="faqs" className="relative scroll-mt-16 overflow-hidden border-t border-border-dark py-20 sm:py-28">
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="FAQs"
            tone="sky"
            title="Questions, answered."
            description="Everything you need to know about Responza and the open test."
          />
          <div className="mt-12 divide-y divide-border-dark border-y border-border-dark">
            {LANDING_FAQS.map((faq, index) => {
              const isOpen = openIndex === index
              const panelId = `faq-panel-${index}`
              const buttonId = `faq-button-${index}`

              return (
                <Reveal key={faq.q} delay={Math.min(index, 4) * 50}>
                  <div>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-accent sm:py-6"
                    >
                      <span className="text-[15px] font-medium text-on-dark sm:text-lg">{faq.q}</span>
                      <span
                        className={[
                          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border-strong text-on-dark-muted transition-all duration-300',
                          isOpen ? 'rotate-45 border-accent/50 bg-accent/10 text-accent' : '',
                        ].join(' ')}
                        aria-hidden
                      >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 5v14M5 12h14" />
                        </svg>
                      </span>
                    </button>
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className={[
                        'grid transition-[grid-template-rows] duration-300 ease-out',
                        isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                      ].join(' ')}
                    >
                      <div className="overflow-hidden">
                        <p className="pb-6 text-sm leading-relaxed text-on-dark-muted sm:pr-12 sm:text-base">{faq.a}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <section id="get-the-app" className="relative scroll-mt-16 overflow-hidden px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-border-strong bg-surface-dark sm:rounded-[2.5rem]">
          <div className="bg-grid-dark mask-fade-grid pointer-events-none absolute inset-0 opacity-70" aria-hidden />
          <div
            className="animate-aurora pointer-events-none absolute -top-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-glow-mint/25 blur-[120px]"
            aria-hidden
          />
          <div
            className="animate-aurora pointer-events-none absolute -right-24 -bottom-40 h-[30rem] w-[30rem] rounded-full bg-glow-violet/25 blur-[120px]"
            style={{ animationDelay: '-7s' }}
            aria-hidden
          />

          <div className="relative grid items-center gap-12 px-6 py-14 sm:px-12 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-6">
            <Reveal className="text-center lg:text-left">
              <h2 className="text-4xl leading-[1.04] font-semibold tracking-[-0.04em] text-ink sm:text-6xl">
                Your customers are already messaging.{' '}
                <span className="text-accent-gradient">Reply like a pro.</span>
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg lg:mx-0">
                Join the open test on Google Play and give every chat a fast, thoughtful answer, from one inbox.
              </p>
              <div className="mt-9 flex flex-col items-center gap-3 lg:items-start">
                <PlayStoreButton href={PLAY_STORE_URL} />
              </div>

              <div id="waitlist" className="mt-12 scroll-mt-24 border-t border-border-dark pt-8">
                <p className="text-sm font-medium text-on-dark">Not on Android? Get launch updates.</p>
                <p className="mt-1 text-xs text-ink-faint">Join the waitlist. No spam, just launch news.</p>
                <div className="mt-4">
                  <WaitlistForm align="left" />
                </div>
              </div>
            </Reveal>

            <Reveal delay={150} className="mx-auto w-[240px] sm:w-[290px]">
              <PhoneMockup glow="rgb(52 224 161 / 0.4)">
                <PhoneScreenImage src="/mockups/app-welcome.webp" alt="Responza welcome screen" />
              </PhoneMockup>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
