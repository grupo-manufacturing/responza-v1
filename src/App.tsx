import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { RouterProvider } from 'react-router-dom'

import { router } from '@/app/router'
import { CloudflareWebAnalytics } from '@/shared/analytics/CloudflareWebAnalytics'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
})

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Analytics />
      <SpeedInsights />
      <CloudflareWebAnalytics />
    </QueryClientProvider>
  )
}
