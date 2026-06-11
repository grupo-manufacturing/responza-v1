export const CUSTOMER_TONE_OPTIONS = [
  { value: 'very_formal_sir_madam', label: "Very formal (Sir/Ma'am)" },
  { value: 'semi_formal_friendly', label: 'Semi-formal but friendly' },
  { value: 'casual_like_friend', label: 'Casual like a friend' },
  { value: 'hinglish_local_feel', label: 'Hinglish / local feel' },
  { value: 'fully_regional_language', label: 'Fully regional language' },
] as const

export const COMMON_CONVERSATION_OPTIONS = [
  { value: 'order_status_tracking', label: 'Order status / tracking' },
  { value: 'product_enquiries', label: 'Product enquiries' },
  { value: 'complaints_returns', label: 'Complaints & returns' },
  { value: 'payment_issues', label: 'Payment issues' },
  { value: 'all_of_the_above', label: 'All of the above' },
] as const

export const CUSTOMER_LANGUAGE_OPTIONS = [
  { value: 'english', label: 'English' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'hinglish', label: 'Hinglish' },
  { value: 'regional', label: 'Regional (Tamil, Telugu, Marathi etc.)' },
  { value: 'mix_of_everything', label: 'Mix of everything' },
] as const

export const AI_RESTRICTIONS_OPTIONS = [
  { value: 'never_mention_competitors', label: 'Never mention competitors' },
  { value: 'never_offer_discounts_without_approval', label: 'Never offer discounts without approval' },
  { value: 'never_discuss_refunds_directly', label: 'Never discuss refunds directly' },
  { value: 'never_use_slang', label: 'Never use slang' },
  { value: 'no_restrictions', label: 'No restrictions' },
] as const

export type CustomerTone = (typeof CUSTOMER_TONE_OPTIONS)[number]['value']
export type CommonConversationTypes = (typeof COMMON_CONVERSATION_OPTIONS)[number]['value']
export type CustomerMessageLanguage = (typeof CUSTOMER_LANGUAGE_OPTIONS)[number]['value']
export type AiRestrictions = (typeof AI_RESTRICTIONS_OPTIONS)[number]['value']
