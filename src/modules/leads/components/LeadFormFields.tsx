import { Select } from '@/components/ui/Select'
import { LEAD_STATUS_OPTIONS } from '@/shared/constants/leads'

import { leadInputClassName, type LeadFormValues } from './lead-form'

type LeadFormFieldsProps = {
  idPrefix: string
  values: LeadFormValues
  onChange: (values: LeadFormValues) => void
}

export function LeadFormFields({ idPrefix, values, onChange }: LeadFormFieldsProps) {
  const patch = (partial: Partial<LeadFormValues>) => onChange({ ...values, ...partial })

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor={`${idPrefix}-name`} className="text-sm font-medium text-neutral-700">
          Name <span className="text-red-600">*</span>
        </label>
        <input
          id={`${idPrefix}-name`}
          required
          maxLength={200}
          value={values.name}
          onChange={(event) => patch({ name: event.target.value })}
          className={leadInputClassName}
        />
      </div>

      <div>
        <label htmlFor={`${idPrefix}-email`} className="text-sm font-medium text-neutral-700">
          Email
        </label>
        <input
          id={`${idPrefix}-email`}
          type="email"
          maxLength={320}
          value={values.email}
          onChange={(event) => patch({ email: event.target.value })}
          className={leadInputClassName}
        />
      </div>

      <div>
        <label htmlFor={`${idPrefix}-phone`} className="text-sm font-medium text-neutral-700">
          Phone
        </label>
        <input
          id={`${idPrefix}-phone`}
          type="tel"
          minLength={3}
          maxLength={32}
          value={values.phone}
          onChange={(event) => patch({ phone: event.target.value })}
          className={leadInputClassName}
        />
        <p className="mt-1 text-xs text-neutral-500">If provided, at least 3 characters.</p>
      </div>

      <div>
        <label htmlFor={`${idPrefix}-status`} className="text-sm font-medium text-neutral-700">
          Status
        </label>
        <Select
          id={`${idPrefix}-status`}
          value={values.status}
          onChange={(status) => patch({ status })}
          options={LEAD_STATUS_OPTIONS}
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor={`${idPrefix}-notes`} className="text-sm font-medium text-neutral-700">
          Notes
        </label>
        <textarea
          id={`${idPrefix}-notes`}
          rows={4}
          maxLength={5000}
          value={values.notes}
          onChange={(event) => patch({ notes: event.target.value })}
          className={leadInputClassName}
        />
      </div>
    </div>
  )
}
