import { useEffect, useState } from 'react'

import { Alert } from '@/components/ui/Alert'
import { Select } from '@/components/ui/Select'
import { SpinnerSection } from '@/components/ui/Spinner'
import { AuthService } from '@/modules/auth/auth.service'
import { AppButton, AppCard, AppLabel, APP_INPUT_CLASS } from '@/shared/ui/app-ui'
import { applySessionProfile } from '@/shared/hooks/useSession'
import type { TranslationLanguage } from '@/shared/session/storage'
import { getApiErrorMessage } from '@/shared/utils/api-error'

const readOnlyInputClass = `${APP_INPUT_CLASS} cursor-not-allowed bg-surface-muted text-ink-muted`

type LanguageSelectValue = TranslationLanguage | ''

export function GeneralSettingsPanel() {
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
  const [accountMessage, setAccountMessage] = useState<{
    variant: 'success' | 'error'
    text: string
  } | null>(null)
  const [passwordMessage, setPasswordMessage] = useState<{
    variant: 'success' | 'error'
    text: string
  } | null>(null)
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
        if (!cancelled) setLoadError('Could not load account details.')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const nameDirty = name.trim() !== savedName
  const languageDirty = targetLanguage !== savedTargetLanguage
  const canSaveAccount =
    (nameDirty || languageDirty) && name.trim().length > 0 && !isSavingAccount

  const handleSaveAccount = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!canSaveAccount) return

    setIsSavingAccount(true)
    setAccountMessage(null)

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
      setAccountMessage({ variant: 'success', text: 'Account settings updated.' })
    } catch (err: unknown) {
      setAccountMessage({
        variant: 'error',
        text: getApiErrorMessage(err, 'Could not update account settings.'),
      })
    } finally {
      setIsSavingAccount(false)
    }
  }

  const handleChangePassword = async (event: React.FormEvent) => {
    event.preventDefault()
    setPasswordMessage(null)

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ variant: 'error', text: 'New passwords do not match.' })
      return
    }

    if (newPassword.length < 8) {
      setPasswordMessage({ variant: 'error', text: 'New password must be at least 8 characters.' })
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
      setPasswordMessage({ variant: 'success', text: 'Password updated.' })
    } catch (err: unknown) {
      setPasswordMessage({
        variant: 'error',
        text: getApiErrorMessage(err, 'Could not update password.'),
      })
    } finally {
      setIsSavingPassword(false)
    }
  }

  if (isLoading) {
    return <SpinnerSection minHeightClassName="min-h-[20rem]" />
  }

  if (loadError !== null) {
    return <Alert variant="error">{loadError}</Alert>
  }

  const selectOptions: ReadonlyArray<{ value: LanguageSelectValue; label: string }> = [
    { value: '', label: 'Select target language…' },
    ...languageOptions,
  ]

  return (
    <div className="max-w-2xl">
      <AppCard>
        <form onSubmit={handleSaveAccount} className="space-y-5">
          <div>
            <AppLabel htmlFor="account-name">Organization name</AppLabel>
            <input
              id="account-name"
              name="name"
              type="text"
              autoComplete="organization"
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                setAccountMessage(null)
              }}
              className={APP_INPUT_CLASS}
              maxLength={160}
            />
          </div>

          <div>
            <AppLabel htmlFor="account-email">Email</AppLabel>
            <input
              id="account-email"
              name="email"
              type="email"
              value={email}
              readOnly
              className={readOnlyInputClass}
            />
            <p className="mt-1.5 text-xs text-ink-faint">Login email cannot be changed here.</p>
          </div>

          <div>
            <Select<LanguageSelectValue>
              id="target-translation-language"
              label="Target translation language"
              value={targetLanguage}
              onChange={(value) => {
                setTargetLanguage(value)
                setAccountMessage(null)
              }}
              options={selectOptions}
              placeholder="Select target language…"
            />
            <p className="mt-1.5 text-xs text-ink-faint">
              Inbox messages will be translated into this language when you use translate.
            </p>
          </div>

          {accountMessage !== null && (
            <Alert variant={accountMessage.variant}>{accountMessage.text}</Alert>
          )}

          <div className="flex justify-end border-t border-border pt-5">
            <AppButton type="submit" disabled={!canSaveAccount}>
              {isSavingAccount ? 'Saving…' : 'Save changes'}
            </AppButton>
          </div>
        </form>

        <div className="mt-8 border-t border-border pt-8">
          <h3 className="text-sm font-semibold text-ink">Change password</h3>
          <p className="mt-1 text-sm text-ink-muted">Use a strong password you do not use elsewhere.</p>

          <form onSubmit={handleChangePassword} className="mt-5 space-y-4">
            <div>
              <AppLabel htmlFor="current-password">Current password</AppLabel>
              <input
                id="current-password"
                name="currentPassword"
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(event) => {
                  setCurrentPassword(event.target.value)
                  setPasswordMessage(null)
                }}
                className={APP_INPUT_CLASS}
              />
            </div>

            <div>
              <AppLabel htmlFor="new-password">New password</AppLabel>
              <input
                id="new-password"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(event) => {
                  setNewPassword(event.target.value)
                  setPasswordMessage(null)
                }}
                className={APP_INPUT_CLASS}
                minLength={8}
              />
            </div>

            <div>
              <AppLabel htmlFor="confirm-password">Confirm new password</AppLabel>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value)
                  setPasswordMessage(null)
                }}
                className={APP_INPUT_CLASS}
                minLength={8}
              />
            </div>

            {passwordMessage !== null && (
              <Alert variant={passwordMessage.variant}>{passwordMessage.text}</Alert>
            )}

            <div className="flex justify-end pt-1">
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
        </div>
      </AppCard>
    </div>
  )
}
