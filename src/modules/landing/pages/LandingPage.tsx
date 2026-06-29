import { LandingClosing } from '../components/LandingClosing'
import { LandingFeatures } from '../components/LandingFeatures'
import { LandingHero } from '../components/LandingHero'
import { LandingPricing } from '../components/LandingPricing'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-light">
      <LandingHero />
      <LandingFeatures />
      <LandingPricing />
      <LandingClosing />
    </div>
  )
}
