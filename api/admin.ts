import { randomBytes, randomUUID } from 'node:crypto'
import { clearSessionCookie, createSignedToken, getAdminSession, requireAdmin, setSessionCookie, verifySignedToken } from './_lib/auth.js'
import { addAuditEvent, assertDb, db, ensureSchema, sha256 } from './_lib/db.js'
import { bodyObject, header, isSameOrigin, methodNotAllowed, noStore, queryValue, requestIp, text, type ApiRequest, type ApiResponse } from './_lib/http.js'
import { createSignedPdf } from './_lib/pdf.js'

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'caleb.wolin@gmail.com').toLowerCase()
const ADMIN_BASE_URL = process.env.ADMIN_BASE_URL || 'https://admin.wolin.dev'
const PUBLIC_BASE_URL = 'https://wolin.dev'
const EMAIL_FROM = process.env.SIGNING_FROM_EMAIL || 'Wolin <reports@wolin.dev>'

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function escapeHtml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;')
}

function renderTemplate(body: string, values: Record<string, string>) {
  return body.replace(/{{([a-z_]+)}}/g, (match, key: string) => values[key] ?? match)
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
  return `<div style="background:#f2f5f3;padding:36px 18px;font-family:Arial,sans-serif;color:#17211f"><div style="max-width:600px;margin:auto;background:#fff;border:1px solid #dfe5e1;border-radius:16px;overflow:hidden"><div style="padding:24px 30px;border-bottom:1px solid #edf0ee;color:#214e45;font-weight:800;letter-spacing:.16em">WOLIN</div><div style="padding:34px 30px">${content}</div><div style="padding:18px 30px;background:#f7f9f8;color:#68736f;font-size:12px">Securely delivered by Wolin Sign · ${host}</div></div></div>`
}

async function sendSigningEmail(envelope: Record<string, unknown>, signingToken: string) {
  const link = `${PUBLIC_BASE_URL}/sign/${encodeURIComponent(signingToken)}`
  const name = String(envelope.recipient_name)
  const title = String(envelope.document_title)
  const message = String(envelope.email_message || '')
  const safeName = escapeHtml(name)
  const safeTitle = escapeHtml(title)
  const safeMessage = escapeHtml(message).replaceAll('\n', '<br>')
  await sendEmail({
    to: [String(envelope.recipient_email)],
    subject: String(envelope.email_subject),
    text: [`Hi ${name},`, '', message || `Caleb Wolin sent you “${title}” to review and sign.`, '', `Review and sign: ${link}`, '', 'This secure link is intended only for you.'].join('\n'),
    html: emailFrame(`<p style="margin:0 0 10px;color:#68736f">Hi ${safeName},</p><h1 style="font-size:26px;line-height:1.2;margin:0 0 16px">A document is ready for your signature.</h1><p style="line-height:1.6;margin:0 0 22px">${safeMessage || `Caleb Wolin sent you <strong>${safeTitle}</strong> to review and sign.`}</p><a href="${link}" style="display:inline-block;background:#214e45;color:#fff;text-decoration:none;padding:13px 20px;border-radius:9px;font-weight:700">Review &amp; sign</a><p style="font-size:12px;color:#7b8581;margin:24px 0 0">This secure link is intended only for ${safeName} and expires on ${new Date(String(envelope.expires_at)).toLocaleDateString('en-US', { dateStyle: 'long' })}.</p>`),
  })
}

