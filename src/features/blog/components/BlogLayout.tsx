import { Link } from 'react-router-dom'

import { BLOG_INDEX_SEO } from '@/features/blog/blog.posts'
import { LEGAL_FOOTER_LINKS } from '@/features/landing/legal.constants'
import { LandingButton, LandingLogo } from '@/shared/ui/brand-ui'

export function BlogLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface-light">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <LandingLogo variant="light" />
          <nav className="flex items-center gap-4 sm:gap-6">
            <Link
              to={BLOG_INDEX_SEO.path}
              className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
            >
              Blog
            </Link>
            <Link to="/" className="hidden text-sm font-medium text-ink-muted transition-colors hover:text-ink sm:inline">
              Home
            </Link>
            <LandingButton to="/auth?mode=register" variant="primary" className="px-4">
              Try free
            </LandingButton>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-white py-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-6">
          <p className="text-xs text-ink-faint">© {new Date().getFullYear()} Responza AI. All rights reserved.</p>
          <nav className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
            <Link to="/" className="text-ink-muted transition-colors hover:text-ink">
              Home
            </Link>
            <Link to={BLOG_INDEX_SEO.path} className="text-ink-muted transition-colors hover:text-ink">
              Blog
            </Link>
            {LEGAL_FOOTER_LINKS.map((link) => (
              <Link key={link.to} to={link.to} className="text-ink-muted transition-colors hover:text-ink">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  )
}
