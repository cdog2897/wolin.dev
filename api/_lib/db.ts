import { createHash, randomUUID } from 'node:crypto'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { defaultTemplates } from './default-templates.js'

let client: SupabaseClient | null = null
let schemaPromise: Promise<void> | null = null

export function db() {
  if (client) return client
  const url = process.env.SUPABASE_URL
  const secretKey = process.env.SUPABASE_SECRET_KEY
  if (!url || !secretKey) throw new Error('SUPABASE_URL and SUPABASE_SECRET_KEY must be configured.')
  client = createClient(url, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
  return client
}

export function sha256(value: string) {
  return createHash('sha256').update(value).digest('hex')
}

export function assertDb(error: { message: string } | null, context: string) {
  if (error) throw new Error(`${context}: ${error.message}`)
}

export async function ensureSchema() {
  if (schemaPromise) return schemaPromise
  schemaPromise = (async () => {
    const supabase = db()
    const { error: checkError } = await supabase.from('signing_templates').select('id').limit(1)
    assertDb(checkError, 'Signing schema is unavailable')
    const rows = defaultTemplates.map((template) => ({
      id: template.id,
      name: template.name,
      package_name: template.packageName,
      price: template.price,
      subject: template.subject,
      body: template.body,
    }))
    const { error: seedError } = await supabase.from('signing_templates').upsert(rows, { onConflict: 'id', ignoreDuplicates: true })
    assertDb(seedError, 'Unable to seed signing templates')
  })().catch((error) => {
    schemaPromise = null
    throw error
  })
  return schemaPromise
}

export async function addAuditEvent(
  envelopeId: string,
  eventType: string,
  detail: Record<string, unknown>,
  ip = '',
  userAgent = '',
) {
  const supabase = db()
  const { data: previousRows, error: previousError } = await supabase
    .from('signing_audit_events')
    .select('event_hash')
    .eq('envelope_id', envelopeId)
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
    .limit(1)
  assertDb(previousError, 'Unable to read the audit chain')
  const previousHash = String(previousRows?.[0]?.event_hash ?? '')
  const createdAt = new Date().toISOString()
  const eventHash = sha256([envelopeId, eventType, JSON.stringify(detail), ip, userAgent, previousHash, createdAt].join('|'))
  const { error } = await supabase.from('signing_audit_events').insert({
    id: randomUUID(),
    envelope_id: envelopeId,
    event_type: eventType,
    detail,
    ip,
    user_agent: userAgent,
    previous_hash: previousHash || null,
    event_hash: eventHash,
    created_at: createdAt,
  })
  assertDb(error, 'Unable to append the audit event')
  return eventHash
}
