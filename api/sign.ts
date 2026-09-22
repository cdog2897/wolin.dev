import { addAuditEvent, assertDb, db, ensureSchema, sha256 } from './_lib/db.js'
import { bodyObject, header, isSameOrigin, methodNotAllowed, noStore, queryValue, requestIp, text, type ApiRequest, type ApiResponse } from './_lib/http.js'
import { createSignedPdf } from './_lib/pdf.js'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'caleb.wolin@gmail.com'
const EMAIL_FROM = process.env.SIGNING_FROM_EMAIL || 'Wolin <reports@wolin.dev>'
const CONSENT_TEXT = 'I have reviewed this document, consent to use electronic records and signatures, and agree that my electronic signature is legally binding.'

function escapeHtml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;')
}

async function sendEmail(payload: { to: string[]; subject: string; html: string; text: string }) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error('RESEND_API_KEY is not configured.')
  const result = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: EMAIL_FROM, ...payload }),
  })
  if (!result.ok) throw new Error(`Resend rejected the email (${result.status}): ${await result.text()}`)
}

function emailFrame(content: string, host: 'wolin.dev' | 'admin.wolin.dev' = 'wolin.dev') {
  return `<div style="background:#f2f5f3;padding:36px 18px;font-family:Arial,sans-serif;color:#17211f"><div style="max-width:600px;margin:auto;background:#fff;border:1px solid #dfe5e1;border-radius:16px;overflow:hidden"><div style="padding:24px 30px;border-bottom:1px solid #edf0ee;color:#214e45;font-weight:800;letter-spacing:.16em">WOLIN</div><div style="padding:34px 30px">${content}</div><div style="padding:18px 30px;background:#f7f9f8;color:#68736f;font-size:12px">Securely completed with Wolin Sign · ${host}</div></div></div>`
}

async function findEnvelope(token: string) {
  if (!token || token.length > 200) return null
  const supabase = db()
  const { data, error } = await supabase.from('signing_envelopes').select('*').eq('token_hash', sha256(token)).maybeSingle()
  assertDb(error, 'Unable to load the signing document')
  return data
}

async function downloadPdf(envelope: Record<string, unknown>, response: ApiResponse) {
  if (envelope.status !== 'signed') return response.status(409).json({ error: 'The completed PDF is available after signing.' })
  const buffer = await createSignedPdf(envelope as never)
  const filename = `${String(envelope.business_name).replace(/[^a-z0-9]+/gi, '-')}-${String(envelope.document_title).replace(/[^a-z0-9]+/gi, '-')}.pdf`
  response.setHeader('Content-Type', 'application/pdf')
  response.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
  return response.status(200).send(buffer)
}

async function getDocument(request: ApiRequest, response: ApiResponse, token: string) {
  const envelope = await findEnvelope(token)
  if (!envelope) return response.status(404).json({ error: 'This signing link is invalid.' })
  if (queryValue(request, 'format') === 'pdf') return downloadPdf(envelope, response)

  const expiresAt = new Date(String(envelope.expires_at))
  if (!['signed', 'voided', 'expired'].includes(String(envelope.status)) && expiresAt.getTime() < Date.now()) {
    const supabase = db()
    const { error } = await supabase.from('signing_envelopes').update({ status: 'expired' }).eq('id', String(envelope.id))
    assertDb(error, 'Unable to expire the signing document')
    envelope.status = 'expired'
    await addAuditEvent(String(envelope.id), 'document_expired', {}, requestIp(request), header(request, 'user-agent'))
  } else if (envelope.status === 'sent') {
    const supabase = db()
    const viewedAt = String(envelope.viewed_at || new Date().toISOString())
    const { data: viewedRows, error } = await supabase
      .from('signing_envelopes')
      .update({ status: 'viewed', viewed_at: viewedAt })
      .eq('id', String(envelope.id))
      .eq('status', 'sent')
      .select('id')
    assertDb(error, 'Unable to record the document view')
    if (viewedRows?.[0]) {
      envelope.status = 'viewed'
      envelope.viewed_at = viewedAt
      await addAuditEvent(String(envelope.id), 'document_viewed', {}, requestIp(request), header(request, 'user-agent'))
    }
  }

  return response.status(200).json({
    document: {
      id: envelope.id,
      recipientName: envelope.recipient_name,
      recipientEmail: envelope.recipient_email,
      businessName: envelope.business_name,
      title: envelope.document_title,
      body: envelope.document_body,
      documentHash: envelope.document_hash,
      status: envelope.status,
      expiresAt: envelope.expires_at,
      sentAt: envelope.sent_at,
      viewedAt: envelope.viewed_at,
      signedAt: envelope.signed_at,
      signatureName: envelope.signature_name,
      signatureType: envelope.signature_type,
      signatureData: envelope.status === 'signed' ? envelope.signature_data : null,
      consentText: CONSENT_TEXT,
    },
  })
}

