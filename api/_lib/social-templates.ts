import { formatOfferPrice, socialOffers } from '../../shared/social-offers.js'
import type { DefaultTemplate } from './default-templates.js'

const introduction = `This Agreement is between Caleb Wolin, operating as Wolin ("Provider"), and {{business_name}}, represented by {{client_name}} ("Client"). It becomes effective when Client signs electronically.`

const responsibilities = `Client will provide accurate business information, appropriate access to its Instagram, Facebook, and TikTok accounts and analytics, brand materials, reasonable access for the included shoot, and timely feedback or approvals. Client confirms it has the right to use supplied materials. Provider may publish the content approved under the agreed content plan. Client remains responsible for business offers, customer commitments, and specialized or regulated advice. Work affected by missing access or approvals may be paused; the parties will agree in writing on any resulting schedule change.`

const ownership = `Client retains ownership of its brand, social accounts, and materials it supplies. After the applicable service fee is paid, Client may use the final content and custom templates delivered for its business. Provider retains ownership of pre-existing tools and general methods. Third-party music, fonts, stock assets, and platform tools remain subject to their applicable licenses. Platform policies, availability, and algorithms are outside Provider's control.`

const scope = `The service covers Client's business on Instagram, Facebook, and TikTok. A post means a publication on one platform; publishing the same creative on three platforms counts as three posts. The platform totals describe publications and do not promise a separate original creative for every publication. Content strategy is tailored to Client's business and local audience. Provider handles content planning, scripting, editing, captions, hashtags, scheduling, and publishing, and supplies a monthly analytics report.

DM or community management, paid advertising and ad spend, additional shoots, websites, search optimization, and other work outside these listed services require a separate written agreement before any additional fee applies. No particular number of followers, inquiries, sales, or revenue is promised.`

const signature = `By signing, Client confirms that the signer is authorized to bind {{business_name}}, has reviewed this Agreement, and consents to electronic records and signatures. Electronic copies may be treated as originals.

Client: {{business_name}}
Authorized signer: {{client_name}} ({{client_email}})
Date prepared: {{date}}`

export const socialTemplates: DefaultTemplate[] = socialOffers.map(offer => {
  const monthly = offer.cadence === 'monthly'
  const count = offer.postsPerPlatform
  const fee = formatOfferPrice(offer.amount)
  const body = monthly ? `${offer.title.toUpperCase()} MONTHLY SOCIAL MEDIA AGREEMENT

${introduction}

1. MONTHLY SERVICE, BILLING, AND START DATE

Client engages Provider for {{package_name}} at {{price}}. Stripe checkout after signing starts a monthly subscription and collects the first month's fee. Stripe automatically charges the agreed monthly fee, plus applicable tax, on each monthly billing date until canceled. This is month-to-month, with no fixed multi-month commitment. Onboarding is included. The first service month begins at checkout; production begins when Provider has the account access and information reasonably needed to start. Provider and Client will confirm the content and shoot schedule during onboarding.

2. INCLUDED SERVICES

Provider will publish ${count * 3} posts per monthly service period: ${count} on Instagram, ${count} on Facebook, and ${count} on TikTok. One professional photo/video shoot is included per monthly service period, with its date, location, and production plan agreed during onboarding.

${scope}

3. TIER CHANGES AND CANCELLATION

Client may request a different social media tier for the next billing period by emailing caleb.wolin@gmail.com before the next billing date. Provider will confirm the new price and posting volume in writing before the change takes effect. Client may cancel future monthly charges through the Stripe customer portal if available or by emailing caleb.wolin@gmail.com before the next billing date. Service continues through the paid period, and cancellation stops future renewals. The 90-day program's bonuses and view guarantee are not included in this monthly plan.

4. CLIENT COOPERATION AND APPROVALS

${responsibilities}

5. CONTENT, ACCOUNTS, AND THIRD-PARTY PLATFORMS

${ownership}

6. ELECTRONIC SIGNATURE

${signature}` : `90-DAY HANDS-FREE LOCAL VIRALITY AGREEMENT

${introduction}

1. PROGRAM, TERM, AND ONE-TIME FEE

Client engages Provider for {{package_name}}. The fee is {{price}}, charged once at Stripe checkout after signing and due before work begins. The current sale fee is ${fee}; the advertised regular price is $7,000. This Agreement authorizes one payment and does not start a subscription or automatically renew. The 90-day service period begins once Provider has the signed Agreement, payment, account access, and completed onboarding. Provider will confirm the start date with Client.

2. INCLUDED SERVICES

Provider will publish 60 posts in each 30-day service period: 20 on Instagram, 20 on Facebook, and 20 on TikTok. Across the full 90 days, that is 180 platform publications. One professional photo/video shoot is included during the program, with its date, location, and production plan agreed during onboarding.

${scope}

3. INCLUDED FREE BONUSES

At no separate charge, Provider will provide an Internet Growth Guide with practical steps for improving Client's online presence and attracting local customers; refresh Client's Instagram, Facebook, and TikTok bios with clear business descriptions and calls to action; and deliver a Branded Template Pack of reusable social designs styled with Client's colors and branding for promotions, announcements, and customer testimonials. The custom templates will be delivered in a reusable format agreed during onboarding. These bonuses are included in the paid 90-day program.

4. 10,000 COMBINED VIEWS GUARANTEE

Provider guarantees at least 10,000 combined views of the program's content across Instagram, Facebook, and TikTok within the first 90 service days. The total is the sum of content views reported by those platforms and shown in the monthly reports; it does not mean 10,000 unique people, impressions, or guaranteed local viewers. If the combined total is below 10,000 at the end of the 90 days, Provider will keep managing Client's social media at no extra charge until that total reaches 10,000. The extension creates no additional management fee and does not enroll Client in a paid monthly plan. Client will continue providing the access and cooperation needed to deliver the extension.

5. CLIENT COOPERATION AND APPROVALS

${responsibilities}

6. CONTENT, ACCOUNTS, AND THIRD-PARTY PLATFORMS

${ownership}

7. END OF PROGRAM

Provider will deliver the final program analytics report. Any outstanding guarantee extension continues under Section 4. Continuing with a paid monthly tier requires a separate agreement and subscription; it is optional.

8. ELECTRONIC SIGNATURE

${signature}`
  return {
    id: offer.templateId,
    name: `${offer.title} Agreement`,
    packageName: offer.title,
    price: `${fee}${monthly ? '/month' : ' one time'}, plus applicable tax`,
    subject: `Your Wolin ${offer.title} agreement is ready to sign`,
    body,
  }
})
