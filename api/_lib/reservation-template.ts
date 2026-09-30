import { RESERVATION_TEMPLATE_ID, RESERVED_PROGRAM_TEMPLATE_ID } from '../../shared/reservation.js'
import { socialTemplates } from './social-templates.js'
import type { DefaultTemplate } from './default-templates.js'

const program = socialTemplates.find(template => template.id === 'local-virality-90-day')!
export const reservedProgramTemplate: DefaultTemplate = {
  ...program,
  id: RESERVED_PROGRAM_TEMPLATE_ID,
  name: '90-Day Hands-Free Local Virality — Reserved Program Agreement',
  packageName: '90-Day Hands-Free Local Virality — Reserved Program',
  price: '$3,199 one time, plus applicable tax',
  subject: 'Your Wolin reserved 90-day program agreement is ready to sign',
  body: program.body.replace('90-DAY HANDS-FREE LOCAL VIRALITY AGREEMENT', '90-DAY HANDS-FREE LOCAL VIRALITY — RESERVED PROGRAM AGREEMENT'),
}

export const reservationTemplate: DefaultTemplate = {
  id: RESERVATION_TEMPLATE_ID,
  name: '90-Day Local Virality — Reservation Deposit Agreement',
  packageName: '90-Day Local Virality — Reservation Deposit',
  price: '$300 non-refundable deposit, plus applicable tax',
  subject: 'Your Wolin reservation deposit agreement is ready to sign',
  body: `90-DAY LOCAL VIRALITY — RESERVATION DEPOSIT AGREEMENT

This Agreement is between Caleb Wolin, operating as Wolin ("Provider"), and {{business_name}}, represented by {{client_name}} ("Client"). It becomes effective when Client signs electronically.

1. RESERVATION AND PLANNED START DATE

Planned program start date: {{start_date}} (America/Denver).

Client reserves the 90-Day Hands-Free Local Virality program for that future date. After signing this deposit agreement, Client pays {{price}} through its separate Stripe checkout. The reservation is confirmed only when the deposit payment succeeds. This deposit agreement reserves the date; it does not purchase or begin the 90-day service.

2. NON-REFUNDABLE DEPOSIT AND SEPARATE PROGRAM PURCHASE

The $300 non-refundable deposit is credited once toward the $3,499 program price, leaving a $3,199 program fee, plus applicable tax. Client's cancellation or decision not to proceed does not make the deposit refundable, except where applicable law requires otherwise. The credit is for this Client's reserved program and is not transferable or usable for any other purchase. A refunded deposit cannot be used as a credit.

Provider will send a separate $3,199 reserved-program agreement and a separate Stripe payment link for the program purchase. That agreement records the start date and the full program scope, bonuses, guarantee, and service terms. Client must sign it separately and complete its checkout on the planned start date. The deposit payment does not authorize an automatic charge, subscription, or recurring payment. Stripe calculates applicable tax at each separate checkout.

Any date change must be agreed in writing with Provider; the signed deposit agreement is not edited. Service starts under the separate program agreement after the required payments, account access, and onboarding are complete.

3. ELECTRONIC SIGNATURE

By signing, Client confirms that the signer is authorized to bind {{business_name}}, has reviewed this Agreement, and consents to electronic records and signatures. Electronic copies may be treated as originals.

Client: {{business_name}}
Authorized signer: {{client_name}} ({{client_email}})
Date prepared: {{date}}`,
}
