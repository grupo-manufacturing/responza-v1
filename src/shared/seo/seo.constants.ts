export const SITE_URL = 'https://www.responza.in'

const SITE_DESCRIPTION =
  'AI-powered WhatsApp & Instagram inbox for Indian businesses. AI draft replies, translation and analytics in one workspace. Plans from ₹499/month.'

type SeoPage = {
  readonly path: string
  readonly title: string
  readonly description: string
  readonly noindex?: boolean
}

export const SEO_PAGES = {
  home: {
    path: '/',
    title: 'AI-powered WhatsApp & Instagram inbox — Responza AI',
    description: SITE_DESCRIPTION,
  },
  privacy: {
    path: '/privacy-policy',
    title: 'Privacy Policy — Responza AI',
    description: 'Privacy Policy for Responza AI, operated by Grupo Technologies Private Limited.',
  },
  terms: {
    path: '/terms-conditions',
    title: 'Terms & Conditions — Responza AI',
    description: 'Terms and Conditions for using the Responza AI messaging platform.',
  },
  /** Prerendered to dist/404.html, which Vercel serves with a 404 status for unknown URLs. */
  notFound: {
    path: '/404',
    title: 'Page not found — Responza AI',
    description: 'The page you are looking for does not exist.',
    noindex: true,
  },
} as const satisfies Record<string, SeoPage>
