import {
  LegalList,
  LegalPageLayout,
  LegalSectionBlock,
  LegalSubsection,
  LegalSubsubsection,
} from '@/features/landing/components/LegalPageLayout'
import { SEO_PAGES } from '@/shared/seo/seo.constants'
import { usePageMeta } from '@/shared/seo/usePageMeta'

export function TermsPage() {
  usePageMeta(SEO_PAGES.terms)

  return (
    <LegalPageLayout title="Terms & Conditions" lastUpdated="May 22, 2026" dateLabel="Effective Date">
      <div className="space-y-3 text-sm leading-relaxed text-ink-muted">
        <p>
          These Terms and Conditions (&quot;Terms&quot;) constitute a legally binding agreement between
          you (&quot;Business User&quot;) and Responza, operated by Grupo.in (&quot;Responza&quot;, &quot;we&quot;,
          &quot;us&quot;), governing your access to and use of the Responza platform, APIs, dashboard, and
          related services (collectively, the &quot;Platform&quot;).
        </p>
        <p>
          By creating an account or using the Platform, you confirm that you have read, understood,
          and agree to these Terms. If you are registering on behalf of a company or business, you
          represent that you have authority to bind that entity.
        </p>
      </div>

      <LegalSectionBlock title="1. About Responza">
        <p>
          Responza is a unified AI-powered messaging and customer intelligence platform that connects
          to your business accounts on WhatsApp (via Meta&apos;s Business API), Instagram (via Meta&apos;s
          Graph API), and IndiaMart. Responza provides:
        </p>
        <LegalList
          items={[
            'A unified inbox aggregating messages from all connected channels',
            'AI-powered daily insights on customer interactions, volumes, and channel performance',
            'Real-time message translation across Hindi, Telugu, English, and Spanish',
            'Automated intent detection and smart routing of messages (e.g., customer support, sales enquiry, complaint)',
            'AI-assisted response suggestions and workflow automation tools',
          ]}
        />
        <p>
          Responza is part of the Grupo.in family of products and is built for businesses —
          particularly Indian MSMEs and social commerce sellers — operating across digital and offline
          channels.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock title="2. Eligibility and Account Registration">
        <LegalList
          items={[
            'You must be at least 18 years of age and operate a legitimate business entity to use Responza.',
            'You agree to provide accurate, current, and complete information during registration.',
            'You are responsible for all activity that occurs under your account and for maintaining the security of your login credentials. Notify us immediately at support@responza.in if you suspect unauthorised access.',
            'Responza reserves the right to verify your business identity and to decline or suspend registration at its sole discretion.',
            'One account per business entity. Creating multiple accounts to circumvent usage limits or policies is prohibited.',
          ]}
        />
      </LegalSectionBlock>

      <LegalSectionBlock title="3. Connected Channels and API Authorisation">
        <LegalSubsection title="3.1 WhatsApp Business API (Meta)">
          <p>
            To use WhatsApp integration, you must hold a valid WhatsApp Business account and authorise
            Responza as your Business Solutions Provider (BSP). By connecting WhatsApp, you agree to:
          </p>
          <LegalList
            items={[
              "WhatsApp's Business Policy (www.whatsapp.com/legal/business-policy)",
              "Meta's Platform Terms (developers.facebook.com/terms)",
              'Ensure all WhatsApp messaging via Responza complies with Meta\'s messaging guidelines, including opt-in requirements for promotional messages',
            ]}
          />
        </LegalSubsection>
        <LegalSubsection title="3.2 Instagram Messaging (Meta)">
          <p>
            Instagram DM integration requires you to authorise Responza through Meta&apos;s OAuth flow. You
            must own or have administrative access to the Instagram Business or Creator account you
            connect. Meta&apos;s Platform Terms apply to all Instagram data accessed through Responza.
          </p>
        </LegalSubsection>
        <LegalSubsection title="3.3 IndiaMart">
          <p>
            IndiaMart integration requires a valid IndiaMart seller subscription with API access
            enabled. You are responsible for complying with IndiaMart&apos;s platform terms. Responza is
            not affiliated with IndiaMart and cannot guarantee API availability or continuity.
          </p>
        </LegalSubsection>
        <LegalSubsection title="3.4 Channel Availability">
          <p>
            Responza does not guarantee uninterrupted access to any third-party channel. If Meta or
            IndiaMart changes or restricts their API terms, Responza may need to modify, suspend, or
            discontinue an integration. We will notify you as promptly as possible in such events.
          </p>
        </LegalSubsection>
      </LegalSectionBlock>

      <LegalSectionBlock title="4. AI Features — Scope and Limitations">
        <LegalSubsection title="4.1 Message Translation">
          <p>
            Responza provides real-time message translation between Hindi, Telugu, English, and
            Spanish. Translations are AI-generated and provided for convenience. Responza does not
            guarantee translation accuracy and is not liable for misunderstandings arising from
            translated communications. Business Users should review AI translations before sending
            critical responses.
          </p>
        </LegalSubsection>
        <LegalSubsection title="4.2 Intent Detection and Smart Routing">
          <p>
            Responza&apos;s AI classifies incoming messages by intent and suggests routing. These
            classifications are probabilistic in nature. Responza does not guarantee 100% accuracy and
            is not liable for messages routed incorrectly. Business Users are responsible for
            supervising AI routing and maintaining final approval over customer communications.
          </p>
        </LegalSubsection>
        <LegalSubsection title="4.3 Customer Insights">
          <p>
            Daily and periodic analytics are generated from your message data. These insights are
            provided for informational and decision-support purposes. Responza does not guarantee the
            accuracy or completeness of analytics and is not liable for business decisions made on the
            basis of Platform-generated insights.
          </p>
        </LegalSubsection>
        <LegalSubsubsection title="4.4 AI Response Suggestions">
          <p>
            Where Responza provides AI-generated response suggestions, these are suggestions only.
            Business Users retain full responsibility for the content of all communications sent to
            their End Customers.
          </p>
        </LegalSubsubsection>
      </LegalSectionBlock>

      <LegalSectionBlock title="5. Subscription Plans and Billing">
        <LegalList
          items={[
            'Responza offers subscription-based pricing plans. Current pricing is available at www.responza.in/pricing and may be updated from time to time.',
            'Subscriptions are billed monthly or annually as selected. Payments are due in advance.',
            'All prices are in Indian Rupees (INR) unless otherwise stated. Applicable GST will be added to all invoices.',
            'Responza will notify Business Users at least 30 days before implementing any price changes.',
            'Payments are non-refundable except as required by applicable Indian consumer law or as explicitly stated in our Refund Policy.',
            "In the event of non-payment, Responza may suspend access to the Platform with 7 days' written notice.",
          ]}
        />
      </LegalSectionBlock>

      <LegalSectionBlock title="6. Acceptable Use Policy">
        <p>By using Responza, you agree NOT to:</p>
        <LegalList
          items={[
            'Send spam, bulk unsolicited messages, or use Responza to conduct mass marketing without proper end-customer opt-in in violation of platform policies',
            'Use Responza to harass, abuse, threaten, or defraud any person',
            'Use the Platform to transmit malware, viruses, or harmful code',
            'Process sensitive personal data categories — including health data, financial account information, national identification numbers, or data relating to minors — through Responza\'s messaging channels without appropriate safeguards',
            'Attempt to reverse-engineer, scrape, or extract data from the Platform beyond what is available through official APIs',
            'Use Responza to conduct activities that violate Indian law or the laws of any jurisdiction in which your End Customers are located',
            "Resell, sublicense, or white-label access to the Platform without Responza's prior written consent",
            'Use Responza in a manner that could damage, overload, or impair our infrastructure or third-party APIs',
          ]}
        />
        <p>
          Violation of this Acceptable Use Policy may result in immediate suspension or termination of
          your account without refund.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock title="7. Data Ownership and Licence">
        <LegalList
          items={[
            'Business Users retain ownership of their business data and End Customer conversation data processed through Responza.',
            'You grant Responza a limited, non-exclusive licence to process, transmit, and store your data for the sole purpose of providing the Platform services.',
            'Responza retains ownership of all Platform software, AI models, algorithms, insights methodologies, interface designs, and aggregated anonymised data derived from Platform use.',
            'Business Users may export their conversation data at any time through the Platform dashboard.',
          ]}
        />
      </LegalSectionBlock>

      <LegalSectionBlock title="8. Business User Responsibilities Regarding End Customers">
        <p>You acknowledge and agree that:</p>
        <LegalList
          items={[
            'You are the data controller for your End Customers\' personal data and Responza acts as your data processor',
            'You are responsible for obtaining valid consent from your End Customers to receive messages and to process their data through third-party platforms including Responza',
            'You must maintain and publish a privacy policy for your own business that discloses your use of messaging platforms, AI-powered tools, and data processors',
            'You will handle End Customer data in compliance with all applicable laws, including the Digital Personal Data Protection Act, 2023',
            'You will promptly notify Responza if you become aware of any data breach involving your connected channels',
          ]}
        />
      </LegalSectionBlock>

      <LegalSectionBlock title="9. Confidentiality">
        <p>
          Each party agrees to keep confidential any non-public information of the other party
          disclosed in the course of using the Platform, including pricing, technical systems, and
          business strategy. This obligation does not apply to information that is publicly
          available, independently developed, or required to be disclosed by law.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock title="10. Intellectual Property">
        <p>
          Responza, its logo, AI engine, dashboard design, and all related technology are the
          intellectual property of Grupo.in. You are granted a limited, non-exclusive,
          non-transferable licence to use the Platform for your business purposes. You may not copy,
          adapt, reverse-engineer, or create derivative works from any element of the Platform.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock title="11. Disclaimer of Warranties">
        <p>
          Responza is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We make no warranties,
          express or implied, including warranties of merchantability, fitness for a particular
          purpose, or non-infringement. We do not warrant that the Platform will be error-free,
          uninterrupted, or that AI-generated content (translations, insights, intent
          classifications) will be 100% accurate.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock title="12. Limitation of Liability">
        <p>
          To the fullest extent permitted under Indian law, Responza&apos;s total aggregate liability for
          any claim arising from these Terms shall not exceed the subscription fees paid by you in the
          3 months immediately preceding the claim.
        </p>
        <p>
          Responza shall not be liable for indirect, incidental, consequential, or punitive damages,
          including lost revenue, business interruption, reputational harm, or loss of customer data,
          even if advised of the possibility of such damages.
        </p>
        <p>
          Responza is not liable for the actions, policies, or downtime of third-party platforms
          including Meta (WhatsApp/Instagram) and IndiaMart.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock title="13. Indemnification">
        <p>
          You agree to indemnify, defend, and hold harmless Responza, Grupo.in, and their respective
          officers, directors, employees, and agents from and against any claims, liabilities,
          damages, losses, and expenses (including reasonable legal fees) arising from: (a) your use
          of the Platform in violation of these Terms; (b) your communications sent to End Customers
          via Responza; (c) your violation of any applicable law or third-party platform terms; or (d)
          infringement of third-party rights.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock title="14. Term and Termination">
        <LegalList
          items={[
            'These Terms are effective from the date you create an account and remain in effect until terminated.',
            'You may cancel your subscription at any time from the dashboard. Cancellation takes effect at the end of the current billing period.',
            'Responza may suspend or terminate your account immediately for material breach of these Terms, violation of the Acceptable Use Policy, non-payment, or conduct that harms other users or the Platform.',
            'Upon termination, your access to the Platform ceases. You may export your data within 30 days of termination, after which identifiable data is deleted per the retention policy.',
            'Provisions relating to intellectual property, confidentiality, limitation of liability, indemnification, and dispute resolution survive termination.',
          ]}
        />
      </LegalSectionBlock>

      <LegalSectionBlock title="15. Modifications to the Platform and Terms">
        <p>
          Responza reserves the right to modify, suspend, or discontinue any feature of the Platform
          at any time, with reasonable notice where possible. We may update these Terms at any time.
          Material changes will be communicated by email and in-dashboard notification at least 15 days
          before taking effect. Continued use after the effective date constitutes acceptance.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock title="16. Dispute Resolution">
        <p>
          Users may bring any disputes to the Company who will try to resolve them amicably.
        </p>
        <p>
          While User&apos;s right to take legal action shall always remain unaffected, in the event of any
          controversy regarding the use of Responza or the Service, Users are asked to contact the
          Company at the contact details provided in this document.
        </p>
        <p>
          The user may submit the complaint including a brief description and if applicable, the
          details of the related order, purchase, or account to the Company&apos;s email address specified
          in this document.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock title="17. Governing Law and Jurisdiction">
        <p>
          These Terms are governed by the laws of India. Subject to the arbitration clause, you
          submit to the exclusive jurisdiction of the courts of Hyderabad, Telangana, India.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock title="18. General Provisions">
        <LegalList
          items={[
            'Entire Agreement: These Terms, together with the Privacy Policy and any applicable order forms, constitute the entire agreement between you and Responza.',
            'Severability: If any provision is found unenforceable, the remaining provisions remain in full force.',
            'Waiver: Failure to enforce any right under these Terms does not constitute a waiver of that right.',
            "Assignment: You may not assign your rights under these Terms without Responza's written consent. Responza may assign its rights in connection with a merger or acquisition.",
            'Force Majeure: Responza is not liable for delays or failures caused by circumstances beyond its reasonable control, including API platform outages, internet failures, or acts of government.',
          ]}
        />
      </LegalSectionBlock>

      <LegalSectionBlock title="19. Contact — Legal Enquiries">
        <p>Responza (by Grupo.in)</p>
        <p>Email: contact@grupo.in</p>
        <p>Registered in India</p>
      </LegalSectionBlock>
    </LegalPageLayout>
  )
}
