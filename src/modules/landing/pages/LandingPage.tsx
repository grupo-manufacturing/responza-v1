import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-sm font-bold text-white">
                R
              </div>
              <span className="text-xl font-semibold text-neutral-900">Responza AI</span>
            </div>
          <nav className="hidden items-center gap-6 md:flex">
            <a href="#features" className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900">
              How it works
            </a>
            <a href="#pricing" className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900">
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-3">
              <Link
                to="/auth?mode=login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-600 transition-all hover:bg-neutral-100 hover:text-neutral-900"
              >
                Sign in
              </Link>
              <Link
                to="/auth?mode=register"
              className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-neutral-800"
            >
              Get started free
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-28 lg:py-36">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-neutral-100 blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-1.5 text-xs font-medium text-neutral-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Now live — WhatsApp &amp; Instagram in one inbox
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-6xl lg:text-7xl">
          Reply faster.{' '}
          <span className="relative whitespace-nowrap">
            <span className="relative z-10">Win more customers.</span>
            <svg
              aria-hidden
              viewBox="0 0 418 42"
              className="absolute left-0 top-full w-full fill-neutral-200"
              preserveAspectRatio="none"
            >
              <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 9.365-15.383 4.52-25.836 7.474-15.954 7.203 5.9-.163 15.637-3.51 26.723-7.574 4.207-1.537 8.815-3.47 13.794-5.239 7.982-2.814 17.461-4.516 30.337-5.282 12.803-.759 21.02.354 26.332 2.327 5.312 1.974 7.996 4.955 8.526 8.664.529 3.708-.994 7.982-3.865 11.287-6.913 7.986-20.225 13.235-40.854 16.499l-2.016.331c-5.571.914-11.677 1.908-19.219 3.616-19.459 4.4-46.727 9.498-68.375 13.372C102.982 77.032 47.44 89.22 13.02 94.543c-4.494.698-8.374 1.302-11.64 1.823C-1.234 97.009-.804 97.8.395 97.99c1.2.19 2.657-.196 6.5-.774 3.844-.577 9.1-1.372 15.764-2.386l.74-.115c-7.2 1.127-14.3 2.22-21.4 3.22-5.3.764-10.6 1.532-15.9 2.305C-11.495 100.58-10.6 101.22-.9 99.878l10.7-1.342c65.2-8.187 155-22.81 196.3-31.14l21.3-4.315c37.1-7.493 67.8-15.78 79.3-24.01C316.7 32.72 316.8 24 299.8 17.37c-16.95-6.63-56.7-10.14-96.43-10.45zM8.1 99.76c-2 .314-4 .626-6 .944 2-.314 4-.626 6-.944zm-2.6.41a2074.01 2074.01 0 01-3.4.535c1.1-.178 2.3-.356 3.4-.535zM23.1 97.29c-2.2.348-4.4.694-6.6 1.042 2.2-.348 4.4-.694 6.6-1.042zM15.8 98.47c-1.8.282-3.6.563-5.4.847 1.8-.284 3.6-.565 5.4-.847z" />
            </svg>
          </span>
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-neutral-600">
          Responza AI connects your WhatsApp and Instagram in one inbox — with AI that suggests
          replies, translates messages, and helps you close leads faster.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/auth?mode=register"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-neutral-900 px-8 text-sm font-semibold text-white shadow-md transition-all hover:bg-neutral-800 hover:shadow-lg"
          >
            Start free trial
          </Link>
          <Link
            to="/auth?mode=login"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-neutral-200 bg-white px-8 text-sm font-semibold text-neutral-700 transition-all hover:border-neutral-300 hover:bg-neutral-50"
          >
            Sign in to your account
          </Link>
        </div>

        <p className="mt-4 text-xs text-neutral-500">No credit card required · Free 7-day trial</p>

        <div className="mt-12 flex items-center justify-center gap-6">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-widest">Works with</p>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2 rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-2">
              <img src="/whatsapp.png" alt="WhatsApp" className="h-5 w-5 object-contain" />
              <span className="text-sm font-medium text-neutral-700">WhatsApp</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-2">
              <img src="/instagram.png" alt="Instagram" className="h-5 w-5 object-contain" />
              <span className="text-sm font-medium text-neutral-700">Instagram</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const FEATURES = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: 'Unified Inbox',
    description: 'WhatsApp and Instagram conversations in one place. Switch platforms without switching tabs.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'AI Reply Suggestions',
    description: 'Get smart reply suggestions based on the conversation context. Reply in seconds, not minutes.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
    ),
    title: 'Message Translation',
    description: 'Instantly translate incoming messages into your language. Communicate with customers in any language.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    title: 'Message Rewrite',
    description: 'Polish your replies with AI. Make them more professional, friendly, or concise with one click.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Lead Management',
    description: 'Track every prospect from first message to closed deal. Add notes, update status, and never drop a lead.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Conversation Analytics',
    description: 'Understand your conversations with AI summaries and insights. Know what customers really want.',
  },
]

