import { socialOffers } from '../../shared/social-offers.js'
import { assertDb, db } from './db.js'

type StripeId = string | { id?: string } | null
type SocialStripeObject = {
  object?: string
  id?: string
  customer?: StripeId
  subscription?: StripeId
  parent?: { subscription_details?: { subscription?: StripeId } }
  status?: string
  currency?: string | null
  amount_paid?: number
  amount_due?: number
  total?: number
  status_transitions?: { paid_at?: number | null }
  current_period_end?: number
  cancel_at_period_end?: boolean
  items?: { data?: Array<{ current_period_end?: number }> }
}
type SocialStripeEvent = {
  id?: string
  type?: string
  created?: number
  livemode?: boolean
  data?: { object?: SocialStripeObject }
}

function stripeId(value: StripeId | undefined) {
  return typeof value === 'string' ? value : value?.id ?? null
}

const monthlyTemplateIds = new Set<string>(socialOffers.filter(offer => offer.cadence === 'monthly').map(offer => offer.templateId))

export function isMonthlySocialTemplate(templateId: unknown) {
  return monthlyTemplateIds.has(String(templateId))
}

function timestamp(value: number | undefined | null) {
  return value && Number.isFinite(value) && value > 0 ? new Date(value * 1000).toISOString() : null
}

export async function recordSocialSubscription(event: SocialStripeEvent) {
  if (event.livemode !== true || !event.id || !event.created || !event.type) return
  const object = event.data?.object
  if (!object?.id) return
  const subscriptionEvent = ['customer.subscription.created', 'customer.subscription.updated', 'customer.subscription.deleted'].includes(event.type)
  const invoiceEvent = ['invoice.paid', 'invoice.payment_failed', 'invoice.payment_action_required', 'invoice.finalization_failed'].includes(event.type)
  if (!subscriptionEvent && !invoiceEvent) return
  if (subscriptionEvent && object.object !== 'subscription') return
  if (invoiceEvent && (object.object !== 'invoice' || object.currency?.toLowerCase() !== 'usd')) return
  const subscriptionId = subscriptionEvent ? object.id : stripeId(object.parent?.subscription_details?.subscription ?? object.subscription)
  if (!subscriptionId) return

  const supabase = db()
  const { data: envelope, error: readError } = await supabase.from('signing_envelopes')
    .select('id, template_id, stripe_customer_id, stripe_subscription_status, stripe_last_invoice_id, stripe_last_invoice_status')
    .eq('stripe_subscription_id', subscriptionId).eq('status', 'signed').maybeSingle()
  assertDb(readError, 'Unable to find the social subscription agreement')
  if (!envelope || !isMonthlySocialTemplate(envelope.template_id)) return
  if (envelope.stripe_customer_id && stripeId(object.customer) !== envelope.stripe_customer_id) return

  if (subscriptionEvent) {
    if (!object.status) return
    // A canceled Stripe subscription cannot become active again, even on a late delivery.
    if (envelope.stripe_subscription_status === 'canceled' && object.status !== 'canceled') return
    const periodEnd = object.current_period_end ?? object.items?.data?.[0]?.current_period_end
    const { error } = await supabase.from('signing_envelopes').update({
      stripe_subscription_status: object.status,
      subscription_current_period_end: timestamp(periodEnd),
      subscription_cancel_at_period_end: object.cancel_at_period_end ?? false,
      subscription_last_event_created: event.created,
    }).eq('id', envelope.id).eq('stripe_subscription_id', subscriptionId).lte('subscription_last_event_created', event.created)
    assertDb(error, 'Unable to update the social subscription status')
    return
  }

  const paid = event.type === 'invoice.paid'
  if (paid && object.status !== 'paid') return
  // Do not let an earlier failed attempt overwrite a paid invoice on redelivery.
  if (!paid && envelope.stripe_last_invoice_id === object.id && envelope.stripe_last_invoice_status === 'paid') return
  const { error } = await supabase.from('signing_envelopes').update({
    payment_status: paid ? 'paid' : 'failed',
    stripe_last_invoice_id: object.id,
    stripe_last_invoice_status: paid ? 'paid' : event.type === 'invoice.payment_failed' ? 'payment_failed' : event.type === 'invoice.payment_action_required' ? 'action_required' : 'finalization_failed',
    last_invoice_amount_total: object.total ?? object.amount_paid ?? object.amount_due ?? null,
    last_invoice_paid_at: paid ? timestamp(object.status_transitions?.paid_at ?? event.created) : null,
    invoice_last_event_created: event.created,
  }).eq('id', envelope.id).eq('stripe_subscription_id', subscriptionId).lte('invoice_last_event_created', event.created)
  assertDb(error, 'Unable to record the social subscription invoice')
}
