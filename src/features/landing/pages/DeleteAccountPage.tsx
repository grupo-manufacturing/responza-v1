import { LegalList, LegalPageLayout, LegalSectionBlock } from '@/features/landing/components/LegalPageLayout'
import { SEO_PAGES } from '@/shared/seo/seo.constants'
import { usePageMeta } from '@/shared/seo/usePageMeta'

const CONTACT_EMAIL = 'contact@responza.in'

function MailLink({
  children = CONTACT_EMAIL,
  subject,
}: {
  readonly children?: string
  readonly subject?: string
}) {
  const href =
    subject === undefined
      ? `mailto:${CONTACT_EMAIL}`
      : `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`

  return (
    <a href={href} className="font-medium text-ink underline underline-offset-2 hover:text-accent">
      {children}
    </a>
  )
}

export function DeleteAccountPage() {
  usePageMeta(SEO_PAGES.deleteAccount)

  return (
    <LegalPageLayout title="Delete Your Account" lastUpdated="November 16, 2026">
      <LegalSectionBlock title="How to delete your Responza account">
        <ol className="list-decimal space-y-2 pl-5">
          <li>Open the Responza app → Profile → Delete account, or open this page.</li>
          <li>
            Email <MailLink subject="Delete my Responza account" /> from the email address linked to
            your Account.
          </li>
          <li>Say clearly that you want your Responza account deleted.</li>
        </ol>
        <p>
          We will confirm your request and delete your Account and associated Service data as
          described in our Privacy Policy (typically within 60 days after we complete deletion, except
          where law requires retention).
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock title="Important">
        <LegalList
          items={[
            'Deleting your Responza Account is separate from cancelling a Google Play subscription. Cancel auto-renewal in Google Play if you also want billing to stop.',
            'Disconnecting WhatsApp or Instagram does not by itself delete your Responza Account.',
            'Messages may still exist on WhatsApp, Instagram, or customer devices after your Responza Account is deleted.',
          ]}
        />
      </LegalSectionBlock>

      <LegalSectionBlock title="Questions">
        <p>
          Questions: <MailLink />
        </p>
      </LegalSectionBlock>
    </LegalPageLayout>
  )
}
