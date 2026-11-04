import type { ComponentType } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { Article as HowFastToReply } from '@/features/blog/articles/HowFastToReply'
import { Article as ManageWhatsappInstagramOnePlace } from '@/features/blog/articles/ManageWhatsappInstagramOnePlace'
import { Article as MultilingualCustomerChats } from '@/features/blog/articles/MultilingualCustomerChats'
import { Article as WhatsappBusinessAppVsDedicatedInbox } from '@/features/blog/articles/WhatsappBusinessAppVsDedicatedInbox'

import {
  BLOG_INDEX_SEO,
  BLOG_POSTS,
  blogPostPath,
  blogPostSeo,
  findBlogPostByPath,
  formatBlogDate,
  type BlogPost,
  type BlogSlug,
} from '@/features/blog/blog.posts'
import { BlogLayout } from '@/features/blog/components/BlogLayout'
import { NotFoundPage } from '@/features/landing/pages/NotFoundPage'
import { usePageMeta } from '@/shared/seo/usePageMeta'
/** Imported eagerly: a nested lazy() here would make the prerender emit the body out of order behind a script. */
const ARTICLE_BODIES: Record<BlogSlug, ComponentType> = {
  'manage-whatsapp-instagram-messages-one-place': ManageWhatsappInstagramOnePlace,
  'whatsapp-business-app-vs-dedicated-inbox': WhatsappBusinessAppVsDedicatedInbox,
  'how-fast-should-business-reply-whatsapp-instagram': HowFastToReply,
  'reply-to-customers-in-indian-languages-whatsapp-instagram': MultilingualCustomerChats,
}

export function BlogPostPage() {
  const { pathname } = useLocation()
  const post = findBlogPostByPath(pathname.replace(/\/+$/, ''))
  if (post === undefined) return <NotFoundPage />
  return <BlogPostContent post={post} />
}

function BlogPostContent({ post }: { readonly post: BlogPost }) {
  usePageMeta(blogPostSeo(post))
  const Body = ARTICLE_BODIES[post.slug]
  const morePosts = BLOG_POSTS.filter((other) => other.slug !== post.slug)

  return (
    <BlogLayout>
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <nav aria-label="Breadcrumb" className="text-xs text-ink-faint">
          <Link to="/" className="hover:text-ink">
            Home
          </Link>
          <span className="mx-2" aria-hidden>
            /
          </span>
          <Link to={BLOG_INDEX_SEO.path} className="hover:text-ink">
            Blog
          </Link>
        </nav>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-[2.5rem] sm:leading-tight">
          {post.title}
        </h1>
        <p className="mt-4 text-sm text-ink-muted">
          By Responza Team · <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time> ·{' '}
          {post.readingMinutes} min read
        </p>

        <div className="mt-10 space-y-5">
          <Body />
        </div>

        <section className="mt-14 border-t border-border pt-10" aria-labelledby="article-faqs">
          <h2 id="article-faqs" className="text-2xl font-semibold tracking-tight text-ink">
            Frequently asked questions
          </h2>
          <dl className="mt-6 space-y-6">
            {post.faqs.map((faq) => (
              <div key={faq.q}>
                <dt className="text-base font-semibold text-ink">{faq.q}</dt>
                <dd className="mt-2 text-base leading-relaxed text-ink-muted">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <aside className="mt-14 rounded-2xl bg-surface-dark px-6 py-8 text-center sm:px-10">
          <p className="text-xl font-semibold text-on-dark">WhatsApp and Instagram, in one workspace</p>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-on-dark-muted">
            AI draft replies you approve, in-chat translation and a dashboard that shows who is waiting. Try
            Responza free for 3 days, no credit card needed.
          </p>
        </aside>
      </article>

      <section className="border-t border-border bg-surface-muted py-12" aria-labelledby="more-articles">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 id="more-articles" className="text-lg font-semibold text-ink">
            More from the blog
          </h2>
          <ul className="mt-4 space-y-3">
            {morePosts.map((other) => (
              <li key={other.slug}>
                <Link to={blogPostPath(other.slug)} className="text-base text-accent hover:underline">
                  {other.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </BlogLayout>
  )
}
