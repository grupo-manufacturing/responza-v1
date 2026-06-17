import { useEffect, useState } from 'react'

import { Alert } from '@/components/ui/Alert'
import { Select } from '@/components/ui/Select'
import { SpinnerSection } from '@/components/ui/Spinner'
import { AuthService } from '@/modules/auth/auth.service'
import { applySessionProfile } from '@/shared/hooks/useSession'
import type { TranslationLanguage } from '@/shared/session/storage'
import { getApiErrorMessage } from '@/shared/utils/api-error'

const inputClassName =
  'w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition-all duration-200 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10'

const labelClassName = 'mb-1.5 block text-sm font-medium text-neutral-700'

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
    return <SpinnerSection label="Loading account..." minHeightClassName="min-h-[20rem]" />
  }

  if (loadError !== null) {
    return (
      <div className="max-w-2xl rounded-2xl border border-red-100 bg-red-50/50 p-6 text-sm text-red-600">
        {loadError}
      </div>
    )
  }

  const selectOptions: ReadonlyArray<{ value: LanguageSelectValue; label: string }> = [
    { value: '', label: 'Select target language…' },
    ...languageOptions,
  ]

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-neutral-900">General</h2>
        <p className="mt-1 text-sm text-neutral-500">
          Your account details, translation preference, and login credentials.
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <form onSubmit={handleSaveAccount} className="space-y-5 p-6 sm:p-8">
          <div>
            <label htmlFor="account-name" className={labelClassName}>
              Name
            </label>
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
              className={inputClassName}
              maxLength={160}
            />
          </div>

          <div>
            <label htmlFor="account-email" className={labelClassName}>
              Email
            </label>
            <input
              id="account-email"
              name="email"
              type="email"
              value={email}
              readOnly
              className={[
                inputClassName,
                'cursor-not-allowed bg-neutral-50 text-neutral-500',
              ].join(' ')}
            />
            <p className="mt-1.5 text-xs text-neutral-500">Login email cannot be changed here.</p>
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
            <p className="mt-1.5 text-xs text-neutral-500">
              Inbox messages will be translated into this language when you use translate.
            </p>
          </div>

          {accountMessage !== null && (
            <Alert variant={accountMessage.variant}>{accountMessage.text}</Alert>
          )}

          <div className="flex justify-end border-t border-neutral-100 pt-5">
            <button
              type="submit"
              disabled={!canSaveAccount}
              className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSavingAccount ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>

        <div className="border-t border-neutral-100 px-6 py-6 sm:px-8 sm:py-8">
          <h3 className="text-sm font-semibold text-neutral-900">Change password</h3>
          <p className="mt-1 text-sm text-neutral-500">
            Use a strong password you do not use elsewhere.
          </p>

          <form onSubmit={handleChangePassword} className="mt-5 space-y-4">
            <div>
              <label htmlFor="current-password" className={labelClassName}>
                Current password
              </label>
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
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="new-password" className={labelClassName}>
                New password
              </label>
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
                className={inputClassName}
                minLength={8}
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className={labelClassName}>
                Confirm new password
              </label>
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
                className={inputClassName}
                minLength={8}
              />
            </div>

            {passwordMessage !== null && (
              <Alert variant={passwordMessage.variant}>{passwordMessage.text}</Alert>
            )}

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={
                  isSavingPassword ||
                  currentPassword.length === 0 ||
                  newPassword.length === 0 ||
                  confirmPassword.length === 0
                }
                className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition-colors hover:border-neutral-300 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSavingPassword ? 'Updating…' : 'Update password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
