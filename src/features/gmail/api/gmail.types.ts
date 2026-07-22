export interface GmailMessageListItem {
  id: string
  from: string
  to: string
  subject: string
  snippet: string
  receivedAt: string
}

export interface GmailMessageDetail extends GmailMessageListItem {
  bodyHtml: string
}

export interface ListGmailMessagesResponse {
  messages: GmailMessageListItem[]
  nextPageToken: string | null
}

export interface GetGmailMessageResponse {
  message: GmailMessageDetail
}
