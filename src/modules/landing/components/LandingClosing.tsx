import { useState } from 'react'
import { Link } from 'react-router-dom'

import { LANDING_FAQS } from '../landing.constants'
import { LandingButton, LandingLogo, Reveal, SectionDivider } from '../landing-ui'

export function LandingClosing() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <>
      <section id="faqs" className="relative overflow-hidden bg-grid-dark py-20 sm:py-28">
        <div
          className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionDivider label="FAQs" variant="dark" />
            <h2 className="mt-10 text-center text-2xl font-semibold tracking-tight text-on-dark sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-center text-base text-on-dark-muted">
              Everything you need to know about Responza AI from setup to billing.
            </p>
          </Reveal>
          <div className="mt-10 space-y-3 sm:mt-12">
            {LANDING_FAQS.map((faq, index) => {
              const isOpen = openIndex === index
              return (
                <Reveal key={faq.q} delay={index * 60}>
                  <div
                    className={[
                      'glass-dark transition-colors duration-200',
                      isOpen ? 'border-accent/20 bg-accent/5' : '',
                      'rounded-2xl px-4 py-4 sm:rounded-[var(--radius-pill)] sm:px-5',
                    ].join(' ')}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="flex w-full items-start justify-between gap-4 text-left sm:items-center"
                    >
                      <span className="text-sm font-medium text-on-dark">{faq.q}</span>
                      <span
                        className={[
                          'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs transition-colors',
                          isOpen
                            ? 'border-accent/40 bg-accent/15 text-accent-soft'
                            : 'border-border-dark text-on-dark-muted',
                        ].join(' ')}
                      >
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                    {isOpen && (
                      <p className="mt-3 pr-2 text-sm leading-relaxed text-on-dark-muted animate-step-in sm:pr-10">
                        {faq.a}
                      </p>
                    )}
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-grid-dark py-20 sm:py-28">
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-accent/15 to-accent-violet/10 blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight text-on-dark sm:text-4xl">
              Stop juggling apps. Start{' '}
              <span className="text-accent-gradient-dark">closing conversations.</span>
            </h2>
            <p className="mt-4 text-base text-on-dark-muted">
              Join businesses using Responza AI to respond faster and convert more customers.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <LandingButton to="/auth?mode=register" variant="secondary" showChevron className="w-full sm:w-auto">
                Start free trial
              </LandingButton>
              <LandingButton to="/auth?mode=login" variant="ghost" className="w-full sm:w-auto">
                Sign in
              </LandingButton>
            </div>
            <p className="mt-4 text-xs text-on-dark-muted">No credit card required · Cancel anytime</p>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-border-dark bg-surface-dark py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <LandingLogo variant="dark" />
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-on-dark-muted">
                One intelligent inbox for WhatsApp, Instagram, and the leads that matter.
              </p>
            </div>
            <div className="flex gap-10 text-sm sm:gap-12">
              <div className="space-y-2">
                <p className="font-medium text-on-dark">Product</p>
                <a href="#features" className="block text-on-dark-muted transition-colors hover:text-accent-soft">
                  Features
                </a>
                <a href="#pricing" className="block text-on-dark-muted transition-colors hover:text-accent-soft">
                  Pricing
                </a>
              </div>
              <div className="space-y-2">
                <p className="font-medium text-on-dark">Account</p>
                <Link to="/auth?mode=login" className="block text-on-dark-muted transition-colors hover:text-accent-soft">
                  Sign in
                </Link>
                <Link to="/auth?mode=register" className="block text-on-dark-muted transition-colors hover:text-accent-soft">
                  Get started
                </Link>
              </div>
            </div>
          </div>
          <p className="mt-10 text-center text-xs text-on-dark-muted">
            © {new Date().getFullYear()} Responza AI. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  )
}
