import { businessDate, reservationSummary, RESERVATION_BALANCE, RESERVATION_DEPOSIT, RESERVATION_TEMPLATE_ID, RESERVED_PROGRAM_TEMPLATE_ID, FULL_PROGRAM_TEMPLATE_ID, validStartDate } from '../../shared/reservation.js'
import { assertDb, db } from './db.js'
import { matchesPaymentReference, paymentReferenceForEnvelope, paymentOffers, type PaymentOffer, type ReservationPaymentStage } from './payment-links.js'

export const reservationPaymentOffers: Record<ReservationPaymentStage, PaymentOffer> = {
  deposit: { url: 'https://buy.stripe.com/dRmbJ0bh21Hb7ff1Dk0ZW0a', linkId: 'plink_1ULCauAUfC4vfcETDoWq3RPd',
    productId: 'prod_VLuKcKNeSX1IwP', priceId: 'price_1ULCW3AUfC4vfcETbMXaDWaS', subtotal: RESERVATION_DEPOSIT, cadence: 'one_time' },
  balance: { url: 'https://buy.stripe.com/28E5kCcl62LfgPPdm20ZW0b', linkId: 'plink_1ULCgyAUfC4vfcETxxkdMiTz',
    productId: 'prod_VLuRhHqzsFzPsV', priceId: 'price_1ULCcmAUfC4vfcETjFgsd50q', subtotal: RESERVATION_BALANCE, cadence: 'one_time' },
}

export async function eligibleDeposit(envelope: Record<string, unknown>) {
  if (typeof envelope.reservation_deposit_envelope_id !== 'string') return null
  const { data: deposit, error } = await db().from('signing_envelopes').select('*').eq('id', envelope.reservation_deposit_envelope_id).maybeSingle()
  assertDb(error, 'Unable to verify the reservation deposit')
  const matches = deposit?.template_id === RESERVATION_TEMPLATE_ID && deposit.status === 'signed' && deposit.payment_status === 'paid'
    && deposit.recipient_email === envelope.recipient_email && deposit.business_name === envelope.business_name
    && deposit.reservation_start_date === envelope.reservation_start_date
  if (!matches || !deposit.stripe_payment_intent_id) return null
  const { data: refund, error: refundError } = await db().from('signing_reservation_refunds').select('payment_intent_id').eq('payment_intent_id', deposit.stripe_payment_intent_id).maybeSingle()
  assertDb(refundError, 'Unable to verify that the deposit credit remains valid')
  return refund ? null : deposit
}

export async function reservationPaymentUrl(envelope: Record<string, unknown>, now = new Date()) {
  const reservation = reservationSummary(envelope, now)
  if (envelope.status !== 'signed' || !reservation || ['paid', 'reserved', 'review_required', 'balance_processing', 'deposit_processing'].includes(reservation.state)) return null
  const deposit = envelope.template_id === RESERVATION_TEMPLATE_ID
  if (!deposit && businessDate(now) < reservation.startDate) return null
  if (envelope.template_id === RESERVED_PROGRAM_TEMPLATE_ID && !await eligibleDeposit(envelope)) return null
  const stage = deposit ? 'deposit' : envelope.template_id === RESERVED_PROGRAM_TEMPLATE_ID ? 'balance' : undefined
  const offer = stage ? reservationPaymentOffers[stage] : paymentOffers[FULL_PROGRAM_TEMPLATE_ID]
  const reference = paymentReferenceForEnvelope(envelope.id, envelope.token_hash, stage)
  if (!reference) return null
  const url = new URL(offer.url)
  url.searchParams.set('client_reference_id', reference)
  return url.toString()
}

type StripeId = string | { id?: string } | null
type ReservationEvent = { id?: string; type?: string; created?: number; livemode?: boolean; data?: { object?: {
  object?: string; id?: string; client_reference_id?: string | null; payment_link?: StripeId; mode?: string; payment_status?: string;
  currency?: string | null; subscription?: StripeId; amount_subtotal?: number | null; amount_total?: number | null; amount_refunded?: number;
  customer?: StripeId; payment_intent?: StripeId;
} } }
function stripeId(value: StripeId | undefined) { return typeof value === 'string' ? value : value?.id ?? null }

async function revokeRefundedReservation(intent: string) {
  const supabase = db()
  const { data: affected, error } = await supabase.from('signing_envelopes').update({ payment_status: 'refunded' })
    .in('template_id', [RESERVATION_TEMPLATE_ID, RESERVED_PROGRAM_TEMPLATE_ID, FULL_PROGRAM_TEMPLATE_ID]).eq('stripe_payment_intent_id', intent).eq('status', 'signed').select('id, template_id')
  assertDb(error, 'Unable to record the reservation payment refund')
  for (const row of affected ?? []) {
    if (row.template_id !== RESERVATION_TEMPLATE_ID) continue
    const { error: creditError } = await supabase.from('signing_envelopes').update({ reservation_deposit_status: 'refunded' }).eq('reservation_deposit_envelope_id', row.id)
    assertDb(creditError, 'Unable to revoke the refunded deposit credit')
  }
}