function FeaturesSection() {
  return (
    <section id="features" className="bg-neutral-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            Everything you need to respond faster
          </h2>
          <p className="mt-4 text-lg text-neutral-600">
            Built for businesses that take customer conversations seriously.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-900 text-white">
                {feature.icon}
              </div>
              <h3 className="mt-5 text-base font-semibold text-neutral-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const STEPS = [
  {
    step: '01',
    title: 'Connect your channels',
    description: 'Link your WhatsApp Business number and Instagram account in under 2 minutes using OAuth and Meta Embedded Signup.',
  },
  {
    step: '02',
    title: 'Receive messages in one inbox',
    description: 'All conversations from both platforms arrive in a single unified inbox, sorted by latest activity.',
  },
  {
    step: '03',
    title: 'Reply with AI assistance',
    description: 'Use AI-suggested replies, translate incoming messages, or rewrite your drafts — then send instantly.',
  },
]

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            Up and running in minutes
          </h2>
          <p className="mt-4 text-lg text-neutral-600">
            No technical setup. No developers needed.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {STEPS.map((item, index) => (
            <div key={item.step} className="relative flex flex-col">
              {index < STEPS.length - 1 && (
                <div className="absolute left-full top-6 hidden w-full -translate-x-1/2 border-t-2 border-dashed border-neutral-200 lg:block" />
              )}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-neutral-900 bg-white text-sm font-bold text-neutral-900">
                {item.step}
              </div>
              <h3 className="mt-5 text-lg font-semibold text-neutral-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const PLANS = [
  {
    key: 'basic',
    label: 'Basic',
    amountInr: 499,
    conversationLimit: 1_000,
    highlight: false,
  },
  {
    key: 'premium',
    label: 'Premium',
    amountInr: 5_000,
    conversationLimit: 2_500,
    highlight: true,
  },
  {
    key: 'scale',
    label: 'Scale',
    amountInr: 10_000,
    conversationLimit: 7_000,
    highlight: false,
  },
  {
    key: 'enterprise',
    label: 'Enterprise',
    amountInr: 20_000,
    conversationLimit: 25_000,
    highlight: false,
  },
]

const PLAN_FEATURES = [
  'Unified WhatsApp + Instagram inbox',
  'AI reply suggestions',
  'Message translation',
  'Message rewrite',
  'Lead management',
  'Conversation analytics',
  '7-day free trial',
]

function formatInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function PricingSection() {
  return (
    <section id="pricing" className="bg-neutral-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            Simple, conversation-based pricing
          </h2>
          <p className="mt-4 text-lg text-neutral-600">
            All plans include every feature. Only conversation volume differs. GST inclusive.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan) => (
            <div
              key={plan.key}
              className={[
                'relative flex flex-col rounded-2xl border p-7 shadow-sm',
                plan.highlight
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-200 bg-white',
              ].join(' ')}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
                    Most popular
                  </span>
                </div>
              )}

              <div>
                <p className={`text-sm font-semibold ${plan.highlight ? 'text-neutral-300' : 'text-neutral-500'}`}>
                  {plan.label}
                </p>
                <p className={`mt-3 text-3xl font-bold ${plan.highlight ? 'text-white' : 'text-neutral-900'}`}>
                  {formatInr(plan.amountInr)}
                  <span className={`text-sm font-medium ${plan.highlight ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    /mo
                  </span>
                </p>
                <p className={`mt-2 text-sm ${plan.highlight ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  {plan.conversationLimit.toLocaleString('en-IN')} conversations / month
                </p>
              </div>

              <ul className="my-7 flex-1 space-y-3">
                {PLAN_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <svg
                      className={`mt-0.5 h-4 w-4 shrink-0 ${plan.highlight ? 'text-emerald-400' : 'text-emerald-500'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className={`text-sm ${plan.highlight ? 'text-neutral-300' : 'text-neutral-600'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                to="/auth?mode=register"
                className={[
                  'inline-flex h-10 items-center justify-center rounded-xl text-sm font-semibold transition-all',
                  plan.highlight
                    ? 'bg-white text-neutral-900 hover:bg-neutral-100'
                    : 'bg-neutral-900 text-white hover:bg-neutral-800',
                ].join(' ')}
              >
                Start free trial
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-neutral-500">
          All plans start with a free 7-day trial. Billed monthly via Razorpay.
        </p>
      </div>
    </section>
  )
}

function CtaSection() {
  return (
    <section className="bg-neutral-900 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Stop juggling apps. Start closing conversations.
        </h2>
        <p className="mt-4 text-lg text-neutral-400">
          Join businesses using Responza AI to respond faster and convert more customers.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/auth?mode=register"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-8 text-sm font-semibold text-neutral-900 shadow-md transition-all hover:bg-neutral-100"
          >
            Start free trial
          </Link>
          <Link
            to="/auth?mode=login"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-neutral-700 px-8 text-sm font-semibold text-neutral-300 transition-all hover:border-neutral-600 hover:text-white"
          >
            Sign in
          </Link>
        </div>
        <p className="mt-4 text-xs text-neutral-500">No credit card required · Cancel anytime</p>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-xs font-bold text-white">
              R
            </div>
            <span className="text-sm font-semibold text-neutral-900">Responza AI</span>
          </div>
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} Responza AI. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link to="/auth?mode=login" className="text-xs text-neutral-500 hover:text-neutral-900">
              Sign in
            </Link>
            <Link to="/auth?mode=register" className="text-xs text-neutral-500 hover:text-neutral-900">
              Get started
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <CtaSection />
      <Footer />
    </div>
  )
}
