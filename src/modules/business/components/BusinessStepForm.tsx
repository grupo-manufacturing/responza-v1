import { BrandMark } from '@/shared/ui/brand-ui'

import type { BusinessDetailsFormData, FormStep } from '../business-steps'
import { businessInputClassName } from '../business-steps'

type BusinessStepFormProps = {
  step: FormStep
  stepIndex: number
  formData: BusinessDetailsFormData
  onChange: (data: BusinessDetailsFormData) => void
}

type ChoiceField = Extract<FormStep, { kind: 'choice' }>['field']

export function BusinessStepForm({ step, stepIndex, formData, onChange }: BusinessStepFormProps) {
  return (
    <div key={stepIndex} className="animate-step-in space-y-4">
      <div className="flex items-start gap-3">
        <BrandMark size="sm" />
        <div className="min-w-0 flex-1 pt-0.5">
          <h3 className="text-base font-semibold leading-snug text-ink sm:text-lg">{step.title}</h3>
          <p className="mt-1 text-sm leading-snug text-ink-muted sm:text-base">{step.subtitle}</p>
        </div>
      </div>

      {step.kind === 'text' ? (
        <textarea
          value={formData[step.field]}
          onChange={(e) => onChange({ ...formData, [step.field]: e.target.value })}
          placeholder={step.placeholder}
          rows={step.rows}
          className={businessInputClassName}
        />
      ) : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
          {step.options.map((option) => {
            const selected = formData[step.field] === option.value
            return (
              <label
                key={option.value}
                className={[
                  'flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors duration-150',
                  selected
                    ? 'border-accent bg-accent/8 ring-1 ring-accent/20'
                    : 'border-border bg-white/80 hover:border-accent/30 hover:bg-surface-muted',
                ].join(' ')}
              >
                <input
                  type="radio"
                  name={step.field}
                  value={option.value}
                  checked={selected}
                  onChange={() =>
                    onChange({
                      ...formData,
                      [step.field]: option.value as BusinessDetailsFormData[ChoiceField],
                    })
                  }
                  className="h-4 w-4 shrink-0 accent-accent"
                />
                <span
                  className={[
                    'text-sm leading-snug sm:text-base',
                    selected ? 'font-medium text-ink' : 'text-ink-muted',
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
  )
}
