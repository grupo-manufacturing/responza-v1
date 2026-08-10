import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'

import {
  KnowledgeService,
  type IngestionResult,
  type KnowledgeBaseResult,
  type KnowledgeJob,
} from '@/features/agent/api/knowledge.service'
import { AgentChatPanel } from '@/features/agent/components/AgentChatPanel'
import { AgentPipelineSection } from '@/features/agent/components/AgentPipelineSection'
import { AgentProfileSummary } from '@/features/agent/components/AgentProfileSummary'
import { pollKnowledgeJob } from '@/features/agent/lib/poll-job'
import { BusinessService, type BusinessResponse } from '@/features/business/api/business.service'
import { getApiErrorMessage } from '@/shared/utils/api-error'
import { Alert } from '@/shared/ui/primitives/Alert'
import { SpinnerSection } from '@/shared/ui/primitives/Spinner'
import { AppButtonLink, AppPage, AppPageHeader } from '@/shared/ui/app-ui'

type PipelineStep = 'ingest' | 'index'

async function loadIngestion(): Promise<IngestionResult | null> {
  try {
    return await KnowledgeService.getIngestion()
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null
    }
    throw error
  }
}

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
  const [ingestion, setIngestion] = useState<IngestionResult | null>(null)
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBaseResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState<string | null>(null)
  const [activeStep, setActiveStep] = useState<PipelineStep | null>(null)
  const [activeJob, setActiveJob] = useState<KnowledgeJob | null>(null)
  const [stepError, setStepError] = useState<string | null>(null)

  const refreshStatus = useCallback(async () => {
    const [nextIngestion, nextKnowledgeBase] = await Promise.all([loadIngestion(), loadKnowledgeBase()])
    setIngestion(nextIngestion)
    setKnowledgeBase(nextKnowledgeBase)
  }, [])

  useEffect(() => {
    let cancelled = false

    void (async () => {
      try {
        const [businessResponse, nextIngestion, nextKnowledgeBase] = await Promise.all([
          BusinessService.getBusiness(),
          loadIngestion(),
          loadKnowledgeBase(),
        ])

        if (cancelled) {
          return
        }

        setBusiness(businessResponse)
        setIngestion(nextIngestion)
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

  async function runPipelineStep(step: PipelineStep, start: () => Promise<{ job: KnowledgeJob }>) {
    setStepError(null)
    setActiveStep(step)
    setActiveJob(null)

    try {
      const { job } = await start()
      setActiveJob(job)

      const finishedJob = await pollKnowledgeJob(job.id, setActiveJob)
      if (finishedJob.status === 'failed') {
        setStepError(finishedJob.error ?? 'Job failed.')
        return
      }

      await refreshStatus()
    } catch (error) {
      setStepError(getApiErrorMessage(error, 'Job failed.'))
    } finally {
      setActiveStep(null)
      setActiveJob(null)
    }
  }

  function handleIngest() {
    void runPipelineStep('ingest', KnowledgeService.startIngest)
  }

  function handleIndex() {
    void runPipelineStep('index', KnowledgeService.startIndex)
  }

  const businessName = business?.profile.brandName ?? 'your business'
  const chatReady = knowledgeBase !== null && knowledgeBase.chunks_created > 0

  return (
    <AppPage>
      <AppPageHeader
        title="Agent test"
        description="Run ingest → index → ask against your live business profile. For internal testing of the knowledge agent."
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

          <AgentPipelineSection
            ingestion={ingestion}
            knowledgeBase={knowledgeBase}
            activeStep={activeStep}
            activeJob={activeJob}
            stepError={stepError}
            onIngest={handleIngest}
            onIndex={handleIndex}
          />

          <div>
            <h2 className="mb-3 text-sm font-medium text-ink">3. Ask the agent</h2>
            <AgentChatPanel businessName={businessName} disabled={!chatReady} />
          </div>
        </div>
      )}
    </AppPage>
  )
}
