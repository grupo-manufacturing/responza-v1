import {
  BLOG_INDEX_SEO,
  BLOG_POSTS,
  blogPostPath,
  findBlogPostByPath,
  type BlogFaq,
  type BlogPost,
} from '@/features/blog/blog.posts'
import { LANDING_FAQS, PRICING_PLANS } from '@/features/landing/constants'
import { SEO_PAGES, SITE_URL } from '@/shared/seo/seo.constants'

const ORGANIZATION_ID = `${SITE_URL}/#organization`
const BLOG_ID = `${SITE_URL}/blog#blog`
const INDIA = { '@type': 'Country', name: 'India' } as const

type JsonLd = Record<string, unknown>

function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).href
}

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

/** Must mirror the FAQs rendered on the page (LandingClosing, BlogPostPage). */
function faqPage(faqs: readonly BlogFaq[]): JsonLd {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  }
}

function blog(): JsonLd {
  return {
    '@type': 'Blog',
    '@id': BLOG_ID,
    name: 'Responza Blog',
    description: BLOG_INDEX_SEO.description,
    url: absoluteUrl(BLOG_INDEX_SEO.path),
    inLanguage: 'en-IN',
    publisher: { '@id': ORGANIZATION_ID },
    blogPost: BLOG_POSTS.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: absoluteUrl(blogPostPath(post.slug)),
      datePublished: post.publishedAt,
    })),
  }
}

function blogPosting(post: BlogPost): JsonLd {
  const url = absoluteUrl(blogPostPath(post.slug))
  return {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: post.title,
    description: post.description,
    url,
    mainEntityOfPage: url,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    inLanguage: 'en-IN',
    image: `${SITE_URL}/og-image.jpg`,
    author: { '@type': 'Organization', name: 'Responza AI', url: `${SITE_URL}/` },
    publisher: { '@id': ORGANIZATION_ID },
    isPartOf: { '@id': BLOG_ID },
  }
}

function breadcrumbs(items: readonly { name: string; path: string }[]): JsonLd {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

function graph(nodes: JsonLd[]): JsonLd {
  return { '@context': 'https://schema.org', '@graph': nodes }
}

export function getStructuredData(path: string): JsonLd | null {
  if (path === SEO_PAGES.home.path) {
    return graph([organization(), softwareApplication(), faqPage(LANDING_FAQS)])
  }
  if (path === BLOG_INDEX_SEO.path) {
    return graph([
      organization(),
      blog(),
      breadcrumbs([
        { name: 'Home', path: SEO_PAGES.home.path },
        { name: 'Blog', path: BLOG_INDEX_SEO.path },
      ]),
    ])
  }
  const post = findBlogPostByPath(path)
  if (post !== undefined) {
    return graph([
      organization(),
      blogPosting(post),
      faqPage(post.faqs),
      breadcrumbs([
        { name: 'Home', path: SEO_PAGES.home.path },
        { name: 'Blog', path: BLOG_INDEX_SEO.path },
        { name: post.title, path: blogPostPath(post.slug) },
      ]),
    ])
  }
  return null
}
