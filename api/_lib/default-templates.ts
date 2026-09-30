import { socialTemplates } from './social-templates.js'
import { reservationTemplate, reservedProgramTemplate } from './reservation-template.js'

export type DefaultTemplate = {
  id: string
  name: string
  packageName: string
  price: string
  subject: string
  body: string
  active?: boolean
}

const sensationAgreement = `90-DAY HANDS-FREE LOCAL SENSATION AGREEMENT

This Agreement is between Caleb Wolin, operating as Wolin ("Provider"), and {{business_name}}, represented by {{client_name}} ("Client"). It becomes effective when Client signs electronically.

1. PROGRAM, TERM, AND FEE

Client engages Provider for the 90-day Hands-Free Local Sensation. The one-time fee is {{price}}, due before work begins. The 90-day service period begins when Provider has this signed Agreement, payment, and the access and information reasonably needed to start. This Agreement does not automatically renew.

2. INCLUDED SERVICES

Provider will complete and connect Client's internet profile across Instagram, Facebook, Google Business Profile, a custom website, and AI search; create a practical SEO improvement plan; perform AI search optimization; produce professional video content; handle scripting, filming, editing, and scheduling content across the connected platforms; manage DMs, routine customer questions, and leads on those platforms; track leads from social platforms; and provide a complete monthly report of metrics across the platforms.

The SEO improvement plan and AI search optimization are promised deliverables. They are not promises of a particular search ranking, AI citation, lead count, sale, or revenue outcome.

3. INCLUDED BONUSES

At no additional charge, Provider will build a custom website, optimize Client's Google Business Profile, optimize Client's Apple Maps presence, and provide a Google review strategic adviser report. "Free" means these items have no separate fee under this paid program. If Provider registers a domain for the website during the program, Provider covers its registration cost and remains its registered owner. Other third-party charges during the program, such as paid advertising or premium software, require Client's separate approval. Domain registration and renewal are included in the separate $99/month website hosting and maintenance service if Client selects it.

4. 10,000 LOCAL VIEWS GUARANTEE

Provider guarantees at least 10,000 combined views and impressions of Client's business content across the platforms used in the program during the first 90 days. The measure is the sum of views and impressions reported by those platforms; it is not a guarantee of 10,000 unique people or of a particular number of leads or sales. Provider will share the relevant platform metrics in the monthly reports. If the combined total is below 10,000 at the end of the first 90 days, Provider will continue managing Client's marketing at no charge until the combined total reaches 10,000. The guarantee extension does not create another program fee.

5. CLIENT COOPERATION AND APPROVALS

Client will provide accurate business information; appropriate access to accounts, website, domain, and analytics; reasonable access for filming; and timely feedback or approvals. Client authorizes Provider to publish approved content and respond to routine customer inquiries on Client's behalf. Client remains responsible for final decisions on pricing, offers, customer commitments, and regulated or specialized advice. Provider may pause affected work while required access or approval is unavailable, and the parties will agree in writing on any resulting schedule change.

6. ACCOUNTS, WEBSITE, AND THIRD-PARTY PLATFORMS

Client retains ownership of its brand, accounts, materials supplied to Provider, and any domain Client already owns. Provider owns any domain Provider registers for the custom website. If Client later cancels the separate website hosting and maintenance service, Client may request transfer of that Provider-owned domain into Client's name for a one-time $99 fee. Provider will cooperate with the transfer after payment, subject to registrar requirements. Once the program fee is paid, Client owns the final custom website content and design created specifically for Client under this Agreement. Platform policies, availability, and algorithms are outside Provider's control. Ongoing website hosting and maintenance after the program require a separate agreement; they are not included in this one-time fee.

7. CHANGES AND END OF PROGRAM

Work outside the listed services requires written agreement before an additional charge applies. At the end of the 90-day period, Provider will deliver the final monthly report and any outstanding guarantee extension will continue under Section 4. Neither party is obligated to purchase or provide another paid service without a separate agreement.

8. ELECTRONIC SIGNATURE

By signing, Client confirms that the signer is authorized to bind {{business_name}}, has reviewed this Agreement, and consents to electronic records and signatures. Electronic copies may be treated as originals.

Client: {{business_name}}
Authorized signer: {{client_name}} ({{client_email}})
Date prepared: {{date}}`

