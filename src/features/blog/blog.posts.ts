import type { SeoPage } from '@/shared/seo/seo.constants'

export type BlogFaq = {
  readonly q: string
  readonly a: string
}

export type BlogPostMeta = {
  readonly slug: string
  /** On-page H1 and JSON-LD headline. */
  readonly title: string
  /** Shorter title for <title>; " | Responza AI" is appended. */
  readonly metaTitle: string
  readonly description: string
  readonly excerpt: string
  /** YYYY-MM-DD */
  readonly publishedAt: string
  /** YYYY-MM-DD */
  readonly updatedAt: string
  readonly readingMinutes: number
  /** Rendered at the end of the article and mirrored in its FAQPage JSON-LD. */
  readonly faqs: readonly BlogFaq[]
}

/** Newest first. Every slug needs a matching body in BlogPostPage's ARTICLE_BODIES. */
export const BLOG_POSTS = [
  {
    slug: 'manage-whatsapp-instagram-messages-one-place',
    title: "Switching Between WhatsApp and Instagram All Day? Here's What It's Costing Your Business",
    metaTitle: 'Manage WhatsApp and Instagram Messages in One Place',
    description:
      'Jumping between WhatsApp and Instagram costs Indian businesses sales. See what app switching really costs and how to manage both inboxes in one place.',
    excerpt:
      'Two inboxes, two sets of unread chats, and the same questions all day. Here is what juggling WhatsApp and Instagram really costs a small business, and what to do about it.',
    publishedAt: '2026-11-02',
    updatedAt: '2026-11-02',
    readingMinutes: 8,
    faqs: [
      {
        q: 'Can I manage WhatsApp and Instagram messages from one app?',
        a: 'Not with the official apps alone. WhatsApp Business and Instagram each have their own inbox. To see both together you need a tool that connects to both, such as Responza, an upcoming mobile app that brings WhatsApp and Instagram chats into one inbox.',
      },
      {
        q: 'Will I still be able to reply from my phone?',
        a: 'Yes. With Responza, messages you send directly from WhatsApp or Instagram still sync into the matching Responza module while that channel is connected, so your chat history stays complete.',
      },
      {
        q: 'Why do some Instagram messages from customers seem to go missing?',
        a: "They are usually sitting in Message requests. When someone who doesn't follow you sends a DM, Instagram often puts it there instead of your main inbox. Check that folder every day so new customers are not ignored.",
      },
      {
        q: 'How much does a WhatsApp and Instagram inbox tool cost in India?',
        a: 'It varies a lot between providers. Responza, launching soon as a mobile app, plans to start at ₹499 per month for 1,000 conversations with GST included.',
      },
    ],
  },
  {
    slug: 'whatsapp-business-app-vs-dedicated-inbox',
    title: 'WhatsApp Business App vs a Dedicated Inbox: When the Free App Stops Being Enough',
    metaTitle: 'WhatsApp Business App vs a Dedicated Inbox',
    description:
      'The free WhatsApp Business app is great until it is not. Where it falls short for growing Indian businesses, and signs it is time for a dedicated inbox.',
    excerpt:
      'The free app does a lot. But missed chats, repeated questions and a separate Instagram inbox add up. Here are the signs you have outgrown it.',
    publishedAt: '2026-11-02',
    updatedAt: '2026-11-02',
    readingMinutes: 7,
    faqs: [
      {
        q: 'Is the WhatsApp Business app free?',
        a: 'Yes. Downloading and using the WhatsApp Business app is free. Tools built on the WhatsApp Business Platform are different: the software usually has its own fee, and Meta may charge for certain types of messages.',
      },
      {
        q: 'What is the difference between the WhatsApp Business app and the WhatsApp Business API?',
        a: 'The app is the free phone app made for small businesses. The API, which Meta calls the WhatsApp Business Platform, lets software connect to WhatsApp so businesses can use things like dashboards, AI assistance and other channels in the same place. Most small businesses use it through a provider rather than building on it themselves.',
      },
      {
        q: 'Can I use WhatsApp Business and Instagram together in one inbox?',
        a: 'Not in the official apps. You need a tool that connects to both. Responza, launching soon, brings WhatsApp and Instagram into one mobile inbox that shows what needs a reply.',
      },
      {
        q: 'When should a small business move beyond the WhatsApp Business app?',
        a: 'A good sign is when replies start slipping: chats from yesterday that never got an answer, the same questions repeated all day, or Instagram DMs being ignored because WhatsApp takes all your time.',
      },
    ],
  },
  {
    slug: 'how-fast-should-business-reply-whatsapp-instagram',
    title: 'How Fast Should a Business Reply on WhatsApp and Instagram? (And How to Actually Do It)',
    metaTitle: 'How Fast Should a Business Reply on WhatsApp and Instagram?',
    description:
      'A practical reply time target for Indian businesses on WhatsApp and Instagram, why slow replies lose customers, and simple ways to answer faster.',
    excerpt:
      'Customers on chat apps expect chat speed. Here is a realistic reply time target for a small team, and the habits and tools that help you hit it.',
    publishedAt: '2026-11-02',
    updatedAt: '2026-11-02',
    readingMinutes: 6,
    faqs: [
      {
        q: 'How quickly should a business reply on WhatsApp?',
        a: "During working hours, try to reply within 15 to 30 minutes. Outside working hours, use an away message so customers know when to expect a reply, and answer as soon as you're back.",
      },
      {
        q: 'What is the WhatsApp 24-hour window?',
        a: "On the WhatsApp Business Platform, businesses can send normal replies for 24 hours after a customer's last message. After that, a pre-approved template message is needed to restart the conversation. This applies to tools built on the platform, not to everyday use of the WhatsApp Business app.",
      },
      {
        q: 'How can I reply faster to Instagram DMs?',
        a: 'Set up saved replies for common questions, check the Requests folder daily so new customers are not missed, and consider a tool that brings Instagram and WhatsApp into one place with suggested replies.',
      },
      {
        q: 'Should I send automatic replies to customers?',
        a: 'Automatic greeting and away messages are useful. For real answers about price, stock or delivery, it is safer to review the reply before it goes out, because one wrong answer can cost you the sale.',
      },
    ],
  },
  {
    slug: 'reply-to-customers-in-indian-languages-whatsapp-instagram',
    title: 'Customers Messaging in Hindi, Tamil or Telugu? How to Handle Multilingual Chats on WhatsApp and Instagram',
    metaTitle: 'Handling Customer Messages in Indian Languages',
    description:
      'How Indian businesses can handle WhatsApp and Instagram messages in Hindi, Tamil, Telugu, Bengali and other languages, including in-chat translation.',
    excerpt:
      'Your customers write the way they talk. Here is how to understand and answer messages in Hindi, Tamil, Telugu and more without slowing down.',
    publishedAt: '2026-11-02',
    updatedAt: '2026-11-02',
    readingMinutes: 6,
    faqs: [
      {
        q: 'How do I translate a WhatsApp message from a customer?',
        a: 'You can copy the message into a translation app such as Google Translate, or use a customer messaging tool with translation built in. In Responza, you tap the translate button on the message and it is shown in your preferred language inside the chat.',
      },
      {
        q: 'Which languages does Responza translate messages into?',
        a: 'Hindi, Bengali, Telugu, Marathi, Tamil, Gujarati, Kannada, Malayalam, Punjabi, Odia, Arabic and Spanish. You choose your preferred language in Settings.',
      },
      {
        q: "Should I reply to customers in their own language?",
        a: "It helps when you can do it accurately, especially for your most common replies. If you can't, a clear and simple reply in English or Hindi with the key details confirmed is better than a late or badly translated one.",
      },
      {
        q: 'Does translation work for Instagram DMs too?',
        a: 'In Responza, yes. The translate option works on customer text messages in both the WhatsApp and Instagram modules.',
      },
    ],
  },
] as const satisfies readonly BlogPostMeta[]

export type BlogPost = (typeof BLOG_POSTS)[number]
export type BlogSlug = BlogPost['slug']

export function blogPostPath(slug: BlogSlug): string {
  return `/blog/${slug}`
}

export const BLOG_INDEX_SEO = {
  path: '/blog',
  title: 'WhatsApp and Instagram Tips for Indian Businesses | Responza Blog',
  description:
      'Practical guides for Indian businesses on replying faster on WhatsApp and Instagram, managing both inboxes and handling chats in Indian languages.',
  lastModified: BLOG_POSTS.map((post) => post.updatedAt).sort().at(-1),
} satisfies SeoPage

export function blogPostSeo(post: BlogPost): SeoPage {
  return {
    path: blogPostPath(post.slug),
    title: `${post.metaTitle} | Responza AI`,
    description: post.description,
    lastModified: post.updatedAt,
    ogType: 'article',
  }
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** Formats YYYY-MM-DD without Intl so prerendered and hydrated output always match. */
export function formatBlogDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  return `${day} ${MONTHS[month - 1]} ${year}`
}

export function findBlogPostByPath(path: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => blogPostPath(post.slug) === path)
}
