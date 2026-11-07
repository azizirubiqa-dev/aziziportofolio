// Menjalankan semua file supabase/*.sql ke database proyek lewat Supabase Management API.
// Pakai:  SUPABASE_ACCESS_TOKEN=sbp_xxx npm run db:migrate
// Token dibuat di https://supabase.com/dashboard/account/tokens (Access Tokens). Jangan dibagikan / di-commit.
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const client = await readFile(path.join(root, 'src', 'supabaseClient.js'), 'utf8');
const ref = client.match(/https:\/\/([a-z0-9]+)\.supabase\.co/)?.[1];
const token = process.env.SUPABASE_ACCESS_TOKEN;
if (!ref) { console.error('Tidak menemukan project ref di src/supabaseClient.js'); process.exit(1); }
if (!token) {
  console.error('SUPABASE_ACCESS_TOKEN belum diisi.\n1) Buat token di https://supabase.com/dashboard/account/tokens\n2) Jalankan:  SUPABASE_ACCESS_TOKEN=sbp_xxx npm run db:migrate');
  process.exit(1);
}
const dir = path.join(root, 'supabase');
const files = (await readdir(dir)).filter(f => f.endsWith('.sql')).sort();
for (const f of files) {
  const query = await readFile(path.join(dir, f), 'utf8');
  const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  const text = await res.text();
  if (!res.ok) { console.error(`✗ ${f} gagal (${res.status}): ${text}`); process.exit(1); }
  console.log(`✓ ${f}`);
}
console.log('Selesai. Muat ulang halaman admin.');
