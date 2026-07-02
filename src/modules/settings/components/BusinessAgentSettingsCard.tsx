import { Link } from 'react-router-dom'

import { Alert } from '@/components/ui/Alert'
import { AuthService } from '@/modules/auth/auth.service'
import { AppCard } from '@/shared/ui/app-ui'
import { applySessionProfile } from '@/shared/hooks/useSession'
import { getApiErrorMessage } from '@/shared/utils/api-error'

type BusinessAgentSettingsCardProps = {
  readonly agentEnabled: boolean
  readonly agentDailyLimit: number
  readonly agentRepliesUsedToday: number
  readonly businessProfileCompleted: boolean
  readonly isSaving: boolean
  readonly message: { variant: 'success' | 'error'; text: string } | null
  readonly onAgentEnabledChange: (enabled: boolean) => void
  readonly onAgentUsageChange: (input: {
    agentDailyLimit: number
    agentRepliesUsedToday: number
  }) => void
  readonly onMessageChange: (message: { variant: 'success' | 'error'; text: string } | null) => void
  readonly onSavingChange: (isSaving: boolean) => void
}

export function BusinessAgentSettingsCard({
  agentEnabled,
  agentDailyLimit,
  agentRepliesUsedToday,
  businessProfileCompleted,
  isSaving,
  message,
  onAgentEnabledChange,
  onAgentUsageChange,
  onMessageChange,
  onSavingChange,
}: BusinessAgentSettingsCardProps) {
  const canToggle = businessProfileCompleted && !isSaving

  const handleToggle = () => {
    if (!canToggle) {
      return
    }

    const nextEnabled = !agentEnabled
    onSavingChange(true)
    onMessageChange(null)

    void AuthService.patchMe({ agentEnabled: nextEnabled })
      .then((me) => {
        onAgentEnabledChange(me.organization.agentEnabled)
        onAgentUsageChange({
          agentDailyLimit: me.organization.agentDailyLimit,
          agentRepliesUsedToday: me.organization.agentRepliesUsedToday,
        })
        applySessionProfile(me)
        onMessageChange({
          variant: 'success',
          text: nextEnabled ? 'Business agent enabled.' : 'Business agent disabled.',
        })
      })
      .catch((err: unknown) => {
        onMessageChange({
          variant: 'error',
          text: getApiErrorMessage(err, 'Could not update business agent settings.'),
        })
      })
      .finally(() => {
        onSavingChange(false)
      })
  }

  return (
    <AppCard className="mt-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-ink">Business agent</h3>
          <p className="mt-1 text-sm text-ink-muted">
            Automatically answer simple FAQ and business-information questions using your profile
            details. Complex or order-specific messages are left for you.
          </p>
          <p className="mt-2 text-xs text-ink-faint">
            {agentRepliesUsedToday} / {agentDailyLimit} auto-replies used today (UTC).
          </p>
          {!businessProfileCompleted && (
            <p className="mt-2 text-xs text-ink-muted">
              Complete your{' '}
              <Link to="/settings?tab=profile" className="font-medium text-accent-violet hover:underline">
                business profile
              </Link>{' '}
              before enabling the agent.
            </p>
          )}
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={agentEnabled}
          aria-label={agentEnabled ? 'Disable business agent' : 'Enable business agent'}
          disabled={!canToggle}
          onClick={handleToggle}
          className={[
            'relative mt-0.5 inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200',
            agentEnabled ? 'bg-ink' : 'bg-border',
            canToggle ? 'cursor-pointer' : 'cursor-not-allowed opacity-50',
          ].join(' ')}
        >
          <span
            className={[
              'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200',
              agentEnabled ? 'translate-x-5' : 'translate-x-0',
            ].join(' ')}
          />
        </button>
      </div>

      {message !== null && (
        <div className="mt-4">
          <Alert variant={message.variant}>{message.text}</Alert>
        </div>
      )}
    </AppCard>
  )
}
