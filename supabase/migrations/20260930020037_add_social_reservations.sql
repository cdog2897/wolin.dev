alter table public.signing_envelopes
  add column reservation_start_date date,
  add column reservation_deposit_status text not null default 'unpaid'
    check (reservation_deposit_status in ('unpaid', 'processing', 'paid', 'failed', 'refunded')),
  add column reservation_deposit_paid_at timestamptz,
  add column reservation_deposit_amount_total bigint,
  add column reservation_deposit_session_id text,
  add column reservation_deposit_intent_id text,
  add column reservation_deposit_event_created bigint not null default 0;

create index signing_envelopes_reservation_deposit_intent_idx
  on public.signing_envelopes (reservation_deposit_intent_id)
  where reservation_deposit_intent_id is not null;

alter table public.signing_envelopes add constraint reservation_requires_start_date
  check (template_id <> 'local-virality-reservation' or reservation_start_date is not null);

-- Retain refunds that arrive before the checkout success notification.
create table public.signing_reservation_refunds (
  payment_intent_id text primary key,
  event_id text not null,
  created_at timestamptz not null default now()
);
alter table public.signing_reservation_refunds enable row level security;
