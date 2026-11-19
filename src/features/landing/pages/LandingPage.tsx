import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { SEO_PAGES } from '@/shared/seo/seo.constants'
import { usePageMeta } from '@/shared/seo/usePageMeta'
import { SiteFooter, SiteHeader } from '@/shared/ui/site-chrome'

import { LandingClosing } from '../components/LandingClosing'
import { LandingFeatures } from '../components/LandingFeatures'
import { LandingHero } from '../components/LandingHero'
import { LandingHowItWorks } from '../components/LandingHowItWorks'
import { LandingPricing } from '../components/LandingPricing'
import { LandingTrust } from '../components/LandingTrust'
import { LandingWatch } from '../components/LandingWatch'

export function LandingPage() {
  const location = useLocation()
  usePageMeta(SEO_PAGES.home)

  useEffect(() => {
    if (!location.hash) return
    const target = document.getElementById(location.hash.slice(1))
    target?.scrollIntoView()
  }, [location.hash])

  return (
    <div className="min-h-screen bg-surface-light">
      <SiteHeader />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingHowItWorks />
        <LandingTrust />
        <LandingWatch />
        <LandingPricing />
        <LandingClosing />
      </main>
      <SiteFooter />
    </div>
  )
}
