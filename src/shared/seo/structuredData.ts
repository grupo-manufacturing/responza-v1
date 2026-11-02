import { LANDING_FAQS, PRICING_PLANS } from '@/features/landing/constants'
import { SEO_PAGES, SITE_URL } from '@/shared/seo/seo.constants'

const ORGANIZATION_ID = `${SITE_URL}/#organization`
const INDIA = { '@type': 'Country', name: 'India' } as const

type JsonLd = Record<string, unknown>

function organization(): JsonLd {
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: 'Responza AI',
    legalName: 'Grupo Technologies Private Limited',
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/logo.png`,
    email: 'contact@responza.in',
    areaServed: INDIA,
  }
}

function softwareApplication(): JsonLd {
  return {
    '@type': 'SoftwareApplication',
    name: 'Responza AI',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: `${SITE_URL}/`,
    description: SEO_PAGES.home.description,
    publisher: { '@id': ORGANIZATION_ID },
    offers: PRICING_PLANS.map((plan) => ({
      '@type': 'Offer',
      name: plan.label,
      description: plan.description,
      price: plan.amountInr.toFixed(2),
      priceCurrency: 'INR',
      eligibleRegion: INDIA,
      url: `${SITE_URL}/#pricing`,
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: plan.amountInr.toFixed(2),
        priceCurrency: 'INR',
        billingDuration: plan.interval === 'monthly' ? 'P1M' : 'P1Y',
        valueAddedTaxIncluded: true,
      },
    })),
  }
}

/** Must mirror the FAQ section rendered on the landing page (LandingClosing). */
function faqPage(): JsonLd {
  return {
    '@type': 'FAQPage',
    mainEntity: LANDING_FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  }
}

export function getStructuredData(path: string): JsonLd | null {
  if (path !== SEO_PAGES.home.path) return null
  return {
    '@context': 'https://schema.org',
    '@graph': [organization(), softwareApplication(), faqPage()],
  }
}
