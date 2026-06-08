export type IntegrationPlatform = 'whatsapp' | 'instagram' | 'indiamart'

export type IntegrationStatus = 'connected' | 'disconnected'

export type PlatformDefinition = {
  platform: IntegrationPlatform
  label: string
  description: string
  logoSrc: string
}

export const PLATFORM_DEFINITIONS: PlatformDefinition[] = [
  {
    platform: 'whatsapp',
    label: 'WhatsApp',
    description: 'Connect your WhatsApp Business account to receive and reply to customer messages.',
    logoSrc: '/whatsapp.png',
  },
  {
    platform: 'instagram',
    label: 'Instagram',
    description: 'Connect Instagram DMs so conversations from Instagram appear in your inbox.',
    logoSrc: '/instagram.png',
  },
  {
    platform: 'indiamart',
    label: 'IndiaMART',
    description: 'Connect IndiaMART inquiries and respond to buyer leads from one place.',
    logoSrc: '/indiamart.png',
  },
]

export function integrationStatusLabel(status: IntegrationStatus): string {
  return status === 'connected' ? 'Connected' : 'Not connected'
}

export function integrationStatusBadgeClass(status: IntegrationStatus): string {
  return status === 'connected'
    ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
    : 'bg-neutral-100 text-neutral-600 ring-neutral-200'
}