async function requestLogin(request: ApiRequest, response: ApiResponse) {
  if (request.method !== 'POST') return methodNotAllowed(response, ['POST'])
  if (!isSameOrigin(request)) return response.status(403).json({ error: 'Request origin is not allowed.' })
  const email = text(bodyObject(request).email, 254).toLowerCase()
  if (email === ADMIN_EMAIL) {
    const loginToken = createSignedToken(email, 15 * 60)
    const link = `${ADMIN_BASE_URL}/api/admin?action=verify&token=${encodeURIComponent(loginToken)}`
    await sendEmail({
      to: [email],
      subject: 'Your Wolin Admin sign-in link',
      text: `Sign in to Wolin Admin: ${link}\n\nThis link expires in 15 minutes.`,
      html: emailFrame(`<h1 style="font-size:26px;margin:0 0 12px">Sign in to Wolin Admin</h1><p style="line-height:1.6;margin:0 0 22px">Use this private link to open your admin portal. It expires in 15 minutes.</p><a href="${link}" style="display:inline-block;background:#214e45;color:#fff;text-decoration:none;padding:13px 20px;border-radius:9px;font-weight:700">Sign in securely</a>`, 'admin.wolin.dev'),
    })
  }
  return response.status(200).json({ ok: true })
}

function verifyLogin(request: ApiRequest, response: ApiResponse) {
  if (request.method !== 'GET') return methodNotAllowed(response, ['GET'])
  const token = verifySignedToken(queryValue(request, 'token'))
  if (!token || token.email.toLowerCase() !== ADMIN_EMAIL) {
    response.statusCode = 302
    response.setHeader('Location', `${ADMIN_BASE_URL}/?login=expired`)
    return response.end()
  }
  setSessionCookie(response, createSignedToken(token.email, 7 * 24 * 60 * 60))
  response.statusCode = 302
  response.setHeader('Location', `${ADMIN_BASE_URL}/`)
  return response.end()
}

async function templates(request: ApiRequest, response: ApiResponse) {
  if (!requireAdmin(request, response)) return
  await ensureSchema()
  const supabase = db()
  if (request.method === 'GET') {
    const { data, error } = await supabase.from('signing_templates').select('*').eq('active', true).order('created_at').order('name')
    assertDb(error, 'Unable to load templates')
    return response.status(200).json({ templates: data ?? [] })
  }
  if (request.method !== 'POST') return methodNotAllowed(response, ['GET', 'POST'])
  if (!isSameOrigin(request)) return response.status(403).json({ error: 'Request origin is not allowed.' })
  const body = bodyObject(request)
  const id = text(body.id, 100) || randomUUID()
  const name = text(body.name, 160)
  const packageName = text(body.packageName, 100)
  const price = text(body.price, 50)
  const subject = text(body.subject, 200)
  const templateBody = text(body.body, 40_000)
  if (!name || !packageName || !price || !subject || templateBody.length < 100) {
    return response.status(400).json({ error: 'Complete every template field.' })
  }
  const { data, error } = await supabase.from('signing_templates').upsert({
    id,
    name,
    package_name: packageName,
    price,
    subject,
    body: templateBody,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'id' }).select('*').single()
  assertDb(error, 'Unable to save the template')
  return response.status(200).json({ template: data })
}

async function envelopes(request: ApiRequest, response: ApiResponse) {
  if (!requireAdmin(request, response)) return
  await ensureSchema()
  const supabase = db()
  if (request.method !== 'GET') return methodNotAllowed(response, ['GET'])
  const id = queryValue(request, 'id')
  if (id) {
    const { data: envelope, error: envelopeError } = await supabase.from('signing_envelopes').select('*').eq('id', id).maybeSingle()
    assertDb(envelopeError, 'Unable to load the document')
    if (!envelope) return response.status(404).json({ error: 'Document not found.' })
    const { data: audit, error: auditError } = await supabase
      .from('signing_audit_events')
      .select('event_type, detail, ip, user_agent, event_hash, previous_hash, created_at')
      .eq('envelope_id', id)
      .order('created_at')
      .order('id')
    assertDb(auditError, 'Unable to load the audit trail')
    return response.status(200).json({ envelope, audit: audit ?? [] })
  }
  const { data, error } = await supabase
    .from('signing_envelopes')
    .select('id, template_id, recipient_name, recipient_email, business_name, document_title, status, expires_at, created_at, sent_at, viewed_at, signed_at, voided_at')
    .order('created_at', { ascending: false })
    .limit(250)
  assertDb(error, 'Unable to load documents')
  const rows = data ?? []
  const stats = {
    total: rows.length,
    sent: rows.filter((item) => item.status === 'sent').length,
    viewed: rows.filter((item) => item.status === 'viewed').length,
    signed: rows.filter((item) => item.status === 'signed').length,
    draft: rows.filter((item) => item.status === 'draft').length,
  }
  return response.status(200).json({ envelopes: rows, stats })
}

