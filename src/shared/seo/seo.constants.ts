export const SITE_URL = 'https://www.responza.in'

const SITE_DESCRIPTION =
  'One workspace, every channel. Manage WhatsApp and Instagram for your Indian business, with AI draft replies, translation and analytics. Plans from ₹499/month.'

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
    title: 'WhatsApp & Instagram in One Workspace | Responza AI',
    description: SITE_DESCRIPTION,
    lastModified: '2026-11-02',
  },
  privacy: {
    path: '/privacy-policy',
    title: 'Privacy Policy | Responza AI',
    description: 'Privacy Policy for Responza AI, operated by Grupo Technologies Private Limited.',
    lastModified: '2026-07-15',
  },
  terms: {
    path: '/terms-conditions',
    title: 'Terms & Conditions | Responza AI',
    description: 'Terms and Conditions for using the Responza AI messaging platform.',
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
