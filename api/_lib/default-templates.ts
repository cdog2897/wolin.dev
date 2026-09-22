export type DefaultTemplate = {
  id: string
  name: string
  packageName: string
  price: string
  subject: string
  body: string
}

const agreementBody = `This Monthly Services Agreement (the “Agreement”) is between Caleb Wolin, operating under the name Wolin (“Provider”), and {{business_name}}, represented by {{client_name}} (“Client”). It becomes effective when Client signs electronically.

1. PACKAGE AND MONTHLY FEE

Client selects the {{package_name}} package at {{price}} per monthly service period, plus any applicable tax. The package is month-to-month and does not require a fixed long-term commitment. Each service period begins on the first payment date and renews monthly on the corresponding calendar date. If a month does not contain that date, renewal occurs on the month’s final day.

2. SERVICES INCLUDED

{{package_scope}}

Provider will use reasonable professional judgment to prioritize the included services. The exact order and timing depend on account access, platform availability, Client approvals, current conditions, and the work with the greatest expected value.

3. SERVICE SCHEDULE AND DELIVERY

Work begins after Provider receives this signed Agreement, the first monthly payment, and the access and materials reasonably needed for the work. Provider may communicate findings, completed changes, and next steps by email, shared document, report, or another format agreed with Client.

The monthly fee reserves recurring professional time and covers the included services Provider can reasonably complete during that service period. It does not purchase unlimited labor or require every possible recommendation to be completed in one month.

4. CLIENT RESPONSIBILITIES

Client will provide timely and lawful access to relevant profiles, website systems, analytics, hosting, domains, and third-party accounts; provide accurate business information and approved materials; respond to approval requests within a reasonable time; maintain necessary subscriptions, backups, and security controls; and confirm it has the right to use all materials and account access supplied to Provider.

Provider may pause affected work when access, information, approval, payment, or a safe backup is unavailable. A Client delay does not extend the paid service period unless Provider agrees in writing.

5. SERVICES NOT INCLUDED

Unless the parties approve a separate written add-on, this package excludes paid advertising and ad spend; premium software, licenses, domains, hosting, stock media, and other third-party fees; professional photography or video production; legal, tax, accessibility, or cybersecurity certification; and work outside the package scope described above. Provider will request approval before purchasing a third-party product or service for Client.

6. RESULTS AND PLATFORM LIMITATIONS

Provider promises to perform the included services with reasonable care and professional diligence but does not promise a particular business result. No specific ranking, map position, indexing outcome, traffic level, lead volume, sale, revenue, return on investment, review outcome, platform approval, AI mention, or continued account access is guaranteed. Results may change because of competition, location, seasonality, demand, prior account history, Client decisions, algorithm changes, platform policies, outages, and third-party conduct.

Provider will not use deceptive practices, fake reviews, false business information, hidden text, link schemes, impersonation, or other tactics Provider reasonably believes violate law or platform rules.

7. FEES AND PAYMENT

Client will pay {{price}} in advance for each monthly service period through Provider’s payment link or another approved invoicing method. The first payment is due after signature and before work begins. Provider may pause work while an amount is overdue. Provider will not increase the package fee without advance written notice, and Client may cancel before a new price takes effect.

8. CANCELLATION AND ENDING SERVICE

Client may cancel at any time by emailing caleb.wolin@gmail.com. Cancellation stops future renewals and becomes effective at the end of the current paid service period. Monthly fees are not prorated or refunded after a service period begins except when required by law or agreed in writing.

Provider may end this Agreement on seven days’ written notice, or immediately for nonpayment, unlawful instructions, abusive conduct, material breach, security risk, or loss of necessary access. If Provider ends service without cause before a paid period ends, Provider will refund the unused portion on a reasonable prorated basis.

9. CHANGES AND ADDITIONAL WORK

Work outside the included services requires Client’s written approval of added scope, timing, and price. Email approval is sufficient. Provider is not required to begin added work before receiving any requested deposit or payment.

10. OWNERSHIP AND USE OF MATERIALS

Client keeps ownership of its pre-existing names, logos, photos, content, accounts, data, and other materials. After full payment, Client owns final written content, configuration changes, and deliverables created specifically for Client to the extent they can be owned and transferred. Provider retains pre-existing methods, templates, checklists, tools, code, processes, know-how, and general skills, and grants Client a perpetual, nonexclusive license to any Provider-owned element embedded in a paid deliverable. Third-party materials remain subject to their own terms.

11. CONFIDENTIALITY AND ACCOUNT ACCESS

Each party will use reasonable care to protect the other party’s nonpublic business information and use it only to perform or receive the services. Provider may use employees, contractors, and service providers who reasonably need access and are expected to protect confidential information. Client authorizes Provider to access and make changes in accounts and systems supplied for the included services.

12. INDEPENDENT CONTRACTOR

Provider is an independent contractor, not Client’s employee, partner, joint venturer, agent, or legal representative. Provider controls the manner and means of performing the services, subject to this Agreement, applicable law, and platform rules.

13. WARRANTIES AND DISCLAIMERS

Each party represents that it has authority to enter this Agreement. Client represents that information and instructions it supplies are accurate and lawful. Provider represents that the services will be performed professionally and consistently with ordinary industry practice. Except for these express promises, services and deliverables are provided as is and as available. To the extent permitted by law, Provider disclaims implied warranties, including merchantability, fitness for a particular purpose, and noninfringement.

14. LIMITATION OF LIABILITY

To the extent permitted by law, neither party is liable for indirect, incidental, special, exemplary, punitive, or consequential damages, or for lost profits, revenue, opportunities, goodwill, or data arising from this Agreement. Provider’s total liability will not exceed the fees Client paid under this Agreement during the three months immediately before the event giving rise to the claim. This limit does not apply where prohibited by law or to fraud, willful misconduct, or gross negligence.

15. GENERAL TERMS

The parties will first try in good faith to resolve a dispute through direct discussion. The laws of the state where Provider principally resides on the Effective Date govern this Agreement unless the parties agree otherwise in writing. This Agreement and written add-ons are the entire agreement about these services and replace prior discussions on the same subject. Changes must be in writing and accepted by both parties. If one provision is unenforceable, the rest remains effective. Notices may be sent by email. Signatures in counterparts and electronic signatures are effective, and an electronic copy may be treated as an original.

16. ELECTRONIC SIGNATURE CONSENT

By selecting “I agree” and applying an electronic signature, Client confirms that the signer is authorized to bind the business named above, has reviewed this entire Agreement, consents to use electronic records and signatures, and agrees to the {{package_name}} package at {{price}} per month.`

