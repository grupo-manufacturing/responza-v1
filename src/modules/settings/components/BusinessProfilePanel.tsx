import { Alert } from '@/components/ui/Alert'
import { Spinner } from '@/components/ui/Spinner'
import { SpinnerSection } from '@/components/ui/Spinner'
import { BusinessOnboardingForm } from '@/modules/business/components/BusinessOnboardingForm'
import { useBusinessProfileEditor } from '@/modules/business/hooks/useBusinessProfileEditor'
import { AppButton, AppCard } from '@/shared/ui/app-ui'

export function BusinessProfilePanel() {
  const {
    isLoading,
    loadError,
    formData,
    setFormData,
    catalogueFiles,
    uploadingCatalogue,
    removingCatalogueId,
    isSaving,
    saveMessage,
    canSave,
    handleUploadCatalogue,
    handleRemoveCatalogue,
    handleSave,
  } = useBusinessProfileEditor()

  if (isLoading) {
    return <SpinnerSection minHeightClassName="min-h-[20rem]" />
  }

  if (loadError !== null || formData === null) {
    return <Alert variant="error">{loadError ?? 'Business profile unavailable.'}</Alert>
  }

  return (
    <AppCard>
      {saveMessage !== null && (
        <div className="mb-4">
          <Alert variant={saveMessage.variant}>{saveMessage.text}</Alert>
        </div>
      )}

      <BusinessOnboardingForm
        formData={formData}
        catalogueFiles={catalogueFiles}
        uploadingCatalogue={uploadingCatalogue}
        removingCatalogueId={removingCatalogueId}
        onChange={setFormData}
        onUploadCatalogue={handleUploadCatalogue}
        onRemoveCatalogue={handleRemoveCatalogue}
        intro={
          <p className="rounded-xl border border-accent/15 bg-accent/5 px-4 py-3 text-sm leading-relaxed text-ink-muted">
            Keep this information up to date so Responza&apos;s AI understands your brand, products,
            and how you communicate with customers. Website, catalogue, and social links are
            optional, but they help the AI give more accurate replies and insights.
          </p>
        }
      />

      <div className="mt-8 flex justify-end border-t border-border pt-5">
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
