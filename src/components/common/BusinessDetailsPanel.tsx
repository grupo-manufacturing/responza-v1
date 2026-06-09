import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

import {
  AI_RESTRICTIONS_OPTIONS,
  COMMON_CONVERSATION_OPTIONS,
  CUSTOMER_LANGUAGE_OPTIONS,
  CUSTOMER_TONE_OPTIONS,
  type AiRestrictions,
  type CommonConversationTypes,
  type CustomerMessageLanguage,
  type CustomerTone,
} from '@/shared/constants/business-details'
import { Spinner, SpinnerOverlay } from '@/components/ui/Spinner'
import AuthService from '@/shared/services/auth.service'
import BusinessDetailsService, {
  type CompleteBusinessDetailsPayload,
} from '@/shared/services/business-details.service'
import { getApiErrorMessage } from '@/shared/utils/api-error'

type BusinessDetailsFormData = {
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

type FormStep =
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

const EMPTY_FORM: BusinessDetailsFormData = {
  brandAndProducts: '',
  customerTone: '',
  sampleCustomerReply: '',
  commonConversationTypes: '',
  customerMessageLanguage: '',
  signaturePhrases: '',
  aiRestrictions: '',
}

const STEPS: FormStep[] = [
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

function buildCompletePayload(formData: BusinessDetailsFormData): CompleteBusinessDetailsPayload {
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

function canProceedStep(step: FormStep, formData: BusinessDetailsFormData): boolean {
  if (step.kind === 'text') {
    return formData[step.field].trim().length >= step.minLength
  }

  return formData[step.field] !== ''
}

const inputClassName =
  'w-full resize-none rounded-xl border border-neutral-200 bg-white px-4 py-3 text-base leading-relaxed text-neutral-900 outline-none transition-all duration-300 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10'

const primaryButtonClassName =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-7 py-3 text-base font-semibold text-white transition-all duration-200 hover:bg-neutral-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50'

export function BusinessDetailsPanel() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isHydrating, setIsHydrating] = useState(true)
  const [alreadyCompleted, setAlreadyCompleted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<BusinessDetailsFormData>(EMPTY_FORM)

  useEffect(() => {
    let cancelled = false

    void BusinessDetailsService.getBusinessDetails()
      .then(({ profile }) => {
        if (cancelled) return

        if (profile.completed) {
          setAlreadyCompleted(true)
        }
      })
      .catch(() => {
        // New account — show empty form.
      })
      .finally(() => {
        if (!cancelled) {
          setIsHydrating(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const handleNext = () => {
    setError(null)
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    setError(null)

    try {
      await BusinessDetailsService.completeBusinessDetails(buildCompletePayload(formData))
      AuthService.setBusinessDetailsCompleted(true)
      navigate('/dashboard', { replace: true })
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Something went wrong. Please try again.'))
    } finally {
      setIsLoading(false)
    }
  }

  const currentStepData = STEPS[currentStep]
  const isLastStep = currentStep === STEPS.length - 1
  const progress = ((currentStep + 1) / STEPS.length) * 100
  const canProceed = canProceedStep(currentStepData, formData)

  if (isHydrating) {
    return (
      <SpinnerOverlay
        label="Preparing your setup..."
        className="bg-neutral-50"
      />
    )
  }

  if (alreadyCompleted) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-neutral-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-neutral-200/40 blur-3xl" />
        <div className="absolute -right-16 bottom-1/4 h-80 w-80 rounded-full bg-neutral-300/30 blur-3xl" />
        <div className="absolute left-1/2 top-8 h-56 w-56 -translate-x-1/2 rounded-full bg-white blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-4xl flex-1 flex-col gap-5 px-6 py-6 sm:gap-6 sm:px-8 sm:py-8">
        <header className="shrink-0 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-sm font-bold text-white shadow-md">
              R
            </div>
            <span className="text-lg font-semibold text-neutral-900">Responza</span>
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-neutral-900 sm:text-3xl">
            Set up your business details
          </h1>
        </header>

        <div className="flex shrink-0 items-center gap-3">
          <div className="relative h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-neutral-200">
            <div
              className="h-full rounded-full bg-neutral-900 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="shrink-0 text-sm font-semibold text-neutral-600">
            Step {currentStep + 1} of {STEPS.length}
          </span>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-lg shadow-neutral-900/5 sm:gap-5 sm:p-8">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div key={currentStep} className="animate-step-in space-y-4">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-sm font-bold text-white shadow-sm">
                {currentStep + 1}
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <h3 className="text-base font-semibold leading-snug text-neutral-900 sm:text-lg">
                  {currentStepData.title}
                </h3>
                <p className="mt-1 text-sm leading-snug text-neutral-500 sm:text-base">
                  {currentStepData.subtitle}
                </p>
              </div>
            </div>

            {currentStepData.kind === 'text' ? (
              <textarea
                value={formData[currentStepData.field]}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, [currentStepData.field]: e.target.value }))
                }
                placeholder={currentStepData.placeholder}
                rows={currentStepData.rows}
                className={inputClassName}
              />
            ) : (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                {currentStepData.options.map((option) => {
                  const selected = formData[currentStepData.field] === option.value
                  return (
                    <label
                      key={option.value}
                      className={[
                        'flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors duration-150',
                        selected
                          ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900/15'
                          : 'border-neutral-200 bg-white hover:border-neutral-400 hover:bg-neutral-50',
                      ].join(' ')}
                    >
                      <input
                        type="radio"
                        name={currentStepData.field}
                        value={option.value}
                        checked={selected}
                        onChange={() =>
                          setFormData((prev) => ({
                            ...prev,
                            [currentStepData.field]: option.value as BusinessDetailsFormData[ChoiceField],
                          }))
                        }
                        className="h-4 w-4 shrink-0 accent-neutral-900"
                      />
                      <span
                        className={[
                          'text-sm leading-snug sm:text-base',
                          selected ? 'font-medium text-neutral-900' : 'text-neutral-700',
                        ].join(' ')}
                      >
                        {option.label}
                      </span>
                    </label>
                  )
                })}
              </div>
            )}
          </div>

          <div className="mt-2 flex items-center justify-between gap-3 border-t border-neutral-200 pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              disabled={currentStep === 0 || isLoading}
              className="inline-flex items-center rounded-xl border border-neutral-200 bg-white px-5 py-3 text-base font-medium text-neutral-600 transition-all duration-300 hover:border-neutral-400 hover:bg-neutral-50 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Back
            </button>

            {isLastStep ? (
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={!canProceed || isLoading}
                className={primaryButtonClassName}
              >
                {isLoading ? (
                  <>
                    <Spinner size="sm" variant="white" />
                    Saving...
                  </>
                ) : (
                  'Save & finish setup'
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                disabled={!canProceed}
                className={primaryButtonClassName}
              >
                Next
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
