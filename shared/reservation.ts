export const RESERVATION_TEMPLATE_ID = 'local-virality-reservation'
export const RESERVED_PROGRAM_TEMPLATE_ID = 'local-virality-90-day-reserved'
export const FULL_PROGRAM_TEMPLATE_ID = 'local-virality-90-day'
export const START_DATE_TEMPLATE_IDS = [RESERVATION_TEMPLATE_ID, RESERVED_PROGRAM_TEMPLATE_ID, FULL_PROGRAM_TEMPLATE_ID]
export function isProgramTemplate(id: unknown) { return id === RESERVED_PROGRAM_TEMPLATE_ID || id === FULL_PROGRAM_TEMPLATE_ID }
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
  kind: 'deposit' | 'program'
  startDate: string
  startDateLabel: string
  state: 'deposit_due' | 'deposit_processing' | 'deposit_failed' | 'reserved' | 'balance_due' | 'balance_processing' | 'balance_failed' | 'paid' | 'review_required'
  depositAmount: number
  balanceAmount: number
  totalAmount: number
}

export function reservationSummary(envelope: Record<string, unknown>, now = new Date()): ReservationSummary | null {
  if (!START_DATE_TEMPLATE_IDS.includes(String(envelope.template_id)) || !validStartDate(envelope.reservation_start_date)) return null
  const isDeposit = envelope.template_id === RESERVATION_TEMPLATE_ID
  const deposit = envelope.reservation_deposit_status
  const state: ReservationSummary['state'] = deposit === 'refunded' || envelope.payment_status === 'refunded' ? 'review_required'
    : isDeposit ? envelope.payment_status === 'paid' ? 'reserved' : envelope.payment_status === 'processing' ? 'deposit_processing' : envelope.payment_status === 'failed' ? 'deposit_failed' : 'deposit_due'
    : envelope.payment_status === 'paid' ? 'paid'
    : envelope.payment_status === 'processing' ? 'balance_processing'
    : businessDate(now) < envelope.reservation_start_date ? 'reserved'
    : envelope.payment_status === 'failed' ? 'balance_failed' : 'balance_due'
  const amount = envelope.template_id === FULL_PROGRAM_TEMPLATE_ID ? RESERVATION_TOTAL : RESERVATION_BALANCE
  return { kind: isDeposit ? 'deposit' : 'program', startDate: envelope.reservation_start_date, startDateLabel: formatStartDate(envelope.reservation_start_date), state, depositAmount: RESERVATION_DEPOSIT, balanceAmount: amount, totalAmount: isDeposit ? RESERVATION_DEPOSIT : amount }
}
