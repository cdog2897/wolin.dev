import { businessDate, reservationSummary, RESERVATION_BALANCE, RESERVATION_DEPOSIT, RESERVATION_TEMPLATE_ID, validStartDate } from '../../shared/reservation.js'
import { assertDb, db } from './db.js'
import { matchesPaymentReference, paymentReferenceForEnvelope, type PaymentOffer, type ReservationPaymentStage } from './payment-links.js'

export const reservationPaymentOffers: Record<ReservationPaymentStage, PaymentOffer> = {
  deposit: {
    url: 'https://buy.stripe.com/dRmbJ0bh21Hb7ff1Dk0ZW0a',
    linkId: 'plink_1ULCauAUfC4vfcETDoWq3RPd',
    productId: 'prod_VLuKcKNeSX1IwP', priceId: 'price_1ULCW3AUfC4vfcETbMXaDWaS',
    subtotal: RESERVATION_DEPOSIT, cadence: 'one_time',
  },
  balance: {
    url: 'https://buy.stripe.com/28E5kCcl62LfgPPdm20ZW0b', linkId: 'plink_1ULCgyAUfC4vfcETxxkdMiTz',
    productId: 'prod_VLuRhHqzsFzPsV', priceId: 'price_1ULCcmAUfC4vfcETjFgsd50q',
    subtotal: RESERVATION_BALANCE, cadence: 'one_time',
  },
}

export function reservationPaymentUrl(envelope: Record<string, unknown>, now = new Date()) {
  const reservation = reservationSummary(envelope, now)
  if (envelope.status !== 'signed' || !reservation) return null
  const stage = ['deposit_due', 'deposit_failed'].includes(reservation.state) ? 'deposit'
    : ['balance_due', 'balance_failed'].includes(reservation.state) ? 'balance' : null
  if (!stage) return null
  const reference = paymentReferenceForEnvelope(envelope.id, envelope.token_hash, stage)
  const offer = reservationPaymentOffers[stage]
  if (!reference || !offer.url) return null
  const url = new URL(offer.url)
  url.searchParams.set('client_reference_id', reference)
  return url.toString()
}

type StripeId = string | { id?: string } | null
type ReservationEvent = {
  id?: string; type?: string; created?: number; livemode?: boolean
  data?: { object?: {
    object?: string; id?: string; client_reference_id?: string | null; payment_link?: StripeId
    mode?: string; payment_status?: string; currency?: string | null; subscription?: StripeId
    amount_subtotal?: number | null; amount_total?: number | null; amount_refunded?: number
    customer?: StripeId; payment_intent?: StripeId
  } }
}

function stripeId(value: StripeId | undefined) { return typeof value === 'string' ? value : value?.id ?? null }

async function revokeRefundedReservation(intent: string) {
  const supabase = db()
  const { error: depositError } = await supabase.from('signing_envelopes').update({ reservation_deposit_status: 'refunded' })
    .eq('template_id', RESERVATION_TEMPLATE_ID).eq('reservation_deposit_intent_id', intent).eq('status', 'signed')
  assertDb(depositError, 'Unable to record the reservation deposit refund')
  const { error: balanceError } = await supabase.from('signing_envelopes').update({ payment_status: 'refunded' })
    .eq('template_id', RESERVATION_TEMPLATE_ID).eq('stripe_payment_intent_id', intent).eq('status', 'signed')
  assertDb(balanceError, 'Unable to record the reservation balance refund')
}

