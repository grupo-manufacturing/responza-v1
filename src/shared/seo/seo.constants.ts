export const SITE_URL = 'https://www.responza.in'

const SITE_DESCRIPTION =
  'One intelligent inbox for WhatsApp and Instagram. Respond faster with AI suggestions, translation, and analytics in one place.'

type SeoPage = {
  readonly path: string
  readonly title: string
  readonly description: string
  readonly noindex?: boolean
}

export const SEO_PAGES = {
  home: {
    path: '/',
    title: 'Responza AI — Unified inbox for WhatsApp & Instagram',
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
