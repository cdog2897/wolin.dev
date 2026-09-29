import { createHmac, timingSafeEqual } from 'node:crypto'
import { assertDb, db } from './_lib/db.js'
import { matchesPaymentReference, paymentOffers } from './_lib/payment-links.js'
import { customerForFirstPayment, ensureInvoiceSchedule, INSTALLMENT_COUNT, INSTALLMENT_TEMPLATE_ID, paidLaterInvoices, scheduleForSubscription, scheduleMatchesEnvelope } from './_lib/stripe-installments.js'

type CheckoutSession = {
  object?: string
  id?: string
  client_reference_id?: string | null
  payment_link?: string | { id?: string } | null
  payment_status?: string
  amount_subtotal?: number | null
  amount_total?: number | null
  currency?: string | null
  customer?: string | { id?: string } | null
  payment_intent?: string | { id?: string } | null
  subscription?: string | { id?: string } | null
  customer_details?: { email?: string | null; name?: string | null; address?: Record<string, string | null> | null } | null
}

type StripeEvent = {
  id?: string
  type?: string
  created?: number
  livemode?: boolean
  data?: { object?: CheckoutSession & { parent?: { subscription_details?: { subscription?: string | { id?: string } } }; subscription?: string | { id?: string } | null } }
}

function stripeId(value: string | { id?: string } | null | undefined) {
  return typeof value === 'string' ? value : value?.id ?? null
}

