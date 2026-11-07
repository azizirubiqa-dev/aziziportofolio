-- Jalankan sekali di Supabase → SQL Editor. Membuat tabel Toolkit & Process agar bisa diedit dari admin.
create table if not exists public.tools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon_url text not null,
  sort_order int not null default 0,
  created_at timestamptz default now()
);
create table if not exists public.process_steps (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  tags text,
  sort_order int not null default 0,
  created_at timestamptz default now()
);

alter table public.tools enable row level security;
alter table public.process_steps enable row level security;

drop policy if exists "public read tools" on public.tools;
drop policy if exists "admin write tools" on public.tools;
create policy "public read tools" on public.tools for select using (true);
create policy "admin write tools" on public.tools for all to authenticated using (true) with check (true);

drop policy if exists "public read process_steps" on public.process_steps;
drop policy if exists "admin write process_steps" on public.process_steps;
create policy "public read process_steps" on public.process_steps for select using (true);
create policy "admin write process_steps" on public.process_steps for all to authenticated using (true) with check (true);
