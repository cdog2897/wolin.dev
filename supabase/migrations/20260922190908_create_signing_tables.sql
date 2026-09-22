create table if not exists public.signing_templates (
  id text primary key,
  name text not null check (char_length(name) between 1 and 160),
  package_name text not null check (char_length(package_name) between 1 and 100),
  price text not null check (char_length(price) between 1 and 50),
  subject text not null check (char_length(subject) between 1 and 200),
  body text not null check (char_length(body) between 100 and 40000),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.signing_envelopes (
  id text primary key,
  template_id text references public.signing_templates(id) on delete set null,
  recipient_name text not null check (char_length(recipient_name) between 1 and 160),
  recipient_email text not null check (char_length(recipient_email) between 3 and 254),
  business_name text not null check (char_length(business_name) between 1 and 200),
  email_subject text not null check (char_length(email_subject) between 1 and 200),
  email_message text not null default '' check (char_length(email_message) <= 2000),
  document_title text not null,
  document_body text not null,
  document_hash text not null check (char_length(document_hash) = 64),
  token_hash text not null unique check (char_length(token_hash) = 64),
  status text not null default 'draft' check (status in ('draft', 'sent', 'viewed', 'signed', 'voided', 'expired')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  sent_at timestamptz,
  viewed_at timestamptz,
  signed_at timestamptz,
  voided_at timestamptz,
  signature_name text check (signature_name is null or char_length(signature_name) between 1 and 160),
  signature_type text check (signature_type is null or signature_type in ('typed', 'drawn')),
  signature_data text,
  signature_hash text check (signature_hash is null or char_length(signature_hash) = 64),
  signer_ip text,
  signer_user_agent text,
  consent_text text
);

create index if not exists signing_envelopes_status_idx on public.signing_envelopes(status);
create index if not exists signing_envelopes_created_idx on public.signing_envelopes(created_at desc);

create table if not exists public.signing_audit_events (
  id text primary key,
  envelope_id text not null references public.signing_envelopes(id) on delete cascade,
  event_type text not null,
  detail jsonb not null default '{}'::jsonb,
  ip text,
  user_agent text,
  previous_hash text check (previous_hash is null or char_length(previous_hash) = 64),
  event_hash text not null check (char_length(event_hash) = 64),
  created_at timestamptz not null default now()
);

create index if not exists signing_audit_envelope_idx on public.signing_audit_events(envelope_id, created_at, id);

alter table public.signing_templates enable row level security;
alter table public.signing_envelopes enable row level security;
alter table public.signing_audit_events enable row level security;

revoke all on table public.signing_templates from anon, authenticated;
revoke all on table public.signing_envelopes from anon, authenticated;
revoke all on table public.signing_audit_events from anon, authenticated;

grant all on table public.signing_templates to service_role;
grant all on table public.signing_envelopes to service_role;
grant all on table public.signing_audit_events to service_role;

comment on table public.signing_templates is 'Server-only reusable Wolin agreement templates.';
comment on table public.signing_envelopes is 'Immutable agreement snapshots and signer evidence; access is restricted to server functions.';
comment on table public.signing_audit_events is 'Append-only tamper-evident signing event chain; access is restricted to server functions.';
