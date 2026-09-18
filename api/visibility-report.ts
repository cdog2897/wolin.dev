/// <reference types="node" />

type RequestBody = {
  name?: unknown
  email?: unknown
  website?: unknown
  phone?: unknown
  company?: unknown
}

type ApiRequest = {
  method?: string
  headers: Record<string, string | string[] | undefined>
  body?: RequestBody | string
}

type ApiResponse = {
  status: (statusCode: number) => ApiResponse
  setHeader: (name: string, value: string) => void
  json: (body: Record<string, unknown>) => void
}

const MAX_FIELD_LENGTH = 300

function getHeader(request: ApiRequest, name: string) {
  const value = request.headers[name] ?? request.headers[name.toLowerCase()]
  return Array.isArray(value) ? value[0] : value
}

function getText(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function isAllowedOrigin(request: ApiRequest) {
  const origin = getHeader(request, 'origin')
  const host = getHeader(request, 'x-forwarded-host') ?? getHeader(request, 'host')

  if (!origin || !host) return false

  try {
    return new URL(origin).host === host.split(',')[0]?.trim()
  } catch {
    return false
  }
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidWebsite(website: string) {
  try {
    const url = new URL(website)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export default async function handler(request: ApiRequest, response: ApiResponse) {
  response.setHeader('Cache-Control', 'no-store')

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return response.status(405).json({ error: 'Method not allowed.' })
  }

  if (!isAllowedOrigin(request)) {
    return response.status(403).json({ error: 'Request origin is not allowed.' })
  }

  let body: RequestBody
  try {
    body = typeof request.body === 'string' ? JSON.parse(request.body) as RequestBody : request.body ?? {}
  } catch {
    return response.status(400).json({ error: 'Invalid request body.' })
  }

  // Bots commonly fill fields that are visually hidden from real visitors.
  if (getText(body.company)) {
    return response.status(200).json({ ok: true })
  }

  const name = getText(body.name)
  const email = getText(body.email)
  const website = getText(body.website)
  const phone = getText(body.phone)
  const fields = [name, email, website, phone]

  if (fields.some((field) => !field || field.length > MAX_FIELD_LENGTH)) {
    return response.status(400).json({ error: 'Please complete every field.' })
  }

  if (!isValidEmail(email) || !isValidWebsite(website)) {
    return response.status(400).json({ error: 'Please enter a valid email and website.' })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('RESEND_API_KEY is not configured.')
    return response.status(500).json({ error: 'Email service is not configured.' })
  }

  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safeWebsite = escapeHtml(website)
  const safePhone = escapeHtml(phone)

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Wolin Visibility Report <reports@wolin.dev>',
      to: ['caleb.wolin@gmail.com'],
      reply_to: email,
      subject: `New visibility report request — ${name}`,
      text: [
        'A new client requested a visibility report.',
        '',
        `Name: ${name}`,
        `Email: ${email}`,
        `Business website: ${website}`,
        `Phone: ${phone}`,
      ].join('\n'),
      html: `
        <h1>New visibility report request</h1>
        <table cellpadding="8" cellspacing="0" style="border-collapse: collapse; font-family: sans-serif;">
          <tr><th align="left">Name</th><td>${safeName}</td></tr>
          <tr><th align="left">Email</th><td><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
          <tr><th align="left">Business website</th><td><a href="${safeWebsite}">${safeWebsite}</a></td></tr>
          <tr><th align="left">Phone</th><td><a href="tel:${safePhone}">${safePhone}</a></td></tr>
        </table>
      `,
    }),
  })

  if (!resendResponse.ok) {
    const resendError = await resendResponse.text()
    console.error('Resend rejected a visibility report email.', resendResponse.status, resendError)
    return response.status(502).json({ error: 'Unable to send the report request.' })
  }

  return response.status(200).json({ ok: true })
}
