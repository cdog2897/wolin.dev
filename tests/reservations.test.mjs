import { after, before, beforeEach, test } from 'node:test'
import assert from 'node:assert/strict'
import { createHmac, createHash } from 'node:crypto'
import webhook from '../node_modules/.tmp/api-tests/api/stripe-webhook.js'
import signHandler from '../node_modules/.tmp/api-tests/api/sign.js'
import adminHandler from '../node_modules/.tmp/api-tests/api/admin.js'
import { createSignedToken } from '../node_modules/.tmp/api-tests/api/_lib/auth.js'
import { paymentReferenceForEnvelope } from '../node_modules/.tmp/api-tests/api/_lib/payment-links.js'
import { reservationPaymentOffers, reservationPaymentUrl } from '../node_modules/.tmp/api-tests/api/_lib/reservations.js'
import { reservationTemplate } from '../node_modules/.tmp/api-tests/api/_lib/reservation-template.js'
import { businessDate, reservationSummary, RESERVATION_TEMPLATE_ID, validStartDate } from '../node_modules/.tmp/api-tests/shared/reservation.js'

const id = '11111111-1111-4111-8111-111111111111'
const token = 'reservation-test-token'
const tokenHash = createHash('sha256').update(token).digest('hex')
const secret = 'test-reservation-webhook-secret'
const now = Math.floor(Date.now() / 1000)
const oldFetch = globalThis.fetch
const env = { ...process.env }
let rows = [], refunds = [], emails = [], audit = [], patches = []
let completionResolve
const futureDate = '2099-02-15'
function envelope(extra = {}) {
  return { id, template_id: RESERVATION_TEMPLATE_ID, token_hash: tokenHash, status: 'signed',
    reservation_start_date: futureDate, reservation_deposit_status: 'unpaid', reservation_deposit_event_created: 0,
    payment_status: 'unpaid', stripe_last_event_created: 0, installments_paid: 0,
    document_body: 'Reservation', document_title: 'Reservation', document_hash: tokenHash,
    recipient_name: 'Test Client', recipient_email: 'client@example.invalid', business_name: 'Test Business',
    expires_at: new Date(Date.now() - 86400000).toISOString(), ...extra }
}
function matches(row, url) {
  for (const [key, filter] of url.searchParams) {
    const i = filter.indexOf('.'); const op = filter.slice(0, i), value = filter.slice(i + 1)
    if (op === 'eq' && String(row[key]) !== value) return false
    if (op === 'neq' && String(row[key]) === value) return false
    if (op === 'lte' && Number(row[key]) > Number(value)) return false
  }
  return true
}
before(() => {
  process.env.SUPABASE_URL = 'https://reservations-test.invalid'
  process.env.SUPABASE_SECRET_KEY = 'test-only'
  process.env.STRIPE_WEBHOOK_SECRET = secret
  process.env.SESSION_SECRET = 'test-session-secret-32-characters-long'
  process.env.RESEND_API_KEY = 'test-email-key'
  globalThis.fetch = async (input, init = {}) => {
    const url = new URL(String(input)), method = init.method ?? 'GET'
    if (url.hostname === 'api.resend.com') {
      assert.equal(init.headers.Authorization, 'Bearer test-email-key')
      emails.push(JSON.parse(init.body)); return Response.json({ id: 'mock-email' })
    }
    assert.equal(url.hostname, 'reservations-test.invalid', 'Never call a live service')
    if (url.pathname.endsWith('/signing_templates')) {
      if (method === 'POST') {
        const body = JSON.parse(init.body); const templates = Array.isArray(body) ? body : [body]
        for (const template of templates) assert.ok(template.price.length >= 1 && template.price.length <= 50, 'Template price must satisfy the deployed database constraint')
      }
      return Response.json(method === 'GET' ? [{ ...reservationTemplate, package_name: reservationTemplate.packageName }] : [])
    }
    if (url.pathname.endsWith('/signing_audit_events')) {
      if (method === 'POST') { const event = JSON.parse(init.body); audit.push(event); if (event.event_type === 'completion_emails_sent') completionResolve?.() }
      return Response.json([])
    }
    if (url.pathname.endsWith('/signing_reservation_refunds')) {
      if (method === 'POST') { const row = JSON.parse(init.body); if (!refunds.some(item => item.payment_intent_id === row.payment_intent_id)) refunds.push(row) }
      return Response.json(refunds.filter(row => matches(row, url)))
    }
    assert.ok(url.pathname.endsWith('/signing_envelopes'))
    if (method === 'POST') { rows.push({ reservation_deposit_status: 'unpaid', ...JSON.parse(init.body) }); return Response.json([]) }
    const matched = rows.filter(row => matches(row, url))
    if (method === 'PATCH') { const change = JSON.parse(init.body); for (const row of matched) Object.assign(row, change); patches.push({ change, count: matched.length }) }
    return Response.json(matched)
  }
})
after(() => {
  globalThis.fetch = oldFetch
  for (const key of ['SUPABASE_URL','SUPABASE_SECRET_KEY','STRIPE_WEBHOOK_SECRET','SESSION_SECRET','RESEND_API_KEY']) {
    if (env[key] === undefined) delete process.env[key]; else process.env[key] = env[key]
  }
})
beforeEach(() => { rows = [envelope()]; refunds = []; emails = []; audit = []; patches = [] })
function checkout(stage, extra = {}) {
  const offer = reservationPaymentOffers[stage]
  return { object: 'checkout.session', id: `cs_${stage}`, client_reference_id: paymentReferenceForEnvelope(id, tokenHash, stage),
    payment_link: offer.linkId, mode: 'payment', currency: 'usd', amount_subtotal: offer.subtotal, amount_total: offer.subtotal,
    payment_status: 'paid', payment_intent: `pi_${stage}`, customer: 'cus_test', ...extra }
}
async function deliver(type, object, extra = {}) {
  const body = JSON.stringify({ id: 'evt_test', type, created: now, livemode: true, data: { object }, ...extra })
  const signature = createHmac('sha256', secret).update(`${now}.${body}`).digest('hex')
  const result = await webhook.fetch(new Request('https://wolin.dev/api/stripe-webhook', { method: 'POST', body,
    headers: { 'stripe-signature': `t=${now},v1=${signature}` } }))
  assert.equal(result.status, 200); return result
}
async function call(handler, request) {
  let status, body
  const response = { setHeader() {}, status(code) { status = code; return this }, json(data) { body = data; return this } }
  await handler(request, response); return { status, body }
}
function adminRequest(action, body, authenticated = true) {
  return { method: 'POST', query: { action }, body,
    headers: { origin: 'https://admin.wolin.dev', host: 'admin.wolin.dev', cookie: authenticated ? `wolin_admin_session=${createSignedToken('caleb.wolin@gmail.com', 300)}` : '' } }
}