function validSignature(body: Buffer, header: string, secret: string) {
  const parts = header.split(',').map((part) => part.trim())
  const timestamp = parts.find((part) => part.startsWith('t='))?.slice(2)
  const signatures = parts.filter((part) => part.startsWith('v1=')).map((part) => part.slice(3))
  if (!timestamp || !/^\d+$/.test(timestamp) || Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false
  const expected = createHmac('sha256', secret).update(`${timestamp}.`).update(body).digest()
  return signatures.some((signature) => {
    if (!/^[a-f0-9]{64}$/i.test(signature)) return false
    return timingSafeEqual(expected, Buffer.from(signature, 'hex'))
  })
}

async function recordCheckout(event: StripeEvent) {
  if (event.livemode !== true) return
  if (!['checkout.session.completed', 'checkout.session.async_payment_succeeded', 'checkout.session.async_payment_failed'].includes(event.type ?? '')) return
  const session = event.data?.object
  const reference = session?.client_reference_id
  const envelopeId = reference?.split('_')[0]
  if (session?.object !== 'checkout.session' || !session.id || !envelopeId || !/^[0-9a-f-]{36}$/i.test(envelopeId)) return

  const supabase = db()
  const { data: envelope, error: readError } = await supabase.from('signing_envelopes')
    .select('id, template_id, token_hash, status, payment_status, stripe_checkout_session_id, stripe_subscription_id, stripe_customer_id, stripe_last_event_created')
    .eq('id', envelopeId).maybeSingle()
  assertDb(readError, 'Unable to match the Stripe payment')
  if (!envelope || envelope.status !== 'signed' || !matchesPaymentReference(reference, envelope.id, envelope.token_hash)) return

  const offer = paymentOffers[String(envelope.template_id)]
  if (!offer || stripeId(session.payment_link) !== offer.linkId || session.currency?.toLowerCase() !== 'usd' || session.amount_subtotal !== offer.subtotal) return

  const eventCreated = Number(event.created) || 0
  if (!eventCreated || !event.id) return
  const paid = event.type === 'checkout.session.async_payment_succeeded' || (event.type === 'checkout.session.completed' && session.payment_status === 'paid')
  const failed = event.type === 'checkout.session.async_payment_failed'
  if (envelope.template_id === INSTALLMENT_TEMPLATE_ID) {
    if (stripeId(session.subscription) || (envelope.stripe_checkout_session_id && envelope.stripe_checkout_session_id !== session.id)) {
      throw new Error('The first installment checkout does not match this agreement.')
    }
    if (!paid) {
      const { error } = await supabase.from('signing_envelopes').update({
        payment_status: failed ? 'failed' : 'processing',
        stripe_checkout_session_id: session.id,
        stripe_payment_link_id: offer.linkId,
        stripe_last_event_id: event.id,
        stripe_last_event_created: eventCreated,
      }).eq('id', envelopeId).eq('status', 'signed').eq('installments_paid', 0)
      assertDb(error, 'Unable to record the pending first installment')
      return
    }
    if (session.amount_total == null || session.amount_total < offer.subtotal) throw new Error('The first installment total is invalid.')
    const firstTotal = session.amount_total
    const { error: firstError } = await supabase.from('signing_envelopes').update({
      payment_status: 'processing',
      installments_paid: 1,
      stripe_checkout_session_id: session.id,
      stripe_payment_link_id: offer.linkId,
      stripe_payment_intent_id: stripeId(session.payment_intent),
      stripe_customer_id: stripeId(session.customer),
      first_payment_amount_total: firstTotal,
      payment_amount_total: firstTotal,
      payment_currency: 'USD',
      stripe_last_event_id: event.id,
      stripe_last_event_created: eventCreated,
    }).eq('id', envelopeId).eq('status', 'signed').eq('installments_paid', 0)
    assertDb(firstError, 'Unable to record the first installment')
    const customerId = await customerForFirstPayment(envelope.stripe_customer_id ?? stripeId(session.customer), session.customer_details ?? {}, envelope.id)
    const { error: customerError } = await supabase.from('signing_envelopes').update({ stripe_customer_id: customerId })
      .eq('id', envelopeId).eq('status', 'signed').eq('stripe_checkout_session_id', session.id)
    assertDb(customerError, 'Unable to save the Stripe customer')
    const schedule = await ensureInvoiceSchedule(customerId, envelope.id, eventCreated)
    const { error } = await supabase.from('signing_envelopes').update({
      stripe_customer_id: customerId,
      stripe_subscription_schedule_id: schedule.id,
    }).eq('id', envelopeId).eq('status', 'signed').eq('stripe_checkout_session_id', session.id)
    assertDb(error, 'Unable to save the monthly invoice schedule')
    return
  }
  if (!paid && Number(envelope.stripe_last_event_created) > eventCreated) return
  if (!paid && envelope.payment_status === 'paid') return
  if (failed && envelope.stripe_checkout_session_id !== session.id) return

  const update = {
    payment_status: paid ? 'paid' : failed ? 'failed' : 'processing',
    stripe_checkout_session_id: session.id,
    stripe_payment_link_id: offer.linkId,
    stripe_payment_intent_id: stripeId(session.payment_intent),
    stripe_subscription_id: stripeId(session.subscription),
    stripe_customer_id: stripeId(session.customer),
    payment_amount_total: session.amount_total ?? null,
    payment_currency: session.currency?.toUpperCase() ?? null,
    paid_at: paid ? new Date(eventCreated * 1000).toISOString() : null,
    stripe_last_event_id: event.id,
    stripe_last_event_created: eventCreated,
  }
  let query = supabase.from('signing_envelopes').update(update).eq('id', envelopeId).eq('status', 'signed')
  if (!paid) query = query.neq('payment_status', 'paid').lte('stripe_last_event_created', eventCreated)
  else query = query.neq('payment_status', 'paid')
  const { error } = await query
  assertDb(error, 'Unable to record the Stripe payment')
}

async function recordInstallmentInvoice(event: StripeEvent) {
  if (event.livemode !== true || event.type !== 'invoice.paid') return
  const invoice = event.data?.object
  if (invoice?.object !== 'invoice' || !invoice.id) return
  const subscriptionId = stripeId(invoice.parent?.subscription_details?.subscription ?? invoice.subscription)
  if (!subscriptionId) return
  const schedule = await scheduleForSubscription(subscriptionId)
  if (!schedule) return
  const supabase = db()
  const { data: envelope, error: readError } = await supabase.from('signing_envelopes')
    .select('id, template_id, status, stripe_subscription_id, stripe_subscription_schedule_id, stripe_customer_id, first_payment_amount_total')
    .eq('stripe_subscription_schedule_id', schedule.id).maybeSingle()
  assertDb(readError, 'Unable to find the installment agreement')
  if (!envelope || envelope.template_id !== INSTALLMENT_TEMPLATE_ID || envelope.status !== 'signed') return
  if (!envelope.stripe_customer_id || !scheduleMatchesEnvelope(schedule, envelope.stripe_customer_id, envelope.id)) throw new Error('The monthly invoice schedule does not match the signed agreement.')
  if (envelope.stripe_subscription_id && envelope.stripe_subscription_id !== subscriptionId) throw new Error('An unexpected subscription is linked to this agreement.')
  if (!Number.isFinite(Number(envelope.first_payment_amount_total)) || Number(envelope.first_payment_amount_total) < 150_000) throw new Error('The first installment has not been recorded.')
  const later = await paidLaterInvoices(subscriptionId)
  if (later.count > INSTALLMENT_COUNT - 1) throw new Error('The monthly plan has more than two later paid invoices.')
  const fullyPaid = later.count === INSTALLMENT_COUNT - 1
  const { error } = await supabase.from('signing_envelopes').update({
    payment_status: fullyPaid ? 'paid' : 'processing',
    installments_paid: 1 + later.count,
    stripe_subscription_id: subscriptionId,
    payment_amount_total: Number(envelope.first_payment_amount_total) + later.amountPaid,
    payment_currency: 'USD',
    paid_at: fullyPaid && later.lastPaidAt ? new Date(later.lastPaidAt * 1000).toISOString() : null,
    stripe_last_event_id: event.id ?? null,
    stripe_last_event_created: Number(event.created) || 0,
  }).eq('id', envelope.id).eq('status', 'signed')
  assertDb(error, 'Unable to record the installment invoice')
}

export default {
  async fetch(request: Request) {
    if (request.method !== 'POST') return Response.json({ error: 'Method not allowed.' }, { status: 405, headers: { Allow: 'POST' } })
    const secret = process.env.STRIPE_WEBHOOK_SECRET
    if (!secret) return Response.json({ error: 'Payment notifications are not configured.' }, { status: 503 })
    const body = Buffer.from(await request.arrayBuffer())
    if (!validSignature(body, request.headers.get('stripe-signature') ?? '', secret)) {
      return Response.json({ error: 'Invalid Stripe signature.' }, { status: 400 })
    }
    try {
      const event = JSON.parse(body.toString('utf8')) as StripeEvent
      await recordCheckout(event)
      await recordInstallmentInvoice(event)
      return Response.json({ received: true })
    } catch (error) {
      console.error('Unable to process Stripe payment notification.', error)
      return Response.json({ error: 'Unable to process payment notification.' }, { status: 500 })
    }
  },
}
