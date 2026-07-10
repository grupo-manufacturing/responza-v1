import { useEffect, useState } from 'react'

import { Alert } from '@/components/ui/Alert'
import { SpinnerSection } from '@/components/ui/Spinner'
import { AgentService, type AgentSettings } from '@/modules/agent/agent.service'
import { AppButton, AppCard, AppLabel, APP_INPUT_CLASS } from '@/shared/ui/app-ui'
import { getApiErrorMessage } from '@/shared/utils/api-error'

const TIMEZONE_OPTIONS = [
  { value: 'Asia/Kolkata', label: 'India (IST)' },
  { value: 'Asia/Dubai', label: 'UAE (GST)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
  { value: 'Europe/London', label: 'UK (GMT/BST)' },
  { value: 'America/New_York', label: 'US Eastern' },
] as const

export function AgentSettingsPanel() {
  const [settings, setSettings] = useState<AgentSettings | null>(null)
  const [enabled, setEnabled] = useState(false)
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.9)
  const [businessHoursEnabled, setBusinessHoursEnabled] = useState(false)
  const [businessHoursTimezone, setBusinessHoursTimezone] = useState('Asia/Kolkata')
  const [businessHoursStart, setBusinessHoursStart] = useState('09:00')
  const [businessHoursEnd, setBusinessHoursEnd] = useState('18:00')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [message, setMessage] = useState<{ variant: 'success' | 'error'; text: string } | null>(
    null,
  )

  useEffect(() => {
    let cancelled = false

    void AgentService.getSettings()
      .then((loaded) => {
        if (cancelled) return
        setSettings(loaded)
        setEnabled(loaded.enabled)
        setConfidenceThreshold(loaded.confidenceThreshold)
        setBusinessHoursEnabled(loaded.businessHoursEnabled)
        setBusinessHoursTimezone(loaded.businessHoursTimezone)
        setBusinessHoursStart(loaded.businessHoursStart)
        setBusinessHoursEnd(loaded.businessHoursEnd)
      })
      .catch(() => {
        if (!cancelled) setLoadError('Could not load agent settings.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const isDirty =
    settings !== null &&
    (enabled !== settings.enabled ||
      confidenceThreshold !== settings.confidenceThreshold ||
      businessHoursEnabled !== settings.businessHoursEnabled ||
      businessHoursTimezone !== settings.businessHoursTimezone ||
      businessHoursStart !== settings.businessHoursStart ||
      businessHoursEnd !== settings.businessHoursEnd)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!isDirty || saving) return

    setSaving(true)
    setMessage(null)

    try {
      const updated = await AgentService.updateSettings({
        enabled,
        confidenceThreshold,
        businessHoursEnabled,
        businessHoursTimezone,
        businessHoursStart,
        businessHoursEnd,
      })
      setSettings(updated)
      setMessage({ variant: 'success', text: 'Agent settings updated.' })
    } catch (err: unknown) {
      setMessage({
        variant: 'error',
        text: getApiErrorMessage(err, 'Could not update agent settings.'),
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <SpinnerSection minHeightClassName="min-h-[20rem]" />
  }

  if (loadError !== null) {
    return <Alert variant="error">{loadError}</Alert>
  }

  return (
    <div className="max-w-2xl">
      <AppCard>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-base font-semibold text-ink">Auto-reply with AI</h3>
            <p className="mt-1 text-sm text-ink-muted">
              When enabled, Responza can automatically reply to customer messages using your
              business profile and catalogue knowledge. Replies are sent only when confidence is
              high.
            </p>
          </div>

          <label className="flex items-start gap-3 rounded-xl border border-border bg-surface-muted/50 p-4">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(event) => {
                setEnabled(event.target.checked)
                setMessage(null)
              }}
              className="mt-1 h-4 w-4 rounded border-border text-accent focus:ring-accent"
            />
            <span>
              <span className="block text-sm font-medium text-ink">Enable auto-reply</span>
              <span className="mt-1 block text-sm text-ink-muted">
                Off by default. The agent skips refunds, complaints, and low-confidence messages.
              </span>
            </span>
          </label>

          <div>
            <AppLabel htmlFor="agent-confidence">Confidence threshold</AppLabel>
            <input
              id="agent-confidence"
              type="number"
              min={0.5}
              max={1}
              step={0.05}
              value={confidenceThreshold}
              onChange={(event) => {
                setConfidenceThreshold(Number(event.target.value))
                setMessage(null)
              }}
              className={APP_INPUT_CLASS}
            />
            <p className="mt-1.5 text-xs text-ink-faint">
              Recommended: 0.90. Higher values reply less often but more safely.
            </p>
          </div>

          <div className="border-t border-border pt-6">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={businessHoursEnabled}
                onChange={(event) => {
                  setBusinessHoursEnabled(event.target.checked)
                  setMessage(null)
                }}
                className="mt-1 h-4 w-4 rounded border-border text-accent focus:ring-accent"
              />
              <span>
                <span className="block text-sm font-medium text-ink">Limit to business hours</span>
                <span className="mt-1 block text-sm text-ink-muted">
                  Auto-replies are only sent during the hours you set below.
                </span>
              </span>
            </label>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-3">
                <AppLabel htmlFor="agent-timezone">Timezone</AppLabel>
                <select
                  id="agent-timezone"
                  value={businessHoursTimezone}
                  onChange={(event) => {
                    setBusinessHoursTimezone(event.target.value)
                    setMessage(null)
                  }}
                  className={APP_INPUT_CLASS}
                >
                  {TIMEZONE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <AppLabel htmlFor="agent-hours-start">Start</AppLabel>
                <input
                  id="agent-hours-start"
                  type="time"
                  value={businessHoursStart}
                  onChange={(event) => {
                    setBusinessHoursStart(event.target.value)
                    setMessage(null)
                  }}
                  className={APP_INPUT_CLASS}
                />
              </div>

              <div>
                <AppLabel htmlFor="agent-hours-end">End</AppLabel>
                <input
                  id="agent-hours-end"
                  type="time"
                  value={businessHoursEnd}
                  onChange={(event) => {
                    setBusinessHoursEnd(event.target.value)
                    setMessage(null)
                  }}
                  className={APP_INPUT_CLASS}
                />
              </div>
            </div>
          </div>

          {message !== null && <Alert variant={message.variant}>{message.text}</Alert>}

          <div className="flex justify-end border-t border-border pt-5">
            <AppButton type="submit" disabled={!isDirty || saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </AppButton>
          </div>
        </form>
      </AppCard>
    </div>
  )
}
