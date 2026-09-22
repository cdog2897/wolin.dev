import type { IncomingMessage, ServerResponse } from 'node:http'

export type ApiRequest = IncomingMessage & {
  body?: unknown
  query?: Record<string, string | string[] | undefined>
}

export type ApiResponse = ServerResponse & {
  status: (code: number) => ApiResponse
  json: (body: unknown) => void
  send: (body: string | Buffer) => void
}

export function text(value: unknown, max = 500) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

export function bodyObject(request: ApiRequest) {
  if (request.body && typeof request.body === 'object') {
    return request.body as Record<string, unknown>
  }
  if (typeof request.body === 'string') {
    try {
      return JSON.parse(request.body) as Record<string, unknown>
    } catch {
      return {}
    }
  }
  return {}
}

export function queryValue(request: ApiRequest, key: string) {
  const fromQuery = request.query?.[key]
  if (Array.isArray(fromQuery)) return fromQuery[0] ?? ''
  if (fromQuery) return fromQuery
  const url = new URL(request.url ?? '/', 'http://localhost')
  return url.searchParams.get(key) ?? ''
}

export function header(request: ApiRequest, key: string) {
  const value = request.headers[key.toLowerCase()]
  return Array.isArray(value) ? value[0] ?? '' : value ?? ''
}

export function requestIp(request: ApiRequest) {
  return header(request, 'x-forwarded-for').split(',')[0]?.trim() || header(request, 'x-real-ip') || 'unknown'
}

export function isSameOrigin(request: ApiRequest) {
  const origin = header(request, 'origin')
  const host = header(request, 'x-forwarded-host') || header(request, 'host')
  if (!origin || !host) return false
  try {
    return new URL(origin).host === host.split(',')[0]?.trim()
  } catch {
    return false
  }
}

export function noStore(response: ApiResponse) {
  response.setHeader('Cache-Control', 'no-store, max-age=0')
  response.setHeader('X-Content-Type-Options', 'nosniff')
  response.setHeader('Referrer-Policy', 'same-origin')
}

export function methodNotAllowed(response: ApiResponse, allowed: string[]) {
  response.setHeader('Allow', allowed.join(', '))
  return response.status(405).json({ error: 'Method not allowed.' })
}