test('real dates and Denver midnight gate balance availability, including daylight saving boundaries', () => {
  assert.equal(validStartDate('2028-02-29'), true)
  for (const value of ['2026-02-29','2026-02-30','2026-13-01','2026-2-01',null]) assert.equal(validStartDate(value), false)
  assert.equal(businessDate(new Date('2026-10-01T05:59:59Z')), '2026-09-30')
  assert.equal(businessDate(new Date('2026-10-01T06:00:00Z')), '2026-10-01')
  assert.equal(businessDate(new Date('2026-12-01T06:59:59Z')), '2026-11-30')
  const row = envelope({ reservation_start_date: '2026-10-01', reservation_deposit_status: 'paid' })
  assert.equal(reservationPaymentUrl(row, new Date('2026-10-01T05:59:59Z')), null)
  assert.match(reservationPaymentUrl(row, new Date('2026-10-01T06:00:00Z')), /client_reference_id=/)
})

test('live configured reservation prices and agreement total match without adding a public offer', () => {
  assert.equal(reservationPaymentOffers.deposit.subtotal, 30000)
  assert.equal(reservationPaymentOffers.balance.subtotal, 319900)
  for (const offer of Object.values(reservationPaymentOffers)) {
    assert.match(offer.url, /^https:\/\/buy.stripe.com\//); assert.match(offer.priceId, /^price_/)
  }
  for (const text of ['$300 non-refundable', '$3,199 balance', '$3,499', '{{start_date}}', '180 platform publications', '10,000 combined views', 'Branded Template Pack']) assert.ok(reservationTemplate.body.includes(text))
})

test('deposit succeeds independently, signed links survive expiry, and no balance is offered early', async () => {
  await deliver('checkout.session.completed', checkout('deposit'))
  assert.equal(rows[0].reservation_deposit_status, 'paid'); assert.equal(rows[0].payment_status, 'unpaid')
  assert.equal(rows[0].reservation_deposit_amount_total, 30000)
  const result = await call(signHandler, { method: 'GET', query: { token }, headers: {} })
  assert.equal(result.status, 200); assert.equal(result.body.document.reservation.state, 'reserved')
  assert.equal(result.body.document.paymentUrl, null)
  assert.equal(rows[0].status, 'signed')
  await deliver('checkout.session.completed', checkout('balance'))
  assert.equal(rows[0].payment_status, 'unpaid')
})

test('on the agreed date the paid deposit grants one $300 credit and only the balance completes purchase', async () => {
  rows[0].reservation_start_date = businessDate(new Date())
  await deliver('checkout.session.completed', checkout('deposit'))
  const result = await call(signHandler, { method: 'GET', query: { token }, headers: {} })
  assert.equal(result.body.document.reservation.state, 'balance_due')
  const url = new URL(result.body.document.paymentUrl)
  assert.equal(url.searchParams.get('client_reference_id'), paymentReferenceForEnvelope(id, tokenHash, 'balance'))
  await deliver('checkout.session.completed', checkout('balance'))
  assert.equal(rows[0].payment_status, 'paid'); assert.equal(rows[0].payment_amount_total, 319900)
  assert.equal(rows[0].reservation_deposit_amount_total + rows[0].payment_amount_total, 349900)
  const paid = rows[0].paid_at
  await deliver('checkout.session.completed', checkout('balance', { id: 'cs_duplicate', payment_intent: 'pi_duplicate' }), { created: now + 60 })
  assert.equal(rows[0].stripe_checkout_session_id, 'cs_balance'); assert.equal(rows[0].paid_at, paid)
  assert.equal(reservationPaymentUrl(rows[0]), null)
})

test('missing deposits, unsigned agreements, wrong links, amounts, currencies, stages or forged references never grant credit', async () => {
  for (const extra of [{}, { status: 'sent', reservation_deposit_status: 'paid' }, { reservation_deposit_status: 'refunded' }]) {
    rows = [envelope({ reservation_start_date: businessDate(), ...extra })]
    await deliver('checkout.session.completed', checkout('balance')); assert.equal(rows[0].payment_status, 'unpaid')
  }
  for (const change of [{ payment_link: 'wrong' }, { amount_subtotal: 1 }, { amount_total: 1 }, { currency: 'eur' }, { mode: 'subscription' },
    { client_reference_id: paymentReferenceForEnvelope(id, tokenHash) }, { client_reference_id: paymentReferenceForEnvelope(id, tokenHash, 'balance') },
    { client_reference_id: `${id}_forged` }, { payment_intent: null }]) {
    rows = [envelope()]; await deliver('checkout.session.completed', checkout('deposit', change))
    assert.equal(rows[0].reservation_deposit_status, 'unpaid')
  }
  rows = [envelope()]; await deliver('checkout.session.completed', checkout('deposit'), { livemode: false })
  assert.equal(rows[0].reservation_deposit_status, 'unpaid')
})

test('delayed payments permit retries after failure and stale failures cannot erase a paid deposit', async () => {
  await deliver('checkout.session.completed', checkout('deposit', { payment_status: 'unpaid' }))
  assert.equal(rows[0].reservation_deposit_status, 'processing'); assert.equal(reservationPaymentUrl(rows[0]), null)
  await deliver('checkout.session.async_payment_failed', checkout('deposit', { payment_status: 'unpaid' }), { created: now + 1 })
  assert.equal(rows[0].reservation_deposit_status, 'failed'); assert.ok(reservationPaymentUrl(rows[0]))
  await deliver('checkout.session.async_payment_succeeded', checkout('deposit'), { created: now + 2 })
  await deliver('checkout.session.async_payment_failed', checkout('deposit', { payment_status: 'unpaid' }), { created: now + 3 })
  assert.equal(rows[0].reservation_deposit_status, 'paid')
})

test('refunds revoke credit even when delivered before checkout success or followed by duplicate success', async () => {
  const charge = { object: 'charge', id: 'ch_test', payment_intent: 'pi_deposit', amount_refunded: 30000, currency: 'usd' }
  await deliver('charge.refunded', charge)
  await deliver('checkout.session.completed', checkout('deposit'))
  assert.equal(rows[0].reservation_deposit_status, 'refunded')
  await deliver('checkout.session.completed', checkout('deposit'), { created: now + 60 })
  assert.equal(rows[0].reservation_deposit_status, 'refunded'); assert.equal(reservationPaymentUrl(rows[0]), null)
  assert.equal(reservationSummary(rows[0]).state, 'review_required')
})

test('reservation creation requires admin access and a real future date before saving or sending', async () => {
  const body = { templateId: RESERVATION_TEMPLATE_ID, recipientName: 'Test Client', recipientEmail: 'client@example.invalid', businessName: 'Test Business' }
  assert.equal((await call(adminHandler, adminRequest('send', { ...body, startDate: futureDate }, false))).status, 401)
  for (const startDate of ['', '2026-02-30', businessDate(), '2000-01-01']) {
    const result = await call(adminHandler, adminRequest('send', { ...body, startDate }))
    assert.equal(result.status, 400)
  }
  assert.equal(emails.length, 0); assert.equal(rows.length, 1)
  const result = await call(adminHandler, adminRequest('send', { ...body, startDate: futureDate }))
  assert.equal(result.status, 201); assert.equal(rows.length, 2)
  assert.equal(rows[1].reservation_start_date, futureDate)
  assert.match(rows[1].document_body, /February 15, 2099 \(America\/Denver\)/)
  assert.doesNotMatch(rows[1].document_body, /{{[a-z_]+}}/)
  assert.equal(emails.length, 1); assert.match(emails[0].text, /\$300 non-refundable/)
  assert.ok(audit.some(event => event.detail.startDate === futureDate))
})

test('signing a reservation returns its deposit checkout and retains the planned date', async () => {
  const completion = new Promise(resolve => { completionResolve = resolve })
  rows = [envelope({ status: 'sent', expires_at: new Date(Date.now() + 86400000).toISOString() })]
  const result = await call(signHandler, { method: 'POST', query: { token }, body: { signerName: 'Test Client', signatureType: 'typed', agreed: true }, headers: { origin: 'https://wolin.dev', host: 'wolin.dev' } })
  await completion
  assert.equal(result.status, 200)
  assert.equal(rows[0].status, 'signed')
  assert.equal(rows[0].reservation_start_date, futureDate)
  assert.equal(new URL(result.body.paymentUrl).searchParams.get('client_reference_id'), paymentReferenceForEnvelope(id, tokenHash, 'deposit'))
  assert.match(emails[0].text, /February 15, 2099/)
  assert.match(emails[0].text, /https:\/\/wolin.dev\/sign\/reservation-test-token/)
})
