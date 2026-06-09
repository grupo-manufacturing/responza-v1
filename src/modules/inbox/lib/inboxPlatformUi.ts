import type { IntegrationPlatform } from '@/shared/constants/integrations'

export function outboundBubbleClass(platform: IntegrationPlatform | null | undefined): string {
  if (platform === 'whatsapp') {
    return 'bg-[#DCF8C6] text-neutral-900'
  }

  if (platform === 'instagram') {
    return 'bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white'
  }

  return 'bg-neutral-900 text-white'
}

export function outboundMetaClass(platform: IntegrationPlatform | null | undefined): string {
  if (platform === 'whatsapp') {
    return 'text-neutral-500'
  }

  if (platform === 'instagram') {
    return 'text-white/80'
  }

  return 'text-neutral-300'
}

export function composerFocusRingClass(platform: IntegrationPlatform | null | undefined): string {
  if (platform === 'whatsapp') {
    return 'focus-within:border-[#128C7E]'
  }

  if (platform === 'instagram') {
    return 'focus-within:border-[#E1306C]'
  }

  return 'focus-within:border-neutral-900'
}

export function composerSendButtonClass(
  canSend: boolean,
  platform: IntegrationPlatform | null | undefined,
): string {
  if (!canSend) {
    return 'bg-neutral-200 text-neutral-400'
  }

  if (platform === 'whatsapp') {
    return 'bg-[#128C7E] text-white hover:bg-[#0f7a6d]'
  }

  if (platform === 'instagram') {
    return 'bg-[#E1306C] text-white hover:bg-[#c72c63]'
  }

  return 'bg-neutral-900 text-white hover:bg-neutral-800'
}
