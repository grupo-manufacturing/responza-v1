export const INTEGRATION_PLATFORMS = ['whatsapp', 'instagram', 'indiamart'] as const

export type IntegrationPlatform = (typeof INTEGRATION_PLATFORMS)[number]
export type IntegrationStatus = 'connected' | 'disconnected'

export const INTEGRATION_PLATFORM_LABELS: Record<IntegrationPlatform, string> = {
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  indiamart: 'IndiaMART',
}

export const INTEGRATION_PLATFORM_LOGOS: Record<IntegrationPlatform, string> = {
  whatsapp: '/whatsapp.svg',
  instagram: '/instagram.svg',
  indiamart: '/indiamart.svg',
}

export const INTEGRATION_PLATFORM_DESCRIPTIONS: Record<IntegrationPlatform, string> = {
  whatsapp: 'Use Meta Embedded Signup to connect your WhatsApp Business number for inbox messaging.',
  instagram: 'Connect Instagram Direct to manage conversations in one place.',
  indiamart: 'Connect IndiaMART to capture buyer inquiries from your listings.',
}

export function integrationPlatformLabel(platform: IntegrationPlatform): string {
  return INTEGRATION_PLATFORM_LABELS[platform]
}

export function integrationStatusLabel(status: IntegrationStatus): string {
  return status === 'connected' ? 'Connected' : 'Disconnected'
}
