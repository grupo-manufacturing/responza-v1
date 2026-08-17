const INTEGRATION_PLATFORMS = ['whatsapp', 'instagram', 'gmail'] as const

export type IntegrationPlatform = (typeof INTEGRATION_PLATFORMS)[number]
export type IntegrationStatus = 'connected' | 'disconnected'

export const INTEGRATION_PLATFORM_LABELS: Record<IntegrationPlatform, string> = {
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  gmail: 'Gmail',
}

export const INTEGRATION_PLATFORM_LOGOS: Record<IntegrationPlatform, string> = {
  whatsapp: '/whatsapp.png',
  instagram: '/instagram.png',
  gmail: '/gmail.png',
}

export function integrationPlatformLogoClass(_platform: IntegrationPlatform): string {
  return 'h-full w-full object-contain'
}

export function integrationPlatformLabel(platform: IntegrationPlatform): string {
  return INTEGRATION_PLATFORM_LABELS[platform]
}

export function integrationStatusLabel(status: IntegrationStatus): string {
  return status === 'connected' ? 'Connected' : 'Disconnected'
}

const COMING_SOON_INTEGRATION_PLATFORMS = [
  'indiamart',
  'tally',
  'tiktok',
  'shopify',
] as const

export type ComingSoonIntegrationPlatform = (typeof COMING_SOON_INTEGRATION_PLATFORMS)[number]

export type ComingSoonIntegration = {
  platform: ComingSoonIntegrationPlatform
  label: string
  logo: string
}

export const COMING_SOON_INTEGRATIONS: ComingSoonIntegration[] = [
  {
    platform: 'indiamart',
    label: 'IndiaMART',
    logo: '/indiamart.png',
  },
  {
    platform: 'tally',
    label: 'Tally',
    logo: '/tally.png',
  },
  {
    platform: 'tiktok',
    label: 'TikTok',
    logo: '/tiktok.png',
  },
  {
    platform: 'shopify',
    label: 'Shopify',
    logo: '/shopify.png',
  },
]

export function comingSoonIntegrationLogoClass(platform: ComingSoonIntegrationPlatform): string {
  if (platform === 'indiamart') {
    return 'h-8 w-auto max-w-full object-contain'
  }

  return 'h-full w-full object-contain'
}
