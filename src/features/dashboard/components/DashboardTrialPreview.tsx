import { ProLockedSection } from '@/shared/ui/gates/ProLockedSection'
import { ConversationQueueList } from '@/features/dashboard/components/ConversationQueueList'
import { DashboardActionPanel } from '@/features/dashboard/components/DashboardActionPanel'
import { DashboardStatsRow } from '@/features/dashboard/components/DashboardStatsRow'
import { DASHBOARD_PREVIEW_DATA } from '@/features/dashboard/lib/dashboard.preview'
import { AppPage, AppPageHeader } from '@/shared/ui/app-ui'

export function DashboardTrialPreview() {
  const data = DASHBOARD_PREVIEW_DATA

  return (
    <AppPage>
      <AppPageHeader
        title="Dashboard"
        description="See what needs your attention and jump straight into action."
      />

      <ProLockedSection className="min-h-[70vh]">
        <div className="space-y-6">
          <DashboardStatsRow
            stats={data.stats}
            needsReplyCount={data.needsReply.length}
            toNudgeCount={data.toNudge.length}
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <DashboardActionPanel
              title="Conversations that need your reply"
              description="Customers are waiting for a response."
              viewAllHref="/whatsapp"
              viewAllLabel="Open WhatsApp"
            >
              <ConversationQueueList
                conversations={data.needsReply}
                emptyMessage="All caught up — no conversations need a reply."
                actionLabel="Reply"
              />
            </DashboardActionPanel>

            <DashboardActionPanel
              title="Conversations to nudge"
              description="You replied, but the customer has gone quiet."
              viewAllHref="/whatsapp"
              viewAllLabel="Open WhatsApp"
            >
              <ConversationQueueList
                conversations={data.toNudge}
                emptyMessage="No conversations need a follow-up nudge."
                actionLabel="Nudge"
              />
            </DashboardActionPanel>
          </div>
        </div>
      </ProLockedSection>
    </AppPage>
  )
}
