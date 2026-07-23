import type { IntegrationPlatform } from '@/features/integrations/constants'

export const INBOX_SHELL_CLASS =
  'glass-light flex min-h-0 flex-1 overflow-hidden rounded-[var(--radius-card-lg)] border border-border shadow-card'

export const INBOX_PANEL_HEADER_CLASS = 'shrink-0 border-b border-border px-3 py-2.5 sm:px-4'

export const INBOX_ICON_BUTTON_CLASS =
  'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink disabled:cursor-not-allowed disabled:opacity-40'

export const INBOX_COMPOSER_ACTION_CLASS =
  'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors disabled:cursor-not-allowed'

export function inboxThreadBackgroundClass(platform: IntegrationPlatform | null | undefined): string {
  if (platform === 'whatsapp') {
    return "bg-[url('/chat-bg.jpg')] bg-repeat bg-auto"
  }

  return 'bg-surface-muted/60 bg-grid-light'
}

export function inboundBubbleClass(): string {
  return 'border border-border/80 bg-white/95 text-ink shadow-soft backdrop-blur-sm'
}

export function outboundBubbleClass(platform: IntegrationPlatform | null | undefined): string {
  if (platform === 'whatsapp') {
    return 'bg-[#DCF8C6] text-ink shadow-soft'
  }

  if (platform === 'instagram') {
    return 'bg-gradient-to-br from-[#405DE6] to-brand-instagram text-white shadow-soft'
  }

  return 'bg-ink text-on-dark shadow-soft'
}

export function outboundMetaClass(platform: IntegrationPlatform | null | undefined): string {
  if (platform === 'whatsapp') {
    return 'text-ink-faint'
  }

  if (platform === 'instagram') {
    return 'text-white/70'
  }

  return 'text-on-dark-muted'
}

type PlatformTabFilter = IntegrationPlatform | 'all'

function platformTabInactiveClass(): string {
  return 'border border-transparent bg-white/70 text-ink-muted hover:border-border hover:bg-surface-muted hover:text-ink'
}

export function platformTabActiveClass(filter: PlatformTabFilter, isActive: boolean): string {
  if (!isActive) {
    return platformTabInactiveClass()
  }

  if (filter === 'whatsapp') {
    return 'border border-brand-whatsapp/30 bg-brand-whatsapp text-white shadow-soft'
  }

  if (filter === 'instagram') {
    return 'border border-brand-instagram/30 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white shadow-soft'
  }

  return 'border border-ink/10 bg-ink text-on-dark shadow-soft'
}

export function listItemSelectedClass(
  platform: IntegrationPlatform,
  isSelected: boolean,
): string {
  if (!isSelected) {
    return 'hover:bg-surface-muted/70'
  }

  if (platform === 'whatsapp') {
    return 'bg-accent/8 border-l-2 border-brand-whatsapp'
  }

  if (platform === 'instagram') {
    return 'bg-accent/8 border-l-2 border-brand-instagram'
  }

  return 'bg-accent/10 border-l-2 border-accent'
}

export function composerSendButtonClass(
  canSend: boolean,
  platform: IntegrationPlatform | null | undefined,
): string {
  if (!canSend) {
    return 'bg-surface-muted text-ink-faint'
  }

  if (platform === 'whatsapp') {
    return 'bg-brand-whatsapp text-white hover:bg-brand-whatsapp/90'
  }

  if (platform === 'instagram') {
    return 'bg-gradient-to-r from-[#405DE6] to-brand-instagram text-white hover:opacity-90'
  }

  return 'bg-ink text-on-dark hover:bg-ink/90'
}

export function composerFocusRingClass(platform: IntegrationPlatform | null | undefined): string {
  if (platform === 'whatsapp') {
    return 'focus-within:border-brand-whatsapp focus-within:ring-2 focus-within:ring-brand-whatsapp/15'
  }

  if (platform === 'instagram') {
    return 'focus-within:border-brand-instagram focus-within:ring-2 focus-within:ring-brand-instagram/15'
  }

  return 'focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/15'
}
