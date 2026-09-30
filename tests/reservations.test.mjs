import { after, before, beforeEach, test } from 'node:test'
import assert from 'node:assert/strict'
import { createHmac, createHash } from 'node:crypto'
import webhook from '../node_modules/.tmp/api-tests/api/stripe-webhook.js'
import signHandler from '../node_modules/.tmp/api-tests/api/sign.js'
import adminHandler from '../node_modules/.tmp/api-tests/api/admin.js'
import { createSignedToken } from '../node_modules/.tmp/api-tests/api/_lib/auth.js'
import { paymentReferenceForEnvelope, paymentOffers } from '../node_modules/.tmp/api-tests/api/_lib/payment-links.js'
import { reservationPaymentOffers, reservationPaymentUrl } from '../node_modules/.tmp/api-tests/api/_lib/reservations.js'
import { reservationTemplate, reservedProgramTemplate } from '../node_modules/.tmp/api-tests/api/_lib/reservation-template.js'
import { businessDate, reservationSummary, RESERVATION_TEMPLATE_ID, RESERVED_PROGRAM_TEMPLATE_ID, FULL_PROGRAM_TEMPLATE_ID, validStartDate } from '../node_modules/.tmp/api-tests/shared/reservation.js'

import { defaultTemplates } from '../node_modules/.tmp/api-tests/api/_lib/default-templates.js'

const programId = '22222222-2222-4222-8222-222222222222'
const programToken = 'program-test-token'
const programHash = createHash('sha256').update(programToken).digest('hex')
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
    if (op === 'in' && !value.slice(1,-1).split(',').includes(String(row[key]))) return false
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
      return Response.json(method === 'GET' ? defaultTemplates.map(item => ({ ...item, active: true, package_name: item.packageName })).filter(row => matches(row, url)) : [])
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
    if (method === 'POST') { rows.push({ payment_status: 'unpaid', stripe_last_event_created: 0, reservation_deposit_status: 'unpaid', ...JSON.parse(init.body) }); return Response.json([]) }
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
  const offer = stage === 'full' ? paymentOffers[FULL_PROGRAM_TEMPLATE_ID] : reservationPaymentOffers[stage]
  const targetId = stage === 'balance' ? programId : id, hash = stage === 'balance' ? programHash : tokenHash
  return { object: 'checkout.session', id: 'cs_' + stage, client_reference_id: paymentReferenceForEnvelope(targetId, hash, stage === 'full' ? undefined : stage),
    payment_link: offer.linkId, mode: 'payment', currency: 'usd', amount_subtotal: offer.subtotal, amount_total: offer.subtotal,
    payment_status: 'paid', payment_intent: 'pi_' + stage, customer: 'cus_test', ...extra }
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

function program(extra = {}) {
  return envelope({ id: programId, token_hash: programHash, template_id: RESERVED_PROGRAM_TEMPLATE_ID,
    reservation_deposit_envelope_id: id, reservation_deposit_status: 'paid', ...extra })
}
function paidDeposit(extra = {}) {
  return envelope({ payment_status: 'paid', paid_at: new Date(now * 1000).toISOString(), stripe_payment_intent_id: 'pi_deposit', ...extra })
}
const sendBody = { recipientName: 'Test Client', recipientEmail: 'client@example.invalid', businessName: 'Test Business' }

test('two program agreements share every term except title and price; deposit has its own scope', () => {
  const full = defaultTemplates.find(item => item.id === FULL_PROGRAM_TEMPLATE_ID)
  assert.equal(full.body.split('\n').slice(1).join('\n'), reservedProgramTemplate.body.split('\n').slice(1).join('\n'))
  assert.notEqual(full.price, reservedProgramTemplate.price)
  for (const body of [full.body, reservedProgramTemplate.body]) {
    for (const text of ['{{start_date}}', '180 platform publications', '10,000 combined views', 'Branded Template Pack']) assert.ok(body.includes(text))
  }
  assert.match(reservationTemplate.body, /separate \$3,199 reserved-program agreement/)
  assert.doesNotMatch(reservationTemplate.body, /180 platform publications/)
  assert.equal(reservationPaymentOffers.deposit.subtotal + reservationPaymentOffers.balance.subtotal, 349900)
  assert.notEqual(reservationPaymentOffers.deposit.linkId, reservationPaymentOffers.balance.linkId)
})

test('real dates and Denver midnight gate each program checkout, including daylight saving', async () => {
  assert.equal(validStartDate('2028-02-29'), true)
  for (const value of ['2026-02-29', '2026-02-30', '2026-13-01', '2026-2-01', null]) assert.equal(validStartDate(value), false)
  assert.equal(businessDate(new Date('2026-10-01T05:59:59Z')), '2026-09-30')
  assert.equal(businessDate(new Date('2026-12-01T06:59:59Z')), '2026-11-30')
  rows = [paidDeposit({ reservation_start_date: '2026-10-01' }), program({ reservation_start_date: '2026-10-01' })]
  assert.equal(await reservationPaymentUrl(rows[1], new Date('2026-10-01T05:59:59Z')), null)
  assert.match(await reservationPaymentUrl(rows[1], new Date('2026-10-01T06:00:00Z')), /client_reference_id=/)
})

