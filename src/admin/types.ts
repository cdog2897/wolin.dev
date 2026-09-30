import type { ReservationSummary } from '../../shared/reservation'

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
export type PaymentStatus = 'unpaid' | 'processing' | 'paid' | 'failed' | 'refunded'

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
  payment_required?: boolean
  payment_due_amount?: number | null
  payment_installments_expected?: number
  installments_paid?: number
  stripe_subscription_schedule_id?: string | null
  payment_status?: PaymentStatus
  reservation?: ReservationSummary | null
  reservation_start_date?: string | null
  reservation_deposit_envelope_id?: string | null
  reservation_program?: { id: string; document_title: string; status: EnvelopeStatus; payment_status: PaymentStatus } | null
  reservation_deposit_status?: PaymentStatus
  reservation_deposit_paid_at?: string | null
  reservation_deposit_amount_total?: number | null
  reservation_deposit_intent_id?: string | null
  reservation_payment_url?: string | null
  paid_at?: string | null
  payment_amount_total?: number | null
  payment_currency?: string | null
  stripe_checkout_session_id?: string | null
  stripe_payment_intent_id?: string | null
  stripe_subscription_id?: string | null
  stripe_subscription_status?: string | null
  subscription_current_period_end?: string | null
  subscription_cancel_at_period_end?: boolean
  stripe_last_invoice_id?: string | null
  stripe_last_invoice_status?: string | null
  last_invoice_amount_total?: number | null
  last_invoice_paid_at?: string | null
  stripe_customer_id?: string | null
  stripe_payment_link_id?: string | null
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
  paymentRequired: boolean
  paymentUrl: string | null
  billingPortalUrl?: string | null
  reservation?: ReservationSummary | null
}
