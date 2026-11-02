export const SITE_URL = 'https://www.responza.in'

const SITE_DESCRIPTION =
  'One intelligent inbox for WhatsApp and Instagram. Respond faster with AI suggestions, translation, and analytics in one place.'

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
} as const
