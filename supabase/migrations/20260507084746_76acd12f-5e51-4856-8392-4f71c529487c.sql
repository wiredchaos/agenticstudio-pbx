create table public.early_access (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text not null default 'landing',
  created_at timestamptz not null default now()
);
alter table public.early_access enable row level security;
create policy "anon can request early access"
  on public.early_access for insert
  to anon, authenticated
  with check (
    email is not null
    and length(email) between 5 and 320
    and email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  );

create table public.praxis_demo_runs (
  id uuid primary key default gen_random_uuid(),
  ip_hash text not null,
  prompt text not null,
  output text,
  created_at timestamptz not null default now()
);
alter table public.praxis_demo_runs enable row level security;
create index praxis_demo_runs_ip_recent on public.praxis_demo_runs (ip_hash, created_at desc);