import type { AuditEvent, Envelope, SigningDocument, Stats, Template } from './types'

export const demoMode = import.meta.env.DEV && new URLSearchParams(window.location.search).has('demo')

const demoBody = `This Monthly Services Agreement (the “Agreement”) is between Caleb Wolin, operating under the name Wolin (“Provider”), and Juniper Coffee Company, represented by Maya Chen (“Client”). It becomes effective when Client signs electronically.

1. PACKAGE AND MONTHLY FEE

Client selects the Growth package at $679 per monthly service period, plus any applicable tax. The package is month-to-month and does not require a fixed long-term commitment.

2. SERVICES INCLUDED

The Growth package includes Google Business Profile management, two monthly posts, a focused website health review, corrections to prioritized on-page issues, practical mobile and speed improvements, conversion-path improvements, local business structured-data checks, and Google Search Console monitoring.

3. SERVICE SCHEDULE AND DELIVERY

Work begins after Provider receives this signed Agreement, the first monthly payment, and the access and materials reasonably needed for the work. The monthly fee reserves recurring professional time and does not purchase unlimited labor.

4. CLIENT RESPONSIBILITIES

Client will provide timely and lawful access, accurate business information, approved materials, and reasonable responses to approval requests. Client confirms it has the right to use all materials and account access supplied to Provider.

5. RESULTS AND PLATFORM LIMITATIONS

Provider will perform the services with reasonable care and professional diligence but does not promise a particular ranking, traffic level, lead volume, sale, revenue, return on investment, platform approval, or AI mention.

6. FEES, CANCELLATION, AND GENERAL TERMS

Client will pay $679 in advance for each monthly service period. Client may cancel at any time by email, effective at the end of the current paid service period. Electronic signatures are effective, and an electronic copy may be treated as an original.

7. ELECTRONIC SIGNATURE CONSENT

By selecting “I agree” and applying an electronic signature, Client confirms that the signer is authorized to bind the business named above, has reviewed this entire Agreement, and consents to electronic records and signatures.`

let demoTemplates: Template[] = [
  { id: 'starter-monthly', name: 'Starter Monthly Services Agreement', package_name: 'Starter', price: '$279', subject: 'Your Wolin Starter agreement is ready to sign', body: demoBody.replaceAll('Growth', 'Starter').replaceAll('$679', '$279') },
  { id: 'growth-monthly', name: 'Growth Monthly Services Agreement', package_name: 'Growth', price: '$679', subject: 'Your Wolin Growth agreement is ready to sign', body: demoBody },
  { id: 'authority-monthly', name: 'Authority Monthly Services Agreement', package_name: 'Authority', price: '$1,279', subject: 'Your Wolin Authority agreement is ready to sign', body: demoBody.replaceAll('Growth', 'Authority').replaceAll('$679', '$1,279') },
]

let demoEnvelopes: Envelope[] = [
  { id: 'env-1', template_id: 'growth-monthly', recipient_name: 'Maya Chen', recipient_email: 'maya@juniper.coffee', business_name: 'Juniper Coffee Company', document_title: 'Growth Monthly Services Agreement', status: 'viewed', expires_at: '2026-10-02T18:22:00Z', created_at: '2026-09-21T16:42:00Z', sent_at: '2026-09-21T16:43:00Z', viewed_at: '2026-09-22T14:08:00Z', signed_at: null, voided_at: null },
  { id: 'env-2', template_id: 'starter-monthly', recipient_name: 'Eli Rivera', recipient_email: 'eli@northstarplumbing.com', business_name: 'Northstar Plumbing', document_title: 'Starter Monthly Services Agreement', status: 'signed', expires_at: '2026-09-29T18:22:00Z', created_at: '2026-09-15T16:42:00Z', sent_at: '2026-09-15T16:43:00Z', viewed_at: '2026-09-15T17:08:00Z', signed_at: '2026-09-15T17:16:00Z', voided_at: null },
  { id: 'env-3', template_id: 'authority-monthly', recipient_name: 'Avery Morgan', recipient_email: 'avery@fieldandform.co', business_name: 'Field & Form', document_title: 'Authority Monthly Services Agreement', status: 'sent', expires_at: '2026-10-05T18:22:00Z', created_at: '2026-09-20T16:42:00Z', sent_at: '2026-09-20T16:43:00Z', viewed_at: null, signed_at: null, voided_at: null },
  { id: 'env-4', template_id: 'growth-monthly', recipient_name: 'Noah Brooks', recipient_email: 'noah@redmesa.design', business_name: 'Red Mesa Design', document_title: 'Growth Monthly Services Agreement', status: 'draft', expires_at: '2026-10-06T18:22:00Z', created_at: '2026-09-22T13:42:00Z', sent_at: null, viewed_at: null, signed_at: null, voided_at: null },
]

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  })
  const data = await response.json().catch(() => ({})) as T & { error?: string }
  if (!response.ok) throw new Error(data.error || 'Something went wrong.')
  return data
}

