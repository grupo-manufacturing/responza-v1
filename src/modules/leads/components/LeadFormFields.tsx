import { Select } from '@/components/ui/Select'
import { LEAD_STATUS_OPTIONS } from '@/modules/leads/leads.constants'
import { AppLabel } from '@/shared/ui/app-ui'

import { leadInputClassName, leadTextareaClassName, type LeadFormValues } from './lead-form'

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
        <AppLabel htmlFor={`${idPrefix}-name`}>
          Name <span className="text-red-600">*</span>
        </AppLabel>
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
        <AppLabel htmlFor={`${idPrefix}-email`}>Email</AppLabel>
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
        <AppLabel htmlFor={`${idPrefix}-phone`}>Phone</AppLabel>
        <input
          id={`${idPrefix}-phone`}
          type="tel"
          minLength={3}
          maxLength={32}
          value={values.phone}
          onChange={(event) => patch({ phone: event.target.value })}
          className={leadInputClassName}
        />
        <p className="mt-1 text-xs text-ink-faint">If provided, at least 3 characters.</p>
      </div>

      <div>
        <AppLabel htmlFor={`${idPrefix}-status`}>Status</AppLabel>
        <Select
          id={`${idPrefix}-status`}
          value={values.status}
          onChange={(status) => patch({ status })}
          options={LEAD_STATUS_OPTIONS}
          className="mt-1"
        />
      </div>

      <div>
        <AppLabel htmlFor={`${idPrefix}-notes`}>Notes</AppLabel>
        <textarea
          id={`${idPrefix}-notes`}
          rows={4}
          maxLength={5000}
          value={values.notes}
          onChange={(event) => patch({ notes: event.target.value })}
          className={leadTextareaClassName}
        />
      </div>
    </div>
  )
}
