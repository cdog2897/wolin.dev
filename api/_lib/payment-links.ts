import { createHmac, timingSafeEqual } from 'node:crypto'
import { socialOffers } from '../../shared/social-offers.js'

export type PaymentOffer = { url: string; linkId: string; subtotal: number; total?: number; installments?: number; cadence?: 'one_time' | 'monthly'; priceId?: string; productId?: string }

const socialPaymentLinks: Record<string, Omit<PaymentOffer, 'subtotal'>> = {
  'local-virality-90-day': {
    url: 'https://buy.stripe.com/6oUbJ0fxi3Pj0QR3Ls0ZW06',
    linkId: 'plink_1ULBttAUfC4vfcET4Ck87uvI',
    productId: 'prod_VLtd77VFuium2O',
    priceId: 'price_1ULBpyAUfC4vfcETZGOAOWZB',
  },
  'social-momentum-monthly': {
    url: 'https://buy.stripe.com/bJebJ084Q85zgPP5TA0ZW07',
    linkId: 'plink_1ULBxXAUfC4vfcETTVqdXiM0',
    productId: 'prod_VLteGlY3qrjsQ2',
    priceId: 'price_1ULBr8AUfC4vfcETeeMdFpRE',
  },
  'social-growth-monthly': {
    url: 'https://buy.stripe.com/6oUfZg2KwetX4331Dk0ZW08',
    linkId: 'plink_1ULC2YAUfC4vfcETchR6NU2b',
    productId: 'prod_VLtfwkuYg9cgXf',
    priceId: 'price_1ULBs4AUfC4vfcETyU3hylCI',
  },
  'social-presence-monthly': {
    url: 'https://buy.stripe.com/3cI9AS1GsbhL1UVbdU0ZW09',
    linkId: 'plink_1ULC5wAUfC4vfcETza3Hracy',
    productId: 'prod_VLtgUYBDWaobJ6',
    priceId: 'price_1ULBshAUfC4vfcETIziLqF7t',
  },
}

export const paymentOffers: Record<string, PaymentOffer> = {
  ...Object.fromEntries(socialOffers.map(offer => [offer.templateId, { ...socialPaymentLinks[offer.templateId], subtotal: offer.amount, cadence: offer.cadence }])),
  'local-sensation-90-day': {
    url: 'https://buy.stripe.com/dRm3cucl60D7fLLa9Q0ZW01',
    linkId: 'plink_1UJKEtAUfC4vfcETORJfDVOB',
    subtotal: 450_000,
  },
  'local-sensation-90-day-installments': {
    url: 'https://buy.stripe.com/4gMfZgcl685z8jja9Q0ZW04',
    linkId: 'plink_1UJaf1AUfC4vfcETikH1OjzC',
    subtotal: 150_000,
    total: 450_000,
    installments: 3,
  },
  'website-care-monthly': {
    url: 'https://buy.stripe.com/eVq5kC0CoetXfLLbdU0ZW02',
    linkId: 'plink_1UJKFOAUfC4vfcETvF2v3ak7',
    subtotal: 9_900,
  },
  'standalone-website': {
    url: 'https://buy.stripe.com/cNi9ASacY85z9nn95M0ZW05',
    linkId: 'plink_1UKgjxAUfC4vfcETnpQlBjez',
    subtotal: 29_900,
  },
  'checkout-flow-test-1-dollar': {
    url: 'https://buy.stripe.com/4gM7sK0Co2Lfczz81I0ZW03',
    linkId: 'plink_1UJaEEAUfC4vfcETwtFiuHDF',
    subtotal: 100,
  },
}

export type ReservationPaymentStage = 'deposit' | 'balance'

function referenceSignature(envelopeId: string, tokenHash: string, stage?: ReservationPaymentStage) {
  const message = stage ? `wolin-stripe-reservation:v1:${stage}:${envelopeId}` : `wolin-stripe-payment:v1:${envelopeId}`
  return createHmac('sha256', tokenHash).update(message).digest('base64url')
}

export function paymentReferenceForEnvelope(envelopeId: unknown, tokenHash: unknown, stage?: ReservationPaymentStage) {
  if (typeof envelopeId !== 'string' || !/^[0-9a-f-]{36}$/i.test(envelopeId) || typeof tokenHash !== 'string' || !/^[0-9a-f]{64}$/i.test(tokenHash)) return null
  return `${envelopeId}_${referenceSignature(envelopeId, tokenHash, stage)}`
}

export function matchesPaymentReference(reference: unknown, envelopeId: string, tokenHash: string, stage?: ReservationPaymentStage) {
  const expected = paymentReferenceForEnvelope(envelopeId, tokenHash, stage)
  if (!expected || typeof reference !== 'string') return false
  const actualBytes = Buffer.from(reference)
  const expectedBytes = Buffer.from(expected)
  return actualBytes.length === expectedBytes.length && timingSafeEqual(actualBytes, expectedBytes)
}

export function paymentUrlForEnvelope(templateId: unknown, envelopeId: unknown, tokenHash: unknown) {
  const offer = paymentOffers[String(templateId)]
  const reference = paymentReferenceForEnvelope(envelopeId, tokenHash)
  if (!offer || !reference) return null
  const url = new URL(offer.url)
  url.searchParams.set('client_reference_id', reference)
  return url.toString()
}