function demoStats(): Stats {
  return {
    total: demoEnvelopes.length,
    sent: demoEnvelopes.filter((item) => item.status === 'sent').length,
    viewed: demoEnvelopes.filter((item) => item.status === 'viewed').length,
    signed: demoEnvelopes.filter((item) => item.status === 'signed').length,
    draft: demoEnvelopes.filter((item) => item.status === 'draft').length,
  }
}

export const adminApi = {
  async session() {
    if (demoMode) return { authenticated: true, email: 'caleb.wolin@gmail.com' }
    return request<{ authenticated: boolean; email: string | null }>('/api/admin?action=session')
  },
  async requestLogin(email: string) {
    if (demoMode) return { ok: true }
    return request<{ ok: true }>('/api/admin?action=request-login', { method: 'POST', body: JSON.stringify({ email }) })
  },
  async logout() {
    if (demoMode) return { ok: true }
    return request<{ ok: true }>('/api/admin?action=logout', { method: 'POST' })
  },
  async templates() {
    if (demoMode) return { templates: [...demoTemplates] }
    return request<{ templates: Template[] }>('/api/admin?action=templates')
  },
  async saveTemplate(template: { id?: string; name: string; packageName: string; price: string; subject: string; body: string }) {
    if (demoMode) {
      const saved: Template = { id: template.id || crypto.randomUUID(), name: template.name, package_name: template.packageName, price: template.price, subject: template.subject, body: template.body }
      demoTemplates = [...demoTemplates.filter((item) => item.id !== saved.id), saved]
      return { template: saved }
    }
    return request<{ template: Template }>('/api/admin?action=templates', { method: 'POST', body: JSON.stringify(template) })
  },
  async envelopes() {
    if (demoMode) return { envelopes: [...demoEnvelopes], stats: demoStats() }
    return request<{ envelopes: Envelope[]; stats: Stats }>('/api/admin?action=envelopes')
  },
  async envelope(id: string) {
    if (demoMode) {
      const envelope = demoEnvelopes.find((item) => item.id === id)
      if (!envelope) throw new Error('Document not found.')
      const detail: Envelope = { ...envelope, document_body: demoBody, document_hash: 'db05eb4216d2fca38c2c5645ff047cb899827a8dc7ce4a9e0559e82c811b2f36', signature_name: envelope.status === 'signed' ? envelope.recipient_name : null, signature_type: envelope.status === 'signed' ? 'typed' : null, signature_data: envelope.status === 'signed' ? envelope.recipient_name : null, signature_hash: envelope.status === 'signed' ? 'a19ff06c6b422682a9ad74b95620768492b78eaefb7011e756b1290ab27bde08' : null, signer_ip: envelope.status === 'signed' ? '198.51.100.24' : null, consent_text: envelope.status === 'signed' ? 'I consent to use electronic records and signatures.' : null }
      const audit: AuditEvent[] = [
        { event_type: 'document_created', detail: {}, ip: '203.0.113.12', user_agent: 'Chrome', event_hash: 'c8fae421c393690777aa0e8036a11e1f54de99e2', previous_hash: null, created_at: envelope.created_at },
        ...(envelope.sent_at ? [{ event_type: 'email_sent', detail: {}, ip: '203.0.113.12', user_agent: 'Chrome', event_hash: 'ac12e09b2d3fe1d8da9654ed4c0307067f47e2b5', previous_hash: 'c8fae421', created_at: envelope.sent_at } satisfies AuditEvent] : []),
        ...(envelope.viewed_at ? [{ event_type: 'document_viewed', detail: {}, ip: '198.51.100.24', user_agent: 'Safari', event_hash: '18daed4938c128840411f337f289a1876cffbe01', previous_hash: 'ac12e09b', created_at: envelope.viewed_at } satisfies AuditEvent] : []),
        ...(envelope.signed_at ? [{ event_type: 'document_signed', detail: {}, ip: '198.51.100.24', user_agent: 'Safari', event_hash: '4bd8e902ca4274a16888a9e1391265a905b83bb1', previous_hash: '18daed49', created_at: envelope.signed_at } satisfies AuditEvent] : []),
      ]
      return { envelope: detail, audit }
    }
    return request<{ envelope: Envelope; audit: AuditEvent[] }>(`/api/admin?action=envelopes&id=${encodeURIComponent(id)}`)
  },
  async send(payload: { templateId: string; recipientName: string; recipientEmail: string; businessName: string; message: string; expiresDays: number }) {
    if (demoMode) {
      const template = demoTemplates.find((item) => item.id === payload.templateId)!
      const envelope: Envelope = { id: crypto.randomUUID(), template_id: template.id, recipient_name: payload.recipientName, recipient_email: payload.recipientEmail, business_name: payload.businessName, document_title: template.name, status: 'sent', expires_at: new Date(Date.now() + payload.expiresDays * 86_400_000).toISOString(), created_at: new Date().toISOString(), sent_at: new Date().toISOString(), viewed_at: null, signed_at: null, voided_at: null }
      demoEnvelopes = [envelope, ...demoEnvelopes]
      return { ok: true, envelope }
    }
    return request<{ ok: true; envelope: Envelope }>('/api/admin?action=send', { method: 'POST', body: JSON.stringify(payload) })
  },
  async resend(id: string) {
    if (demoMode) return { ok: true }
    return request<{ ok: true }>('/api/admin?action=resend', { method: 'POST', body: JSON.stringify({ id }) })
  },
  async void(id: string) {
    if (demoMode) {
      demoEnvelopes = demoEnvelopes.map((item) => item.id === id ? { ...item, status: 'voided', voided_at: new Date().toISOString() } : item)
      return { ok: true }
    }
    return request<{ ok: true }>('/api/admin?action=void', { method: 'POST', body: JSON.stringify({ id }) })
  },
}