const websiteCareAgreement = `WEBSITE HOSTING AND MAINTENANCE AGREEMENT

This Agreement is between Caleb Wolin, operating as Wolin ("Provider"), and {{business_name}}, represented by {{client_name}} ("Client"). It becomes effective when Client signs electronically.

1. SERVICE AND MONTHLY FEE

Provider will keep the custom website built for Client under the 90-day Hands-Free Local Sensation hosted and maintained for {{price}}. The first monthly payment is due before this service begins; subsequent payments are due monthly on the same calendar date. This service is month-to-month.

2. INCLUDED MAINTENANCE

Provider will keep the website hosted, monitor basic site availability, maintain its operating components, and address routine maintenance issues needed to keep the existing website functioning. The monthly fee includes registration and renewal costs for any domain Provider registers for the website, and all third-party tools used to operate and maintain the website.

3. EDITS

Minor edits cost $25 per edit. Minor edits include any text changes and other simple edits to existing content that do not substantially change the website's design or functionality. Major work is priced by individual quote and requires Client's approval before Provider begins work or charges for it. Major work includes UI redesign, adding pages, adding features, and other substantial changes to the website. Edit fees are not included in the monthly maintenance charge.

4. CLIENT RESPONSIBILITIES

Provider will remain the registered owner of any domain Provider registers for the website while this service is active. Client retains ownership of any domain Client already owns and will provide access reasonably needed for hosting and maintenance. Client will supply accurate replacement content and confirm it has the right to use any materials it asks Provider to publish.

5. CANCELLATION AND HANDOFF

Client may cancel future monthly service by emailing caleb.wolin@gmail.com before the next payment date. Service continues through the paid period. If Client cancels, Client may request transfer of a domain Provider registered for the website into Client's name for a one-time $99 fee. After payment, Provider will cooperate promptly with the transfer, subject to registrar requirements. Provider will reasonably cooperate in transferring the website to Client or a new host after cancellation; third-party hosting charges after the handoff are Client's responsibility. The website may stop being hosted by Provider after the paid period ends.

6. ELECTRONIC SIGNATURE

By signing, Client confirms that the signer is authorized to bind {{business_name}}, has reviewed this Agreement, and consents to electronic records and signatures. Electronic copies may be treated as originals.

Client: {{business_name}}
Authorized signer: {{client_name}} ({{client_email}})
Date prepared: {{date}}`

const standaloneWebsiteAgreement = `STANDALONE WEBSITE BUILD AND CARE AGREEMENT

This Agreement is between Caleb Wolin, operating as Wolin ("Provider"), and {{business_name}}, represented by {{client_name}} ("Client"). It becomes effective when Client signs electronically.

1. WEBSITE BUILD AND PAYMENT SCHEDULE

Provider will build a custom website for Client. The package price is {{price}}. The $299 website build fee is charged at Stripe checkout after signing. The same checkout starts a $99/month hosting and maintenance subscription with its first 30 calendar days free. The first $99 monthly charge is scheduled 30 days after checkout, and monthly charges continue until Client cancels. The 30-day free period begins at checkout, even if the website launches later. Provider begins the build after the initial payment and the information and materials reasonably needed to start.

2. INCLUDED WEBSITE CARE AND DOMAIN

The $299 build fee includes the custom website and an available domain agreed with Client and registered by Provider at no separate charge. Hosting, basic availability checks, routine maintenance, and third-party tools used to operate and maintain the website are included during the first 30 days and in the $99 monthly service afterward. Domain registration and renewal costs are included; Client will not be charged separately for them while this service is active.

3. UNLIMITED MINOR EDITS AND MAJOR WORK

Unlimited minor edits are included at no charge during the first 30 days and while the monthly service is active. Minor edits include text changes and other simple edits to existing content that do not substantially change the website's design or functionality. Provider will complete each minor edit within 48 hours after receiving a complete request and any needed replacement content. Major work is priced by individual quote and requires Client's approval before Provider begins work or charges for it. Major work includes UI redesign, adding pages, adding features, and other substantial changes to the website.

4. OWNERSHIP AND CLIENT RESPONSIBILITIES

Once the $299 build fee is paid, Client owns the final website content and design created specifically for Client. Provider remains the registered owner of any domain Provider registers for the website while the service is active. Client retains ownership of any domain Client already owns. Client will provide accurate business information, timely feedback, and appropriate access, and will confirm it has the right to use materials it asks Provider to publish.

5. CANCELLATION AND HANDOFF

Client may cancel future monthly charges by emailing caleb.wolin@gmail.com before the next payment date, including during the 30-day free period. Service continues through the free or paid period then in effect. If Client cancels, Client may request transfer of a domain Provider registered for the website into Client's name for a one-time $99 fee. After payment, Provider will cooperate promptly with the transfer, subject to registrar requirements. Provider will reasonably cooperate in transferring the website to Client or a new host after cancellation; third-party hosting charges after the handoff are Client's responsibility. The website may stop being hosted by Provider after the service period ends.

6. ELECTRONIC SIGNATURE

By signing, Client confirms that the signer is authorized to bind {{business_name}}, has reviewed this Agreement, and consents to electronic records and signatures. Electronic copies may be treated as originals.

Client: {{business_name}}
Authorized signer: {{client_name}} ({{client_email}})
Date prepared: {{date}}`

