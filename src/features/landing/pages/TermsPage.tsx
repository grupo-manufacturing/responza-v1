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

export function TermsPage() {
  usePageMeta(SEO_PAGES.terms)

  return (
    <LegalPageLayout title="Terms & Conditions" lastUpdated="November 16, 2026" dateLabel="Effective Date">
      <div className="space-y-3 text-sm leading-relaxed text-ink-muted">
        <p>
          These Terms &amp; Conditions (&quot;Terms&quot;) are a legal agreement between you
          (&quot;Business User&quot;, &quot;you&quot;) and Grupo Technologies Private Limited
          (&quot;Company&quot;, &quot;Responza&quot;, &quot;we&quot;, &quot;us&quot;) for use of the
          Responza mobile application, website, APIs, and related services (the &quot;Service&quot;).
        </p>
        <p>
          By creating an Account or using the Service, you agree to these Terms and to our Privacy
          Policy at{' '}
          <a
            href="https://responza.in/privacy-policy"
            className="font-medium text-ink underline underline-offset-2 hover:text-accent"
          >
            https://responza.in/privacy-policy
          </a>
          .
        </p>
        <p>
          If you use the Service on behalf of a business, you confirm you have authority to bind that
          business.
        </p>
      </div>

      <LegalSectionBlock title="1. About the Service">
        <p>Responza is an AI-powered inbox for businesses. Current core features include:</p>
        <LegalList
          items={[
            'Connecting WhatsApp Business and Instagram business messaging',
            'A unified inbox to read and reply to customer conversations',
            'AI-assisted tools such as draft replies, conversation summaries, translation, and an in-app assistant',
            'Optional Responza Pro subscription features gated behind a free trial and/or paid plan',
          ]}
        />
        <p>
          Some integrations (for example IndiaMART or Gmail) may appear as &quot;Coming soon&quot; and
          are not part of the Service until enabled and connected.
        </p>
        <p>
          Responza is independent and is not affiliated with, endorsed, or sponsored by Meta,
          WhatsApp, Instagram, or Google.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock title="2. Eligibility">
        <LegalList
          items={[
            'You must be at least 18 years old',
            'You must use the Service for a legitimate business purpose',
            'You must provide accurate registration information',
            'You are responsible for activity under your Account and for keeping login credentials secure',
            'Notify us at contact@responza.in if you suspect unauthorised access',
          ]}
        />
      </LegalSectionBlock>

      <LegalSectionBlock title="3. Accounts and access">
        <LegalList
          items={[
            'You may register with email and password and/or supported social login options offered in the app (currently Google, where available)',
            'We may suspend or refuse Accounts that appear abusive, fraudulent, or in violation of these Terms',
            'After onboarding, new Accounts typically receive a short free trial of paid features (currently 3 days). Trial length may change; the app will show your access status',
          ]}
        />
      </LegalSectionBlock>

      <LegalSectionBlock title="4. Connected channels">
        <LegalSubsection title="4.1 WhatsApp">
          <p>
            WhatsApp features require a valid WhatsApp Business setup and your authorisation through
            Meta&apos;s flows. You must comply with WhatsApp&apos;s Business Policy and Meta&apos;s
            Platform Terms. You are responsible for required customer opt-ins for
            promotional/template messaging.
          </p>
        </LegalSubsection>
        <LegalSubsection title="4.2 Instagram">
          <p>
            Instagram messaging requires an eligible Instagram professional account and your
            authorisation through Meta. Meta&apos;s Platform Terms apply.
          </p>
        </LegalSubsection>
        <LegalSubsection title="4.3 Channel limits">
          <p>
            We do not control Meta platforms. API outages, policy changes, or account restrictions by
            Meta may limit or interrupt a channel. We may modify or discontinue an integration if a
            partner&apos;s rules require it.
          </p>
        </LegalSubsection>
      </LegalSectionBlock>

      <LegalSectionBlock title="5. AI features — scope and limits">
        <p>
          AI outputs (drafts, summaries, translations, assistant answers) are assistive only. They
          may be inaccurate or incomplete.
        </p>
        <p>
          You remain solely responsible for every message you send to End Customers, including any
          AI-assisted content you choose to send.
        </p>
        <p>Do not rely on AI features for legal, medical, or other high-risk advice.</p>
      </LegalSectionBlock>

      <LegalSectionBlock title="6. Subscriptions and billing (Google Play)">
        <LegalList
          items={[
            'Paid plans (Responza Pro) are offered as auto-renewing subscriptions through Google Play Billing',
            'Prices and plan options shown in the app / Play Store apply. Google may display prices in your local currency',
            'Payment is charged to your Google account. Renewals are handled by Google Play until you cancel',
            'Manage or cancel in Google Play (Subscriptions) or via Manage in the Responza Profile screen when subscribed',
            'Restoring purchases may be required after reinstall or device change',
            'Except where required by law or Google Play’s refund policies, fees are non-refundable by Responza directly',
            'If access lapses for non-payment or expiry, inbox/AI features may be locked until a valid subscription or trial applies',
          ]}
        />
        <p>
          Website pricing pages, if any, are informational and do not override the price Google Play
          shows at purchase time for the Android app.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock title="7. Acceptable use">
        <p>You agree not to:</p>
        <LegalList
          items={[
            'Send spam or messages that violate WhatsApp, Instagram, or Meta policies',
            'Harass, abuse, defraud, or exploit others through the Service',
            'Upload malware or attempt to disrupt the Service or third-party APIs',
            'Misuse AI features to process unlawful content or content you have no right to process',
            'Reverse engineer or abuse the Service beyond permitted use',
            'Resell or white-label the Service without our written consent',
            'Use the Service in violation of Indian law or other applicable law',
          ]}
        />
        <p>
          We may suspend or terminate Accounts for violations, with or without notice where needed to
          protect users, partners, or the Service.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock title="8. Data ownership and licence">
        <LegalList
          items={[
            'You retain ownership of your business data and End Customer conversation content you submit to the Service',
            'You grant us a limited licence to host, process, transmit, and display that data solely to provide and secure the Service',
            'We own the Service software, branding, and aggregated/anonymised insights that do not identify you or End Customers',
            'For End Customer personal data, you are the primary business responsible for that relationship; we process it to provide the Service to you',
          ]}
        />
      </LegalSectionBlock>

      <LegalSectionBlock title="9. Your responsibilities to End Customers">
        <p>You agree that:</p>
        <LegalList
          items={[
            'You are responsible for lawful use of End Customer data',
            'You must obtain any required consents/opt-ins for messaging',
            'You should maintain your own privacy disclosures for your customers',
            'You will comply with applicable law, including India’s Digital Personal Data Protection Act, 2023 where it applies',
          ]}
        />
      </LegalSectionBlock>

      <LegalSectionBlock title="10. Intellectual property">
        <p>
          Responza name, logo, and software are owned by Grupo Technologies Private Limited / its
          licensors. We grant you a limited, non-exclusive, non-transferable right to use the Service
          for your internal business purposes while your Account is in good standing.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock title="11. Third-party services">
        <p>
          The Service depends on third parties including Meta, Google Play, RevenueCat, and AI
          providers. Their terms and privacy policies also apply to their services. We are not
          responsible for third-party outages or policy enforcement against your channel accounts.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock title="12. Disclaimers">
        <p>
          THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot;. TO THE MAXIMUM EXTENT
          ALLOWED BY LAW, WE DISCLAIM WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
          AND NON-INFRINGEMENT. WE DO NOT WARRANT UNINTERRUPTED OR ERROR-FREE OPERATION OR PERFECT AI
          ACCURACY.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock title="13. Limitation of liability">
        <p>
          TO THE MAXIMUM EXTENT ALLOWED BY INDIAN LAW, OUR TOTAL LIABILITY FOR CLAIMS ARISING OUT OF
          THE SERVICE OR THESE TERMS IS LIMITED TO THE AMOUNTS YOU PAID TO US / THROUGH GOOGLE PLAY
          FOR RESPONZA SUBSCRIPTION ACCESS IN THE 3 MONTHS BEFORE THE CLAIM.
        </p>
        <p>
          WE ARE NOT LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR
          FOR LOST PROFITS, LOST DATA, OR BUSINESS INTERRUPTION, EVEN IF ADVISED OF THE POSSIBILITY.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock title="14. Indemnity">
        <p>
          You will indemnify and hold harmless the Company and its officers, directors, employees,
          and agents from claims, losses, and expenses (including reasonable legal fees) arising from:
          (a) your use of the Service; (b) messages you send; (c) your violation of these Terms, law,
          or platform policies; or (d) your infringement of third-party rights.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock title="15. Termination">
        <LegalList
          items={[
            'You may stop using the Service at any time',
            'To cancel paid auto-renewal, cancel in Google Play',
            'To delete your Account and associated Service data, use https://responza.in/delete-account (also linked in the app) and follow the instructions',
            'We may suspend or terminate access for breach, risk, non-payment/expiry, or legal reasons',
            'After termination, export or recovery of data may be limited; contact contact@responza.in promptly if you need help retrieving data we still hold',
          ]}
        />
      </LegalSectionBlock>

      <LegalSectionBlock title="16. Changes">
        <p>
          We may change the Service or these Terms. We will post updates on this page and update the
          effective date. Material changes may also be notified in-app or by email. Continued use
          after changes means you accept the updated Terms.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock title="17. Governing law">
        <p>
          These Terms are governed by the laws of India. Courts in Hyderabad, Telangana, India have
          exclusive jurisdiction, without limiting any mandatory consumer protections that cannot be
          waived.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock title="18. Contact">
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
