import { Link } from 'react-router-dom'

import { BLOG_INDEX_SEO, BLOG_POSTS, blogPostPath, formatBlogDate } from '@/features/blog/blog.posts'
import { BlogLayout } from '@/features/blog/components/BlogLayout'
import { usePageMeta } from '@/shared/seo/usePageMeta'

export function BlogIndexPage() {
  usePageMeta(BLOG_INDEX_SEO)

  return (
    <BlogLayout>
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-xs font-medium tracking-wide text-accent uppercase">Responza Blog</p>
        <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight text-ink sm:text-[2.5rem] sm:leading-tight">
          WhatsApp and Instagram tips for Indian businesses
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
          Practical guides on replying to customers faster, keeping WhatsApp and Instagram under control, and
          serving customers in the languages they actually write in.
        </p>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2">
          {BLOG_POSTS.map((post) => (
            <li key={post.slug}>
              <article className="group flex h-full flex-col rounded-2xl border border-border bg-white p-6 transition-shadow hover:shadow-card">
                <p className="text-xs text-ink-faint">
                  <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time> · {post.readingMinutes} min
                  read
                </p>
                <h2 className="mt-3 text-lg font-semibold leading-snug text-ink group-hover:text-accent">
                  <Link to={blogPostPath(post.slug)}>{post.title}</Link>
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">{post.excerpt}</p>
                <Link
                  to={blogPostPath(post.slug)}
                  className="mt-5 text-sm font-medium text-accent"
                  aria-label={`Read: ${post.title}`}
                >
                  Read article
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </BlogLayout>
  )
}
