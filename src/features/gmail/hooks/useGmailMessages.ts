import { useInfiniteQuery } from '@tanstack/react-query'

import { GmailService } from '@/features/gmail/api/gmail.service'
import { GMAIL_MESSAGES_PAGE_SIZE, gmailKeys } from '@/features/gmail/constants'

export function useGmailMessages(enabled: boolean) {
  return useInfiniteQuery({
    queryKey: gmailKeys.messages,
    queryFn: ({ pageParam }) =>
      GmailService.listMessages({
        pageToken: pageParam,
        maxResults: GMAIL_MESSAGES_PAGE_SIZE,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextPageToken ?? undefined,
    enabled,
    refetchOnWindowFocus: true,
  })
}

export function flattenGmailMessages(
  data: ReturnType<typeof useGmailMessages>['data'],
) {
  return data?.pages.flatMap((page) => page.messages) ?? []
}
