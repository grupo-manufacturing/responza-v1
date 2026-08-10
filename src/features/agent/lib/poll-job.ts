import { KnowledgeService, type KnowledgeJob } from '@/features/agent/api/knowledge.service'

const POLL_INTERVAL_MS = 2000

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export async function pollKnowledgeJob(
  jobId: string,
  onUpdate?: (job: KnowledgeJob) => void,
): Promise<KnowledgeJob> {
  while (true) {
    const job = await KnowledgeService.getJob(jobId)
    onUpdate?.(job)

    if (job.status === 'completed' || job.status === 'failed') {
      return job
    }

    await sleep(POLL_INTERVAL_MS)
  }
}
