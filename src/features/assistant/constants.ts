export const ASSISTANT_SUGGESTED_PROMPTS = [
  'How many conversations do I have?',
  'Which Instagram DMs need my reply?',
  'What recent emails are in my inbox?',
  'Which integrations are connected?',
] as const

export const ASSISTANT_QUESTION_MAX_LENGTH = 2000

/**
 * Chat needs its own viewport height because `DashboardPage` has `AppPageHeader` above it.
 * Subtracts shell padding + title/description so the panel fits without a page scrollbar.
 */
export const ASSISTANT_CHAT_PANEL_HEIGHT_CLASS =
  'h-[calc(100dvh-12.5rem)] lg:h-[calc(100dvh-8rem)]'
