import type { ReactNode } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'

/** Shared by the browser entry and the build-time prerender, so both produce the same tree for hydration. */
export function AppProviders({ children }: { readonly children: ReactNode }) {
  return (
    <>
      {children}
      <Analytics />
      <SpeedInsights />
    </>
  )
}
