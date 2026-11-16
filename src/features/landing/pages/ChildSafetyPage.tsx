import {
  LegalList,
  LegalPageLayout,
  LegalSectionBlock,
} from '@/features/landing/components/LegalPageLayout'
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

function ExternalLink({ href, children }: { readonly href: string; readonly children: string }) {
  return (
    <a href={href} className="font-medium text-ink underline underline-offset-2 hover:text-accent">
      {children}
    </a>
  )
}

export function ChildSafetyPage() {
  usePageMeta(SEO_PAGES.childSafety)

  return (
    <LegalPageLayout title="Child Safety Standards" lastUpdated="November 16, 2026">
      <div className="space-y-3 text-sm leading-relaxed text-ink-muted">
        <p>
          Responza is operated by Grupo Technologies Private Limited (&quot;Responza&quot;, &quot;we&quot;,
          &quot;us&quot;, or &quot;our&quot;).
        </p>
        <p>
          These Child Safety Standards describe our policies against child sexual abuse and
          exploitation (CSAE), including child sexual abuse material (CSAM). This page is published
          to meet applicable platform requirements, including Google Play&apos;s Child Safety Standards
          policy.
        </p>
      </div>

      <LegalSectionBlock title="1. Who Responza is for">
        <p>
          Responza is a business messaging inbox for adult business users. It is not designed for
          children and is not directed to anyone under 18.
        </p>
        <p>
          Business Users must be at least 18 years old to create an account and use the Service, as
          stated in our Terms &amp; Conditions:{' '}
          <ExternalLink href="https://responza.in/terms-conditions">
            https://responza.in/terms-conditions
          </ExternalLink>
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock title="2. Zero tolerance for CSAE and CSAM">
        <p>We have zero tolerance for:</p>
        <LegalList
          items={[
            'Child sexual abuse material (CSAM)',
            'Child sexual exploitation or grooming',
            'Any content or behaviour that sexualises minors',
            'Attempts to use Responza to create, share, solicit, or distribute such content',
          ]}
        />
        <p>
          This applies to Business Users and to content processed through connected channels
          (including WhatsApp and Instagram) when that content is handled in Responza.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock title="3. Prohibited use">
        <p>Users may not use Responza to:</p>
        <LegalList
          items={[
            'Upload, send, store, or request CSAM or any sexual content involving minors',
            'Facilitate exploitation, trafficking, or abuse of children',
            'Bypass safety systems or encourage others to violate these standards',
          ]}
        />
        <p>
          Violation may result in immediate suspension or termination of the account, removal of
          content where we control it, and referral to law enforcement or other authorities where
          required or appropriate.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock title="4. How we address child safety risks">
        <p>
          Responza is primarily used by businesses to manage customer conversations from channels
          they connect. We take the following measures:
        </p>
        <LegalList
          items={[
            'Age eligibility: accounts are intended for users 18+',
            'Acceptable use rules in our Terms prohibit illegal and abusive messaging',
            'Access controls: users must authenticate to use the Service',
            'Review of reports: we review child-safety reports sent to our designated contact',
            'Enforcement: we may suspend or terminate accounts and restrict access when we find violations',
            'Cooperation with platforms and authorities: where required by law, we report CSAM and related crimes to the relevant regional or national authorities and may cooperate with Meta / Google investigations when lawfully requested',
          ]}
        />
        <p>We do not knowingly allow CSAM on the Service.</p>
      </LegalSectionBlock>

      <LegalSectionBlock title="5. How to report a child safety concern">
        <p>
          If you encounter content or behaviour on Responza that may involve child sexual abuse or
          exploitation, report it immediately.
        </p>
        <p>
          Email (designated contact): <MailLink subject="Child safety concern" />
        </p>
        <p>Please include:</p>
        <LegalList
          items={[
            'Your Responza account email (if you have one)',
            'Date and approximate time of the issue',
            'Channel involved (for example WhatsApp or Instagram), if known',
            'Description of the concern',
            'Any message IDs, screenshots, or other details that help us locate the issue (do not forward illegal images if avoidable; describe them instead)',
          ]}
        />
        <p>We aim to acknowledge reports promptly and take appropriate action.</p>
        <p>
          You may also report concerns through the relevant messaging platform (WhatsApp /
          Instagram / Meta) using that platform&apos;s in-app reporting tools.
        </p>
        <p>
          In the Responza app, you can reach us via Profile → related support / account options, or
          by emailing <MailLink /> from the email on your account.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock title="6. What happens after a report">
        <p>When we receive a credible child-safety report, we may:</p>
        <LegalList
          items={[
            'Review available account and conversation metadata',
            'Restrict, suspend, or terminate the relevant account',
            'Preserve records as required for legal compliance',
            'Report to the appropriate authority where required by applicable law',
            'Notify the reporting party of receipt when appropriate (we may not share confidential enforcement details)',
          ]}
        />
      </LegalSectionBlock>

      <LegalSectionBlock title="7. Legal compliance and authority reporting">
        <p>
          We are committed to complying with applicable child safety and criminal laws, including
          obligations that require reporting CSAM or related offences to regional or national
          authorities.
        </p>
        <p>
          Where we become aware of apparent CSAM or imminent exploitation of a child, we will take
          appropriate action, which may include reporting to law enforcement or other designated
          authorities.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock title="8. Relationship to other policies">
        <p>These standards work together with:</p>
        <p>
          Privacy Policy:{' '}
          <ExternalLink href="https://responza.in/privacy-policy">
            https://responza.in/privacy-policy
          </ExternalLink>
        </p>
        <p>
          Terms &amp; Conditions:{' '}
          <ExternalLink href="https://responza.in/terms-conditions">
            https://responza.in/terms-conditions
          </ExternalLink>
        </p>
        <p>
          If there is a conflict on child-safety enforcement, these Child Safety Standards guide our
          handling of CSAE/CSAM issues.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock title="9. Contact">
        <p>Designated child-safety contact:</p>
        <p>Grupo Technologies Private Limited (Responza)</p>
        <p>
          Email: <MailLink />
        </p>
        <p>
          Website:{' '}
          <ExternalLink href="https://responza.in">https://responza.in</ExternalLink>
        </p>
      </LegalSectionBlock>
    </LegalPageLayout>
  )
}
