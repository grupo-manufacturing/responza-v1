import {
  AI_RESTRICTIONS_OPTIONS,
  COMMON_CONVERSATION_OPTIONS,
  CUSTOMER_LANGUAGE_OPTIONS,
  CUSTOMER_TONE_OPTIONS,
  type AiRestrictions,
  type CommonConversationTypes,
  type CustomerMessageLanguage,
  type CustomerTone,
} from './business.constants'
import type { CompleteBusinessPayload } from './business.service'
import { APP_TEXTAREA_CLASS } from '@/shared/ui/app-ui'

export type BusinessDetailsFormData = {
  brandAndProducts: string
  customerTone: CustomerTone | ''
  sampleCustomerReply: string
  commonConversationTypes: CommonConversationTypes | ''
  customerMessageLanguage: CustomerMessageLanguage | ''
  signaturePhrases: string
  aiRestrictions: AiRestrictions | ''
}

type TextField = 'brandAndProducts' | 'sampleCustomerReply' | 'signaturePhrases'
type ChoiceField =
  | 'customerTone'
  | 'commonConversationTypes'
  | 'customerMessageLanguage'
  | 'aiRestrictions'

export type FormStep =
  | {
      kind: 'text'
      field: TextField
      title: string
      subtitle: string
      placeholder: string
      rows: number
      minLength: number
    }
  | {
      kind: 'choice'
      field: ChoiceField
      title: string
      subtitle: string
      options: readonly { value: string; label: string }[]
    }

export const EMPTY_BUSINESS_FORM: BusinessDetailsFormData = {
  brandAndProducts: '',
  customerTone: '',
  sampleCustomerReply: '',
  commonConversationTypes: '',
  customerMessageLanguage: '',
  signaturePhrases: '',
  aiRestrictions: '',
}

export const BUSINESS_ONBOARDING_STEPS: FormStep[] = [
  {
    kind: 'text',
    field: 'brandAndProducts',
    title: 'What is your brand name and what do you sell?',
    subtitle: 'Tell us your brand and the products or services you offer.',
    placeholder: 'e.g., StyleHub — we sell ethnic wear and accessories for women online.',
    rows: 4,
    minLength: 1,
  },
  {
    kind: 'choice',
    field: 'customerTone',
    title: 'What tone do you use when talking to your customers?',
    subtitle: 'Pick the style that best matches how you usually reply.',
    options: CUSTOMER_TONE_OPTIONS,
  },
  {
    kind: 'text',
    field: 'sampleCustomerReply',
    title: 'How would you reply to "Is this product available?"',
    subtitle:
      "Write 2–3 lines the way you'd normally reply. Responza's AI learns your exact voice from this.",
    placeholder:
      'e.g., Hi! Yes, this item is in stock and ready to ship. Share your size and pincode and I will confirm delivery.',
    rows: 4,
    minLength: 20,
  },
  {
    kind: 'choice',
    field: 'commonConversationTypes',
    title: 'What are your most common customer conversations?',
    subtitle: 'Choose the type of messages you handle most often.',
    options: COMMON_CONVERSATION_OPTIONS,
  },
  {
    kind: 'choice',
    field: 'customerMessageLanguage',
    title: 'What language do your customers mostly message in?',
    subtitle: 'This helps Responza match the language your customers use.',
    options: CUSTOMER_LANGUAGE_OPTIONS,
  },
  {
    kind: 'text',
    field: 'signaturePhrases',
    title: 'Words, phrases or offers you always use',
    subtitle: 'Share any lines or promos you repeat often with customers.',
    placeholder: 'e.g., Free shipping above ₹499, Reply HELLO to get started',
    rows: 3,
    minLength: 1,
  },
  {
    kind: 'choice',
    field: 'aiRestrictions',
    title: 'What should the AI never say to your customers?',
    subtitle: 'Set a guardrail for automated replies.',
    options: AI_RESTRICTIONS_OPTIONS,
  },
]

export function buildCompletePayload(formData: BusinessDetailsFormData): CompleteBusinessPayload {
  return {
    brandAndProducts: formData.brandAndProducts.trim(),
    customerTone: formData.customerTone as CustomerTone,
    sampleCustomerReply: formData.sampleCustomerReply.trim(),
    commonConversationTypes: formData.commonConversationTypes as CommonConversationTypes,
    customerMessageLanguage: formData.customerMessageLanguage as CustomerMessageLanguage,
    signaturePhrases: formData.signaturePhrases.trim(),
    aiRestrictions: formData.aiRestrictions as AiRestrictions,
  }
}

export function canProceedStep(step: FormStep, formData: BusinessDetailsFormData): boolean {
  if (step.kind === 'text') {
    return formData[step.field].trim().length >= step.minLength
  }

  return formData[step.field] !== ''
}

export const businessInputClassName = `${APP_TEXTAREA_CLASS} px-4 py-3 text-base`
