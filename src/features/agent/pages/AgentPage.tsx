import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'

import { KnowledgeService, type KnowledgeBaseResult } from '@/features/agent/api/knowledge.service'
import { AgentChatPanel } from '@/features/agent/components/AgentChatPanel'
import { AgentProfileSummary } from '@/features/agent/components/AgentProfileSummary'
import { BusinessService, type BusinessResponse } from '@/features/business/api/business.service'
import { getApiErrorMessage } from '@/shared/utils/api-error'
import { Alert } from '@/shared/ui/primitives/Alert'
import { SpinnerSection } from '@/shared/ui/primitives/Spinner'
import { AppButtonLink, AppPage, AppPageHeader } from '@/shared/ui/app-ui'

const KNOWLEDGE_POLL_INTERVAL_MS = 5_000

async function loadKnowledgeBase(): Promise<KnowledgeBaseResult | null> {
  try {
    return await KnowledgeService.getKnowledgeBase()
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null
    }
    throw error
  }
}

export function AgentPage() {
  const [business, setBusiness] = useState<BusinessResponse | null>(null)
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBaseResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState<string | null>(null)

  const refreshKnowledgeBase = useCallback(async () => {
    const nextKnowledgeBase = await loadKnowledgeBase()
    setKnowledgeBase(nextKnowledgeBase)
    return nextKnowledgeBase
  }, [])

  useEffect(() => {
    let cancelled = false

    void (async () => {
      try {
        const [businessResponse, nextKnowledgeBase] = await Promise.all([
          BusinessService.getBusiness(),
          loadKnowledgeBase(),
        ])

        if (cancelled) {
          return
        }

        setBusiness(businessResponse)
        setKnowledgeBase(nextKnowledgeBase)
      } catch (error) {
        if (!cancelled) {
          setPageError(getApiErrorMessage(error, 'Failed to load agent test workspace.'))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (knowledgeBase !== null) {
      return
    }

    const intervalId = window.setInterval(() => {
      void refreshKnowledgeBase().catch(() => {
        // Ignore transient poll errors; the page already shows a building state.
      })
    }, KNOWLEDGE_POLL_INTERVAL_MS)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [knowledgeBase, refreshKnowledgeBase])

  const businessName = business?.profile.brandName ?? 'your business'
  const chatReady = knowledgeBase !== null && knowledgeBase.chunks_created > 0

  return (
    <AppPage>
      <AppPageHeader
        title="Agent test"
        description="Chat with your business agent. Knowledge is built automatically after onboarding."
        action={
          <AppButtonLink to="/business" variant="secondary">
            Edit profile
          </AppButtonLink>
        }
      />

      {loading && <SpinnerSection minHeightClassName="min-h-[40vh]" />}

      {!loading && pageError !== null && <Alert variant="error">{pageError}</Alert>}

      {!loading && pageError === null && business !== null && (
        <div className="space-y-6">
          <AgentProfileSummary business={business} />

          {!chatReady && (
            <Alert variant="warning">
              Your agent is still building from your business profile. This usually takes a few
              minutes. You can stay on this page or come back later.
            </Alert>
          )}

          {chatReady && knowledgeBase !== null && (
            <Alert variant="success">
              Knowledge base ready · {knowledgeBase.chunks_created} chunks across{' '}
              {knowledgeBase.sources_processed} source types.
            </Alert>
          )}

          <AgentChatPanel businessName={businessName} disabled={!chatReady} />
        </div>
      )}
    </AppPage>
  )
}