export async function recordReservationPayment(event: ReservationEvent) {
  if (event.livemode !== true || !event.id || !Number.isFinite(event.created) || !event.created) return
  const object = event.data?.object, supabase = db()
  if (event.type === 'charge.refunded') {
    const intent = stripeId(object?.payment_intent)
    if (object?.object !== 'charge' || !intent || !object.amount_refunded || object.currency?.toLowerCase() !== 'usd') return
    const { error } = await supabase.from('signing_reservation_refunds').upsert({ payment_intent_id: intent, event_id: event.id }, { onConflict: 'payment_intent_id', ignoreDuplicates: true })
    assertDb(error, 'Unable to retain the payment refund')
    await revokeRefundedReservation(intent)
    return
  }
  if (!['checkout.session.completed', 'checkout.session.async_payment_succeeded', 'checkout.session.async_payment_failed'].includes(event.type ?? '')) return
  const reference = object?.client_reference_id, envelopeId = reference?.split('_')[0]
  if (object?.object !== 'checkout.session' || !object.id || !envelopeId || !/^[0-9a-f-]{36}$/i.test(envelopeId)) return
  const { data: envelope, error: readError } = await supabase.from('signing_envelopes').select('*').eq('id', envelopeId).maybeSingle()
  assertDb(readError, 'Unable to match the reservation payment')
  if (!envelope || ![RESERVATION_TEMPLATE_ID, RESERVED_PROGRAM_TEMPLATE_ID, FULL_PROGRAM_TEMPLATE_ID].includes(envelope.template_id) || envelope.status !== 'signed' || !validStartDate(envelope.reservation_start_date)) return
  const isDeposit = envelope.template_id === RESERVATION_TEMPLATE_ID
  const stage = isDeposit ? 'deposit' : envelope.template_id === RESERVED_PROGRAM_TEMPLATE_ID ? 'balance' : undefined
  const offer = stage ? reservationPaymentOffers[stage] : paymentOffers[FULL_PROGRAM_TEMPLATE_ID]
  if (stripeId(object.payment_link) !== offer.linkId || !matchesPaymentReference(reference, envelope.id, envelope.token_hash, stage)) return
  if (object.mode !== 'payment' || stripeId(object.subscription) || object.currency?.toLowerCase() !== 'usd' || object.amount_subtotal !== offer.subtotal) return
  const paid = object.payment_status === 'paid' && ['checkout.session.completed', 'checkout.session.async_payment_succeeded'].includes(event.type ?? '')
  const failed = event.type === 'checkout.session.async_payment_failed'
  if (paid && (object.amount_total == null || object.amount_total < offer.subtotal || !stripeId(object.payment_intent))) return
  const eventDate = new Date(event.created * 1000)
  if (!Number.isFinite(eventDate.getTime()) || ['paid', 'refunded'].includes(envelope.payment_status)) return
  if (failed && envelope.stripe_checkout_session_id !== object.id) return
  if (!paid && Number(envelope.stripe_last_event_created) > event.created) return
  if (!isDeposit && businessDate(eventDate) < envelope.reservation_start_date) return
  if (envelope.template_id === RESERVED_PROGRAM_TEMPLATE_ID) {
    const deposit = await eligibleDeposit(envelope)
    if (!deposit || !deposit.paid_at || new Date(deposit.paid_at).getTime() > eventDate.getTime()) return
  }
  const update = {
    payment_status: paid ? 'paid' : failed ? 'failed' : 'processing', stripe_checkout_session_id: object.id, stripe_payment_link_id: offer.linkId,
    stripe_payment_intent_id: stripeId(object.payment_intent), stripe_customer_id: stripeId(object.customer), stripe_subscription_id: null, payment_amount_total: object.amount_total ?? null,
    payment_currency: 'USD', paid_at: paid ? eventDate.toISOString() : null, stripe_last_event_id: event.id, stripe_last_event_created: event.created,
  }
  let query = supabase.from('signing_envelopes').update(update).eq('id', envelopeId).eq('status', 'signed').neq('payment_status', 'paid').neq('payment_status', 'refunded')
  if (!paid) query = query.lte('stripe_last_event_created', event.created)
  if (envelope.template_id === RESERVED_PROGRAM_TEMPLATE_ID) query = query.eq('reservation_deposit_status', 'paid')
  const { error } = await query
  assertDb(error, 'Unable to record the reservation payment')
  const intent = stripeId(object.payment_intent)
  if (intent) {
    const { data: refund, error: refundError } = await supabase.from('signing_reservation_refunds').select('payment_intent_id').eq('payment_intent_id', intent).maybeSingle()
    assertDb(refundError, 'Unable to check for a refunded reservation payment')
    if (refund) await revokeRefundedReservation(intent)
  }
}
