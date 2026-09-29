import { createHmac, timingSafeEqual } from 'node:crypto'

export type PaymentOffer = { url: string; linkId: string; subtotal: number; total?: number; installments?: number }

export const paymentOffers: Record<string, PaymentOffer> = {
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

function referenceSignature(envelopeId: string, tokenHash: string) {
  return createHmac('sha256', tokenHash).update(`wolin-stripe-payment:v1:${envelopeId}`).digest('base64url')
}

export function paymentReferenceForEnvelope(envelopeId: unknown, tokenHash: unknown) {
  if (typeof envelopeId !== 'string' || !/^[0-9a-f-]{36}$/i.test(envelopeId) || typeof tokenHash !== 'string' || !/^[0-9a-f]{64}$/i.test(tokenHash)) return null
  return `${envelopeId}_${referenceSignature(envelopeId, tokenHash)}`
}

export function matchesPaymentReference(reference: unknown, envelopeId: string, tokenHash: string) {
  const expected = paymentReferenceForEnvelope(envelopeId, tokenHash)
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
