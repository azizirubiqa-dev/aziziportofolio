-- Pastikan admin (user yang login) boleh menambah/mengubah/MENGHAPUS data di semua tabel konten.
do $$
declare t text;
begin
  foreach t in array array['projects','experience','categories','awards','certificates','site_settings'] loop
    if to_regclass('public.' || t) is not null then
      execute format('alter table public.%I enable row level security', t);
      execute format('drop policy if exists "public read %s" on public.%I', t, t);
      execute format('drop policy if exists "admin write %s" on public.%I', t, t);
      execute format('create policy "public read %s" on public.%I for select using (true)', t, t);
      execute format('create policy "admin write %s" on public.%I for all to authenticated using (true) with check (true)', t, t);
    end if;
  end loop;
end $$;
