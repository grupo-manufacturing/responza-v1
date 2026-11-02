import { StrictMode } from 'react'
import { prerender } from 'react-dom/static'
import { StaticRouterProvider, createStaticHandler, createStaticRouter, type RouteObject } from 'react-router-dom'

import { AppProviders } from './App'
import { publicRoutes } from '@/app/router/publicRoutes'
import { RouteErrorElement } from '@/app/router/RouteErrorElement'
import { SEO_PAGES, SITE_URL } from '@/shared/seo/seo.constants'
import { getStructuredData } from '@/shared/seo/structuredData'

export { SITE_URL, getStructuredData }
export const PRERENDER_PAGES = Object.values(SEO_PAGES)

const routes: RouteObject[] = [{ errorElement: <RouteErrorElement />, children: publicRoutes }]

export async function render(path: string): Promise<string> {
  const handler = createStaticHandler(routes)
  const context = await handler.query(new Request(new URL(path, SITE_URL)))
  if (context instanceof Response) {
    throw new Error(`Prerender of ${path} returned a ${context.status} response`)
  }

  const router = createStaticRouter(handler.dataRoutes, context)
  const { prelude } = await prerender(
    <StrictMode>
      <AppProviders>
        <StaticRouterProvider router={router} context={context} hydrate={false} />
      </AppProviders>
    </StrictMode>,
  )
  return new Response(prelude).text()
}