export const signingApi = {
  async document(token: string) {
    if (demoMode) {
      return { document: { id: 'env-demo', recipientName: 'Maya Chen', recipientEmail: 'maya@juniper.coffee', businessName: 'Juniper Coffee Company', title: 'Growth Monthly Services Agreement', body: demoBody, documentHash: 'db05eb4216d2fca38c2c5645ff047cb899827a8dc7ce4a9e0559e82c811b2f36', status: 'viewed', expiresAt: '2026-10-02T18:22:00Z', sentAt: '2026-09-21T16:43:00Z', viewedAt: '2026-09-22T14:08:00Z', signedAt: null, signatureName: null, signatureType: null, signatureData: null, consentText: 'I have reviewed this document, consent to use electronic records and signatures, and agree that my electronic signature is legally binding.' } satisfies SigningDocument }
    }
    return request<{ document: SigningDocument }>(`/api/sign?token=${encodeURIComponent(token)}`)
  },
  async sign(token: string, payload: { signerName: string; signatureType: 'typed' | 'drawn'; signatureData: string; agreed: boolean }) {
    if (demoMode) return { ok: true, signedAt: new Date().toISOString() }
    return request<{ ok: true; signedAt: string }>(`/api/sign?token=${encodeURIComponent(token)}`, { method: 'POST', body: JSON.stringify(payload) })
  },
}
