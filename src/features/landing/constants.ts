/** Google Play open-testing listing. Swap for the production listing URL once the app is public. */
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=in.responza.app'

export const WAITLIST_HREF = '/#waitlist'

export const NAV_LINKS = [
  { href: '/#features', label: 'Features' },
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/#faqs', label: 'FAQs' },
  { href: '/blog', label: 'Blog' },
] as const

export type LandingPlatform = 'whatsapp' | 'instagram' | 'indiamart' | 'gmail' | 'tally' | 'shopify' | 'tiktok'

export const LIVE_CHANNELS = [
  { platform: 'whatsapp', label: 'WhatsApp Business', logo: '/whatsapp.webp' },
  { platform: 'instagram', label: 'Instagram DMs', logo: '/instagram.webp' },
] as const

export const ROADMAP_CHANNELS = [
  { platform: 'indiamart', label: 'IndiaMART', logo: '/indiamart.webp' },
  { platform: 'gmail', label: 'Gmail', logo: '/gmail.webp' },
  { platform: 'tally', label: 'Tally', logo: '/tally.webp' },
  { platform: 'shopify', label: 'Shopify', logo: '/shopify.webp' },
  { platform: 'tiktok', label: 'TikTok', logo: '/tiktok.webp' },
] as const

export type ShowcaseTone = 'mint' | 'violet' | 'amber' | 'sky'

export const SHOWCASE_GLOW: Record<ShowcaseTone, string> = {
  mint: 'rgb(52 224 161 / 0.34)',
  violet: 'rgb(164 147 255 / 0.4)',
  amber: 'rgb(255 184 107 / 0.34)',
  sky: 'rgb(98 200 255 / 0.34)',
}

export const LANDING_FEATURES = [
  {
    id: 'inbox',
    eyebrow: 'One inbox',
    title: 'All your customer chats, finally in one place.',
    description:
      'WhatsApp Business and Instagram DMs sit side by side. Filter by channel, see unread counts and delivery status in real time, and send text, photos, videos and documents without switching apps.',
    points: ['Filter by channel', 'Live unread & delivery status', 'Photos, videos & documents'],
    screen: '/mockups/app-inbox.webp',
    alt: 'Responza inbox showing WhatsApp and Instagram conversations together',
    tone: 'mint' as ShowcaseTone,
  },
  {
    id: 'replies',
    eyebrow: 'AI draft replies',
    title: 'Reply in seconds, in your own voice.',
    description:
      'Responza reads the conversation and your business details, then drafts the reply right in the composer. Edit it or send it as it is. Nothing goes out until you tap send.',
    points: ['Drafts from the live conversation', 'Sounds like your brand', 'You approve every message'],
    screen: '/mockups/app-draft.webp',
    alt: 'An AI drafted reply waiting in the Responza chat composer',
    tone: 'violet' as ShowcaseTone,
  },
  {
    id: 'translation',
    eyebrow: 'Translation',
    title: 'Understand every customer, whatever they write in.',
    description:
      'Translate any incoming message with one tap and reply with confidence. No copy-pasting into other apps, no guessing what a message means.',
    points: ['One-tap message translation', 'Works inside the chat', 'Reply in the same thread'],
    screen: '/mockups/app-translate.webp',
    alt: 'A customer message translated into Hindi inside a Responza chat',
    tone: 'amber' as ShowcaseTone,
  },
  {
    id: 'summaries',
    eyebrow: 'Summaries',
    title: 'Catch up on a long chat in a glance.',
    description:
      'Get an instant summary of any conversation: what the customer wants, what you quoted and what is still open. Perfect before a reply, or between meetings.',
    points: ['What the customer wants', 'What you already said', 'What is still open'],
    screen: '/mockups/app-summary.webp',
    alt: 'A Responza conversation summary sheet over a customer chat',
    tone: 'sky' as ShowcaseTone,
  },
  {
    id: 'assistant',
    eyebrow: 'AI assistant',
    title: 'Ask your inbox anything.',
    description:
      'Find out which chats need a reply and who to follow up with, or get help with captions, follow-ups and quick business answers.',
    points: ['Which chats need a reply?', 'Who should I follow up with?', 'Captions & follow-ups'],
    screen: '/mockups/app-ai.webp',
    alt: 'The Responza AI assistant home screen with suggested questions',
    tone: 'violet' as ShowcaseTone,
  },
] as const

export const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Install the app',
    description: 'Join the open test on Google Play and create your account in a minute.',
  },
  {
    step: '02',
    title: 'Connect your channels',
    description: 'Link your WhatsApp Business number and Instagram account. No developer setup needed.',
  },
  {
    step: '03',
    title: 'Reply with AI',
    description: 'Add your business details once. Responza drafts, translates and summarises, and you stay in control.',
  },
] as const

