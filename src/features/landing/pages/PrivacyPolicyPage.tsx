import {
  LegalList,
  LegalPageLayout,
  LegalSectionBlock,
  LegalSubsection,
} from '@/features/landing/components/LegalPageLayout'
import { SEO_PAGES } from '@/shared/seo/seo.constants'
import { usePageMeta } from '@/shared/seo/usePageMeta'

const CONTACT_EMAIL = 'contact@responza.in'

function MailLink({ children = CONTACT_EMAIL }: { readonly children?: string }) {
  return (
    <a
      href={`mailto:${CONTACT_EMAIL}`}
      className="font-medium text-ink underline underline-offset-2 hover:text-accent"
    >
      {children}
    </a>
  )
}

export function PrivacyPolicyPage() {
  usePageMeta(SEO_PAGES.privacy)

  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="November 16, 2026">
      <div className="space-y-3 text-sm leading-relaxed text-ink-muted">
        <p>
          This Privacy Policy describes how Grupo Technologies Private Limited (&quot;Company&quot;,
          &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses, and discloses information when you use
          Responza (the &quot;Service&quot;).
        </p>
        <p>By using the Service, you agree to this Privacy Policy.</p>
      </div>

      <LegalSectionBlock title="1. What Responza is">
        <p>
          Responza is an AI-powered business inbox available primarily as a mobile application on
          Google Play (package: in.responza.app), together with our backend APIs and website at
          responza.in.
        </p>
        <p>
          Business Users use Responza to manage customer conversations from connected messaging
          channels and to use AI tools such as draft replies, summaries, translation, and an in-app
          assistant.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock title="2. Definitions">
        <LegalList
          items={[
            'Account: your Responza user account.',
            'Business User: the business or individual who registers for Responza.',
            'End Customer: a person who messages a Business User on a connected channel (for example WhatsApp or Instagram).',
            'Personal Data: information that identifies or can identify a person.',
            'Service: the Responza mobile app, website, APIs, and related services.',
            'Country: India.',
          ]}
        />
      </LegalSectionBlock>

      <LegalSectionBlock title="3. Whose data we process">
        <p>
          A) Business User data — we process this as a data fiduciary / controller for operating
          your Account.
        </p>
        <p>
          B) End Customer conversation data — we process this on behalf of Business Users to provide
          the inbox and related features. For that data, Business Users are responsible for having a
          lawful basis and for their own privacy disclosures to End Customers.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock title="4. Information we collect from Business Users">
        <LegalSubsection title="4.1 Account and profile">
          <LegalList
            items={[
              'Email address',
              'Authentication data (for example password hashes managed by our auth provider, or Google account identifiers if you sign in with Google)',
              'Business profile details you provide (brand/business name, website, business description, account type, optional referral code)',
              'Preferred translation language (if you set one)',
            ]}
          />
        </LegalSubsection>

        <LegalSubsection title="4.2 Connected channels">
          <p>
            When you connect a channel, we receive credentials and metadata needed to send and
            receive messages, for example:
          </p>
          <LegalList
            items={[
              'WhatsApp Business phone number / phone number ID, WhatsApp Business Account IDs, display name, and access tokens issued through Meta',
              'Instagram Business account ID, username, profile picture URL, and access tokens issued through Meta',
            ]}
          />
        </LegalSubsection>

        <LegalSubsection title="4.3 Conversation and media data">
          <p>On your behalf we store and process:</p>
          <LegalList
            items={[
              'Message content (text and supported media such as images, videos, documents, stickers, and similar attachments)',
              'Sender/recipient identifiers used by the channel (for example WhatsApp phone numbers / wa_ids, Instagram-scoped user IDs, names/handles)',
              'Timestamps, delivery/read status where provided by the channel',
              'Media files needed to display or send attachments',
            ]}
          />
        </LegalSubsection>

        <LegalSubsection title="4.4 Device and usage data">
          <p>When you use the app or website we may collect:</p>
          <LegalList
            items={[
              'App version, device type/OS, approximate diagnostics needed to keep the Service working',
              'IP address and basic request logs on our servers',
              'Crash or error information if/when we enable crash reporting',
            ]}
          />
          <p>
            We do not use the Google Advertising ID. The Android app blocks the AD_ID permission.
          </p>
        </LegalSubsection>

        <LegalSubsection title="4.5 Photos and camera">
          <p>
            If you grant permission, the app may access your camera or photo library only so you can
            attach media to chats. We do not use that access for advertising.
          </p>
        </LegalSubsection>

        <LegalSubsection title="4.6 Subscription and billing data">
          <p>
            Subscriptions are sold through Google Play Billing and managed with RevenueCat. We store
            subscription status on your Account (for example product identifier, expiry, whether it
            will renew, and sync timestamps).
          </p>
          <p>
            We do not receive or store your full payment card number. Payment is handled by Google
            Play.
          </p>
        </LegalSubsection>

        <LegalSubsection title="4.7 Website cookies">
          <p>
            Our website may use necessary cookies for basic operation and preferences. The mobile
            app does not rely on website cookies for core inbox features.
          </p>
        </LegalSubsection>
      </LegalSectionBlock>

      <LegalSectionBlock title="5. Information we do NOT intentionally collect">
        <LegalList
          items={[
            'We do not sell Personal Data.',
            'We do not use End Customer conversation data to train general-purpose AI models for unrelated products.',
            'Channels shown as “Coming soon” in the app (for example IndiaMART or Gmail) are not active data sources until you connect them after we enable them.',
          ]}
        />
      </LegalSectionBlock>

      <LegalSectionBlock title="6. How we use Personal Data">
        <p>We use Business User and related Service data to:</p>
        <LegalList
          items={[
            'Create and manage your Account',
            'Provide the unified inbox and send/receive messages on connected channels',
            'Provide AI features you use (draft replies, summaries, translation, assistant)',
            'Enforce free-trial and subscription access',
            'Provide customer support and security monitoring',
            'Improve reliability and features of the Service',
            'Comply with law and enforce our Terms',
          ]}
        />
        <p>
          We process End Customer conversation data only to provide the Service to the Business User
          who connected the channel (and as otherwise required by law).
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock title="7. AI processing (important)">
        <p>
          When you use AI features, relevant conversation text and related context may be sent to
          our AI service provider (currently OpenAI) to generate outputs such as drafts, summaries,
          translations, or assistant replies.
        </p>
        <p>
          That content is processed to provide the feature you requested. Do not use Responza AI
          features to process data you are not allowed to share with service providers.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock title="8. How we share information">
        <p>We may share information with:</p>
        <LegalList
          items={[
            'Infrastructure and platform providers that host or operate the Service (for example cloud database/auth hosting, media storage, and our API host)',
            'Meta Platforms, to the extent needed to connect WhatsApp / Instagram and send or receive messages through Meta’s official APIs',
            'OpenAI, for AI features described above',
            'RevenueCat and Google, for subscription validation and Play Billing',
            'Professional advisers or authorities when required by law',
            'A buyer or successor if we undergo a merger, acquisition, or asset sale (with notice where required)',
          ]}
        />
        <p>We do not sell Personal Data or Meta platform data.</p>
      </LegalSectionBlock>

      <LegalSectionBlock title="9. Meta platform data (WhatsApp and Instagram)">
        <p>
          Responza integrates with WhatsApp and Instagram using Meta&apos;s official APIs and product
          flows (including Embedded Signup / OAuth where applicable).
        </p>
        <LegalList
          items={[
            'We use Meta platform data only to provide the Service you authorised',
            'You must follow Meta’s Platform Terms and WhatsApp/Instagram policies',
            'Meta has its own privacy practices; see https://www.meta.com/privacy',
            'You can disconnect a channel in the app. You may also revoke Responza’s access in your Meta account settings where Meta provides that control',
          ]}
        />
      </LegalSectionBlock>

      <LegalSectionBlock title="10. Retention">
        <LegalList
          items={[
            'We retain Account and conversation data while your Account is active and as needed to provide the Service',
            'Conversation data is retained for up to 12 months by default unless deleted earlier or required longer by law',
            'After account deletion is completed, we delete or anonymise identifiable Account data within 60 days, except where we must retain records for legal, tax, security, or dispute purposes',
          ]}
        />
      </LegalSectionBlock>

      <LegalSectionBlock title="11. Your choices and deletion">
        <p>You may:</p>
        <LegalList
          items={[
            'Update business profile details in the app',
            'Connect or disconnect WhatsApp / Instagram in Integrations',
            'Cancel a paid subscription in Google Play (Play → Payments & subscriptions, or the Manage link in the Responza Profile screen)',
            'Request deletion of your Responza Account by using Delete account in the app (Profile) or by visiting https://responza.in/delete-account and emailing us from your Account email',
          ]}
        />
        <p>
          Account deletion removes your Account and associated Service data as described above. It
          does not automatically delete copies of messages that remain on WhatsApp, Instagram, or End
          Customer devices. Cancelling Play Billing is separate from deleting your Responza Account.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock title="12. International transfers">
        <p>
          We may process data on servers outside your state or country (including outside India)
          where our providers operate. We take reasonable steps to protect Personal Data in line with
          this Policy.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock title="13. Security">
        <p>
          We use commercially reasonable safeguards, including encryption in transit (HTTPS) and
          access controls. No method of transmission or storage is 100% secure.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock title="14. Children’s privacy">
        <p>
          Responza is for businesses and adults. The Service is not directed to anyone under 18, and
          we do not knowingly collect Personal Data from children under 18. If you believe a minor
          has created an Account, contact us and we will take steps to delete it.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock title="15. Changes">
        <p>
          We may update this Privacy Policy by posting a new version on this page and updating the
          &quot;Last updated&quot; date. Material changes may also be communicated in the app or by
          email where appropriate.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock title="16. Contact">
        <p>Grupo Technologies Private Limited (Responza)</p>
        <p>
          Email: <MailLink />
        </p>
        <p>
          Website:{' '}
          <a
            href="https://responza.in"
            className="font-medium text-ink underline underline-offset-2 hover:text-accent"
          >
            https://responza.in
          </a>
        </p>
      </LegalSectionBlock>
    </LegalPageLayout>
  )
}
