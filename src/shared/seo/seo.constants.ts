export const SITE_URL = 'https://responza.in'

const SITE_DESCRIPTION =
  'Responza puts WhatsApp Business and Instagram DMs in one AI inbox. Draft replies, translate and summarise chats in seconds. Join the open test on Google Play.'

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
    title: 'Responza AI: WhatsApp & Instagram Inbox | Open Testing',
    description: SITE_DESCRIPTION,
    lastModified: '2026-11-19',
  },
  privacy: {
    path: '/privacy-policy',
    title: 'Privacy Policy | Responza AI',
    description:
      'How Grupo Technologies Private Limited collects, uses and protects Responza account, conversation and subscription data for the Android app and website.',
    lastModified: '2026-11-16',
  },
  terms: {
    path: '/terms-conditions',
    title: 'Terms & Conditions | Responza AI',
    description:
      'Terms for using the Responza Android app and website, including accounts, WhatsApp and Instagram channels, AI features and Google Play billing.',
    lastModified: '2026-11-16',
  },
  deleteAccount: {
    path: '/delete-account',
    title: 'Delete Your Account | Responza AI',
    description:
      'How to delete your Responza account via the app or by emailing contact@responza.in, and how that differs from cancelling Google Play billing.',
    lastModified: '2026-11-16',
  },
  childSafety: {
    path: '/child-safety',
    title: 'Child Safety Standards | Responza AI',
    description:
      'Responza child safety standards against CSAE and CSAM, including how to report concerns to contact@responza.in for Google Play compliance.',
    lastModified: '2026-11-16',
  },
  /** Prerendered to dist/404.html, which Vercel serves with a 404 status for unknown URLs. */
  notFound: {
    path: '/404',
    title: 'Page not found | Responza AI',
    description: 'The page you are looking for does not exist.',
    noindex: true,
  },
  waitlistAdmin: {
    path: '/admin/waitlist',
    title: 'Waitlist Admin | Responza',
    description: 'Private waitlist signup list for Responza operators.',
    noindex: true,
  },
} as const satisfies Record<string, SeoPage>
