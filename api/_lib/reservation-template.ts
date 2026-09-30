import { RESERVATION_TEMPLATE_ID } from '../../shared/reservation.js'
import { socialTemplates } from './social-templates.js'
import type { DefaultTemplate } from './default-templates.js'

const program = socialTemplates.find(template => template.id === 'local-virality-90-day')!
const programTerms = program.body.slice(program.body.indexOf('2. INCLUDED SERVICES'))

export const reservationTemplate: DefaultTemplate = {
  id: RESERVATION_TEMPLATE_ID,
  name: '90-Day Local Virality Reservation Agreement',
  packageName: '90-Day Local Virality Reservation',
  price: '$300 non-refundable; $3,199 balance, plus tax',
  subject: 'Your Wolin 90-day reservation agreement is ready to sign',
  body: `90-DAY HANDS-FREE LOCAL VIRALITY RESERVATION AGREEMENT

This Agreement is between Caleb Wolin, operating as Wolin ("Provider"), and {{business_name}}, represented by {{client_name}} ("Client"). It becomes effective when Client signs electronically.

1. RESERVATION, START DATE, AND PAYMENTS

Planned program start date: {{start_date}} (America/Denver).

Client reserves the 90-Day Hands-Free Local Virality program for that future date. The total program fee is $3,499, plus applicable tax. After signing, Client pays a $300 non-refundable reservation deposit through Stripe. The reservation is confirmed only when the deposit payment succeeds. The deposit is part of the $3,499 program price and is credited once toward this reservation's remaining $3,199 balance; it is not an additional fee, transferable credit, or discount on any other purchase.

On the planned start date, Client returns to the same secure signing link and purchases the program by paying the $3,199 balance through Stripe. Checkout for the balance becomes available on that date after the deposit has been confirmed. Client must complete checkout; this Agreement does not authorize an automatic charge, subscription, or recurring payment. Applicable tax is calculated by Stripe at each checkout.

The 90-day service period begins on the planned start date once Provider has this signed Agreement, both confirmed payments, account access, and completed onboarding. If those requirements are incomplete, work will not begin, and the parties will confirm the actual service start date in writing. The 90-day view guarantee runs from that actual service start date, not from the deposit date. Client's cancellation or decision not to proceed does not make the reservation deposit refundable, except where applicable law requires otherwise. Any date change must be agreed in writing with Provider; it is not made by changing the signed document. A refunded deposit cannot be used as a credit toward the program.

${programTerms}`,
}
