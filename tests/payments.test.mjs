import { after, before, beforeEach, test } from 'node:test'
import assert from 'node:assert/strict'
import { createHmac, createHash } from 'node:crypto'
import webhook from '../node_modules/.tmp/api-tests/api/stripe-webhook.js'
import signHandler from '../node_modules/.tmp/api-tests/api/sign.js'
import { paymentOffers, paymentReferenceForEnvelope, matchesPaymentReference } from '../node_modules/.tmp/api-tests/api/_lib/payment-links.js'
import { socialTemplates } from '../node_modules/.tmp/api-tests/api/_lib/social-templates.js'
import { socialOffers } from '../node_modules/.tmp/api-tests/shared/social-offers.js'
import { businessDate } from '../node_modules/.tmp/api-tests/shared/reservation.js'

const envelopeId = '11111111-1111-4111-8111-111111111111'
const signingToken = 'integration-test-token'
const tokenHash = createHash('sha256').update(signingToken).digest('hex')
const secret = 'integration-test-webhook-secret'
const customerId = 'cus_social_test'
const subscriptionId = 'sub_social_test'
const now = Math.floor(Date.now() / 1000)
let rows = []
let patches = []
const originalFetch = globalThis.fetch
const originalEnv = { ...process.env }

function envelope(templateId = 'social-momentum-monthly', additions = {}) {
  return {
    id: envelopeId, template_id: templateId, token_hash: tokenHash, status: 'signed',
    recipient_name: 'Test Client', recipient_email: 'client@example.invalid', business_name: 'Test Business',
    document_title: 'Test agreement', document_body: 'Test body', document_hash: tokenHash,
    expires_at: new Date(Date.now() + 86_400_000).toISOString(),
    payment_status: 'unpaid', stripe_last_event_created: 0, invoice_last_event_created: 0,
    reservation_start_date: templateId === 'local-virality-90-day' ? businessDate() : null,
    subscription_last_event_created: 0, installments_paid: 0, ...additions,
  }
}

function matches(row, url) {
  for (const [field, filter] of url.searchParams) {
    const separator = filter.indexOf('.')
    if (separator < 0) continue
    const operation = filter.slice(0, separator)
    const value = filter.slice(separator + 1)
    if (operation === 'eq' && String(row[field]) !== value) return false
    if (operation === 'neq' && String(row[field]) === value) return false
    if (operation === 'lte' && Number(row[field]) > Number(value)) return false
  }
  return true
}

before(() => {
  process.env.SUPABASE_URL = 'https://wolin-test.invalid'
  process.env.SUPABASE_SECRET_KEY = 'integration-test-only'
  process.env.STRIPE_WEBHOOK_SECRET = secret
  globalThis.fetch = async (input, init = {}) => {
    const url = new URL(String(input))
    assert.equal(url.hostname, 'wolin-test.invalid', 'Tests must never call a live service')
    const method = init.method ?? 'GET'
    if (url.pathname.endsWith('/signing_templates')) return Response.json(method === 'GET' ? [{ id: 'seeded' }] : [])
    if (url.pathname.endsWith('/signing_reservation_refunds')) return Response.json([])
    assert.ok(url.pathname.endsWith('/signing_envelopes'))
    const matched = rows.filter(row => matches(row, url))
    if (method === 'PATCH') {
      const change = JSON.parse(init.body)
      for (const row of matched) Object.assign(row, change)
      patches.push({ change, matched: matched.length })
    }
    return Response.json(matched)
  }
})

after(() => {
  globalThis.fetch = originalFetch
  for (const key of ['SUPABASE_URL', 'SUPABASE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET']) {
    if (originalEnv[key] === undefined) delete process.env[key]
    else process.env[key] = originalEnv[key]
  }
})
beforeEach(() => { rows = [envelope()]; patches = [] })

function checkout(templateId, changes = {}) {
  const offer = paymentOffers[templateId]
  return {
    object: 'checkout.session', id: 'cs_live_test', client_reference_id: paymentReferenceForEnvelope(envelopeId, tokenHash),
    payment_link: offer.linkId, currency: 'usd', amount_subtotal: offer.subtotal, amount_total: offer.subtotal,
    payment_status: 'paid', mode: offer.cadence === 'monthly' ? 'subscription' : 'payment',
    customer: customerId, payment_intent: 'pi_checkout_test', subscription: offer.cadence === 'monthly' ? subscriptionId : null, ...changes,
  }
}
async function deliver(type, object, additions = {}, validSignature = true) {
  const body = JSON.stringify({ id: 'evt_social_test', type, created: now, livemode: true, data: { object }, ...additions })
  const signature = createHmac('sha256', secret).update(`${now}.${body}`).digest('hex')
  return webhook.fetch(new Request('https://wolin.dev/api/stripe-webhook', {
    method: 'POST', body, headers: { 'stripe-signature': `t=${now},v1=${validSignature ? signature : '0'.repeat(64)}` },
  }))
}

test('all four public prices and volumes match their agreement and configured Stripe billing', () => {
  assert.equal(socialOffers.length, 4)
  for (const offer of socialOffers) {
    const template = socialTemplates.find(template => template.id === offer.templateId)
    const payment = paymentOffers[offer.templateId]
    assert.ok(template)
    assert.equal(payment.subtotal, offer.amount)
    assert.equal(payment.cadence, offer.cadence)
    assert.match(payment.priceId, /^price_/)
    assert.match(payment.linkId, /^plink_/)
    assert.match(template.body, new RegExp(`${offer.postsPerPlatform} on Instagram`))
    assert.ok(template.price.includes((offer.amount / 100).toLocaleString('en-US')))
    if (offer.cadence === 'one_time') {
      assert.match(template.body, /no extra charge until that total reaches 10,000/)
      assert.match(template.body, /Branded Template Pack/)
      assert.doesNotMatch(template.body, /Business Review Guide/)
    } else {
      assert.match(template.body, /automatically charges/)
      assert.match(template.body, /cancel future monthly charges/)
    }
  }
})

