alter table public.signing_envelopes
  add column payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid', 'processing', 'paid', 'failed', 'refunded')),
  add column stripe_checkout_session_id text,
  add column stripe_payment_intent_id text,
  add column stripe_subscription_id text,
  add column stripe_customer_id text,
  add column stripe_payment_link_id text,
  add column payment_amount_total bigint,
  add column payment_currency text,
  add column paid_at timestamptz,
  add column stripe_last_event_id text,
  add column stripe_last_event_created bigint not null default 0;

create index signing_envelopes_stripe_payment_intent_idx
  on public.signing_envelopes (stripe_payment_intent_id)
  where stripe_payment_intent_id is not null;

create index signing_envelopes_stripe_subscription_idx
  on public.signing_envelopes (stripe_subscription_id)
  where stripe_subscription_id is not null;
