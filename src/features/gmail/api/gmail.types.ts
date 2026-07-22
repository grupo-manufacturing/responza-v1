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

export interface SendGmailMessagePayload {
  to: string
  subject: string
  body: string
}

export interface ReplyGmailMessagePayload {
  body: string
}

export interface SentGmailMessageResponse {
  message: {
    id: string
    threadId: string
  }
}