const packages = [
  {
    id: 'starter-monthly',
    name: 'Starter Monthly Services Agreement',
    packageName: 'Starter',
    price: '$279',
    subject: 'Your Wolin Starter agreement is ready to sign',
    scope: `The Starter package covers hands-on Google Business Profile care: a complete profile audit; updates to categories, services, description, attributes, and links where access and platform rules permit; checks of hours, service areas, address, phone, and contact details; review of logo, cover image, and existing photo placement; one profile post per service period; identification of duplicate, suspended, or inaccurate listing issues; and a monthly report with status, local ranking observations, completed work, and recommended next steps.`,
  },
  {
    id: 'growth-monthly',
    name: 'Growth Monthly Services Agreement',
    packageName: 'Growth',
    price: '$679',
    subject: 'Your Wolin Growth agreement is ready to sign',
    scope: `The Growth package includes everything in Starter, two Google Business Profile posts per service period, a focused website health review, corrections to prioritized broken links and on-page issues, practical mobile and speed improvements, improvements to calls to action and contact paths, local business structured-data and business-information checks, and Google Search Console setup and issue monitoring. Website work is prioritized by likely impact and monthly capacity; not every identified issue or page will necessarily be completed in one service period.`,
  },
  {
    id: 'authority-monthly',
    name: 'Authority Monthly Services Agreement',
    packageName: 'Authority',
    price: '$1,279',
    subject: 'Your Wolin Authority agreement is ready to sign',
    scope: `The Authority package includes everything in Growth plus a full website and technical SEO audit with a prioritized roadmap; work on crawl, indexing, sitemap, robots, canonical, redirect, structure, internal linking, structured data, and performance issues; keyword, competitor, service, and location research; writing or improvement of prioritized service, location, FAQ, and authority content; conversion-path review; AI visibility auditing across available ChatGPT, Claude, and Google AI experiences; representative customer-prompt testing; and ongoing search and AI visibility monitoring. Search and AI results are snapshots and vary by user, location, device, model, prompt, and date.`,
  },
]

export const defaultTemplates: DefaultTemplate[] = packages.map((item) => ({
  id: item.id,
  name: item.name,
  packageName: item.packageName,
  price: item.price,
  subject: item.subject,
  body: agreementBody.replace('{{package_scope}}', item.scope),
}))
