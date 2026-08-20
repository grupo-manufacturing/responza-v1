import { useEffect, useState, type ReactNode } from 'react'

import { Select } from '@/shared/ui/primitives/Select'
import { SpinnerSection } from '@/shared/ui/primitives/Spinner'
import { AuthService } from '@/features/auth/api/auth.service'
import { AppButton, AppCard, AppLabel, APP_INPUT_CLASS } from '@/shared/ui/app-ui'
import { applySessionProfile } from '@/shared/hooks/useSession'
import type { TranslationLanguage } from '@/shared/session/storage'
import { useToast } from '@/shared/ui/toast'
import { getApiErrorMessage } from '@/shared/utils/api-error'

const readOnlyInputClass = `${APP_INPUT_CLASS} cursor-not-allowed bg-surface-muted text-ink-muted`

type LanguageSelectValue = TranslationLanguage | ''

function Field({
  id,
  label,
  hint,
  children,
}: {
  readonly id?: string
  readonly label: string
  readonly hint?: string
  readonly children: ReactNode
}) {
  return (
    <div>
      <AppLabel htmlFor={id}>{label}</AppLabel>
      {children}
      {hint !== undefined && <p className="mt-1 text-xs text-ink-faint">{hint}</p>}
    </div>
  )
}

export function GeneralSettingsPanel() {
  const toast = useToast()
  const [name, setName] = useState('')
  const [savedName, setSavedName] = useState('')
  const [email, setEmail] = useState('')
  const [targetLanguage, setTargetLanguage] = useState<LanguageSelectValue>('')
  const [savedTargetLanguage, setSavedTargetLanguage] = useState<LanguageSelectValue>('')
  const [languageOptions, setLanguageOptions] = useState<
    ReadonlyArray<{ value: TranslationLanguage; label: string }>
  >([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSavingAccount, setIsSavingAccount] = useState(false)
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    let cancelled = false

    void Promise.all([AuthService.getMe(), AuthService.getTranslationLanguages()])
      .then(([me, { languages }]) => {
        if (cancelled) return
        setName(me.organization.name)
        setSavedName(me.organization.name)
        setEmail(me.organization.email)
        const preferred = me.organization.preferredTranslationLanguage ?? ''
        setTargetLanguage(preferred)
        setSavedTargetLanguage(preferred)
        setLanguageOptions(
          languages.map((language) => ({
            value: language.code,
            label: language.label,
          })),
        )
        applySessionProfile(me)
      })
      .catch(() => {
        if (!cancelled) {
          const message = 'Could not load account details.'
          setLoadError(message)
          toast.error(message)
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [toast])

  const nameDirty = name.trim() !== savedName
  const languageDirty = targetLanguage !== savedTargetLanguage
  const canSaveAccount =
    (nameDirty || languageDirty) && name.trim().length > 0 && !isSavingAccount

  const handleSaveAccount = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!canSaveAccount) return

    setIsSavingAccount(true)

    try {
      const payload: {
        name?: string
        preferredTranslationLanguage?: TranslationLanguage | null
      } = {}

      if (nameDirty) {
        payload.name = name.trim()
      }

      if (languageDirty) {
        payload.preferredTranslationLanguage = targetLanguage === '' ? null : targetLanguage
      }

      const me = await AuthService.patchMe(payload)
      setName(me.organization.name)
      setSavedName(me.organization.name)
      const preferred = me.organization.preferredTranslationLanguage ?? ''
      setTargetLanguage(preferred)
      setSavedTargetLanguage(preferred)
      applySessionProfile(me)
      toast.success('Account settings updated.')
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Could not update account settings.'))
    } finally {
      setIsSavingAccount(false)
    }
  }

  const handleChangePassword = async (event: React.FormEvent) => {
    event.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.')
      return
    }

    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters.')
      return
    }

    setIsSavingPassword(true)

    try {
      await AuthService.changePassword({
        currentPassword,
        newPassword,
      })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      toast.success('Password updated.')
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Could not update password.'))
    } finally {
      setIsSavingPassword(false)
    }
  }

  if (isLoading) {
    return <SpinnerSection minHeightClassName="min-h-[20rem]" />
  }

  if (loadError !== null) {
    return <p className="text-sm text-ink-muted">{loadError}</p>
  }

  const selectOptions: ReadonlyArray<{ value: LanguageSelectValue; label: string }> = [
    { value: '', label: 'Select target language…' },
    ...languageOptions,
  ]

  return (
    <div className="grid items-stretch gap-4 lg:grid-cols-2">
      <AppCard padding="compact" className="flex h-full flex-col">
        <form onSubmit={handleSaveAccount} className="flex h-full flex-col gap-3">
          <Field id="account-name" label="Organization name">
            <input
              id="account-name"
              name="name"
              type="text"
              autoComplete="organization"
              value={name}
              onChange={(event) => {
                setName(event.target.value)
              }}
              className={APP_INPUT_CLASS}
              maxLength={160}
            />
          </Field>

          <Field id="account-email" label="Email" hint="Login email cannot be changed here.">
            <input
              id="account-email"
              name="email"
              type="email"
              value={email}
              readOnly
              className={readOnlyInputClass}
            />
          </Field>

          <Field
            id="target-translation-language"
            label="Target translation language"
            hint="Inbox messages will be translated into this language when you use translate."
          >
            <Select<LanguageSelectValue>
              id="target-translation-language"
              value={targetLanguage}
              onChange={(value) => {
                setTargetLanguage(value)
              }}
              options={selectOptions}
              placeholder="Select target language…"
            />
          </Field>

          <div className="mt-auto flex justify-end border-t border-border pt-3">
            <AppButton type="submit" disabled={!canSaveAccount}>
              {isSavingAccount ? 'Saving…' : 'Save changes'}
            </AppButton>
          </div>
        </form>
      </AppCard>

      <AppCard padding="compact" className="flex h-full flex-col">
        <form onSubmit={handleChangePassword} className="flex h-full flex-col gap-3">
          <div>
            <h3 className="text-sm font-semibold text-ink">Change password</h3>
            <p className="mt-0.5 text-sm text-ink-muted">Use a strong password you do not use elsewhere.</p>
          </div>
          <Field id="current-password" label="Current password">
            <input
              id="current-password"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(event) => {
                setCurrentPassword(event.target.value)
              }}
              className={APP_INPUT_CLASS}
            />
          </Field>

          <Field id="new-password" label="New password">
            <input
              id="new-password"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(event) => {
                setNewPassword(event.target.value)
              }}
              className={APP_INPUT_CLASS}
              minLength={8}
            />
          </Field>

          <Field id="confirm-password" label="Confirm new password">
            <input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value)
              }}
              className={APP_INPUT_CLASS}
              minLength={8}
            />
          </Field>

          <div className="mt-auto flex justify-end border-t border-border pt-3">
            <AppButton
              type="submit"
              variant="secondary"
              disabled={
                isSavingPassword ||
                currentPassword.length === 0 ||
                newPassword.length === 0 ||
                confirmPassword.length === 0
              }
            >
              {isSavingPassword ? 'Updating…' : 'Update password'}
            </AppButton>
          </div>
        </form>
      </AppCard>
    </div>
  )
}
