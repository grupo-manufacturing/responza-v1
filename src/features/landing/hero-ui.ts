export type HeroPlatform = 'whatsapp' | 'instagram'

export function heroThreadBackgroundClass(platform: HeroPlatform): string {
  if (platform === 'whatsapp') {
    return "bg-[url('/chat-bg.jpg')] bg-repeat bg-auto"
  }

  return 'bg-surface-muted/60 bg-grid-light'
}

export function heroInboundBubbleClass(): string {
  return 'border border-border/80 bg-white/95 text-ink shadow-soft backdrop-blur-sm'
}

export function heroOutboundBubbleClass(platform: HeroPlatform): string {
  return platform === 'whatsapp'
    ? 'bg-[#DCF8C6] text-ink shadow-soft'
    : 'bg-gradient-to-br from-[#405DE6] to-brand-instagram text-white shadow-soft'
}

export function heroTabClass(platform: HeroPlatform, isActive: boolean): string {
  if (!isActive) {
    return 'border border-transparent bg-white/70 text-ink-muted hover:border-border hover:bg-surface-muted hover:text-ink'
  }

  return platform === 'whatsapp'
    ? 'border border-brand-whatsapp/30 bg-brand-whatsapp text-white shadow-soft'
    : 'border border-brand-instagram/30 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white shadow-soft'
}

export function heroListItemClass(platform: HeroPlatform, isSelected: boolean): string {
  if (!isSelected) {
    return 'hover:bg-surface-muted/70'
  }

  return platform === 'whatsapp'
    ? 'bg-accent/8 border-l-2 border-brand-whatsapp'
    : 'bg-accent/8 border-l-2 border-brand-instagram'
}

export function heroSendButtonClass(platform: HeroPlatform): string {
  return platform === 'whatsapp'
    ? 'bg-brand-whatsapp text-white hover:bg-brand-whatsapp/90'
    : 'bg-gradient-to-r from-[#405DE6] to-brand-instagram text-white hover:opacity-90'
}
