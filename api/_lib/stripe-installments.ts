export const INSTALLMENT_TEMPLATE_ID = 'local-sensation-90-day-installments'
export const INSTALLMENT_FIRST_PRICE_ID = 'price_1UJadpAUfC4vfcETCL3icfMC'
export const INSTALLMENT_MONTHLY_PRICE_ID = 'price_1UJaPrAUfC4vfcETdhSqlPR6'
export const INSTALLMENT_SUBTOTAL = 150_000
export const INSTALLMENT_COUNT = 3

type StripeSchedule = {
  id: string
  customer: string | { id: string }
  subscription: string | { id: string } | null
  end_behavior: string
  metadata: Record<string, string>
  default_settings: { collection_method: string; automatic_tax: { enabled: boolean }; invoice_settings: { days_until_due: number | null } }
  phases: Array<{ start_date: number; end_date: number; collection_method?: string | null; automatic_tax?: { enabled: boolean } | null; items: Array<{ price: string | { id: string }; quantity: number }> }>
}

type StripeInvoice = {
  id: string
  status: string
  subtotal: number
  amount_paid: number
  currency: string
  status_transitions?: { paid_at?: number | null }
}

function stripeId(value: string | { id: string } | null | undefined) {
  return typeof value === 'string' ? value : value?.id ?? null
}

async function stripeRequest<T>(path: string, body?: URLSearchParams, idempotencyKey?: string): Promise<T> {
  const key = process.env.STRIPE_RESTRICTED_KEY
  if (!key || !/^rk_(live|test)_/.test(key)) throw new Error('A restricted Stripe API key is required for the three-payment plan.')
  const response = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: body ? 'POST' : 'GET',
    headers: {
      Authorization: `Bearer ${key}`,
      ...(body ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}),
      ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
    },
    body,
  })
  if (!response.ok) throw new Error(`Stripe API request to ${path.split('?')[0]} failed (${response.status}).`)
  return response.json() as Promise<T>
}

function nextMonth(timestamp: number) {
  const date = new Date(timestamp * 1000)
  const day = date.getUTCDate()
  const next = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1, date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()))
  const days = new Date(Date.UTC(next.getUTCFullYear(), next.getUTCMonth() + 1, 0)).getUTCDate()
  next.setUTCDate(Math.min(day, days))
  return Math.floor(next.getTime() / 1000)
}

function validSchedule(schedule: StripeSchedule, customerId: string, envelopeId: string) {
  return stripeId(schedule.customer) === customerId
    && schedule.end_behavior === 'cancel'
    && schedule.metadata?.wolin_plan === INSTALLMENT_TEMPLATE_ID
    && schedule.metadata?.wolin_envelope_id === envelopeId
    && schedule.default_settings.collection_method === 'send_invoice'
    && schedule.default_settings.automatic_tax.enabled
    && schedule.default_settings.invoice_settings.days_until_due === 7
    && schedule.phases.length === 1
    && (schedule.phases[0].collection_method == null || schedule.phases[0].collection_method === 'send_invoice')
    && (schedule.phases[0].automatic_tax == null || schedule.phases[0].automatic_tax.enabled)
    && schedule.phases[0].items.length === 1
    && stripeId(schedule.phases[0].items[0].price) === INSTALLMENT_MONTHLY_PRICE_ID
    && schedule.phases[0].items[0].quantity === 1
    && schedule.phases[0].end_date - schedule.phases[0].start_date >= 56 * 86_400
    && schedule.phases[0].end_date - schedule.phases[0].start_date <= 63 * 86_400
}