export async function recordReservationPayment(event: ReservationEvent) {
  if (event.livemode !== true || !event.id || !Number.isFinite(event.created) || !event.created) return
  const object = event.data?.object
  const supabase = db()
  if (event.type === 'charge.refunded') {
    const intent = stripeId(object?.payment_intent)
    if (object?.object !== 'charge' || !intent || !object.amount_refunded || object.currency?.toLowerCase() !== 'usd') return
    const { error } = await supabase.from('signing_reservation_refunds').upsert({ payment_intent_id: intent, event_id: event.id }, { onConflict: 'payment_intent_id', ignoreDuplicates: true })
    assertDb(error, 'Unable to retain the payment refund')
    await revokeRefundedReservation(intent)
    return
  }
  if (!['checkout.session.completed', 'checkout.session.async_payment_succeeded', 'checkout.session.async_payment_failed'].includes(event.type ?? '')) return
  const reference = object?.client_reference_id
  const envelopeId = reference?.split('_')[0]
  if (object?.object !== 'checkout.session' || !object.id || !envelopeId || !/^[0-9a-f-]{36}$/i.test(envelopeId)) return
  const { data: envelope, error: readError } = await supabase.from('signing_envelopes').select('*').eq('id', envelopeId).maybeSingle()
  assertDb(readError, 'Unable to match the reservation payment')
  if (!envelope || envelope.template_id !== RESERVATION_TEMPLATE_ID || envelope.status !== 'signed' || !validStartDate(envelope.reservation_start_date)) return
  const stage = (['deposit', 'balance'] as const).find(value => stripeId(object.payment_link) === reservationPaymentOffers[value].linkId)
  if (!stage || !matchesPaymentReference(reference, envelope.id, envelope.token_hash, stage)) return
  const offer = reservationPaymentOffers[stage]
  if (object.mode !== 'payment' || stripeId(object.subscription) || object.currency?.toLowerCase() !== 'usd' || object.amount_subtotal !== offer.subtotal) return
  const paid = object.payment_status === 'paid' && ['checkout.session.completed', 'checkout.session.async_payment_succeeded'].includes(event.type ?? '')
  const failed = event.type === 'checkout.session.async_payment_failed'
  if (paid && (object.amount_total == null || object.amount_total < offer.subtotal || !stripeId(object.payment_intent))) return
  const eventDate = new Date(event.created * 1000)
  if (!Number.isFinite(eventDate.getTime())) return
  const deposit = stage === 'deposit'
  const statusField = deposit ? 'reservation_deposit_status' : 'payment_status'
  const sessionField = deposit ? 'reservation_deposit_session_id' : 'stripe_checkout_session_id'
  const eventField = deposit ? 'reservation_deposit_event_created' : 'stripe_last_event_created'
  if (['paid', 'refunded'].includes(envelope[statusField])) return
  if (failed && envelope[sessionField] !== object.id) return
  if (!paid && Number(envelope[eventField]) > event.created) return
  if (!deposit && (envelope.reservation_deposit_status !== 'paid' || !envelope.reservation_deposit_paid_at
    || new Date(envelope.reservation_deposit_paid_at).getTime() > eventDate.getTime()
    || businessDate(eventDate) < envelope.reservation_start_date)) return
  const update = deposit ? {
    reservation_deposit_status: paid ? 'paid' : failed ? 'failed' : 'processing',
    reservation_deposit_session_id: object.id, reservation_deposit_intent_id: stripeId(object.payment_intent),
    reservation_deposit_amount_total: object.amount_total ?? null,
    reservation_deposit_paid_at: paid ? eventDate.toISOString() : null, reservation_deposit_event_created: event.created,
  } : {
    payment_status: paid ? 'paid' : failed ? 'failed' : 'processing',
    stripe_checkout_session_id: object.id, stripe_payment_link_id: offer.linkId,
    stripe_payment_intent_id: stripeId(object.payment_intent), stripe_customer_id: stripeId(object.customer),
    payment_amount_total: object.amount_total ?? null, payment_currency: 'USD', paid_at: paid ? eventDate.toISOString() : null,
    stripe_last_event_id: event.id, stripe_last_event_created: event.created,
  }
  let query = supabase.from('signing_envelopes').update(update).eq('id', envelopeId).eq('status', 'signed')
    .neq(statusField, 'paid').neq(statusField, 'refunded')
  if (!paid) query = query.lte(eventField, event.created)
  if (!deposit) query = query.eq('reservation_deposit_status', 'paid')
  const { error } = await query
  assertDb(error, 'Unable to record the reservation payment')
  // Checking after the intent is saved covers refunds delivered before or during recording.
  const intent = stripeId(object.payment_intent)
  if (intent) {
    const { data: refund, error: refundError } = await supabase.from('signing_reservation_refunds').select('payment_intent_id').eq('payment_intent_id', intent).maybeSingle()
    assertDb(refundError, 'Unable to check for a refunded reservation payment')
    if (refund) await revokeRefundedReservation(intent)
  }
}
