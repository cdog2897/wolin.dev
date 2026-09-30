import type { AuditEvent, Envelope, SigningDocument, Stats, Template } from './types'

export const demoMode = import.meta.env.DEV && new URLSearchParams(window.location.search).has('demo')

let demoTemplates: Template[] = [{
  id: 'preview-agreement',
  name: 'Preview Agreement',
  package_name: 'Preview service',
  price: 'Example price',
  subject: 'Preview agreement',
  body: `PREVIEW AGREEMENT

This is sample content for testing the signing interface. It is not a live offer or contract.

1. CLIENT

{{business_name}} is represented by {{client_name}} ({{client_email}}).

2. SERVICE

The preview service is shown here only to demonstrate how a client agreement appears before signing. No actual services or fees are created by this sample.

3. ELECTRONIC SIGNATURE

The preview shows where electronic signature consent and signer details appear. Date prepared: {{date}}`,
}]
let demoEnvelopes: Envelope[] = []

function renderDemoBody(body: string, envelope: { recipient_name: string; recipient_email: string; business_name: string }, template: Template) {
  const values: Record<string, string> = { client_name: envelope.recipient_name, client_email: envelope.recipient_email, business_name: envelope.business_name, package_name: template.package_name, price: template.price, date: new Date().toLocaleDateString('en-US', { dateStyle: 'long' }) }
  return body.replace(/{{([a-z_]+)}}/g, (match, key: string) => values[key] ?? match)
}

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
  async envelopes(reservationsOnly = false) {
    if (demoMode) return { envelopes: demoEnvelopes.filter(item => !reservationsOnly || item.template_id === 'local-virality-reservation'), stats: demoStats() }
    return request<{ envelopes: Envelope[]; stats: Stats }>(`/api/admin?action=envelopes${reservationsOnly ? '&kind=reservations' : ''}`)
  },
  async envelope(id: string) {
    if (demoMode) {
      const envelope = demoEnvelopes.find((item) => item.id === id)
      if (!envelope) throw new Error('Document not found.')
      const template = demoTemplates.find((item) => item.id === envelope.template_id)!
      const detail: Envelope = { ...envelope, document_body: renderDemoBody(template.body, envelope, template), document_hash: 'db05eb4216d2fca38c2c5645ff047cb899827a8dc7ce4a9e0559e82c811b2f36', signature_name: envelope.status === 'signed' ? envelope.recipient_name : null, signature_type: envelope.status === 'signed' ? 'typed' : null, signature_data: envelope.status === 'signed' ? envelope.recipient_name : null, signature_hash: envelope.status === 'signed' ? 'a19ff06c6b422682a9ad74b95620768492b78eaefb7011e756b1290ab27bde08' : null, signer_ip: envelope.status === 'signed' ? '198.51.100.24' : null, consent_text: envelope.status === 'signed' ? 'I consent to use electronic records and signatures.' : null }
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
  async send(payload: { templateId: string; recipientName: string; recipientEmail: string; businessName: string; message: string; expiresDays: number; startDate?: string }) {
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
      const template = demoTemplates[0]
      const recipient = { recipient_name: 'Maya Chen', recipient_email: 'maya@example.com', business_name: 'Example Local Business' }
      return { document: { id: 'env-demo', recipientName: recipient.recipient_name, recipientEmail: recipient.recipient_email, businessName: recipient.business_name, title: template.name, body: renderDemoBody(template.body, recipient, template), documentHash: 'db05eb4216d2fca38c2c5645ff047cb899827a8dc7ce4a9e0559e82c811b2f36', status: 'viewed', expiresAt: '2026-10-02T18:22:00Z', sentAt: '2026-09-21T16:43:00Z', viewedAt: '2026-09-22T14:08:00Z', signedAt: null, signatureName: null, signatureType: null, signatureData: null, consentText: 'I have reviewed this document, consent to use electronic records and signatures, and agree that my electronic signature is legally binding.', paymentRequired: false, paymentUrl: null } satisfies SigningDocument }
    }
    return request<{ document: SigningDocument }>(`/api/sign?token=${encodeURIComponent(token)}`)
  },
  async sign(token: string, payload: { signerName: string; signatureType: 'typed' | 'drawn'; signatureData: string; agreed: boolean }) {
    if (demoMode) return { ok: true, signedAt: new Date().toISOString(), paymentUrl: null }
    return request<{ ok: true; signedAt: string; paymentUrl: string | null }>(`/api/sign?token=${encodeURIComponent(token)}`, { method: 'POST', body: JSON.stringify(payload) })
  },
}