const sensationInstallmentsAgreement = sensationAgreement.replace(
  'The one-time fee is {{price}}, due before work begins. The 90-day service period begins when Provider has this signed Agreement, payment, and the access and information reasonably needed to start. This Agreement does not automatically renew.',
  'The program fee is {{price}}. Client agrees to pay three installments of $1,500 each, plus applicable tax on each installment. The first installment is due at Stripe checkout after signing. Stripe will email a separate payment request for the second installment approximately one month after the first payment and another for the third installment approximately one month later. Client must pay each request separately; the card used for the first payment will not be charged automatically for the later installments. Each later invoice is due seven days after issue. No fourth installment or ongoing program fee is authorized. The 90-day service period begins when Provider has this signed Agreement, the first payment, and the access and information reasonably needed to start. The service period is 90 days even if an invoice date falls outside that period. This Agreement does not renew.',
).replace(
  'Once the program fee is paid, Client owns the final custom website content and design created specifically for Client under this Agreement.',
  'Once all three installments of the program fee are paid, Client owns the final custom website content and design created specifically for Client under this Agreement.',
).replace(
  'they are not included in this one-time fee.',
  'they are not included in this program fee.',
)

const checkoutTestAgreement = `TEST — $1 CHECKOUT AGREEMENT

This test agreement is between Caleb Wolin, operating as Wolin ("Provider"), and {{business_name}}, represented by {{client_name}} ("Test signer"). It is solely for testing Wolin's document signing, Stripe checkout, and payment status in the admin portal.

1. ONE-TIME TEST PAYMENT

After signing, Test signer may complete a real, one-time Stripe payment of {{price}}. Signing alone does not charge a payment method. There is no subscription or recurring charge under this agreement.

2. TEST SCOPE

The $1 payment is for this checkout test only. It does not purchase, amend, or activate the 90-day Hands-Free Local Sensation, website maintenance, or any marketing service, deliverable, or guarantee. The test is complete when Stripe confirms the payment and the admin portal records it as paid.

3. ELECTRONIC SIGNATURE

By signing, Test signer confirms that they are authorized to conduct this test for {{business_name}}, have reviewed this agreement, and consent to electronic records and signatures. Test signer may stop before making the payment.

Client: {{business_name}}
Authorized signer: {{client_name}} ({{client_email}})
Date prepared: {{date}}`

export const defaultTemplates: DefaultTemplate[] = [
  ...socialTemplates,
  reservationTemplate,
  reservedProgramTemplate,
  {
    id: 'local-sensation-90-day',
    name: '90-day Hands-Free Local Sensation Agreement',
    packageName: '90-day Hands-Free Local Sensation',
    price: '$4,500 one-time, plus applicable tax',
    subject: 'Your Wolin 90-day offer agreement is ready to sign',
    body: sensationAgreement,
    active: false,
  },
  {
    id: 'local-sensation-90-day-installments',
    name: '90-day Hands-Free Local Sensation Agreement — 3 payments',
    packageName: '90-day Hands-Free Local Sensation — 3 payments',
    price: '$1,500/month × 3 ($4,500 total) + applicable tax',
    subject: 'Your Wolin 90-day offer agreement with monthly payments is ready to sign',
    body: sensationInstallmentsAgreement,
    active: false,
  },
  {
    id: 'website-care-monthly',
    name: 'Website Hosting and Maintenance Agreement',
    packageName: 'Website hosting and maintenance',
    price: '$99/month, plus applicable tax',
    subject: 'Your Wolin website maintenance agreement is ready to sign',
    body: websiteCareAgreement,
  },
  {
    id: 'standalone-website',
    name: 'Standalone Website Build and Care Agreement',
    packageName: 'Standalone website build and care',
    price: '$299 upfront; $99/month after 30 free days + tax',
    subject: 'Your Wolin website build and care agreement is ready to sign',
    body: standaloneWebsiteAgreement,
  },
  {
    id: 'checkout-flow-test-1-dollar',
    name: 'TEST — $1 Checkout Agreement',
    packageName: 'TEST — $1 checkout',
    price: '$1 one-time, plus applicable tax',
    subject: 'TEST: Your $1 Wolin checkout agreement is ready to sign',
    body: checkoutTestAgreement,
    active: false,
  },
]
