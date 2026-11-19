import { LIVE_CHANNELS, PLAY_STORE_URL, ROADMAP_CHANNELS } from '@/features/landing/constants'
import {
  LandingButton,
  MetaTechProviderBadge,
  PhoneMockup,
  PhoneScreenImage,
  PlayStoreButton,
  Reveal,
  SectionBadge,
  SparkleIcon,
} from '@/shared/ui/brand-ui'

function FloatingChip({
  className,
  children,
  delay = '0s',
}: {
  readonly className: string
  readonly children: React.ReactNode
  readonly delay?: string
}) {
  return (
    <div
      className={`glass-strong animate-float-gentle absolute z-30 hidden items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-xs font-medium text-on-dark shadow-card md:flex ${className}`}
      style={{ animationDelay: delay }}
    >
      {children}
    </div>
  )
}

export function LandingHero() {
  return (
    <>
      <section className="relative overflow-hidden pt-28 sm:pt-32">
        {/* atmosphere */}
        <div className="bg-grid-dark mask-fade-grid pointer-events-none absolute inset-0" aria-hidden />
        <div
          className="animate-aurora pointer-events-none absolute -top-40 left-[8%] h-[34rem] w-[34rem] rounded-full bg-glow-mint/20 blur-[130px]"
          aria-hidden
        />
        <div
          className="animate-aurora pointer-events-none absolute -top-24 right-[4%] h-[30rem] w-[30rem] rounded-full bg-glow-violet/20 blur-[130px]"
          style={{ animationDelay: '-8s' }}
          aria-hidden
        />

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal className="flex flex-col items-center">
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-dark group inline-flex items-center gap-2.5 rounded-[var(--radius-pill)] py-1.5 pr-4 pl-3 text-xs font-medium text-on-dark transition-colors hover:bg-white/10"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping-ring absolute inline-flex h-full w-full rounded-full bg-accent" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Now in open testing on Google Play
              <svg
                className="h-3 w-3 text-on-dark-muted transition-transform group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M9 5l7 7-7 7" />
              </svg>
            </a>

            <h1 className="mt-6 text-[2.2rem] leading-[1.04] min-[400px]:text-[2.5rem] font-semibold tracking-[-0.045em] text-ink sm:text-7xl lg:text-[5rem]">
              Every customer chat.
              <br />
              <span className="text-accent-gradient">One AI inbox.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-xl sm:leading-relaxed">
              Responza brings WhatsApp Business and Instagram into one app, then drafts replies, translates messages
              and summarises chats, so you answer customers in seconds, not hours.
            </p>

            <div className="mt-8 flex w-full max-w-md flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-center">
              <PlayStoreButton href={PLAY_STORE_URL} />
              <LandingButton to="/#features" variant="secondary" size="lg" showChevron>
                See how it works
              </LandingButton>
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
              <MetaTechProviderBadge />
              <p className="text-xs text-ink-faint">Free to try · Billed via Google Play · Cancel anytime</p>
            </div>
          </Reveal>
        </div>

        {/* phone fan */}
        <Reveal delay={150} className="relative mx-auto mt-12 max-w-6xl sm:mt-14">
          <div
            className="pointer-events-none absolute top-[6%] left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-glow-mint/15 blur-[110px] sm:h-[40rem] sm:w-[40rem]"
            aria-hidden
          />
          <div className="mask-fade-b relative mx-auto h-[420px] sm:h-[560px] lg:h-[620px]">
            {/* left */}
            <div
              className="absolute top-[12%] left-1/2 z-10 hidden w-[200px] sm:block md:w-[230px] lg:w-[260px]"
              style={{ transform: 'translateX(calc(-50% - 245px)) rotate(-8deg)' }}
            >
              <PhoneMockup glow="rgb(164 147 255 / 0.35)" className="animate-float-slow">
                <PhoneScreenImage src="/mockups/app-draft.webp" alt="Responza AI draft reply in a WhatsApp chat" />
              </PhoneMockup>
            </div>
            {/* right */}
            <div
              className="absolute top-[12%] left-1/2 z-10 hidden w-[200px] sm:block md:w-[230px] lg:w-[260px]"
              style={{ transform: 'translateX(calc(-50% + 245px)) rotate(8deg)' }}
            >
              <PhoneMockup glow="rgb(98 200 255 / 0.3)" className="animate-float-slow">
                <PhoneScreenImage src="/mockups/app-summary.webp" alt="Responza conversation summary" />
              </PhoneMockup>
            </div>
            {/* center */}
            <div className="absolute top-4 left-1/2 z-20 w-[250px] -translate-x-1/2 sm:w-[290px] lg:w-[320px]">
              <PhoneMockup glow="rgb(52 224 161 / 0.38)" className="animate-float-gentle">
                <PhoneScreenImage
                  src="/mockups/app-inbox.webp"
                  alt="Responza inbox with WhatsApp and Instagram conversations"
                  priority
                />
              </PhoneMockup>
            </div>

            <FloatingChip className="top-[20%] left-[1%] lg:left-[3%]" delay="-1s">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-violet/20 text-accent-violet">
                <SparkleIcon className="h-3.5 w-3.5" />
              </span>
              <span>
                AI draft ready
                <span className="block text-[10px] font-normal text-on-dark-muted">Review, edit, send</span>
              </span>
            </FloatingChip>
            <FloatingChip className="top-[42%] right-[1%] lg:right-[3%]" delay="-3s">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-warm/20 text-[13px] text-accent-warm">
                अ
              </span>
              <span>
                Translated to Hindi
                <span className="block text-[10px] font-normal text-on-dark-muted">One tap, in the chat</span>
              </span>
            </FloatingChip>
            <FloatingChip className="top-[64%] left-[3%] lg:left-[6%]" delay="-5s">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/20 text-accent">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span>
                Chat summarised
                <span className="block text-[10px] font-normal text-on-dark-muted">Caught up in seconds</span>
              </span>
            </FloatingChip>
          </div>
        </Reveal>
      </section>

      <section className="relative border-y border-border-dark bg-surface-dark/60 py-14 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <Reveal>
            <SectionBadge>Channels</SectionBadge>
            <h2 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-ink sm:text-3xl">
              Connect the channels your customers already use.
            </h2>
          </Reveal>

          <Reveal delay={100} className="mt-9 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {LIVE_CHANNELS.map((channel) => (
              <div
                key={channel.platform}
                className="card-surface flex items-center gap-3 rounded-2xl py-3 pr-6 pl-3.5 shadow-soft"
              >
                <img src={channel.logo} alt="" width={36} height={36} className="h-9 w-9 object-contain" aria-hidden />
                <div className="text-left">
                  <p className="text-sm font-medium text-on-dark">{channel.label}</p>
                  <p className="flex items-center gap-1.5 text-[11px] text-accent">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                    Live
                  </p>
                </div>
              </div>
            ))}
          </Reveal>

          <Reveal delay={180} className="mt-8">
            <p className="text-[11px] font-medium tracking-[0.16em] text-ink-faint uppercase">On the roadmap</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
              {ROADMAP_CHANNELS.map((channel) => (
                <div
                  key={channel.platform}
                  className="flex items-center gap-2 rounded-full border border-border-dark bg-ink/[0.03] py-1.5 pr-3.5 pl-2 text-xs text-on-dark-muted"
                >
                  <img
                    src={channel.logo}
                    alt=""
                    width={20}
                    height={20}
                    className="h-5 w-5 rounded-full bg-white object-contain p-0.5 ring-1 ring-border"
                    aria-hidden
                  />
                  {channel.label}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