test('payment references bind a particular document and token', () => {
  const reference = paymentReferenceForEnvelope(envelopeId, tokenHash)
  assert.ok(matchesPaymentReference(reference, envelopeId, tokenHash))
  assert.equal(matchesPaymentReference(reference, envelopeId, 'a'.repeat(64)), false)
  assert.equal(matchesPaymentReference(`${reference}tampered`, envelopeId, tokenHash), false)
  assert.equal(paymentReferenceForEnvelope('invalid', tokenHash), null)
})

test('webhook rejects forged signatures and ignores sandbox events', async () => {
  const object = checkout('social-momentum-monthly')
  assert.equal((await deliver('checkout.session.completed', object, {}, false)).status, 400)
  assert.equal((await deliver('checkout.session.completed', object, { livemode: false })).status, 200)
  assert.equal(patches.length, 0)
})

test('signed customers can pay each new offer and receive the matching payment record', async () => {
  for (const offer of socialOffers) {
    rows = [envelope(offer.templateId)]
    assert.equal((await deliver('checkout.session.completed', checkout(offer.templateId))).status, 200)
    assert.equal(rows[0].payment_status, 'paid')
    assert.equal(rows[0].payment_amount_total, offer.amount)
    assert.equal(rows[0].stripe_payment_link_id, paymentOffers[offer.templateId].linkId)
    assert.equal(rows[0].stripe_subscription_id, offer.cadence === 'monthly' ? subscriptionId : null)
  }
})

test('wrong link, amount, currency, billing mode, document or signature cannot fulfill an agreement', async () => {
  for (const changes of [
    { payment_link: 'plink_wrong' }, { amount_subtotal: 1 }, { currency: 'eur' },
    { mode: 'payment', subscription: null }, { client_reference_id: `${envelopeId}_forged` },
  ]) {
    rows = [envelope()]; patches = []
    await deliver('checkout.session.completed', checkout('social-momentum-monthly', changes))
    assert.equal(patches.length, 0)
  }
  rows = [envelope('local-virality-90-day')]
  await deliver('checkout.session.completed', checkout('local-virality-90-day', { mode: 'subscription', subscription: subscriptionId }))
  assert.equal(patches.length, 0)
  rows = [envelope('social-momentum-monthly', { status: 'sent' })]
  await deliver('checkout.session.completed', checkout('social-momentum-monthly'))
  assert.equal(patches.length, 0)
})

test('monthly invoice failure and recovery are recorded, and stale checkout cannot erase a renewal failure', async () => {
  rows = [envelope('social-momentum-monthly', { payment_status: 'paid', stripe_subscription_id: subscriptionId, stripe_customer_id: customerId })]
  const invoice = { object: 'invoice', id: 'in_renewal', currency: 'usd', customer: customerId, parent: { subscription_details: { subscription: subscriptionId } }, total: 150_000, status: 'open' }
  await deliver('invoice.payment_failed', invoice, { created: now + 10 })
  assert.equal(rows[0].payment_status, 'failed')
  await deliver('checkout.session.completed', checkout('social-momentum-monthly'))
  assert.equal(rows[0].payment_status, 'failed')
  await deliver('invoice.paid', { ...invoice, status: 'paid', amount_paid: 150_000 }, { created: now + 20 })
  assert.equal(rows[0].payment_status, 'paid')
  assert.equal(rows[0].stripe_last_invoice_status, 'paid')
  await deliver('invoice.payment_failed', invoice, { created: now + 30 })
  assert.equal(rows[0].payment_status, 'paid', 'Redelivered failure for a paid invoice stays paid')
})

test('subscription renewals and cancellation are tracked and late updates cannot reactivate cancellation', async () => {
  rows = [envelope('social-momentum-monthly', { payment_status: 'paid', stripe_subscription_id: subscriptionId, stripe_customer_id: customerId })]
  const subscription = { object: 'subscription', id: subscriptionId, customer: customerId, status: 'active', items: { data: [{ current_period_end: now + 30 * 86400 }] }, cancel_at_period_end: true }
  await deliver('customer.subscription.updated', subscription)
  assert.equal(rows[0].subscription_cancel_at_period_end, true)
  assert.ok(rows[0].subscription_current_period_end)
  await deliver('customer.subscription.deleted', { ...subscription, status: 'canceled' }, { created: now + 10 })
  await deliver('customer.subscription.updated', { ...subscription, cancel_at_period_end: false }, { created: now - 10 })
  assert.equal(rows[0].stripe_subscription_status, 'canceled')
})

test('an existing monthly subscriber gets billing management instead of another checkout', async () => {
  rows = [envelope('social-momentum-monthly', { payment_status: 'failed', stripe_subscription_id: subscriptionId })]
  let status = 0; let result
  const response = { setHeader() {}, status(code) { status = code; return this }, json(data) { result = data; return this } }
  await signHandler({ method: 'GET', query: { token: signingToken }, headers: {} }, response)
  assert.equal(status, 200)
  assert.equal(result.document.paymentUrl, null)
  assert.match(result.document.billingPortalUrl, /^https:\/\/billing\.stripe\.com\//)
})