async function signDocument(request: ApiRequest, response: ApiResponse, token: string) {
  if (!isSameOrigin(request)) return response.status(403).json({ error: 'Request origin is not allowed.' })
  const envelope = await findEnvelope(token)
  if (!envelope) return response.status(404).json({ error: 'This signing link is invalid.' })
  if (envelope.status === 'signed') return response.status(409).json({ error: 'This document has already been signed.' })
  if (envelope.status === 'voided') return response.status(409).json({ error: 'This document was voided by the sender.' })
  if (new Date(String(envelope.expires_at)).getTime() < Date.now()) return response.status(409).json({ error: 'This signing link has expired.' })

  const body = bodyObject(request)
  const signerName = text(body.signerName, 160)
  const signatureType = text(body.signatureType, 20)
  const agreed = body.agreed === true
  let signatureData = typeof body.signatureData === 'string' ? body.signatureData : ''
  if (!signerName || !agreed || !['typed', 'drawn'].includes(signatureType)) {
    return response.status(400).json({ error: 'Enter your full name, add a signature, and accept the electronic-signature consent.' })
  }
  if (signatureType === 'typed') signatureData = signerName
  if (signatureType === 'drawn' && (!signatureData.startsWith('data:image/png;base64,') || signatureData.length > 300_000)) {
    return response.status(400).json({ error: 'Please draw a valid signature.' })
  }

  const supabase = db()
  const signatureHash = sha256([String(envelope.document_hash), signerName, signatureType, signatureData, CONSENT_TEXT].join('|'))
  const ip = requestIp(request)
  const userAgent = header(request, 'user-agent').slice(0, 1_000)
  const signedAt = new Date().toISOString()
  const { data: signedRows, error: signError } = await supabase.from('signing_envelopes').update({
    status: 'signed',
    signed_at: signedAt,
    signature_name: signerName,
    signature_type: signatureType,
    signature_data: signatureData,
    signature_hash: signatureHash,
    signer_ip: ip,
    signer_user_agent: userAgent,
    consent_text: CONSENT_TEXT,
  })
    .eq('id', String(envelope.id))
    .neq('status', 'signed')
    .neq('status', 'voided')
    .neq('status', 'expired')
    .select('signed_at')
  assertDb(signError, 'Unable to save the signature')
  if (!signedRows?.[0]) return response.status(409).json({ error: 'This document can no longer be signed.' })
  await addAuditEvent(String(envelope.id), 'document_signed', { signerName, signatureType, signatureHash, consent: CONSENT_TEXT }, ip, userAgent)

  const safeSigner = escapeHtml(signerName)
  const safeBusiness = escapeHtml(String(envelope.business_name))
  const safeTitle = escapeHtml(String(envelope.document_title))
  try {
    await sendEmail({
      to: [String(envelope.recipient_email)],
      subject: `Completed: ${String(envelope.document_title)}`,
      text: `Your signature is complete.\n\nDocument: ${String(envelope.document_title)}\nSigner: ${signerName}\nBusiness: ${String(envelope.business_name)}\n\nReturn to your secure signing link to download a copy.`,
      html: emailFrame(`<h1 style="font-size:26px;margin:0 0 12px">Your signature is complete.</h1><p style="line-height:1.6;margin:0 0 16px"><strong>${safeTitle}</strong> was signed by ${safeSigner} for ${safeBusiness}.</p><p style="line-height:1.6;margin:0">Return to your secure signing link at any time to download the completed document.</p>`),
    })
    await sendEmail({
      to: [ADMIN_EMAIL],
      subject: `Signed: ${String(envelope.document_title)} — ${String(envelope.business_name)}`,
      text: `${signerName} signed ${String(envelope.document_title)} for ${String(envelope.business_name)}. Open Wolin Admin to view the signed document and audit trail.`,
      html: emailFrame(`<h1 style="font-size:26px;margin:0 0 12px">Document signed.</h1><p style="line-height:1.6;margin:0">${safeSigner} signed <strong>${safeTitle}</strong> for ${safeBusiness}. Open Wolin Admin to view the document and audit trail.</p>`, 'admin.wolin.dev'),
    })
    await addAuditEvent(String(envelope.id), 'completion_emails_sent', {}, ip, userAgent)
  } catch (error) {
    console.error('Signature saved, but completion email failed.', error)
    await addAuditEvent(String(envelope.id), 'completion_email_failed', {}, ip, userAgent)
  }
  return response.status(200).json({ ok: true, signedAt: signedRows[0].signed_at })
}

export default async function handler(request: ApiRequest, response: ApiResponse) {
  noStore(response)
  try {
    await ensureSchema()
    const token = queryValue(request, 'token')
    if (request.method === 'GET') return await getDocument(request, response, token)
    if (request.method === 'POST') return await signDocument(request, response, token)
    return methodNotAllowed(response, ['GET', 'POST'])
  } catch (error) {
    console.error('Signing API error.', error)
    return response.status(500).json({ error: 'Unable to load this document. Please try again.' })
  }
}