async function sendEnvelope(request: ApiRequest, response: ApiResponse) {
  if (!requireAdmin(request, response)) return
  if (request.method !== 'POST') return methodNotAllowed(response, ['POST'])
  if (!isSameOrigin(request)) return response.status(403).json({ error: 'Request origin is not allowed.' })
  await ensureSchema()
  const supabase = db()
  const body = bodyObject(request)
  const templateId = text(body.templateId, 100)
  const recipientName = text(body.recipientName, 160)
  const recipientEmail = text(body.recipientEmail, 254).toLowerCase()
  const businessName = text(body.businessName, 200)
  const emailMessage = text(body.message, 2_000)
  const expiresDays = Math.min(90, Math.max(1, Number(body.expiresDays) || 14))
  if (!templateId || !recipientName || !validEmail(recipientEmail) || !businessName) {
    return response.status(400).json({ error: 'Enter a valid recipient, email, business, and template.' })
  }
  const { data: template, error: templateError } = await supabase.from('signing_templates').select('*').eq('id', templateId).eq('active', true).maybeSingle()
  assertDb(templateError, 'Unable to load the template')
  if (!template) return response.status(404).json({ error: 'Template not found.' })

  const envelopeId = randomUUID()
  const signingToken = randomBytes(32).toString('base64url')
  const values = {
    client_name: recipientName,
    client_email: recipientEmail,
    business_name: businessName,
    package_name: String(template.package_name),
    price: String(template.price),
    date: new Date().toLocaleDateString('en-US', { dateStyle: 'long' }),
  }
  const documentBody = renderTemplate(String(template.body), values)
  const documentTitle = String(template.name)
  const documentHash = sha256(`${documentTitle}\n${documentBody}`)
  const expiresAt = new Date(Date.now() + expiresDays * 86_400_000).toISOString()
  const emailSubject = String(template.subject)
  const { error: insertError } = await supabase.from('signing_envelopes').insert({
    id: envelopeId,
    template_id: templateId,
    recipient_name: recipientName,
    recipient_email: recipientEmail,
    business_name: businessName,
    email_subject: emailSubject,
    email_message: emailMessage,
    document_title: documentTitle,
    document_body: documentBody,
    document_hash: documentHash,
    token_hash: sha256(signingToken),
    status: 'draft',
    expires_at: expiresAt,
  })
  assertDb(insertError, 'Unable to create the document')
  await addAuditEvent(envelopeId, 'document_created', { templateId, documentHash }, requestIp(request), header(request, 'user-agent'))
  const envelope = {
    id: envelopeId,
    recipient_name: recipientName,
    recipient_email: recipientEmail,
    business_name: businessName,
    email_subject: emailSubject,
    email_message: emailMessage,
    document_title: documentTitle,
    expires_at: expiresAt,
  }
  try {
    await sendSigningEmail(envelope, signingToken)
  } catch (error) {
    console.error('Unable to deliver signing email.', error)
    return response.status(502).json({ error: 'The document was saved as a draft, but its email could not be delivered.' })
  }
  const { error: sentError } = await supabase.from('signing_envelopes').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', envelopeId)
  assertDb(sentError, 'Unable to mark the document as sent')
  await addAuditEvent(envelopeId, 'email_sent', { recipientEmail }, requestIp(request), header(request, 'user-agent'))
  return response.status(201).json({ ok: true, envelope: { ...envelope, status: 'sent' } })
}

