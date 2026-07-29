/**
 * Gmail uses restricted Google OAuth scopes. Enabled for Google OAuth verification review.
 * Set to `false` again after verification if you want to hide the UI.
 */
export const GMAIL_FEATURE_ENABLED = true

export function isGmailFeatureEnabled(): boolean {
  return GMAIL_FEATURE_ENABLED
}
