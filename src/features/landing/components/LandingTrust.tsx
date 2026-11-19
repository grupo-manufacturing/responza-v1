import { TRUST_POINTS } from '@/features/landing/constants'
import { Reveal, SectionHeading } from '@/shared/ui/brand-ui'

type TrustId = (typeof TRUST_POINTS)[number]['id']

const ICON_PATHS: Record<Exclude<TrustId, 'meta'>, string> = {
  control: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  voice: 'M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.12 2.99 2.7 3.2 1.1.14 2.2.25 3.3.31v3.98l3.7-3.7a.9.9 0 01.6-.26c1.5-.04 2.97-.16 4.4-.39 1.58-.21 2.7-1.6 2.7-3.2V6.74c0-1.6-1.12-2.99-2.7-3.2A48.4 48.4 0 0012 3.25c-2.5 0-4.97.18-7.4.5-1.58.2-2.7 1.6-2.7 3.2v6.02z',
  secure: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z',
  notifications: 'M14.86 17.08a24 24 0 005.45-1.31A8.97 8.97 0 0118 9.75V9A6 6 0 006 9v.75a8.97 8.97 0 01-2.31 6.02 24 24 0 005.45 1.31m5.72 0a24 24 0 01-5.72 0m5.72 0a3 3 0 11-5.72 0',
  delete: 'M14.74 9l-.35 9m-4.78 0L9.26 9m9.97-3.21c.34.05.68.11 1.02.17m-1.02-.17L18.16 19.67a2.25 2.25 0 01-2.24 2.08H8.08a2.25 2.25 0 01-2.24-2.08L4.77 5.79m14.46 0a48 48 0 00-3.48-.4m-12 .57c.34-.06.68-.12 1.02-.17m0 0a48 48 0 013.48-.4m7.5 0v-.92c0-1.18-.91-2.16-2.09-2.2a52 52 0 00-3.32 0c-1.18.04-2.09 1.02-2.09 2.2v.92m7.5 0a48.7 48.7 0 00-7.5 0',
}

function TrustIcon({ id }: { readonly id: TrustId }) {
  if (id === 'meta') {
    return <img src="/meta-icon.webp" alt="" width={22} height={22} className="h-[22px] w-[22px] object-contain" aria-hidden />
  }
  return (
    <svg className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d={ICON_PATHS[id]} />
    </svg>
  )
}

export function LandingTrust() {
  return (
    <section id="trust" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Built to be trusted"
          tone="violet"
          title={
            <>
              AI that helps, <span className="text-accent-gradient">never takes over.</span>
            </>
          }
          description="Your customers, your words. Responza does the legwork, you make the call."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TRUST_POINTS.map((point, index) => (
            <Reveal key={point.id} delay={(index % 3) * 90}>
              <div className="card-surface hover-lift group h-full rounded-[var(--radius-card)] p-6 sm:p-7">
                <div
                  className={[
                    'flex h-11 w-11 items-center justify-center rounded-xl border',
                    point.id === 'meta'
                      ? 'border-border-strong bg-white'
                      : 'border-border-strong bg-ink/[0.04] text-accent transition-colors group-hover:border-accent/40 group-hover:bg-accent/10',
                  ].join(' ')}
                >
                  <TrustIcon id={point.id} />
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight text-ink">{point.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted sm:text-[15px]">{point.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
