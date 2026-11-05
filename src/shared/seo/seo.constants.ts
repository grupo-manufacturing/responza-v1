export const SITE_URL = 'https://responza.in'

const SITE_DESCRIPTION =
  'Responza is the upcoming mobile app that puts your WhatsApp and Instagram business chats in one inbox, with AI replies and translation. Join the waitlist.'

export type SeoPage = {
  readonly path: string
  readonly title: string
  readonly description: string
  readonly noindex?: boolean
  /** YYYY-MM-DD; written to sitemap.xml. Required for every indexable page. */
  readonly lastModified?: string
  readonly ogType?: 'website' | 'article'
}

export const SEO_PAGES = {
  home: {
    path: '/',
    title: 'WhatsApp & Instagram Inbox App, Coming Soon | Responza AI',
    description: SITE_DESCRIPTION,
    lastModified: '2026-11-04',
  },
  privacy: {
    path: '/privacy-policy',
    title: 'Privacy Policy | Responza AI',
    description:
      'How Responza AI, operated by Grupo Technologies Private Limited, collects, uses and protects your personal data and business conversations.',
    lastModified: '2026-07-15',
  },
  terms: {
    path: '/terms-conditions',
    title: 'Terms & Conditions | Responza AI',
    description:
      'The terms and conditions that govern your use of Responza AI, including accounts, subscriptions, acceptable use and data handling.',
    lastModified: '2026-07-15',
  },
  /** Prerendered to dist/404.html, which Vercel serves with a 404 status for unknown URLs. */
  notFound: {
    path: '/404',
    title: 'Page not found | Responza AI',
    description: 'The page you are looking for does not exist.',
    noindex: true,
  },
} as const satisfies Record<string, SeoPage>
