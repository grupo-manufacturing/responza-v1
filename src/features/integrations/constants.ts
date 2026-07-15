const INTEGRATION_PLATFORMS = ['whatsapp', 'instagram'] as const

export type IntegrationPlatform = (typeof INTEGRATION_PLATFORMS)[number]
export type IntegrationStatus = 'connected' | 'disconnected'

export const INTEGRATION_PLATFORM_LABELS: Record<IntegrationPlatform, string> = {
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
}

export const INTEGRATION_PLATFORM_LOGOS: Record<IntegrationPlatform, string> = {
  whatsapp: '/whatsapp.png',
  instagram: '/instagram.png',
}

export function integrationPlatformLogoClass(_platform: IntegrationPlatform): string {
  return 'h-full w-full object-contain'
}

export const INTEGRATION_PLATFORM_DESCRIPTIONS: Record<IntegrationPlatform, string> = {
  whatsapp: 'Use Meta Embedded Signup to connect your WhatsApp Business number for inbox messaging.',
  instagram: 'Connect Instagram Direct to manage conversations in one place.',
}

export function integrationPlatformLabel(platform: IntegrationPlatform): string {
  return INTEGRATION_PLATFORM_LABELS[platform]
}

export function integrationStatusLabel(status: IntegrationStatus): string {
  return status === 'connected' ? 'Connected' : 'Disconnected'
}

const COMING_SOON_INTEGRATION_PLATFORMS = [
  'indiamart',
  'gmail',
  'tally',
  'tiktok',
  'shopify',
] as const

export type ComingSoonIntegrationPlatform = (typeof COMING_SOON_INTEGRATION_PLATFORMS)[number]

export type ComingSoonIntegration = {
  platform: ComingSoonIntegrationPlatform
  label: string
  logo: string
  description: string
}

export const COMING_SOON_INTEGRATIONS: ComingSoonIntegration[] = [
  {
    platform: 'indiamart',
    label: 'IndiaMART',
    logo: '/indiamart.png',
    description: 'Connect IndiaMART leads and inquiries directly in your inbox.',
  },
  {
    platform: 'gmail',
    label: 'Gmail',
    logo: '/gmail.png',
    description: 'Manage customer email conversations alongside your messaging channels.',
  },
  {
    platform: 'tally',
    label: 'Tally',
    logo: '/tally.png',
    description: 'Sync invoices and customer records with your Tally account.',
  },
  {
    platform: 'tiktok',
    label: 'TikTok',
    logo: '/tiktok.png',
    description: 'Reply to TikTok Direct messages from your unified inbox.',
  },
  {
    platform: 'shopify',
    label: 'Shopify',
    logo: '/shopify.png',
    description: 'Connect your Shopify store to track orders and customer conversations.',
  },
]

export function comingSoonIntegrationLogoClass(platform: ComingSoonIntegrationPlatform): string {
  if (platform === 'indiamart') {
    return 'h-8 w-auto max-w-full object-contain'
  }

  return 'h-full w-full object-contain'
}
