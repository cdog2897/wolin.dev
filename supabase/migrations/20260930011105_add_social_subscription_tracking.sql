alter table public.signing_envelopes
  add column stripe_subscription_status text,
  add column subscription_current_period_end timestamptz,
  add column subscription_cancel_at_period_end boolean not null default false,
  add column subscription_last_event_created bigint not null default 0,
  add column stripe_last_invoice_id text,
  add column stripe_last_invoice_status text,
  add column last_invoice_amount_total bigint,
  add column last_invoice_paid_at timestamptz,
  add column invoice_last_event_created bigint not null default 0;
