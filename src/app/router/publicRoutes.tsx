import type { RouteObject } from 'react-router-dom'

import { BLOG_INDEX_SEO, BLOG_POSTS, blogPostPath } from '@/features/blog/blog.posts'
import { NotFoundPage } from '@/features/landing/pages/NotFoundPage'
import { SEO_PAGES } from '@/shared/seo/seo.constants'
import { PageSuspense } from '@/shared/ui/primitives/Spinner'
import { lazyWithRetry } from '@/shared/utils/lazyWithRetry'

const LandingPage = lazyWithRetry(() =>
  import('@/features/landing/pages/LandingPage').then((m) => ({ default: m.LandingPage })),
)
const PrivacyPolicyPage = lazyWithRetry(() =>
  import('@/features/landing/pages/PrivacyPolicyPage').then((m) => ({ default: m.PrivacyPolicyPage })),
)
const TermsPage = lazyWithRetry(() =>
  import('@/features/landing/pages/TermsPage').then((m) => ({ default: m.TermsPage })),
)
const BlogIndexPage = lazyWithRetry(() =>
  import('@/features/blog/pages/BlogIndexPage').then((m) => ({ default: m.BlogIndexPage })),
)
const BlogPostPage = lazyWithRetry(() =>
  import('@/features/blog/pages/BlogPostPage').then((m) => ({ default: m.BlogPostPage })),
)

/** Pre-rendered to static HTML at build time (see scripts/prerender.mjs), so they must stay SSR-safe. */
export const publicRoutes: RouteObject[] = [
  {
    path: SEO_PAGES.home.path,
    element: (
      <PageSuspense>
        <LandingPage />
      </PageSuspense>
    ),
  },
  {
    path: SEO_PAGES.privacy.path,
    element: (
      <PageSuspense>
        <PrivacyPolicyPage />
      </PageSuspense>
    ),
  },
  {
    path: SEO_PAGES.terms.path,
    element: (
      <PageSuspense>
        <TermsPage />
      </PageSuspense>
    ),
  },
  {
    path: BLOG_INDEX_SEO.path,
    element: (
      <PageSuspense>
        <BlogIndexPage />
      </PageSuspense>
    ),
  },
  ...BLOG_POSTS.map((post) => ({
    path: blogPostPath(post.slug),
    element: (
      <PageSuspense>
        <BlogPostPage />
      </PageSuspense>
    ),
  })),
  { path: '*', element: <NotFoundPage /> },
]
