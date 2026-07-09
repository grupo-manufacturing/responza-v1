import { ProLockedSection } from '@/components/common/ProLockedSection'
import { ConversationQueueList } from '@/modules/dashboard/components/ConversationQueueList'
import { DashboardActionPanel } from '@/modules/dashboard/components/DashboardActionPanel'
import { DashboardStatsRow } from '@/modules/dashboard/components/DashboardStatsRow'
import { LeadQueueList } from '@/modules/dashboard/components/LeadQueueList'
import { DASHBOARD_PREVIEW_DATA } from '@/modules/dashboard/dashboard.preview'
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
            leadsCount={data.leadsToFollowUp.length}
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <DashboardActionPanel
              title="Conversations that need your reply"
              description="Customers are waiting for a response."
              viewAllHref="/inbox"
              viewAllLabel="Open inbox"
            >
              <ConversationQueueList
                conversations={data.needsReply}
                emptyMessage="All caught up — no conversations need a reply."
                actionLabel="Reply"
              />
            </DashboardActionPanel>

            <DashboardActionPanel
              title="Leads to follow up on"
              description="Active leads that may need your attention."
              viewAllHref="/leads"
              viewAllLabel="Open leads"
            >
              <LeadQueueList
                leads={data.leadsToFollowUp}
                emptyMessage="No leads need follow-up right now."
              />
            </DashboardActionPanel>

            <div className="lg:col-span-2">
              <DashboardActionPanel
                title="Conversations to nudge"
                description="You replied, but the customer has gone quiet."
                viewAllHref="/inbox"
                viewAllLabel="Open inbox"
              >
                <ConversationQueueList
                  conversations={data.toNudge}
                  emptyMessage="No conversations need a follow-up nudge."
                  actionLabel="Nudge"
                />
              </DashboardActionPanel>
            </div>
          </div>
        </div>
      </ProLockedSection>
    </AppPage>
  )
}
