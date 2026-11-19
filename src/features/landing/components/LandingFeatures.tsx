import { useEffect, useRef, useState } from 'react'

import { LANDING_FEATURES, SHOWCASE_GLOW } from '@/features/landing/constants'
import {
  CheckIcon,
  PhoneMockup,
  PhoneScreenImage,
  Reveal,
  SectionBadge,
  type BadgeTone,
} from '@/shared/ui/brand-ui'

const TONE_TO_BADGE: Record<(typeof LANDING_FEATURES)[number]['tone'], BadgeTone> = {
  mint: 'mint',
  violet: 'violet',
  amber: 'amber',
  sky: 'sky',
}

const TONE_TO_TEXT: Record<(typeof LANDING_FEATURES)[number]['tone'], string> = {
  mint: 'text-accent',
  violet: 'text-accent-violet',
  amber: 'text-accent-warm',
  sky: 'text-accent-sky',
}

const TONE_TO_ORB: Record<(typeof LANDING_FEATURES)[number]['tone'], string> = {
  mint: 'bg-glow-mint/25',
  violet: 'bg-glow-violet/30',
  amber: 'bg-glow-amber/25',
  sky: 'bg-glow-sky/25',
}

export function LandingFeatures() {
  const [active, setActive] = useState(0)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const nodes = stepRefs.current.filter((node): node is HTMLDivElement => node !== null)
    if (nodes.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset.index)
            if (!Number.isNaN(index)) setActive(index)
          }
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  const current = LANDING_FEATURES[active] ?? LANDING_FEATURES[0]

  return (
    <section id="features" className="relative scroll-mt-16 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <SectionBadge tone="mint">Features</SectionBadge>
          <h2 className="mt-5 text-3xl leading-[1.08] font-semibold tracking-[-0.035em] text-ink sm:text-5xl">
            Everything you need to <span className="text-accent-gradient">answer faster.</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink-muted sm:text-lg">
            Built around how small businesses actually sell: lots of chats, on a phone, between everything else.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-x-16 lg:mt-24 lg:grid-cols-2">
          {/* copy column */}
          <div>
            {LANDING_FEATURES.map((feature, index) => (
              <div
                key={feature.id}
                ref={(node) => {
                  stepRefs.current[index] = node
                }}
                data-index={index}
                className="flex flex-col justify-center py-10 lg:min-h-[78vh] lg:py-16"
              >
                <div
                  className={[
                    'transition-all duration-500 lg:max-w-md',
                    active === index ? 'lg:translate-x-0 lg:opacity-100' : 'lg:-translate-x-1 lg:opacity-35',
                  ].join(' ')}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-semibold tabular-nums ${TONE_TO_TEXT[feature.tone]}`}>
                      0{index + 1}
                    </span>
                    <SectionBadge tone={TONE_TO_BADGE[feature.tone]}>{feature.eyebrow}</SectionBadge>
                  </div>
                  <h3 className="mt-5 text-3xl leading-[1.1] font-semibold tracking-[-0.03em] text-ink sm:text-4xl">
                    {feature.title}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">{feature.description}</p>
                  <ul className="mt-6 space-y-3">
                    {feature.points.map((point) => (
                      <li key={point} className="flex items-center gap-3 text-sm text-on-dark">
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink/[0.06] ${TONE_TO_TEXT[feature.tone]}`}
                        >
                          <CheckIcon className="h-3 w-3" />
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* mobile phone */}
                <div className="relative mx-auto mt-12 w-[230px] sm:w-[260px] lg:hidden">
                  <div
                    className={`pointer-events-none absolute top-1/4 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full blur-[90px] ${TONE_TO_ORB[feature.tone]}`}
                    aria-hidden
                  />
                  <PhoneMockup glow={SHOWCASE_GLOW[feature.tone]}>
                    <PhoneScreenImage src={feature.screen} alt={feature.alt} />
                  </PhoneMockup>
                </div>
              </div>
            ))}
          </div>

          {/* sticky phone */}
          <div className="relative hidden lg:block">
            <div className="sticky top-0 flex h-screen items-center justify-center">
              <div className="relative w-[282px]">
                {LANDING_FEATURES.map((feature, index) => (
                  <div
                    key={feature.id}
                    className={`pointer-events-none absolute top-1/2 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px] transition-opacity duration-700 ${TONE_TO_ORB[feature.tone]} ${active === index ? 'opacity-100' : 'opacity-0'}`}
                    aria-hidden
                  />
                ))}
                <PhoneMockup glow={SHOWCASE_GLOW[current.tone]}>
                  {LANDING_FEATURES.map((feature, index) => (
                    <div
                      key={feature.id}
                      className={`absolute inset-0 transition-all duration-700 ease-out ${active === index ? 'scale-100 opacity-100' : 'scale-[1.03] opacity-0'}`}
                      aria-hidden={active !== index}
                    >
                      <PhoneScreenImage src={feature.screen} alt={feature.alt} priority={index === 0} />
                    </div>
                  ))}
                </PhoneMockup>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
