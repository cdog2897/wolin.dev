alter table public.signing_envelopes
  add column reservation_deposit_envelope_id text references public.signing_envelopes(id);

create unique index signing_envelopes_one_program_per_deposit
  on public.signing_envelopes (reservation_deposit_envelope_id)
  where reservation_deposit_envelope_id is not null and status <> 'voided';

alter table public.signing_envelopes drop constraint reservation_requires_start_date;
alter table public.signing_envelopes add constraint social_program_requires_start_date
  check (template_id not in ('local-virality-reservation', 'local-virality-90-day', 'local-virality-90-day-reserved') or reservation_start_date is not null);
alter table public.signing_envelopes add constraint reserved_program_requires_deposit
  check ((template_id = 'local-virality-90-day-reserved') = (reservation_deposit_envelope_id is not null));
