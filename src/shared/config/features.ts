/**
 * Gmail uses restricted Google OAuth scopes and is hidden until verification completes.
 * Set to `true` once Google approves the OAuth verification submission.
 */
export const GMAIL_FEATURE_ENABLED = false

export function isGmailFeatureEnabled(): boolean {
  return GMAIL_FEATURE_ENABLED
}
