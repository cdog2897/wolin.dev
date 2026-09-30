export const RESERVATION_TEMPLATE_ID = 'local-virality-reservation'
export const RESERVATION_DEPOSIT = 30_000
export const RESERVATION_TOTAL = 349_900
export const RESERVATION_BALANCE = RESERVATION_TOTAL - RESERVATION_DEPOSIT
export const RESERVATION_TIMEZONE = 'America/Denver'

export function businessDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: RESERVATION_TIMEZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now)
  return ['year', 'month', 'day'].map(type => parts.find(part => part.type === type)?.value).join('-')
}

export function validStartDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T12:00:00Z`)
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
}

export function formatStartDate(value: string) {
  return new Intl.DateTimeFormat('en-US', { timeZone: RESERVATION_TIMEZONE, dateStyle: 'long' }).format(new Date(`${value}T12:00:00Z`))
}

export type ReservationSummary = {
  startDate: string
  startDateLabel: string
  state: 'deposit_due' | 'deposit_processing' | 'deposit_failed' | 'reserved' | 'balance_due' | 'balance_processing' | 'balance_failed' | 'paid' | 'review_required'
  depositAmount: number
  balanceAmount: number
  totalAmount: number
}

export function reservationSummary(envelope: Record<string, unknown>, now = new Date()): ReservationSummary | null {
  if (envelope.template_id !== RESERVATION_TEMPLATE_ID || !validStartDate(envelope.reservation_start_date)) return null
  const deposit = envelope.reservation_deposit_status
  const state: ReservationSummary['state'] = deposit === 'refunded' || envelope.payment_status === 'refunded' ? 'review_required'
    : deposit !== 'paid' ? deposit === 'processing' ? 'deposit_processing' : deposit === 'failed' ? 'deposit_failed' : 'deposit_due'
    : envelope.payment_status === 'paid' ? 'paid'
    : envelope.payment_status === 'processing' ? 'balance_processing'
    : businessDate(now) < envelope.reservation_start_date ? 'reserved'
    : envelope.payment_status === 'failed' ? 'balance_failed' : 'balance_due'
  return { startDate: envelope.reservation_start_date, startDateLabel: formatStartDate(envelope.reservation_start_date), state, depositAmount: RESERVATION_DEPOSIT, balanceAmount: RESERVATION_BALANCE, totalAmount: RESERVATION_TOTAL }
}
