import type {
  IngestionResult,
  KnowledgeBaseResult,
  KnowledgeJob,
} from '@/features/agent/api/knowledge.service'
import { AppButton, AppCard } from '@/shared/ui/app-ui'
import { Spinner } from '@/shared/ui/primitives/Spinner'

type PipelineStep = 'ingest' | 'index'

type AgentPipelineSectionProps = {
  readonly ingestion: IngestionResult | null
  readonly knowledgeBase: KnowledgeBaseResult | null
  readonly activeStep: PipelineStep | null
  readonly activeJob: KnowledgeJob | null
  readonly stepError: string | null
  readonly onIngest: () => void
  readonly onIndex: () => void
}

function jobStatusLabel(job: KnowledgeJob | null): string | null {
  if (job === null) {
    return null
  }

  if (job.status === 'pending') {
    return 'Queued…'
  }

  if (job.status === 'running') {
    return 'Running…'
  }

  if (job.status === 'failed') {
    return job.error ?? 'Failed'
  }

  return 'Completed'
}

export function AgentPipelineSection({
  ingestion,
  knowledgeBase,
  activeStep,
  activeJob,
  stepError,
  onIngest,
  onIndex,
}: AgentPipelineSectionProps) {
  const ingestBusy = activeStep === 'ingest'
  const indexBusy = activeStep === 'index'
  const hasIngestion = ingestion !== null && ingestion.sources_ingested > 0
  const hasKnowledgeBase = knowledgeBase !== null && knowledgeBase.chunks_created > 0

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <AppCard className="space-y-4">
        <div className="flex items-start gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-bold text-accent">
            1
          </span>
          <div>
            <p className="text-sm font-medium text-ink">Ingest sources</p>
            <p className="mt-1 text-xs text-ink-muted">
              Crawl website, Instagram, and parse catalogue files into clean text.
            </p>
          </div>
        </div>

        {hasIngestion && (
          <div className="rounded-xl border border-border bg-surface-muted/50 px-4 py-3 text-sm">
            <p className="font-medium text-ink">{ingestion.sources_ingested} source(s) ingested</p>
            <p className="mt-1 text-ink-muted">{ingestion.total_characters.toLocaleString()} characters total</p>
          </div>
        )}

        {ingestBusy && (
          <div className="flex items-center gap-2 text-sm text-ink-muted">
            <Spinner size="sm" />
            <span>{jobStatusLabel(activeJob)}</span>
          </div>
        )}

        {activeStep === 'ingest' && stepError !== null && (
          <p className="text-sm text-red-600">{stepError}</p>
        )}

        <AppButton onClick={onIngest} disabled={ingestBusy || indexBusy} className="w-full">
          {ingestBusy ? 'Ingesting…' : hasIngestion ? 'Re-ingest sources' : 'Ingest sources'}
        </AppButton>
      </AppCard>

      <AppCard className="space-y-4">
        <div className="flex items-start gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-violet/15 text-xs font-bold text-accent-violet">
            2
          </span>
          <div>
            <p className="text-sm font-medium text-ink">Build knowledge base</p>
            <p className="mt-1 text-xs text-ink-muted">Chunk content and create embeddings for retrieval.</p>
          </div>
        </div>

        {hasKnowledgeBase && (
          <div className="rounded-xl border border-border bg-surface-muted/50 px-4 py-3 text-sm">
            <p className="font-medium text-ink">{knowledgeBase.chunks_created} chunk(s) indexed</p>
            <p className="mt-1 text-ink-muted">
              {knowledgeBase.embedding_model} · {knowledgeBase.embedding_dimensions} dimensions
            </p>
            <ul className="mt-2 space-y-1 text-xs text-ink-muted">
              {knowledgeBase.chunks_by_source.map((row) => (
                <li key={row.source_type}>
                  {row.source_type}: {row.chunk_count}
                </li>
              ))}
            </ul>
          </div>
        )}

        {indexBusy && (
          <div className="flex items-center gap-2 text-sm text-ink-muted">
            <Spinner size="sm" />
            <span>{jobStatusLabel(activeJob)}</span>
          </div>
        )}

        {activeStep === 'index' && stepError !== null && (
          <p className="text-sm text-red-600">{stepError}</p>
        )}

        <AppButton
          onClick={onIndex}
          disabled={!hasIngestion || ingestBusy || indexBusy}
          variant="secondary"
          className="w-full"
        >
          {indexBusy ? 'Indexing…' : hasKnowledgeBase ? 'Rebuild knowledge base' : 'Build knowledge base'}
        </AppButton>
      </AppCard>
    </div>
  )
}
