export type Template = {
  id: string
  name: string
  package_name: string
  price: string
  subject: string
  body: string
  created_at?: string
  updated_at?: string
}

export type EnvelopeStatus = 'draft' | 'sent' | 'viewed' | 'signed' | 'voided' | 'expired'

export type Envelope = {
  id: string
  template_id: string
  recipient_name: string
  recipient_email: string
  business_name: string
  document_title: string
  status: EnvelopeStatus
  expires_at: string
  created_at: string
  sent_at: string | null
  viewed_at: string | null
  signed_at: string | null
  voided_at: string | null
  document_body?: string
  document_hash?: string
  signature_name?: string | null
  signature_type?: string | null
  signature_data?: string | null
  signature_hash?: string | null
  signer_ip?: string | null
  consent_text?: string | null
}

export type AuditEvent = {
  event_type: string
  detail: Record<string, unknown>
  ip: string | null
  user_agent: string | null
  event_hash: string
  previous_hash: string | null
  created_at: string
}

export type Stats = {
  total: number
  sent: number
  viewed: number
  signed: number
  draft: number
}

export type SigningDocument = {
  id: string
  recipientName: string
  recipientEmail: string
  businessName: string
  title: string
  body: string
  documentHash: string
  status: EnvelopeStatus
  expiresAt: string
  sentAt: string | null
  viewedAt: string | null
  signedAt: string | null
  signatureName: string | null
  signatureType: string | null
  signatureData: string | null
  consentText: string
}
