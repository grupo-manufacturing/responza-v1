import { useEffect, useRef } from 'react'

import { Spinner, SpinnerSection } from '@/shared/ui/primitives/Spinner'
import { BusinessOnboardingForm } from '@/features/business/components/BusinessOnboardingForm'
import { useBusinessProfileEditor } from '@/features/business/hooks/useBusinessProfileEditor'
import { useAgentStatus } from '@/features/knowledge/hooks/useAgentStatus'
import { AppButton, AppCard } from '@/shared/ui/app-ui'
import { useToast } from '@/shared/ui/toast'

function formatLastBuiltAt(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function BusinessProfilePanel() {
  const toast = useToast()
  const lastAgentToastKey = useRef<string | null>(null)
  const { status: agentStatus, isLoading: agentStatusLoading, loadError: agentStatusError, refetch: refetchAgentStatus } =
    useAgentStatus()

  const {
    isLoading,
    loadError,
    formData,
    setFormData,
    fieldErrors,
    catalogueFiles,
    uploadingCatalogue,
    removingCatalogueId,
    isSaving,
    canSave,
    handleUploadCatalogue,
    handleRemoveCatalogue,
    handleSave,
  } = useBusinessProfileEditor({
    onProfileMutated: () => {
      void refetchAgentStatus()
    },
    onFeedback: (feedback) => {
      if (feedback.variant === 'success') {
        toast.success(feedback.text)
      } else {
        toast.error(feedback.text)
      }
    },
  })

  useEffect(() => {
    if (loadError !== null) {
      toast.error(loadError)
    }
  }, [loadError, toast])

  useEffect(() => {
    if (agentStatusLoading) {
      return
    }

    if (agentStatusError !== null) {
      const key = `error:${agentStatusError}`
      if (lastAgentToastKey.current !== key) {
        lastAgentToastKey.current = key
        toast.error(agentStatusError)
      }
      return
    }

    if (agentStatus === null) {
      return
    }

    const key = `${agentStatus.status}:${agentStatus.lastBuiltAt ?? ''}:${agentStatus.lastError ?? ''}`
    if (lastAgentToastKey.current === key) {
      return
    }
    lastAgentToastKey.current = key

    if (agentStatus.status === 'ready') {
      toast.success(
        agentStatus.lastBuiltAt !== null
          ? `Last built ${formatLastBuiltAt(agentStatus.lastBuiltAt)}.`
          : 'Your knowledge base is ready for AI drafts.',
        'Agent knowledge base is ready',
      )
      return
    }

    if (agentStatus.status === 'failed') {
      toast.error(
        agentStatus.lastError ?? 'Save your profile again to retry.',
        'Agent knowledge base build failed',
      )
      return
    }

    if (agentStatus.status === 'building') {
      toast.info('This usually takes a few minutes.', 'Agent knowledge base is building')
      return
    }

    toast.info('Save your business profile to build it.', 'Agent knowledge base is not built yet')
  }, [agentStatus, agentStatusError, agentStatusLoading, toast])

  if (isLoading) {
    return <SpinnerSection minHeightClassName="min-h-[20rem]" />
  }

  if (loadError !== null || formData === null) {
    return <p className="text-sm text-ink-muted">{loadError ?? 'Business profile unavailable.'}</p>
  }

  return (
    <AppCard padding="compact">
      {agentStatus?.status === 'building' && (
        <p className="mb-3 flex items-center gap-2 text-sm text-ink-muted">
          <Spinner size="sm" variant="muted" />
          Agent knowledge base is building…
        </p>
      )}

      <BusinessOnboardingForm
        formData={formData}
        catalogueFiles={catalogueFiles}
        uploadingCatalogue={uploadingCatalogue}
        removingCatalogueId={removingCatalogueId}
        fieldErrors={fieldErrors}
        onChange={setFormData}
        onUploadCatalogue={handleUploadCatalogue}
        onRemoveCatalogue={handleRemoveCatalogue}
        intro={
          <p className="text-sm text-ink-muted">
            Keep this up to date so the AI understands your brand. Website, catalogue, and social
            links are optional.
          </p>
        }
      />

      <div className="mt-4 flex justify-end border-t border-border pt-3">
        <AppButton type="button" onClick={() => void handleSave()} disabled={!canSave}>
          {isSaving ? (
            <>
              <Spinner size="sm" variant="white" />
              Saving...
            </>
          ) : (
            'Save changes'
          )}
        </AppButton>
      </div>
    </AppCard>
  )
}
