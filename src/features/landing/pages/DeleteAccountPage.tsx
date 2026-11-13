import { LegalPageLayout, LegalSectionBlock } from '@/features/landing/components/LegalPageLayout'
import { SEO_PAGES } from '@/shared/seo/seo.constants'
import { usePageMeta } from '@/shared/seo/usePageMeta'

const CONTACT_EMAIL = 'contact@responza.in'

export function DeleteAccountPage() {
  usePageMeta(SEO_PAGES.deleteAccount)

  return (
    <LegalPageLayout title="Delete Your Account" lastUpdated="November 13, 2026">
      <LegalSectionBlock title="How to delete your account">
        <p>
          If you want to delete your Responza account, email us at{' '}
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Delete%20my%20Responza%20account`}
            className="font-medium text-ink underline underline-offset-2 hover:text-accent"
          >
            {CONTACT_EMAIL}
          </a>{' '}
          from the email address linked to your account, and let us know you would like your account deleted.
        </p>
        <p>We will confirm your request and delete your account along with its associated data.</p>
      </LegalSectionBlock>

      <LegalSectionBlock title="Questions">
        <p>
          If you have any questions about your account or your data, contact us at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-ink underline underline-offset-2 hover:text-accent">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </LegalSectionBlock>
    </LegalPageLayout>
  )
}
