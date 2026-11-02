import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'

import { ToastProvider } from '@/shared/ui/toast'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
})

/** Shared by the browser entry and the build-time prerender, so both produce the same tree for hydration. */
export function AppProviders({ children }: { readonly children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>{children}</ToastProvider>
      <Analytics />
      <SpeedInsights />
    </QueryClientProvider>
  )
}