async function resendEnvelope(request: ApiRequest, response: ApiResponse) {
  if (!requireAdmin(request, response)) return
  if (request.method !== 'POST') return methodNotAllowed(response, ['POST'])
  if (!isSameOrigin(request)) return response.status(403).json({ error: 'Request origin is not allowed.' })
  await ensureSchema()
  const supabase = db()
  const id = text(bodyObject(request).id, 100)
  const { data: envelope, error } = await supabase.from('signing_envelopes').select('*').eq('id', id).maybeSingle()
  assertDb(error, 'Unable to load the document')
  if (!envelope) return response.status(404).json({ error: 'Document not found.' })
  if (envelope.status === 'signed' || envelope.status === 'voided') return response.status(409).json({ error: 'This document can no longer be resent.' })
  const signingToken = randomBytes(32).toString('base64url')
  await sendSigningEmail(envelope, signingToken)
  const { error: updateError } = await supabase.from('signing_envelopes').update({
    token_hash: sha256(signingToken),
    status: 'sent',
    sent_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 14 * 86_400_000).toISOString(),
  }).eq('id', id)
  assertDb(updateError, 'Unable to refresh the signing link')
  await addAuditEvent(id, 'email_resent', { recipientEmail: envelope.recipient_email }, requestIp(request), header(request, 'user-agent'))
  return response.status(200).json({ ok: true })
}

async function voidEnvelope(request: ApiRequest, response: ApiResponse) {
  if (!requireAdmin(request, response)) return
  if (request.method !== 'POST') return methodNotAllowed(response, ['POST'])
  if (!isSameOrigin(request)) return response.status(403).json({ error: 'Request origin is not allowed.' })
  await ensureSchema()
  const id = text(bodyObject(request).id, 100)
  const supabase = db()
  const { data, error } = await supabase.from('signing_envelopes')
    .update({ status: 'voided', voided_at: new Date().toISOString() })
    .eq('id', id)
    .neq('status', 'signed')
    .neq('status', 'voided')
    .select('id')
  assertDb(error, 'Unable to void the document')
  if (!data?.[0]) return response.status(409).json({ error: 'This document cannot be voided.' })
  await addAuditEvent(id, 'document_voided', {}, requestIp(request), header(request, 'user-agent'))
  return response.status(200).json({ ok: true })
}

async function pdf(request: ApiRequest, response: ApiResponse) {
  if (!requireAdmin(request, response)) return
  if (request.method !== 'GET') return methodNotAllowed(response, ['GET'])
  await ensureSchema()
  const supabase = db()
  const id = queryValue(request, 'id')
  const { data: envelope, error } = await supabase.from('signing_envelopes').select('*').eq('id', id).maybeSingle()
  assertDb(error, 'Unable to load the signed document')
  if (!envelope || envelope.status !== 'signed') return response.status(404).json({ error: 'Signed document not found.' })
  const buffer = await createSignedPdf(envelope as never)
  const filename = `${String(envelope.business_name).replace(/[^a-z0-9]+/gi, '-')}-${String(envelope.document_title).replace(/[^a-z0-9]+/gi, '-')}.pdf`
  response.setHeader('Content-Type', 'application/pdf')
  response.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
  response.status(200).send(buffer)
}

export default async function handler(request: ApiRequest, response: ApiResponse) {
  noStore(response)
  const action = queryValue(request, 'action') || 'session'
  try {
    if (action === 'request-login') return await requestLogin(request, response)
    if (action === 'verify') return verifyLogin(request, response)
    if (action === 'session') return response.status(200).json({ authenticated: Boolean(getAdminSession(request)), email: getAdminSession(request)?.email ?? null })
    if (action === 'logout') {
      if (request.method !== 'POST') return methodNotAllowed(response, ['POST'])
      clearSessionCookie(response)
      return response.status(200).json({ ok: true })
    }
    if (action === 'templates') return await templates(request, response)
    if (action === 'envelopes') return await envelopes(request, response)
    if (action === 'send') return await sendEnvelope(request, response)
    if (action === 'resend') return await resendEnvelope(request, response)
    if (action === 'void') return await voidEnvelope(request, response)
    if (action === 'pdf') return await pdf(request, response)
    return response.status(404).json({ error: 'Unknown action.' })
  } catch (error) {
    console.error('Admin API error.', error)
    return response.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}