export async function customerForFirstPayment(existingCustomerId: string | null, details: { email?: string | null; name?: string | null; address?: Record<string, string | null> | null }, envelopeId: string) {
  if (existingCustomerId) return existingCustomerId
  if (!details.email) throw new Error('The first installment checkout did not include a customer email.')
  const form = new URLSearchParams({ email: details.email, 'metadata[wolin_envelope_id]': envelopeId })
  if (details.name) form.set('name', details.name)
  for (const [key, value] of Object.entries(details.address ?? {})) if (value) form.set(`address[${key}]`, value)
  const customer = await stripeRequest<{ id: string }>('customers', form, `wolin-installment-customer-${envelopeId}`)
  return customer.id
}

export async function ensureInvoiceSchedule(customerId: string, envelopeId: string, firstPaymentAt: number) {
  const result = await stripeRequest<{ data: StripeSchedule[]; has_more: boolean }>(`subscription_schedules?customer=${encodeURIComponent(customerId)}&limit=100`)
  if (result.has_more) throw new Error('Too many Stripe schedules to identify the payment plan safely.')
  const matches = result.data.filter((schedule) => schedule.metadata?.wolin_envelope_id === envelopeId)
  if (matches.length > 1) throw new Error('Multiple Stripe schedules exist for this agreement.')
  if (matches.length === 1) {
    if (!validSchedule(matches[0], customerId, envelopeId)) throw new Error('The existing Stripe invoice schedule does not match the agreement.')
    return matches[0]
  }
  const form = new URLSearchParams({
    customer: customerId,
    start_date: String(nextMonth(firstPaymentAt)),
    end_behavior: 'cancel',
    'metadata[wolin_plan]': INSTALLMENT_TEMPLATE_ID,
    'metadata[wolin_envelope_id]': envelopeId,
    'default_settings[collection_method]': 'send_invoice',
    'default_settings[invoice_settings][days_until_due]': '7',
    'default_settings[automatic_tax][enabled]': 'true',
    'phases[0][items][0][price]': INSTALLMENT_MONTHLY_PRICE_ID,
    'phases[0][items][0][quantity]': '1',
    'phases[0][duration][interval]': 'month',
    'phases[0][duration][interval_count]': '2',
  })
  const schedule = await stripeRequest<StripeSchedule>('subscription_schedules', form, `wolin-installment-invoices-${envelopeId}`)
  if (!validSchedule(schedule, customerId, envelopeId)) throw new Error('Stripe did not confirm the two-invoice limit.')
  return schedule
}

export async function scheduleForSubscription(subscriptionId: string) {
  const subscription = await stripeRequest<{ id: string; schedule: string | { id: string } | null }>(`subscriptions/${encodeURIComponent(subscriptionId)}`)
  if (subscription.id !== subscriptionId) throw new Error('Stripe returned an unexpected subscription.')
  const scheduleId = stripeId(subscription.schedule)
  if (!scheduleId) return null
  return stripeRequest<StripeSchedule>(`subscription_schedules/${encodeURIComponent(scheduleId)}`)
}

export function scheduleMatchesEnvelope(schedule: StripeSchedule, customerId: string, envelopeId: string) {
  return validSchedule(schedule, customerId, envelopeId)
}

export async function paidLaterInvoices(subscriptionId: string) {
  const params = new URLSearchParams({ subscription: subscriptionId, status: 'paid', limit: '100' })
  const result = await stripeRequest<{ data: StripeInvoice[]; has_more: boolean }>(`invoices?${params}`)
  if (result.has_more) throw new Error('Too many Stripe invoices to reconcile safely.')
  const invoices = result.data.filter((invoice) => invoice.status === 'paid' && invoice.subtotal === INSTALLMENT_SUBTOTAL && invoice.currency.toLowerCase() === 'usd' && invoice.amount_paid >= INSTALLMENT_SUBTOTAL)
  invoices.sort((a, b) => (a.status_transitions?.paid_at ?? 0) - (b.status_transitions?.paid_at ?? 0))
  return {
    count: invoices.length,
    amountPaid: invoices.reduce((total, invoice) => total + invoice.amount_paid, 0),
    lastPaidAt: invoices[invoices.length - 1]?.status_transitions?.paid_at ?? null,
  }
}