test('deposit payment completes only its own document and never opens program checkout on the deposit link', async () => {
  await deliver('checkout.session.completed', checkout('deposit'))
  assert.equal(rows[0].payment_status, 'paid'); assert.equal(rows[0].payment_amount_total, 30000)
  const result = await call(signHandler, { method: 'GET', query: { token }, headers: {} })
  assert.equal(result.status, 200); assert.equal(result.body.document.reservation.state, 'reserved')
  assert.equal(result.body.document.paymentUrl, null); assert.equal(rows[0].status, 'signed')
  await deliver('checkout.session.completed', checkout('balance', { client_reference_id: paymentReferenceForEnvelope(id, tokenHash, 'balance') }))
  assert.equal(rows[0].payment_amount_total, 30000)
})

test('signing the deposit document opens only its own $300 checkout', async () => {
  const completion = new Promise(resolve => { completionResolve = resolve })
  rows = [envelope({ status: 'sent', expires_at: new Date(Date.now() + 86400000).toISOString() })]
  const result = await call(signHandler, { method: 'POST', query: { token }, body: { signerName: 'Test Client', signatureType: 'typed', agreed: true }, headers: { origin: 'https://wolin.dev', host: 'wolin.dev' } })
  await completion
  assert.equal(result.status, 200); assert.equal(rows[0].status, 'signed')
  assert.equal(new URL(result.body.paymentUrl).pathname, new URL(reservationPaymentOffers.deposit.url).pathname)
  assert.equal(new URL(result.body.paymentUrl).searchParams.get('client_reference_id'), paymentReferenceForEnvelope(id, tokenHash, 'deposit'))
})

test('separate signed program gets its own checkout and payment record on the planned date', async () => {
  const today = businessDate()
  rows = [paidDeposit({ reservation_start_date: today }), program({ reservation_start_date: today })]
  const depositSnapshot = { ...rows[0] }
  const result = await call(signHandler, { method: 'GET', query: { token: programToken }, headers: {} })
  assert.equal(result.body.document.reservation.state, 'balance_due')
  assert.equal(new URL(result.body.document.paymentUrl).searchParams.get('client_reference_id'), paymentReferenceForEnvelope(programId, programHash, 'balance'))
  await deliver('checkout.session.completed', checkout('balance'))
  assert.equal(rows[1].payment_status, 'paid'); assert.equal(rows[1].payment_amount_total, 319900)
  assert.deepEqual(rows[0], depositSnapshot)
  await deliver('checkout.session.completed', checkout('balance', { id: 'cs_duplicate' }), { created: now + 60 })
  assert.equal(rows[1].stripe_checkout_session_id, 'cs_balance')
  assert.equal(await reservationPaymentUrl(rows[1]), null)
})

test('missing or refunded deposits, mismatched client/date, unsigned program, and forged checkout never grant credit', async () => {
  for (const change of [{ payment_status: 'unpaid' }, { payment_status: 'refunded' }, { status: 'sent' }, { recipient_email: 'other@example.invalid' }, { reservation_start_date: futureDate }]) {
    rows = [paidDeposit({ reservation_start_date: businessDate(), ...change }), program({ reservation_start_date: businessDate() })]
    assert.equal(await reservationPaymentUrl(rows[1]), null)
    await deliver('checkout.session.completed', checkout('balance')); assert.equal(rows[1].payment_status, 'unpaid')
  }
  rows = [paidDeposit({ reservation_start_date: businessDate() }), program({ reservation_start_date: businessDate(), status: 'sent' })]
  await deliver('checkout.session.completed', checkout('balance')); assert.equal(rows[1].payment_status, 'unpaid')
  for (const change of [{ payment_link: 'wrong' }, { amount_subtotal: 1 }, { amount_total: 1 }, { currency: 'eur' }, { mode: 'subscription' },
    { client_reference_id: paymentReferenceForEnvelope(id, tokenHash) }, { client_reference_id: paymentReferenceForEnvelope(id, tokenHash, 'balance') }, { client_reference_id: id + '_forged' }, { payment_intent: null }]) {
    rows = [envelope()]; await deliver('checkout.session.completed', checkout('deposit', change)); assert.equal(rows[0].payment_status, 'unpaid')
  }
})

test('delayed deposit retries work and duplicate or stale events cannot erase paid status', async () => {
  await deliver('checkout.session.completed', checkout('deposit', { payment_status: 'unpaid' }))
  assert.equal(rows[0].payment_status, 'processing'); assert.equal(await reservationPaymentUrl(rows[0]), null)
  await deliver('checkout.session.async_payment_failed', checkout('deposit', { payment_status: 'unpaid' }), { created: now + 1 })
  assert.equal(rows[0].payment_status, 'failed'); assert.ok(await reservationPaymentUrl(rows[0]))
  await deliver('checkout.session.async_payment_succeeded', checkout('deposit'), { created: now + 2 })
  await deliver('checkout.session.async_payment_failed', checkout('deposit', { payment_status: 'unpaid' }), { created: now + 3 })
  assert.equal(rows[0].payment_status, 'paid')
})

