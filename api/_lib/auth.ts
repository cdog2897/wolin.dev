import { createHmac, timingSafeEqual } from 'node:crypto'
import type { ApiRequest, ApiResponse } from './http.js'
import { header } from './http.js'

const COOKIE_NAME = 'wolin_admin_session'

function secret() {
  const value = process.env.SESSION_SECRET
  if (!value || value.length < 32) throw new Error('SESSION_SECRET must be configured with at least 32 characters.')
  return value
}

function sign(payload: string) {
  return createHmac('sha256', secret()).update(payload).digest('base64url')
}

export function createSignedToken(email: string, ttlSeconds: number) {
  const payload = Buffer.from(JSON.stringify({ email, exp: Math.floor(Date.now() / 1000) + ttlSeconds })).toString('base64url')
  return `${payload}.${sign(payload)}`
}

export function verifySignedToken(token: string) {
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return null
  const expected = sign(payload)
  const providedBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expected)
  if (providedBuffer.length !== expectedBuffer.length || !timingSafeEqual(providedBuffer, expectedBuffer)) return null
  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { email?: string; exp?: number }
    if (!parsed.email || !parsed.exp || parsed.exp < Math.floor(Date.now() / 1000)) return null
    return { email: parsed.email, exp: parsed.exp }
  } catch {
    return null
  }
}

function parseCookies(request: ApiRequest) {
  const cookies: Record<string, string> = {}
  for (const part of header(request, 'cookie').split(';')) {
    const [rawKey, ...rawValue] = part.trim().split('=')
    if (rawKey) cookies[rawKey] = decodeURIComponent(rawValue.join('='))
  }
  return cookies
}

export function getAdminSession(request: ApiRequest) {
  const session = verifySignedToken(parseCookies(request)[COOKIE_NAME] ?? '')
  const adminEmail = (process.env.ADMIN_EMAIL || 'caleb.wolin@gmail.com').toLowerCase()
  if (!session || session.email.toLowerCase() !== adminEmail) return null
  return session
}

export function requireAdmin(request: ApiRequest, response: ApiResponse) {
  const session = getAdminSession(request)
  if (!session) {
    response.status(401).json({ error: 'Please sign in to continue.' })
    return null
  }
  return session
}

export function setSessionCookie(response: ApiResponse, token: string) {
  response.setHeader('Set-Cookie', `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`)
}

export function clearSessionCookie(response: ApiResponse) {
  response.setHeader('Set-Cookie', `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`)
}
