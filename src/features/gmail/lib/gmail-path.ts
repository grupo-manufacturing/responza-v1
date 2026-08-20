export const ASSISTANT_LIST_GMAIL_DEFAULT_LIMIT = 10

export const ASSISTANT_LIST_GMAIL_MAX_LIMIT = 25

export function gmailMessagePath(messageId: string): string {
  return `/gmail?message=${encodeURIComponent(messageId)}`
}
