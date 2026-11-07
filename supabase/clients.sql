-- Jalankan sekali di Supabase → SQL Editor. Membuat tabel logo brand/klien agar bisa diedit dari admin.
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text not null,
  dark_chip text not null default '',
  sort_order int not null default 0,
  created_at timestamptz default now()
);

alter table public.clients enable row level security;

drop policy if exists "public read clients" on public.clients;
drop policy if exists "admin write clients" on public.clients;
create policy "public read clients" on public.clients for select using (true);
create policy "admin write clients" on public.clients for all to authenticated using (true) with check (true);
