alter table public.signing_envelopes
  add column installments_paid integer not null default 0 check (installments_paid >= 0),
  add column stripe_subscription_schedule_id text;
