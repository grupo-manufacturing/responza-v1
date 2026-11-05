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

const LANDING_PLATFORM_LOGOS: Record<LandingPlatform, { src: string; width: number; height: number }> = {
  whatsapp: { src: '/whatsapp.webp', width: 128, height: 128 },
  instagram: { src: '/instagram.webp', width: 128, height: 128 },
  indiamart: { src: '/indiamart.webp', width: 199, height: 128 },
  gmail: { src: '/gmail.webp', width: 177, height: 128 },
  tally: { src: '/tally.webp', width: 295, height: 128 },
  tiktok: { src: '/tiktok.webp', width: 128, height: 128 },
  shopify: { src: '/shopify.webp', width: 128, height: 128 },
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

export const WAITLIST_HREF = '/#waitlist'

export const PRICING_PLANS = [
  {
    key: 'basic',
    label: 'Basic',
    amountInr: 499,
    conversationLimit: 1_000,
    interval: 'monthly' as const,
    highlight: false,
    description: 'For businesses getting started with WhatsApp and Instagram on the go.',
  },
  {
    key: 'premium',
    label: 'Responza Annual',
    amountInr: 4_999,
    conversationLimit: 30_000,
    interval: 'yearly' as const,
    highlight: true,
    description: 'Best value. A full year of Responza with a higher conversation quota.',
  },
] as const

export const PLAN_FEATURES = [
  'WhatsApp & Instagram in one app',
  'AI draft replies & translation',
  'Conversation summaries',
  'Instant push notifications',
] as const

export const LANDING_FEATURES = [
  {
    id: 'inbox',
    label: 'One inbox',
    tone: 'teal' as const,
    title: 'Every chat',
    titleAccent: 'in your pocket.',
    description:
      'WhatsApp and Instagram conversations live side by side in one app, sorted by latest activity, so you can switch channels without losing context.',
  },
  {
    id: 'replies',
    label: 'AI replies',
    tone: 'violet' as const,
    title: 'Reply in seconds with',
    titleAccent: 'AI draft replies.',
    description:
      'Responza AI drafts replies from your business knowledge right in the composer. Review, edit and tap send when you are ready.',
  },
  {
    id: 'translation',
    label: 'Translation',
    tone: 'warm' as const,
    title: "Speak your",
    titleAccent: "customer's language.",
    description:
      'Incoming messages are translated instantly so you can reply confidently, with no copy-pasting into other apps.',
  },
  {
    id: 'analytics',
    label: 'Summaries',
    tone: 'teal' as const,
    title: 'Know what customers want',
    titleAccent: 'at a glance.',
    description:
      'AI-generated summaries and topic labels help you spot urgent chats and prepare before you reply, even between meetings.',
  },
] as const

export const LANDING_FAQS = [
  {
    q: 'What is Responza AI?',
    a: 'Responza is an upcoming mobile app that brings your WhatsApp and Instagram business chats into one inbox, with AI draft replies, instant translation and conversation summaries.',
  },
  {
    q: 'When does the app launch?',
    a: 'Responza is coming soon. Join the waitlist and we will email you as soon as it is available to download.',
  },
  {
    q: 'How do I join the waitlist?',
    a: 'Enter your email in the waitlist form at the bottom of this page. We will add you to the list and share early access updates.',
  },
  {
    q: 'How do AI draft replies work?',
    a: 'When a customer messages you on WhatsApp or Instagram, Responza drafts a reply in the composer from your business knowledge. You review and send it yourself. Nothing goes out automatically.',
  },
  {
    q: 'Can I still reply from WhatsApp or Instagram directly?',
    a: 'Yes. Messages you send from WhatsApp or Instagram directly will sync into Responza, so your conversation history stays complete.',
  },
  {
    q: 'Is my data private and secure?',
    a: 'Your conversations are stored securely and scoped to your business. We use industry-standard encryption and never sell your data.',
  },
  {
    q: 'How much will Responza cost?',
    a: 'Planned launch pricing is ₹499/month for 1,000 conversations, or ₹4,999/year for 30,000 conversations. Both include every feature and GST. Pricing may change before launch.',
  },
  {
    q: 'Will Responza work with IndiaMART or Tally?',
    a: 'WhatsApp and Instagram are supported at launch. IndiaMART, Tally, Gmail and more are on our roadmap.',
  },
] as const

/** YouTube Shorts video about Responza (https://youtube.com/shorts/7d52P3l-Cfc). */
export const LANDING_YOUTUBE_SHORT_ID = '7d52P3l-Cfc'

export const LANDING_YOUTUBE_SHORT_URL = `https://www.youtube.com/shorts/${LANDING_YOUTUBE_SHORT_ID}`

export const LANDING_YOUTUBE_SHORT_EMBED_URL =
  `https://www.youtube-nocookie.com/embed/${LANDING_YOUTUBE_SHORT_ID}?rel=0&modestbranding=1&playsinline=1`

const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faqs', label: 'FAQs' },
] as const

export { NAV_LINKS }
