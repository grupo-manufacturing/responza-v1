export type LandingPlatform =
  | 'whatsapp'
  | 'instagram'
  | 'indiamart'
  | 'gmail'
  | 'tally'
  | 'tiktok'
  | 'shopify'

const LANDING_INTEGRATION_PLATFORMS: readonly LandingPlatform[] = [
  'whatsapp',
  'instagram',
  'indiamart',
  'gmail',
  'tally',
  'tiktok',
  'shopify',
]

const LANDING_PLATFORM_LABELS: Record<LandingPlatform, string> = {
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  indiamart: 'IndiaMART',
  gmail: 'Gmail',
  tally: 'Tally',
  tiktok: 'TikTok',
  shopify: 'Shopify',
}

const LANDING_PLATFORM_LOGOS: Record<LandingPlatform, string> = {
  whatsapp: '/whatsapp.png',
  instagram: '/instagram.png',
  indiamart: '/indiamart.png',
  gmail: '/gmail.png',
  tally: '/tally.png',
  tiktok: '/tiktok.png',
  shopify: '/shopify.png',
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
  tally: 'shadow-[0_8px_24px_rgb(220_38_38/0.16)]',
  tiktok: 'shadow-[0_8px_24px_rgb(236_72_153/0.16)]',
  shopify: 'shadow-[0_8px_24px_rgb(34_197_94/0.18)]',
}

export const PLATFORM_RING: Record<LandingPlatform, string> = {
  whatsapp: 'ring-emerald-500/20',
  instagram: 'ring-pink-500/15',
  indiamart: 'ring-amber-500/20',
  gmail: 'ring-red-500/20',
  tally: 'ring-red-500/20',
  tiktok: 'ring-pink-500/15',
  shopify: 'ring-emerald-500/20',
}

export function landingPlatformLogoClass(platform: LandingPlatform): string {
  if (platform === 'indiamart' || platform === 'tally' || platform === 'shopify') {
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
  {
    key: 'basic',
    label: 'Basic',
    amountInr: 499,
    conversationLimit: 1_000,
    interval: 'monthly' as const,
    highlight: false,
    freeTrial: true,
    description: 'For teams getting started with a unified inbox.',
  },
  {
    key: 'premium',
    label: 'Responza Annual',
    amountInr: 4_999,
    conversationLimit: 30_000,
    interval: 'yearly' as const,
    highlight: true,
    freeTrial: false,
    description: 'Best value — full year of Pro access with a higher conversation quota.',
  },
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
      'Responza AI reads conversation context and drafts replies that match your tone. Edit, send, or ignore you stay in control.',
  },
  {
    label: 'Translation',
    tone: 'warm' as const,
    title: "Speak your customer's language",
    description:
      'Incoming messages are translated instantly so your team can reply confidently no copy-pasting into external tools.',
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
    q: 'How is Responza AI different from using WhatsApp and Instagram separately?',
    a: 'Responza AI unifies both channels in one inbox with shared history, AI suggestions, lead tracking, and analytics — so your team never context-switches between apps.',
  },
  {
    q: 'How do AI reply suggestions work?',
    a: 'Responza AI uses your business profile and conversation context to draft replies. You review and edit before sending — nothing goes out without your approval.',
  },
  {
    q: 'Can I still message customers outside of Responza AI?',
    a: 'Yes. Messages sent from WhatsApp or Instagram directly still sync into your Responza AI inbox when channels are connected.',
  },
  {
    q: 'Is my data private and secure?',
    a: 'Your conversations are stored securely and scoped to your organization. We use industry-standard encryption and never sell your data.',
  },
  {
    q: 'How do I connect WhatsApp or Instagram?',
    a: 'Go to Integrations after signing up and follow the guided OAuth or Embedded Signup flow. Most teams are connected in under two minutes.',
  },
  {
    q: 'What are your pricing plans?',
    a: 'Basic is ₹499/month with 1,000 conversations per month. Responza Annual is ₹4,999/year with 30,000 conversations per year. All plans include the same features — only conversation volume differs. GST inclusive.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes. Every new account gets a 3-day free trial with full access to core features. No credit card required to start.',
  },
] as const

const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faqs', label: 'FAQs' },
] as const

export { NAV_LINKS }
