import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import '@/styles/tailwind.css'
import { AppProviders } from './App'
import { router } from '@/app/router'
import { initGoogleAnalytics } from '@/shared/analytics/googleAnalytics'

initGoogleAnalytics()

const container = document.getElementById('root')!

const app = (
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>
)

function normalizePath(path: string): string {
  return path.length > 1 ? path.replace(/\/+$/, '') : path
}

const prerenderedPath = container.dataset.prerendered
if (prerenderedPath !== undefined && normalizePath(prerenderedPath) === normalizePath(window.location.pathname)) {
  hydrateRoot(container, app)
} else {
  container.replaceChildren()
  createRoot(container).render(app)
}
