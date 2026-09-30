grant select, insert, update on public.signing_reservation_refunds to service_role;
comment on table public.signing_reservation_refunds is 'Server-only Stripe refund markers for private 90-day reservations.';