export const TRUST_POINTS = [
  {
    id: 'control',
    title: 'You stay in control',
    description: 'AI only drafts. Every reply waits for your approval, so nothing is ever sent automatically.',
  },
  {
    id: 'voice',
    title: 'Your brand voice',
    description: 'Add your business details once and drafts follow your tone, products and policies.',
  },
  {
    id: 'meta',
    title: 'Official Meta integration',
    description:
      'Responza is a Meta Tech Provider with Advanced Access, so WhatsApp and Instagram connect the approved way.',
  },
  {
    id: 'secure',
    title: 'Secure by design',
    description:
      'Channel credentials stay on our servers and data is encrypted in transit. Your conversations are never sold.',
  },
  {
    id: 'notifications',
    title: 'Instant notifications',
    description: 'Push alerts the moment a customer messages, so the first reply is never the slow one.',
  },
  {
    id: 'delete',
    title: 'Delete anytime',
    description: 'Remove your account and data from the app or on request. No lock-in.',
  },
] as const

export const PRICING_PLANS = [
  {
    key: 'monthly',
    label: 'Monthly',
    amountInr: 499,
    conversationLimit: 1_000,
    interval: 'monthly' as const,
    highlight: false,
    description: 'Flexible month-to-month for businesses getting started with chat-first selling.',
    badge: null,
  },
  {
    key: 'annual',
    label: 'Annual',
    amountInr: 4_999,
    conversationLimit: 30_000,
    interval: 'yearly' as const,
    highlight: true,
    description: 'Best value. A full year of Responza with 2.5× the conversations of twelve monthly plans.',
    badge: 'Save ₹989 a year',
  },
] as const

export const PLAN_FEATURES = [
  'WhatsApp Business & Instagram in one inbox',
  'AI draft replies you approve',
  'Translation & conversation summaries',
  'AI business assistant',
  'Instant push notifications',
] as const

export const LANDING_FAQS = [
  {
    q: 'What is Responza AI?',
    a: 'Responza is a mobile app that brings your WhatsApp Business and Instagram conversations into one inbox, with AI draft replies, instant translation and conversation summaries.',
  },
  {
    q: 'Is the app available yet?',
    a: 'Responza is in open testing on Google Play, so you can install and use it today. The public launch follows once testing wraps up.',
  },
  {
    q: 'How do I get the app?',
    a: 'Open the Google Play open-testing link on your Android phone and tap to join. If you are not on Android, join the waitlist and we will email you when more platforms are ready.',
  },
  {
    q: 'How do AI draft replies work?',
    a: 'When a customer messages you on WhatsApp or Instagram, Responza drafts a reply in the composer from the conversation and your business details. You review, edit and send it yourself. Nothing goes out automatically.',
  },
  {
    q: 'Can I still reply from WhatsApp or Instagram directly?',
    a: 'Yes. Messages you send from WhatsApp or Instagram directly will sync into Responza, so your conversation history stays complete.',
  },
  {
    q: 'Is my data private and secure?',
    a: 'Your conversations are stored securely and scoped to your business. Channel credentials stay on our servers, data is encrypted in transit and we never sell your data. You can delete your account at any time.',
  },
  {
    q: 'How much does Responza cost?',
    a: 'Plans are ₹499 a month for 1,000 conversations or ₹4,999 a year for 30,000 conversations. Both include every feature and GST, are billed through Google Play, and new accounts get a free trial. Pricing may change before the public launch.',
  },
  {
    q: 'Will Responza work with IndiaMART or Tally?',
    a: 'WhatsApp Business and Instagram are supported today. IndiaMART, Gmail, Tally, Shopify and TikTok are on our roadmap.',
  },
  {
    q: 'Is Responza connected to Meta?',
    a: 'Responza is a Meta Tech Provider with Advanced Access, which is how it connects to WhatsApp Business and Instagram. It is an independent product and is not endorsed or sponsored by Meta, WhatsApp or Instagram.',
  },
] as const

/** YouTube Shorts video about Responza (https://youtube.com/shorts/7d52P3l-Cfc). */
export const LANDING_YOUTUBE_SHORT_ID = '7d52P3l-Cfc'

export const LANDING_YOUTUBE_SHORT_URL = `https://www.youtube.com/shorts/${LANDING_YOUTUBE_SHORT_ID}`

export const LANDING_YOUTUBE_SHORT_EMBED_URL =
  `https://www.youtube-nocookie.com/embed/${LANDING_YOUTUBE_SHORT_ID}?rel=0&modestbranding=1&playsinline=1`
