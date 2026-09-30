import type { ReservationSummary } from '../../shared/reservation'

export default function ReservationNotice({ reservation, onRefresh, refreshing, completed }: { reservation: ReservationSummary; onRefresh: () => void; refreshing: boolean; completed: boolean }) {
  const deposit = reservation.kind === 'deposit'
  const amount = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(reservation.totalAmount / 100)
  const message = reservation.state === 'review_required' ? 'A payment or deposit credit was refunded. Contact Caleb before starting service.'
    : reservation.state === 'paid' ? 'Your program payment is confirmed. Caleb will coordinate onboarding and confirm your service start.'
    : deposit && reservation.state === 'reserved' ? 'Your deposit is confirmed. Caleb will send a separate $3,199 program agreement and its own Stripe payment link.'
    : reservation.state === 'reserved' ? 'Your program checkout opens on the planned start date. Return to this program agreement’s secure link then.'
    : reservation.state.endsWith('processing') ? 'Stripe is processing this payment. Refresh to check for confirmation.'
    : reservation.state.endsWith('failed') ? 'The payment did not complete. Retry this agreement’s checkout.'
    : deposit ? 'Pay the $300 non-refundable deposit after signing to confirm your reservation.'
    : `Pay the ${amount} one-time program fee after signing.`
  return <section className="ws-reservation-notice" aria-label={deposit ? 'Deposit reservation details' : 'Program start details'}>
    <span>Planned program start</span><strong>{reservation.startDateLabel}</strong><small>America/Denver · {amount} before tax</small>
    <p>{message}</p>
    <p className="ws-reservation-fine">{deposit ? 'This document covers only the reservation deposit. The 90-day service requires a separately signed program agreement and payment.' : 'Service begins after payment, access, and onboarding are complete.'} No automatic or recurring charge.</p>
    {completed && <button type="button" onClick={onRefresh} disabled={refreshing}>{refreshing ? 'Checking…' : 'Refresh payment status'}</button>}
  </section>
}
