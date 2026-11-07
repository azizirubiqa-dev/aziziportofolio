-- Kolom teks situs (judul section, label tombol, kartu statistik) yang diedit lewat admin → menu "Teks Situs".
alter table public.site_settings add column if not exists texts jsonb not null default '{}'::jsonb;
