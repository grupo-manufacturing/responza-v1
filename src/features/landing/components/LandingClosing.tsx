import { useState } from 'react'
import { Link } from 'react-router-dom'

import { LEGAL_FOOTER_LINKS } from '../legal.constants'
import { LANDING_FAQS } from '@/features/landing/constants'
import { LandingButton, LandingLogo, Reveal, SectionDivider } from '@/shared/ui/brand-ui'

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
          <div className="mt-10 divide-y divide-border-dark border-y border-border-dark sm:mt-12">
            {LANDING_FAQS.map((faq, index) => {
              const isOpen = openIndex === index
              const panelId = `faq-panel-${index}`
              const buttonId = `faq-button-${index}`

              return (
                <Reveal key={faq.q} delay={index * 60}>
                  <div>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="flex w-full items-center justify-between gap-4 py-4 text-left transition-colors hover:text-accent-soft sm:py-5"
                    >
                      <span className="text-sm font-medium text-on-dark sm:text-base">{faq.q}</span>
                      <svg
                        className={[
                          'h-4 w-4 shrink-0 text-on-dark-muted transition-transform duration-200',
                          isOpen ? 'rotate-180 text-accent-soft' : '',
                        ].join(' ')}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className={[
                        'grid transition-[grid-template-rows] duration-200 ease-out',
                        isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                      ].join(' ')}
                    >
                      <div className="overflow-hidden">
                        <p className="pb-4 text-sm leading-relaxed text-on-dark-muted sm:pb-5 sm:pr-10">
                          {faq.a}
                        </p>
                      </div>
                    </div>
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
            <p className="mt-4 text-xs text-on-dark-muted">
              No credit card required · 3-day free trial · Plans from ₹499/month
            </p>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-border-dark bg-surface-dark py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <LandingLogo variant="dark" />
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-on-dark-muted">
                One intelligent inbox for WhatsApp and Instagram conversations.
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
              <div className="space-y-2">
                <p className="font-medium text-on-dark">Legal</p>
                {LEGAL_FOOTER_LINKS.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="block text-on-dark-muted transition-colors hover:text-accent-soft"
                  >
                    {link.label}
                  </Link>
                ))}
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