test('refunds delivered before checkout or after program creation revoke deposit credit', async () => {
  const charge = { object: 'charge', id: 'ch_test', payment_intent: 'pi_deposit', amount_refunded: 30000, currency: 'usd' }
  await deliver('charge.refunded', charge); await deliver('checkout.session.completed', checkout('deposit'))
  assert.equal(rows[0].payment_status, 'refunded')
  await deliver('checkout.session.completed', checkout('deposit'), { created: now + 60 })
  assert.equal(rows[0].payment_status, 'refunded'); assert.equal(await reservationPaymentUrl(rows[0]), null)
  rows = [paidDeposit({ reservation_start_date: businessDate() }), program({ reservation_start_date: businessDate() })]
  await deliver('charge.refunded', charge)
  assert.equal(rows[1].reservation_deposit_status, 'refunded')
  assert.equal(reservationSummary(rows[1]).state, 'review_required'); assert.equal(await reservationPaymentUrl(rows[1]), null)
})

test('admin creation requires dates for deposit and both program agreements; only deposits require future dates', async () => {
  assert.equal((await call(adminHandler, adminRequest('send', { ...sendBody, templateId: RESERVATION_TEMPLATE_ID, startDate: futureDate }, false))).status, 401)
  for (const templateId of [RESERVATION_TEMPLATE_ID, RESERVED_PROGRAM_TEMPLATE_ID, FULL_PROGRAM_TEMPLATE_ID]) {
    for (const startDate of ['', '2026-02-30']) assert.equal((await call(adminHandler, adminRequest('send', { ...sendBody, templateId, startDate }))).status, 400)
  }
  assert.equal((await call(adminHandler, adminRequest('send', { ...sendBody, templateId: RESERVATION_TEMPLATE_ID, startDate: businessDate() }))).status, 400)
  const deposit = await call(adminHandler, adminRequest('send', { ...sendBody, templateId: RESERVATION_TEMPLATE_ID, startDate: futureDate }))
  assert.equal(deposit.status, 201); assert.match(rows[1].document_body, /February 15, 2099 \(America\/Denver\)/)
  assert.doesNotMatch(rows[1].document_body, /{{[a-z_]+}}/); assert.match(emails[0].text, /separate \$3,199 program agreement/)
  const full = await call(adminHandler, adminRequest('send', { ...sendBody, templateId: FULL_PROGRAM_TEMPLATE_ID, startDate: businessDate() }))
  assert.equal(full.status, 201); assert.match(rows[2].document_body, /\$3,499 one time/)
})

test('a paid deposit creates one separate program document; cross-client and reused credits are refused', async () => {
  rows = [paidDeposit()]
  const body = { ...sendBody, templateId: RESERVED_PROGRAM_TEMPLATE_ID, startDate: futureDate, depositEnvelopeId: id }
  assert.equal((await call(adminHandler, adminRequest('send', { ...body, recipientEmail: 'other@example.invalid' }))).status, 400)
  const result = await call(adminHandler, adminRequest('send', body))
  assert.equal(result.status, 201); assert.equal(rows[1].reservation_deposit_envelope_id, id)
  assert.notEqual(rows[1].id, id); assert.notEqual(rows[1].token_hash, tokenHash)
  assert.match(rows[1].document_body, /\$3,199 one time/); assert.doesNotMatch(rows[1].document_body, /{{[a-z_]+}}/)
  assert.equal((await call(adminHandler, adminRequest('send', body))).status, 409)
  rows[1].status = 'voided'
  assert.equal((await call(adminHandler, adminRequest('send', body))).status, 201)
})

test('each program signs separately and the full-price checkout follows its start date and amount', async () => {
  const completion = new Promise(resolve => { completionResolve = resolve })
  rows = [envelope({ template_id: FULL_PROGRAM_TEMPLATE_ID, status: 'sent', reservation_start_date: businessDate(), expires_at: new Date(Date.now() + 86400000).toISOString() })]
  const result = await call(signHandler, { method: 'POST', query: { token }, body: { signerName: 'Test Client', signatureType: 'typed', agreed: true }, headers: { origin: 'https://wolin.dev', host: 'wolin.dev' } })
  await completion
  assert.equal(result.status, 200); assert.equal(rows[0].status, 'signed')
  assert.equal(new URL(result.body.paymentUrl).searchParams.get('client_reference_id'), paymentReferenceForEnvelope(id, tokenHash))
  await deliver('checkout.session.completed', checkout('full'))
  assert.equal(rows[0].payment_status, 'paid'); assert.equal(rows[0].payment_amount_total, 349900)
  assert.equal(await reservationPaymentUrl(rows[0]), null)
})
