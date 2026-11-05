import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { SEO_PAGES } from '@/shared/seo/seo.constants'
import { usePageMeta } from '@/shared/seo/usePageMeta'

import { LandingClosing } from '../components/LandingClosing'
import { LandingFeatures } from '../components/LandingFeatures'
import { LandingHero } from '../components/LandingHero'
import { LandingPricing } from '../components/LandingPricing'
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
      <LandingHero />
      <LandingWatch />
      <LandingFeatures />
      <LandingPricing />
      <LandingClosing />
    </div>
  )
}
