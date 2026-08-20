import { ProLockedSection } from '@/shared/ui/gates/ProLockedSection'
import { AssistantChat } from '@/features/assistant/components/AssistantChat'
import { AppPage, AppPageHeader } from '@/shared/ui/app-ui'

export function AssistantTrialPreview() {
  return (
    <AppPage>
      <AppPageHeader
        title="Dashboard"
        description="Ask questions about your conversations and connected integrations."
      />

      <ProLockedSection className="min-h-[70vh]">
        <AssistantChat />
      </ProLockedSection>
    </AppPage>
  )
}
