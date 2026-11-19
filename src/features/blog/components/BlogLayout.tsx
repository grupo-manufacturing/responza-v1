import { SiteFooter, SiteHeader } from '@/shared/ui/site-chrome'

export function BlogLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface-light">
      <SiteHeader />
      <main className="flex-1 pt-20 sm:pt-24">{children}</main>
      <SiteFooter />
    </div>
  )
}
