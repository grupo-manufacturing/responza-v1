import {
  INTEGRATION_PLATFORM_LABELS,
  INTEGRATION_PLATFORM_LOGOS,
  INTEGRATION_PLATFORMS,
  type IntegrationPlatform,
} from '@/modules/integrations/integrations.constants'

export type LandingPlatform = IntegrationPlatform | 'gmail'

const LANDING_INTEGRATION_PLATFORMS: readonly LandingPlatform[] = [...INTEGRATION_PLATFORMS, 'gmail']

const LANDING_PLATFORM_LABELS: Record<LandingPlatform, string> = {
  ...INTEGRATION_PLATFORM_LABELS,
  gmail: 'Gmail',
}

const LANDING_PLATFORM_LOGOS: Record<LandingPlatform, string> = {
  ...INTEGRATION_PLATFORM_LOGOS,
  gmail: '/gmail.png',
}

export const LANDING_PLATFORMS = LANDING_INTEGRATION_PLATFORMS.map((platform) => ({
  platform,
  label: LANDING_PLATFORM_LABELS[platform],
  logo: LANDING_PLATFORM_LOGOS[platform],
}))

export const PLATFORM_GLOW: Record<LandingPlatform, string> = {
  whatsapp: 'shadow-[0_8px_24px_rgb(37_211_102/0.18)]',
  instagram: 'shadow-[0_8px_24px_rgb(225_48_108/0.16)]',
  indiamart: 'shadow-[0_8px_24px_rgb(245_158_11/0.16)]',
  gmail: 'shadow-[0_8px_24px_rgb(234_67_53/0.18)]',
}

export const PLATFORM_RING: Record<LandingPlatform, string> = {
  whatsapp: 'ring-emerald-500/20',
  instagram: 'ring-pink-500/15',
  indiamart: 'ring-amber-500/20',
  gmail: 'ring-red-500/20',
}

export function landingPlatformLogoClass(platform: LandingPlatform): string {
  if (platform === 'indiamart') {
    return 'h-8 w-auto max-w-full object-contain'
  }

  return 'h-full w-full object-contain'
}

export const LANDING_AVATARS = {
  priya: '/avatars/priya.jpg',
  alex: '/avatars/alex.jpg',
  maya: '/avatars/maya.jpg',
  natasha: '/avatars/notification.jpg',
} as const

export const PRICING_PLANS = [
  { key: 'basic', label: 'Basic', amountInr: 499, conversationLimit: 1_000, highlight: false, freeTrial: true },
  { key: 'premium', label: 'Premium', amountInr: 5_000, conversationLimit: 2_500, highlight: true, freeTrial: false },
  { key: 'scale', label: 'Scale', amountInr: 10_000, conversationLimit: 7_000, highlight: false, freeTrial: false },
  { key: 'enterprise', label: 'Enterprise', amountInr: 20_000, conversationLimit: 25_000, highlight: false, freeTrial: false },
] as const

export const PLAN_FEATURES = [
  'Unified WhatsApp + Instagram inbox',
  'AI replies & translation',
  'Lead management',
  'Conversation analytics',
] as const

export const AI_FEATURES = [
  {
    label: 'AI replies',
    tone: 'violet' as const,
    title: 'Respond faster with smart suggestions',
    description:
      'Responza reads conversation context and drafts replies that match your tone. Edit, send, or ignore — you stay in control.',
  },
  {
    label: 'Translation',
    tone: 'warm' as const,
    title: "Speak your customer's language",
    description:
      'Incoming messages are translated instantly so your team can reply confidently — no copy-pasting into external tools.',
  },
  {
    label: 'Analytics',
    tone: 'teal' as const,
    title: 'Understand what customers really want',
    description:
      'AI-generated summaries and topic labels help you spot patterns, prioritize urgent threads, and prepare before you reply.',
  },
] as const

export const LANDING_FAQS = [
  {
    q: 'How is Responza different from using WhatsApp and Instagram separately?',
    a: 'Responza unifies both channels in one inbox with shared history, AI suggestions, lead tracking, and analytics — so your team never context-switches between apps.',
  },
  {
    q: 'How do AI reply suggestions work?',
    a: 'Responza uses your business profile and conversation context to draft replies. You review and edit before sending — nothing goes out without your approval.',
  },
  {
    q: 'Can I still message customers outside of Responza?',
    a: 'Yes. Messages sent from WhatsApp or Instagram directly still sync into your Responza inbox when channels are connected.',
  },
  {
    q: 'Is my data private and secure?',
    a: 'Your conversations are stored securely and scoped to your organization. We use industry-standard encryption and never sell your data.',
  },
  {
    q: 'How do I connect WhatsApp or Instagram?',
    a: 'Go to Integrations after signing up and follow the guided OAuth or Embedded Signup flow. Most teams are connected in under two minutes.',
  },
] as const

const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faqs', label: 'FAQs' },
] as const

export { NAV_LINKS }
