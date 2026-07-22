import { getApiErrorCode, getApiErrorMessage } from '@/shared/utils/api-error'

export const GMAIL_REVOKED_MESSAGE =
  'Gmail access was revoked. Reconnect Gmail in Integrations.'

export function isGmailRevokedError(error: unknown): boolean {
  return (
    getApiErrorCode(error) === 'INTEGRATIONS_REQUIRED' &&
    getApiErrorMessage(error, '') === GMAIL_REVOKED_MESSAGE
  )
}
