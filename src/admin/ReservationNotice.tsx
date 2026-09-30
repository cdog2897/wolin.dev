import type { ReservationSummary } from '../../shared/reservation'

const messages: Record<ReservationSummary['state'], string> = {
  deposit_due: 'Pay the $300 non-refundable deposit after signing to confirm your reservation.',
  deposit_failed: 'The deposit did not complete. Retry checkout to confirm your reservation.',
  deposit_processing: 'Stripe is processing your $300 deposit. Your reservation will be confirmed when payment succeeds.',
  reserved: 'Your deposit is confirmed. Return to this secure link on the planned start date to pay the $3,199 balance, including your $300 credit.',
  balance_due: 'Your $300 deposit credit is included. Pay the remaining $3,199 to complete your program purchase.',
  balance_failed: 'The balance payment did not complete. Your $300 deposit credit is still included when you retry.',
  balance_processing: 'Stripe is processing your balance payment. Refresh to check for confirmation.',
  paid: 'Both payments are confirmed. Caleb will coordinate onboarding and confirm your service start.',
  review_required: 'A payment was refunded. Contact Caleb to resolve your reservation before starting service.',
}

export default function ReservationNotice({ reservation, onRefresh, refreshing, completed }: { reservation: ReservationSummary; onRefresh: () => void; refreshing: boolean; completed: boolean }) {
  return <section className="ws-reservation-notice" aria-label="Reservation details">
    <span>Planned program start</span><strong>{reservation.startDateLabel}</strong><small>America/Denver · $3,499 total before tax</small>
    <p>{messages[reservation.state]}</p>
    <p className="ws-reservation-fine">$300 deposit + $3,199 balance. No automatic or recurring charge. Service begins after payment, access, and onboarding are complete.</p>
    {completed && <button type="button" onClick={onRefresh} disabled={refreshing}>{refreshing ? 'Checking…' : 'Refresh payment status'}</button>}
  </section>
}
