import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, CheckCircle2, AlertTriangle, Film, User, BookOpen, Briefcase, Trophy, LogOut, Plus, Pencil, Trash2, X, Loader2, Search, ChevronDown, Clapperboard, Megaphone, Menu, Upload, FileText, Phone, ChevronUp, Wrench, ListOrdered, Building2 } from 'lucide-react';
import { DEFAULT_TOOLS, DEFAULT_STEPS, DEFAULT_CLIENTS } from './toolkit.js';
import { DEFAULT_TEXTS, TEXT_GROUPS } from './siteTexts.js';
import { heroToHtml, heroForDisplay, sanitizeHero } from './heroText.js';
import { supabase } from './supabaseClient';
import './admin.css';
import { toHtml, sanitizeHtml } from './experience.js';

const emptyProject = { type: 'youtube', title: '', description: '', media: '', role: '', year: '', category: 'Film', image: '' };

const input = 'w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 shadow-sm focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none transition';
const label = 'flex flex-col gap-1.5 text-xs font-medium text-slate-500';
const card = 'rounded-2xl border border-slate-200 bg-white p-6 shadow-sm';
const btnPrimary = 'inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-dark transition disabled:opacity-50 disabled:cursor-not-allowed';
const btnGhost = 'inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition';
const btnDanger = 'inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition';
const btnIcon = 'inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition';

// Logo "Z" biru (sama dengan ikon tab situs)
function ZMark({ size = 44, className = '' }) {
  return <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true"><defs><linearGradient id="zg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#4da3ff"/><stop offset="1" stopColor="#0a84ff"/></linearGradient></defs><rect width="64" height="64" rx="15" fill="url(#zg)"/><path d="M18 17h28v7L28 40h19v7H17v-7l18-16H18z" fill="#fff"/></svg>;
}

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(0);
  const submit = async e => {
    e.preventDefault();
    setLoading(true); setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError(/invalid/i.test(error.message) ? 'Email atau password salah. Coba lagi.' : error.message); setShake(n => n + 1); }
  };
  const field = 'w-full rounded-xl border border-slate-200 bg-white/80 py-3 pl-11 pr-11 text-sm text-slate-800 placeholder:text-slate-400 shadow-sm transition focus:border-brand focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand/15';
  return <div className="login-bg relative flex min-h-screen items-center justify-center overflow-hidden px-4">
    <div className="login-orb login-orb-a"/><div className="login-orb login-orb-b"/>
    <form key={shake} onSubmit={submit} className={`relative w-full max-w-[400px] rounded-[28px] border border-white/70 bg-white/75 p-8 shadow-[0_40px_90px_-40px_rgba(20,60,160,.45)] backdrop-blur-xl ${shake ? 'login-shake' : 'login-rise'}`}>
      <div className="mb-7 text-center">
        <ZMark size={56} className="mx-auto mb-4 drop-shadow-[0_12px_20px_rgba(10,132,255,.35)]"/>
        <h1 className="text-[22px] font-extrabold tracking-tight text-slate-900">AZIZI<span className="text-brand">.</span> Admin</h1>
        <p className="mt-1 text-sm text-slate-500">Masuk untuk mengelola portofolio</p>
      </div>
      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-500">Email
          <span className="relative block"><Mail size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/><input className={field} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@email.com" autoComplete="username" required autoFocus/></span>
        </label>
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-500">Password
          <span className="relative block"><Lock size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/><input className={field} type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Masukkan password" autoComplete="current-password" required/>
            <button type="button" onClick={() => setShow(v => !v)} aria-label={show ? 'Sembunyikan password' : 'Tampilkan password'} aria-pressed={show} className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-brand">{show ? <EyeOff size={18}/> : <Eye size={18}/>}</button></span>
        </label>
        {error && <p role="alert" className="flex items-start gap-2 rounded-xl bg-rose-50 px-3.5 py-2.5 text-sm text-rose-600"><AlertTriangle size={16} className="mt-0.5 flex-shrink-0"/>{error}</p>}
        <button type="submit" disabled={loading} className="mt-1 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0a84ff] to-[#5e5ce6] text-sm font-bold text-white shadow-[0_14px_28px_-12px_rgba(10,100,255,.7)] transition hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60">{loading && <Loader2 size={16} className="animate-spin"/>}{loading ? 'Masuk…' : 'Masuk'}</button>
      </div>
      <a href="./index.html" className="mt-6 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-500 transition hover:text-brand"><ArrowLeft size={14}/>Kembali ke situs</a>
    </form>
  </div>;
}

function fileDisplayName(url) {
  if (!url) return '';
  try {
    const last = decodeURIComponent(url.split('/').pop().split('?')[0]);
    return last.replace(/^\d{10,}-/, '');
  } catch { return url; }
}
const isUploadedFile = url => !!url && url.includes('/storage/v1/object/public/');

function UploadField({ label: fieldLabel, value, onChange, accept = 'image/*', placeholder, wide, required }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const handleFile = async e => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    setUploading(true); setError('');
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
    const { error: upErr } = await supabase.storage.from('media').upload(path, file, { upsert: false });
    if (upErr) { setError(upErr.message); setUploading(false); return; }
    const { data } = supabase.storage.from('media').getPublicUrl(path);
    onChange(data.publicUrl);
    setUploading(false);
  };
  const showChip = isUploadedFile(value);
  const isImage = accept.includes('image');
  return <label className={`${label} ${wide ? 'sm:col-span-2' : ''}`}>{fieldLabel}
    {isImage && value && <img src={value} alt="" className="mb-2 h-20 w-20 rounded-lg border border-slate-200 object-cover"/>}
    {showChip ? <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700">
      <FileText size={15} className="flex-shrink-0 text-slate-400"/>
      <span className="flex-1 truncate" title={value}>{fileDisplayName(value)}</span>
      <a href={value} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 text-xs font-medium text-brand hover:underline">Lihat</a>
      <button type="button" onClick={() => onChange('')} className="flex-shrink-0 text-slate-400 hover:text-rose-600"><X size={14}/></button>
    </div> : <div className="flex gap-2">
      <input className={input} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder || 'https:// atau link Google Drive, atau upload file'} required={required}/>
      <label className={`${btnGhost} cursor-pointer whitespace-nowrap flex-shrink-0`}>
        {uploading ? <Loader2 size={14} className="animate-spin"/> : <Upload size={14}/>}
        {uploading ? 'Mengunggah…' : 'Upload'}
        <input type="file" accept={accept} className="hidden" onChange={handleFile}/>
      </label>
    </div>}
    {error && <span className="text-xs text-rose-600">{error}</span>}
  </label>;
}

// ---------- Notifikasi (modal tengah) untuk berhasil / gagal ----------
let toastListener = null;
const notify = (type, title, message = '') => { if (toastListener) toastListener({ id: Date.now() + Math.random(), type, title, message }); };
const errText = e => (e && (e.message || String(e))) || 'Terjadi kesalahan tak dikenal.';
const TABLE_LABEL = { projects: 'Karya', experience: 'Pengalaman', tools: 'Tool', process_steps: 'Langkah proses', clients: 'Brand', awards: 'Award', certificates: 'Sertifikat', categories: 'Kategori' };

function ToastHost() {
  const [t, setT] = useState(null);
  useEffect(() => { toastListener = setT; return () => { toastListener = null; }; }, []);
  useEffect(() => {
    if (!t || t.type !== 'success') return;
    const id = setTimeout(() => setT(null), 2000);
    return () => clearTimeout(id);
  }, [t]);
  if (!t) return null;
  const ok = t.type === 'success';
  return <div className={`fixed inset-0 z-[300] flex items-center justify-center p-4 ${ok ? 'pointer-events-none' : 'bg-slate-900/40 backdrop-blur-sm'}`} onClick={() => !ok && setT(null)}>
    <div role={ok ? 'status' : 'alertdialog'} aria-live="assertive" key={t.id} onClick={e => e.stopPropagation()} className="toast-pop pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-2xl bg-white p-6 text-center shadow-2xl ring-1 ring-black/5">
      <span className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full ${ok ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>{ok ? <CheckCircle2 size={30}/> : <AlertTriangle size={28}/>}</span>
      <h4 className="text-base font-bold text-slate-900">{t.title}</h4>
      {t.message && <p className="mt-1 text-sm text-slate-500 break-words">{t.message}</p>}
      {!ok && <button autoFocus className={`${btnPrimary} mt-4`} onClick={() => setT(null)}>Tutup</button>}
      {ok && <span className="toast-bar absolute bottom-0 left-0 h-1 bg-emerald-500"/>}
    </div>
  </div>;
}

function SaveBar({ saving, saved, error, onSave }) {
  return <div className="mt-2 flex items-center gap-4">
    <button onClick={onSave} disabled={saving} className={btnPrimary}>{saving && <Loader2 size={15} className="animate-spin"/>}{saving ? 'Menyimpan…' : 'Simpan Perubahan'}</button>
    {saved && <span className="text-sm font-medium text-emerald-600">Tersimpan ✓</span>}
    {error && <span className="text-sm text-rose-600">{error}</span>}
  </div>;
}

function useSiteSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.from('site_settings').select('*').eq('id', 1).single().then(({ data, error }) => {
      if (!error) setSettings(data);
      setLoading(false);
    });
  }, []);
  const save = async partial => {
    const { data, error } = await supabase.from('site_settings').update(partial).eq('id', 1).select().single();
    if (!error) { setSettings(data); notify('success', 'Berhasil disimpan', 'Perubahan sudah tersimpan dan tampil di situs.'); }
    else notify('error', 'Gagal menyimpan', errText(error));
    return { data, error };
  };
  return { settings, loading, save };
}

function PageHeader({ title, subtitle }) {
  return <div className="mb-6"><h2 className="text-2xl font-bold text-slate-900">{title}</h2>{subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}</div>;
}

function ProfilPage() {
  const { settings, loading, save } = useSiteSettings();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { if (settings) setForm(settings); }, [settings]);
  if (loading || !form) return <p className="text-slate-500">Memuat…</p>;
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setSaved(false); };
  const onSave = async () => {
    setSaving(true); setError(''); setSaved(false);
    const { error } = await save({
      hero_role_line1: form.hero_role_line1, hero_role_line2: form.hero_role_line2,
      hero_description: form.hero_description, hero_location: form.hero_location,
      cv_url: form.cv_url, portrait_url: form.portrait_url,
    });
    setSaving(false);
    if (error) setError(error.message); else setSaved(true);
  };
  return <div>
    <PageHeader title="Profil & Hero" subtitle="Foto, role, deskripsi, lokasi, dan CV di section pembuka. Sapaan, nama, dan kartu statistik ada di menu “Teks Situs”."/>
    <div className={`${card} grid grid-cols-1 sm:grid-cols-2 gap-5`}>
      <label className={label}>Role baris 1<input className={input} value={form.hero_role_line1 || ''} onChange={e => set('hero_role_line1', e.target.value)}/></label>
      <label className={label}>Role baris 2<input className={input} value={form.hero_role_line2 || ''} onChange={e => set('hero_role_line2', e.target.value)}/></label>
      <HeroEditor value={form.hero_description} onChange={v => set('hero_description', v)}/>
      <label className={label}>Lokasi<input className={input} value={form.hero_location || ''} onChange={e => set('hero_location', e.target.value)}/></label>
      <UploadField label="Foto Portrait (Hero)" value={form.portrait_url} onChange={v => set('portrait_url', v)} accept="image/*" placeholder="Upload foto baru" wide/>
      <UploadField label="CV" value={form.cv_url} onChange={v => set('cv_url', v)} accept="application/pdf" placeholder="Upload file PDF, atau paste link Google Drive" wide/>
    </div>
    <SaveBar saving={saving} saved={saved} error={error} onSave={onSave}/>
  </div>;
}

function TentangPage() {
  const { settings, loading, save } = useSiteSettings();
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [education, setEducation] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [confirmNode, ask] = useConfirm();
  useEffect(() => {
    if (settings) {
      setBio(settings.about_bio || '');
      setSkills((settings.skills || []).join(', '));
      setEducation(settings.education && settings.education.length ? settings.education : [{ title: '', meta: '', text: '' }]);
    }
  }, [settings]);
  if (loading) return <p className="text-slate-500">Memuat…</p>;
  const setEdu = (i, k, v) => { setEducation(list => list.map((e, idx) => idx === i ? { ...e, [k]: v } : e)); setSaved(false); };
  const addEdu = () => setEducation(list => [...list, { title: '', meta: '', text: '' }]);
  const removeEdu = async i => {
    const row = education[i];
    const name = (row.title || '').trim() || 'baris kosong ini';
    const yes = await ask({ title: 'Hapus baris pendidikan?', message: `“${name}” akan dihapus permanen dari database dan hilang dari situs. Tindakan ini tidak bisa dibatalkan.` });
    if (!yes) return;
    const next = education.filter((_, idx) => idx !== i);
    setEducation(next);
    if (!(row.title || row.meta || row.text)) return; // baris kosong yang belum pernah disimpan
    setSaving(true); setError('');
    const { error } = await save({ skills: skills.split(',').map(x => x.trim()).filter(Boolean), education: next.filter(e => (e.title || '').trim()) });
    setSaving(false);
    if (error) setError(error.message); else setSaved(true);
  };
  const onSave = async () => {
    setSaving(true); setError(''); setSaved(false);
    const { error } = await save({ skills: skills.split(',').map(s => s.trim()).filter(Boolean), education });
    setSaving(false);
    if (error) setError(error.message); else setSaved(true);
  };
  return <div>
    <PageHeader title="Pendidikan & Skill" subtitle="Kartu “Education & skills” di section Journey: skill tags dan riwayat pendidikan. Menghapus baris langsung tersimpan; perubahan lain disimpan dengan tombol Simpan."/>
    {confirmNode}
    <div className={`${card} flex flex-col gap-5 mb-5`}>
      <label className={label}>Skill tags (pisah pakai koma)<input className={input} value={skills} onChange={e => { setSkills(e.target.value); setSaved(false); }} placeholder="Video Editing, Color Grading, Storytelling"/></label>
    </div>
    <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">Pendidikan</h3>
    <div className="flex flex-col gap-3 mb-4">
      {education.map((e, i) => <div className={card} key={i}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
          <label className={label}>Nama Sekolah/Tempat<input className={input} value={e.title} onChange={ev => setEdu(i, 'title', ev.target.value)}/></label>
          <label className={label}>Keterangan (jurusan/tahun)<input className={input} value={e.meta} onChange={ev => setEdu(i, 'meta', ev.target.value)}/></label>
          <label className={`${label} sm:col-span-2`}>Deskripsi<input className={input} value={e.text} onChange={ev => setEdu(i, 'text', ev.target.value)}/></label>
        </div>
        <button type="button" className={btnDanger} onClick={() => removeEdu(i)}><Trash2 size={13}/>Hapus Baris</button>
      </div>)}
    </div>
    <button type="button" className={btnGhost} onClick={addEdu}><Plus size={15}/>Tambah Pendidikan</button>
    <SaveBar saving={saving} saved={saved} error={error} onSave={onSave}/>
  </div>;
}

// Dialog konfirmasi / pemberitahuan di dalam halaman (tidak memakai confirm bawaan browser yang bisa diblokir)
function useConfirm() {
  const [dlg, setDlg] = useState(null);
  const ask = opts => new Promise(resolve => setDlg({ ...opts, resolve }));
  const close = v => { dlg?.resolve(v); setDlg(null); };
  const node = dlg ? <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm" onClick={() => close(false)}>
    <div role="alertdialog" aria-modal="true" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
      <div className="mb-3 flex items-start gap-3">
        <span className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${dlg.info ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'}`}>{dlg.info ? <X size={18}/> : <Trash2 size={18}/>}</span>
        <div><h4 className="text-base font-bold text-slate-900">{dlg.title}</h4><p className="mt-1 text-sm text-slate-500">{dlg.message}</p></div>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        {!dlg.info && <button autoFocus className={btnGhost} onClick={() => close(false)}>Batal</button>}
        <button autoFocus={!!dlg.info} className={dlg.info ? btnPrimary : 'inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-700 transition'} onClick={() => close(true)}>{dlg.info ? 'Mengerti' : (dlg.confirmLabel || 'Ya, hapus')}</button>
      </div>
    </div>
  </div> : null;
  return [node, ask];
}

function ListCRUD({ table, title, fields, renderSummary, renderMeta, renderThumb, emptyItem, orderBy = 'sort_order', onChanged, reorder, seed, setupSql }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirmNode, ask] = useConfirm();
  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from(table).select('*').order(orderBy, { ascending: true });
    if (!error) { setItems(data || []); setLoadError(''); } else setLoadError(error.message);
    setLoading(false);
    onChanged && onChanged();
  };
  useEffect(() => { load(); }, []);
  const nextOrder = items.length ? Math.max(...items.map(i => i.sort_order || 0)) + 1 : 0;
  const move = async (i, d) => {
    const a = items[i], b = items[i + d]; if (!a || !b) return;
    setBusy(true);
    const ao = a.sort_order ?? i, bo = b.sort_order ?? (i + d);
    const [sa, sb] = ao === bo ? [i + d, i] : [bo, ao];
    const r1 = await supabase.from(table).update({ sort_order: sa }).eq('id', a.id);
    const r2 = await supabase.from(table).update({ sort_order: sb }).eq('id', b.id);
    setBusy(false);
    if (r1.error || r2.error) { notify('error', 'Gagal mengubah urutan', errText(r1.error || r2.error)); return; }
    notify('success', 'Urutan diperbarui', 'Urutan baru langsung tampil di situs.'); load();
  };
  const seedNow = async () => {
    setBusy(true);
    const { error } = await supabase.from(table).insert(seed.map((r, i) => ({ ...r, sort_order: i })));
    setBusy(false);
    if (error) notify('error', 'Gagal mengisi data awal', errText(error)); else { notify('success', 'Data awal berhasil dimasukkan', 'Sekarang Anda bisa mengubah, menambah, dan mengurutkannya.'); load(); }
  };
  const remove = async item => {
    const name = (renderSummary && renderSummary(item)) || 'item ini';
    const yes = await ask({ title: 'Hapus data ini?', message: `“${String(name).slice(0, 90)}” akan dihapus permanen dari database dan hilang dari situs. Tindakan ini tidak bisa dibatalkan.` });
    if (!yes) return;
    const { data, error } = await supabase.from(table).delete().eq('id', item.id).select('id');
    if (error) { notify('error', 'Gagal menghapus', errText(error)); return; }
    if (!data || data.length === 0) { notify('error', 'Tidak bisa dihapus', 'Database menolak penghapusan (izin hapus untuk tabel ini belum ada). Jalankan “npm run db:migrate” di terminal, lalu coba lagi.'); return; }
    notify('success', 'Berhasil dihapus', `${TABLE_LABEL[table] || 'Data'} sudah dihapus dari database dan situs.`);
    load();
  };
  if (loadError && setupSql) return <div className={`${card} border-amber-300 bg-amber-50`}>
    <p className="mb-1 text-sm font-semibold text-amber-900">Tabel “{table}” belum dibuat di Supabase</p>
    <p className="mb-3 text-xs text-amber-800">Buka Supabase → SQL Editor, tempel SQL di bawah, klik Run, lalu muat ulang halaman ini. Cukup dilakukan sekali.</p>
    <pre className="max-h-56 overflow-auto rounded-lg bg-slate-900 p-3 text-[11px] leading-relaxed text-slate-100 whitespace-pre-wrap">{setupSql}</pre>
    <div className="mt-3 flex gap-2"><button className={btnPrimary} onClick={() => { try { navigator.clipboard.writeText(setupSql); } catch {} }}>Salin SQL</button><button className={btnGhost} onClick={load}>Saya sudah menjalankannya, muat ulang</button></div>
  </div>;
  return <div>
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-lg font-bold text-slate-900">{title} <span className="text-slate-400 font-normal">({items.length})</span></h3>
      <button onClick={() => setEditing(editing === 'new' ? null : 'new')} className={btnPrimary}>{editing === 'new' ? <X size={15}/> : <Plus size={15}/>}{editing === 'new' ? 'Batal' : 'Tambah'}</button>
    </div>
    {confirmNode}
    {editing === 'new' && <ItemForm table={table} fields={fields} emptyItem={emptyItem} extra={reorder ? { sort_order: nextOrder } : undefined} onDone={() => { setEditing(null); load(); }}/>}
    {typeof editing === 'object' && editing && <ItemForm table={table} fields={fields} initial={editing} emptyItem={emptyItem} onDone={() => { setEditing(null); load(); }}/>}
    {!editing && (loading ? <p className="text-slate-500">Memuat…</p> : <div className="flex flex-col gap-2">
      {items.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 bg-white p-5 text-center"><p className="text-sm text-slate-500">Belum ada data.</p>{seed && <button className={`${btnPrimary} mt-3`} disabled={busy} onClick={seedNow}>{busy && <Loader2 size={15} className="animate-spin"/>}Isi dengan data awal situs</button>}</div>}
      {items.map((item, idx) => <div key={item.id} className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3">
        {reorder && <div className="flex flex-shrink-0 flex-col"><button disabled={busy || idx === 0} onClick={() => move(idx, -1)} className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-25" aria-label="Naik"><ChevronUp size={16}/></button><button disabled={busy || idx === items.length - 1} onClick={() => move(idx, 1)} className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-25" aria-label="Turun"><ChevronDown size={16}/></button></div>}
        {renderThumb && renderThumb(item)}
        <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-800">{renderSummary(item)}</p>{renderMeta && <p className="text-xs text-slate-400">{renderMeta(item)}</p>}</div>
        <div className="flex flex-shrink-0 gap-2">
          <button onClick={() => setEditing(item)} className={btnIcon}><Pencil size={13}/>Edit</button>
          <button onClick={() => remove(item)} className={btnDanger}><Trash2 size={13}/>Hapus</button>
        </div>
      </div>)}
    </div>)}
  </div>;
}

// Editor deskripsi hero: tebal, miring, garis bawah, warna teks, sorot (semua warna)
const PALETTE = ['#0a84ff', '#0a6bff', '#5e5ce6', '#af52de', '#ff2d55', '#ff3b30', '#ff9500', '#ffcc00', '#34c759', '#30b0c7', '#0f172a', '#64748b', '#ffffff'];
function ColorMenu({ label: lbl, icon, onPick, onSave }) {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState('#0a84ff');
  const box = useRef(null);
  useEffect(() => {
    if (!open) return;
    const off = e => { if (box.current && !box.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', off); return () => document.removeEventListener('mousedown', off);
  }, [open]);
  const pick = c => { onPick(c); setOpen(false); };
  return <div className="relative" ref={box}>
    <button type="button" className="inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-200" onMouseDown={e => { e.preventDefault(); onSave(); }} onClick={() => setOpen(v => !v)} aria-expanded={open}>{icon}{lbl}<ChevronDown size={12}/></button>
    {open && <div className="absolute left-0 top-9 z-30 w-56 rounded-xl border border-slate-200 bg-white p-3 shadow-xl" onMouseDown={e => { if (e.target.tagName !== 'INPUT') e.preventDefault(); }}>
      <div className="grid grid-cols-7 gap-1.5">{PALETTE.map(c => <button key={c} type="button" title={c} onClick={() => pick(c)} className="h-6 w-6 rounded-full border border-slate-200 transition hover:scale-110" style={{ background: c }}/>)}</div>
      <label className="mt-3 flex items-center justify-between gap-2 text-[11px] font-semibold text-slate-500">Warna bebas
        <span className="flex items-center gap-2"><input type="color" value={custom} onChange={e => setCustom(e.target.value)} className="h-7 w-9 cursor-pointer rounded border border-slate-200 bg-white p-0.5"/><button type="button" onClick={() => pick(custom)} className="rounded-md bg-brand px-2.5 py-1 text-[11px] font-bold text-white">Pakai</button></span>
      </label>
    </div>}
  </div>;
}

function HeroEditor({ value, onChange }) {
  const ref = useRef(null);
  const saved = useRef(null);
  const [html, setHtml] = useState(() => heroToHtml(value));
  useEffect(() => { if (ref.current) ref.current.innerHTML = heroToHtml(value); }, []);
  const emit = () => { const h = sanitizeHero(ref.current.innerHTML); setHtml(h); onChange(h); };
  const sel = () => { const s = window.getSelection(); return s && s.rangeCount && ref.current.contains(s.anchorNode) ? s : null; };
  const remember = () => { const s = sel(); if (s) saved.current = s.getRangeAt(0).cloneRange(); };
  const restore = () => { ref.current.focus(); if (saved.current) { const s = window.getSelection(); s.removeAllRanges(); s.addRange(saved.current); } };
  const needSelection = () => { const s = sel(); if (!s || s.getRangeAt(0).collapsed) { notify('error', 'Blok tulisannya dulu', 'Seret kursor untuk memilih kata yang ingin diubah, lalu klik tombolnya.'); return false; } return true; };
  const cmd = (name, arg) => { restore(); document.execCommand('styleWithCSS', false, true); document.execCommand(name, false, arg); emit(); remember(); };
  const colorCmd = (name, c) => { restore(); if (!needSelection()) return; cmd(name, c); };
  const markAncestor = n => { while (n && n !== ref.current) { if (n.nodeName === 'MARK') return n; n = n.parentNode; } return null; };
  const highlight = () => {
    restore(); const s = sel(); if (!s) return;
    const m = markAncestor(s.anchorNode);
    if (m) { m.replaceWith(...m.childNodes); emit(); return; }
    if (!needSelection()) return;
    const r = s.getRangeAt(0); const mk = document.createElement('mark'); mk.appendChild(r.extractContents()); r.insertNode(mk); s.removeAllRanges(); emit();
  };
  const clear = () => { restore(); document.execCommand('removeFormat'); ref.current.querySelectorAll('mark').forEach(m => m.replaceWith(...m.childNodes)); ref.current.querySelectorAll('strong,b,em,i,u,span,font').forEach(m => m.replaceWith(...m.childNodes)); emit(); };
  const tool = 'inline-flex h-8 min-w-8 items-center justify-center gap-1.5 rounded-md px-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition';
  const pre = e => e.preventDefault();
  return <div className={`${label} sm:col-span-2`}>
    <span>Deskripsi Hero</span>
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
      <div className="flex flex-wrap items-center gap-1 rounded-t-lg border-b border-slate-200 bg-slate-50 px-2 py-1.5">
        <button type="button" className={tool} onMouseDown={pre} onClick={() => cmd('bold')} title="Tebal"><b>B</b></button>
        <button type="button" className={tool} onMouseDown={pre} onClick={() => cmd('italic')} title="Miring"><i>I</i></button>
        <button type="button" className={tool} onMouseDown={pre} onClick={() => cmd('underline')} title="Garis bawah"><u>U</u></button>
        <span className="mx-1 h-5 w-px bg-slate-200"/>
        <ColorMenu label="Warna teks" icon={<span className="font-extrabold text-brand underline decoration-2">A</span>} onSave={remember} onPick={c => colorCmd('foreColor', c)}/>
        <ColorMenu label="Warna sorot" icon={<span className="rounded bg-amber-200 px-1 font-bold text-slate-700">A</span>} onSave={remember} onPick={c => colorCmd('hiliteColor', c)}/>
        <button type="button" className={tool} onMouseDown={pre} onClick={highlight} title="Sorot biru bawaan (biru tebal)"><span className="rounded bg-brand/15 px-1.5 font-bold text-brand">Aa</span> Sorot biru</button>
        <span className="mx-1 h-5 w-px bg-slate-200"/>
        <button type="button" className={tool} onMouseDown={pre} onClick={clear}>Bersihkan</button>
      </div>
      <div ref={ref} className="hero-editor" contentEditable suppressContentEditableWarning spellCheck={false}
        onInput={emit} onBlur={() => { remember(); emit(); }} onMouseUp={remember} onKeyUp={remember}
        onKeyDown={e => { if (e.key === 'Enter') e.preventDefault(); }}
        onPaste={e => { e.preventDefault(); document.execCommand('insertText', false, e.clipboardData.getData('text/plain').replace(/\s+/g, ' ')); }}/>
    </div>
    <span className="text-xs font-normal text-slate-400">Blok kata di dalam kotak, lalu pilih: <b>B</b> tebal, <i>I</i> miring, <u>U</u> garis bawah, <b>Warna teks</b>, <b>Warna sorot</b> (latar warna apa saja, atau “Warna bebas” untuk semua warna), atau <b>Sorot biru</b> bawaan. Klik <b>Bersihkan</b> untuk menghapus semua format.</span>
    <div className="mt-1 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Pratinjau di situs</p>
      <p className="hero-preview text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: heroForDisplay(html) }}/>
    </div>
  </div>;
}

function RichEditor({ value, onChange, hint, label: lbl, wide }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.innerHTML = toHtml(value); }, []);
  const emit = () => onChange(sanitizeHtml(ref.current.innerHTML));
  const exec = (cmd, arg) => { ref.current.focus(); document.execCommand(cmd, false, arg); emit(); };
  const link = () => { const url = window.prompt('Alamat link (https://…)'); if (url) exec('createLink', url); };
  const tool = 'inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 transition';
  return <div className={`${label} ${wide ? 'sm:col-span-2' : ''}`}>
    <span>{lbl}</span>
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 px-2 py-1.5 rounded-t-lg">
        <button type="button" className={tool} title="Tebal" onMouseDown={e => e.preventDefault()} onClick={() => exec('bold')}><b>B</b></button>
        <button type="button" className={tool} title="Miring" onMouseDown={e => e.preventDefault()} onClick={() => exec('italic')}><i>I</i></button>
        <button type="button" className={tool} title="Garis bawah" onMouseDown={e => e.preventDefault()} onClick={() => exec('underline')}><u>U</u></button>
        <span className="mx-1 h-5 w-px bg-slate-200"/>
        <button type="button" className={tool} title="Daftar poin (•)" onMouseDown={e => e.preventDefault()} onClick={() => exec('insertUnorderedList')}>• Poin</button>
        <button type="button" className={tool} title="Daftar angka (1. 2. 3.)" onMouseDown={e => e.preventDefault()} onClick={() => exec('insertOrderedList')}>1. Angka</button>
        <span className="mx-1 h-5 w-px bg-slate-200"/>
        <button type="button" className={tool} title="Link" onMouseDown={e => e.preventDefault()} onClick={link}>Link</button>
        <button type="button" className={tool} title="Hapus format" onMouseDown={e => e.preventDefault()} onClick={() => exec('removeFormat')}>Bersihkan</button>
      </div>
      <div ref={ref} className="rich-editor" contentEditable suppressContentEditableWarning data-placeholder="Tulis ringkasan, lalu buat daftar poin atau angka…" onInput={emit} onBlur={emit}/>
    </div>
    {hint && <span className="text-xs font-normal text-slate-400">{hint}</span>}
  </div>;
}

const ytId = v => { const m = (v || '').match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/); return m ? m[1] : (v || '').trim(); };

async function uploadBlob(blob, name) {
  const path = `${Date.now()}-${name}`;
  const { error } = await supabase.storage.from('media').upload(path, blob, { upsert: false, contentType: blob.type });
  if (error) throw error;
  return supabase.storage.from('media').getPublicUrl(path).data.publicUrl;
}

// Ambil thumbnail otomatis dari link (YouTube langsung; Instagram/TikTok/Vimeo/dll lewat pratinjau link lalu disimpan ke storage supaya tidak kedaluwarsa)
async function fetchBlob(url) {
  for (const u of [url, `https://images.weserv.nl/?url=${encodeURIComponent(url.replace(/^https?:\/\//, ''))}&output=jpg&q=88`]) {
    try { const r = await fetch(u); if (r.ok) { const b = await r.blob(); if (b.type.startsWith('image/') && b.size > 1000) return b; } } catch {}
  }
  throw new Error('gagal mengunduh gambar');
}
async function autoThumb(link) {
  const l = (link || '').trim();
  const yt = l.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/) || (/^[\w-]{11}$/.test(l) ? [0, l] : null);
  if (yt) return `https://img.youtube.com/vi/${yt[1]}/hqdefault.jpg`;
  if (!/^https?:\/\//i.test(l)) throw new Error('Tempel link lengkap (https://…) dulu.');
  if (/instagram\.com/i.test(l)) throw new Error('Instagram memblokir pengambilan otomatis. Kosongkan thumbnail (situs memakai sampul bergaya Instagram), atau upload screenshot postingannya.');
  let img = '';
  try {
    const r = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(l)}`); const j = await r.json();
    img = j?.data?.image?.url || j?.data?.logo?.url || '';
  } catch {}
  if (!img) throw new Error('Link ini tidak menyediakan gambar pratinjau. Upload thumbnail manual.');
  const blob = await fetchBlob(img);
  return uploadBlob(blob, 'thumb.jpg');
}

function captureFrame(src) {
  return new Promise((resolve, reject) => {
    const v = document.createElement('video');
    v.crossOrigin = 'anonymous'; v.muted = true; v.playsInline = true; v.preload = 'auto'; v.src = src;
    const fail = () => reject(new Error('Tidak bisa mengambil gambar dari video ini.'));
    v.onerror = fail;
    v.onloadedmetadata = () => { v.currentTime = Math.min(1.5, Math.max(0.1, (v.duration || 3) / 8)); };
    v.onseeked = () => {
      try {
        const w = Math.min(1280, v.videoWidth || 1280), h = Math.round(w * (v.videoHeight || 720) / (v.videoWidth || 1280));
        const c = document.createElement('canvas'); c.width = w; c.height = h;
        c.getContext('2d').drawImage(v, 0, 0, w, h);
        c.toBlob(b => b ? resolve(b) : fail(), 'image/jpeg', 0.88);
      } catch { fail(); }
    };
  });
}

const MEDIA_INFO = {
  youtube: { label: 'Video YouTube', placeholder: 'Tempel link YouTube atau ID videonya', hint: 'Boleh tempel link lengkap, ID-nya diambil otomatis.' },
  link: { label: 'Link karya (Instagram, TikTok, Vimeo, Facebook, YouTube, dll)', placeholder: 'https://www.instagram.com/reel/…', hint: 'Tempel link apa saja. Instagram, TikTok, Vimeo, Facebook, dan YouTube tampil langsung di situs; link lain dibuka lewat tombol “Open original post”. Thumbnail otomatis untuk YouTube, Vimeo, TikTok, dan website. Untuk Instagram, thumbnail boleh dikosongkan: situs memakai sampul bergaya Instagram (atau upload screenshot).' },
  drive: { label: 'File Google Drive', placeholder: 'ID file Google Drive', hint: 'ID ada di link Drive: …/file/d/ID/view' },
  website: { label: 'Alamat website', placeholder: 'https://…', hint: '' },
};

function MediaField({ form, set }) {
  const t = form.type;
  if (t === 'video') return <UploadField label="Upload video (MP4 / WebM / MOV)" value={form.media} onChange={v => set('media', v)} accept="video/*" placeholder="Pilih file video dari komputer" wide required/>;
  if (t === 'image') return <UploadField label="Upload gambar" value={form.media} onChange={v => set('media', v)} accept="image/*" placeholder="Pilih gambar dari komputer" wide required/>;
  const info = MEDIA_INFO[t] || MEDIA_INFO.youtube;
  return <label className={`${label} sm:col-span-2`}>{info.label}
    <input className={input} value={form.media || ''} required placeholder={info.placeholder} onBlur={async e => { if (form.image || !['link', 'website'].includes(t)) return; try { set('image', await autoThumb(e.target.value)); } catch {} }} onChange={e => { const v = t === 'youtube' ? ytId(e.target.value) : e.target.value; set('media', v); if (t === 'youtube' && v.length === 11 && !form.image) set('image', `https://img.youtube.com/vi/${v}/hqdefault.jpg`); }}/>
    {info.hint && <span className="text-xs font-normal text-slate-400">{info.hint}</span>}
  </label>;
}

function ThumbField({ form, set }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const canVideo = form.type === 'video' && form.media;
  const canYt = form.type === 'youtube' && form.media && form.media.length === 11;
  const canLink = ['youtube', 'link', 'website'].includes(form.type) && !/instagram\.com/i.test(form.media || '') && /^(https?:\/\/|[\w-]{11}$)/i.test((form.media || '').trim());
  const fromLink = async () => {
    setBusy(true); setErr('');
    try { set('image', await autoThumb(form.media)); }
    catch (e) { setErr(e.message || 'Gagal mengambil thumbnail.'); }
    setBusy(false);
  };
  const fromVideo = async () => {
    setBusy(true); setErr('');
    try { const blob = await captureFrame(form.media); set('image', await uploadBlob(blob, 'thumb.jpg')); }
    catch (e) { setErr(e.message || 'Gagal membuat thumbnail.'); }
    setBusy(false);
  };
  return <div className="sm:col-span-2">
    <UploadField label="Thumbnail (gambar sampul)" value={form.image} onChange={v => set('image', v)} accept="image/*" placeholder={form.type === 'link' ? 'Opsional: kosongkan untuk memakai sampul otomatis bergaya platform' : 'Upload gambar sampul atau tempel link gambar'} wide required={form.type !== 'link'}/>
    {(canVideo || canYt || canLink) && <div className="mt-2 flex flex-wrap items-center gap-2">
      {canVideo && <button type="button" onClick={fromVideo} disabled={busy} className={btnGhost}>{busy ? <Loader2 size={14} className="animate-spin"/> : <Film size={14}/>}{busy ? 'Membuat…' : 'Buat thumbnail dari video'}</button>}
      {canLink && <button type="button" onClick={fromLink} disabled={busy} className={btnGhost}>{busy ? <Loader2 size={14} className="animate-spin"/> : <Film size={14}/>}{busy ? 'Mengambil…' : 'Ambil thumbnail otomatis dari link'}</button>}
      {err && <span className="text-xs text-rose-600">{err}</span>}
    </div>}
  </div>;
}

function ItemForm({ table, fields, initial, emptyItem, onDone, extra }) {
  const [form, setForm] = useState(initial || emptyItem);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const submit = async e => {
    e.preventDefault();
    setSaving(true); setError('');
    const payload = {}; fields.forEach(f => { payload[f.key] = form[f.key]; }); if (!form.id && extra) Object.assign(payload, extra);
    const res = form.id ? await supabase.from(table).update(payload).eq('id', form.id) : await supabase.from(table).insert(payload);
    setSaving(false);
    if (res.error) { setError(res.error.message); notify('error', 'Gagal menyimpan', errText(res.error)); }
    else { notify('success', form.id ? 'Berhasil diperbarui' : 'Berhasil ditambahkan', `${TABLE_LABEL[table] || 'Data'} ${form.id ? 'sudah diperbarui.' : 'sudah ditambahkan.'} Perubahan langsung tampil di situs.`); onDone(); }
  };
  return <form onSubmit={submit} className={`${card} mb-5`}>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
      {fields.map(f => f.type === 'media' ? <MediaField key={f.key} form={form} set={set}/> : f.type === 'thumb' ? <ThumbField key={f.key} form={form} set={set}/> : f.type === 'richtext' ? <RichEditor key={f.key} label={f.label} value={form[f.key]} onChange={v => set(f.key, v)} hint={f.hint} wide={f.wide}/> : f.type === 'upload' ? <UploadField key={f.key} label={f.label} value={form[f.key]} onChange={v => set(f.key, v)} accept={f.accept} wide={f.wide} required={f.required}/> : <label key={f.key} className={`${label} ${f.wide ? 'sm:col-span-2' : ''}`}>{f.label}
        {f.type === 'textarea' ? <textarea className={input} rows={f.rows || 2} value={form[f.key] || ''} onChange={e => set(f.key, e.target.value)}/>
        : f.type === 'select' ? <select className={input} value={form[f.key] || ''} onChange={e => set(f.key, e.target.value)} required={f.required}>{f.options.map(o => Array.isArray(o) ? <option key={o[0]} value={o[0]}>{o[1]}</option> : <option key={o} value={o}>{o}</option>)}</select>
        : <input className={input} value={form[f.key] || ''} onChange={e => set(f.key, e.target.value)} required={f.required}/>}
        {f.hint && <span className="text-xs font-normal text-slate-400">{f.hint}</span>}
      </label>)}
    </div>
    {error && <p className="mb-3 text-sm text-rose-600">{error}</p>}
    <div className="flex gap-3">
      <button type="submit" disabled={saving} className={btnPrimary}>{saving && <Loader2 size={15} className="animate-spin"/>}{saving ? 'Menyimpan…' : 'Simpan'}</button>
      <button type="button" className={btnGhost} onClick={onDone}>Batal</button>
    </div>
  </form>;
}

function PengalamanPage() {
  return <div>
    <PageHeader title="Pengalaman Kerja" subtitle="Dipakai di dua tempat: ringkasan di tampilan depan dan modal “View details”."/>
    <div className={`${card} mb-6`}>
      <p className="mb-3 text-sm font-semibold text-slate-800">Kolom mana mengisi bagian mana</p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Tampil di depan (section Journey)</p>
          <p className="text-[11px] text-sky-600 font-semibold">Periode</p>
          <p className="text-sm font-bold text-slate-900">Posisi</p>
          <p className="text-xs text-slate-600">Perusahaan / tempat</p>
          <p className="mt-1 text-xs text-slate-500">Ringkasan singkat (paragraf pertama di Deskripsi)</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Modal “View details”</p>
          <p className="text-[11px] text-sky-600 font-semibold">Periode</p>
          <p className="text-sm font-bold text-slate-900">Posisi</p>
          <p className="text-xs text-sky-700 font-semibold">Perusahaan / tempat</p>
          <ul className="mt-1 list-disc pl-4 text-xs text-slate-500"><li>Poin pekerjaan (daftar di Deskripsi)</li><li>Bisa juga daftar angka 1. 2. 3.</li></ul>
        </div>
      </div>
      <p className="mt-4 text-xs text-slate-500">Urutan tampil mengikuti kolom urutan di database (sort_order). Di depan hanya tampil beberapa pengalaman teratas (jumlahnya diatur di menu “Teks Situs”); semuanya ada di “View details”. Perubahan langsung terlihat setelah halaman situs di-refresh.</p>
    </div>
    <ListCRUD table="experience" title="Pengalaman"
      fields={[
        { key: 'date_label', label: 'Periode (depan + modal)', required: true, hint: 'Contoh: 2023 – 2025   atau   2026 · PRESENT' },
        { key: 'title', label: 'Posisi / jabatan (depan + modal)', required: true, hint: 'Contoh: VFX Artist' },
        { key: 'place', label: 'Perusahaan / tempat (depan + modal)', hint: 'Contoh: Dalang Digital Studio' },
        { key: 'description', label: 'Deskripsi (ringkasan di depan + isi lengkap di modal)', type: 'richtext', wide: true, hint: 'Paragraf pertama (atau poin pertama) menjadi ringkasan di depan. Semua isi, termasuk daftar poin dan angka, tampil di modal View details.' },
      ]}
      emptyItem={{ date_label: '', title: '', place: '', description: '<p>Ringkasan singkat satu kalimat.</p><ul><li>Poin pekerjaan pertama</li><li>Poin pekerjaan kedua</li></ul>' }}
      renderSummary={e => `${e.title} — ${e.place || ''}`}
      renderMeta={e => e.date_label}/>
  </div>;
}

const TOOLKIT_SQL = `-- Jalankan sekali di Supabase → SQL Editor. Membuat tabel Toolkit & Process agar bisa diedit dari admin.
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
`;

function ToolkitPage() {
  const { settings, loading, save } = useSiteSettings();
  const [skills, setSkills] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { if (settings) setSkills((settings.skills || []).join(', ')); }, [settings]);
  const onSave = async () => {
    setSaving(true); setError(''); setSaved(false);
    const { error } = await save({ skills: skills.split(',').map(s => s.trim()).filter(Boolean) });
    setSaving(false);
    if (error) setError(error.message); else setSaved(true);
  };
  return <div>
    <PageHeader title="Toolkit" subtitle="Section “The tools behind the work”: ikon aplikasi dan skill tags."/>
    <ListCRUD table="tools" title="Aplikasi / tools" reorder seed={DEFAULT_TOOLS} setupSql={TOOLKIT_SQL}
      fields={[
        { key: 'name', label: 'Nama tool', required: true, hint: 'Muncul saat ikon di-hover. Contoh: DaVinci Resolve' },
        { key: 'icon_url', label: 'Ikon (PNG/SVG, rasio kotak)', type: 'upload', required: true, wide: true },
      ]}
      emptyItem={{ name: '', icon_url: '' }}
      renderThumb={t => <img src={t.icon_url} alt="" className="h-11 w-11 flex-shrink-0 rounded-xl border border-slate-200 bg-slate-50 object-contain p-1"/>}
      renderSummary={t => t.name}
      renderMeta={() => 'Gunakan tombol ↑ ↓ untuk mengatur urutan'}/>
    <h3 className="mb-3 mt-8 text-xs font-bold uppercase tracking-wide text-slate-400">Skill tags</h3>
    <div className={`${card} mb-3`}>
      <label className={label}>Skill tags (pisah pakai koma)<input className={input} value={skills} onChange={e => { setSkills(e.target.value); setSaved(false); }} placeholder="Video Editing, Color Grading, Storytelling" disabled={loading}/></label>
    </div>
    <SaveBar saving={saving} saved={saved} error={error} onSave={onSave}/>
  </div>;
}

const CLIENTS_SQL = `-- Jalankan sekali di Supabase → SQL Editor. Membuat tabel logo brand/klien agar bisa diedit dari admin.
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
`;

function BrandPage() {
  return <div>
    <PageHeader title="Brands / Klien" subtitle="Section “Brands I’ve worked with”. Jumlah di label (mis. “5 brands”) dihitung otomatis dari daftar ini."/>
    <ListCRUD table="clients" title="Brand" reorder seed={DEFAULT_CLIENTS} setupSql={CLIENTS_SQL}
      fields={[
        { key: 'name', label: 'Nama brand', required: true, hint: 'Dipakai sebagai teks alternatif dan tooltip logo.' },
        { key: 'dark_chip', label: 'Logo transparan (tanpa kotak warna)?', type: 'select', options: [['', 'Tidak, logo punya kotak/latar sendiri'], ['light', 'Ya, beri latar terang di mode gelap']], hint: 'Pilih “Ya” untuk logo PNG transparan berwarna gelap agar tetap terbaca di mode gelap.' },
        { key: 'link_url', label: 'Link tujuan saat logo diklik (opsional)', wide: true, hint: 'Boleh link apa saja: Instagram, YouTube, Google Drive, website, atau email (mailto:). Kosongkan kalau logo tidak perlu bisa diklik.' },
        { key: 'logo_url', label: 'Logo (PNG/SVG, tinggi seragam lebih bagus)', type: 'upload', required: true, wide: true },
      ]}
      emptyItem={{ name: '', logo_url: '', dark_chip: '', link_url: '' }}
      renderThumb={b => <img src={b.logo_url} alt="" className="h-11 w-20 flex-shrink-0 rounded-lg border border-slate-200 bg-slate-50 object-contain p-1"/>}
      renderSummary={b => b.name}
      renderMeta={b => b.link_url ? `Link: ${b.link_url}` : 'Tanpa link · gunakan tombol ↑ ↓ untuk mengatur urutan'}/>
  </div>;
}

function ProsesPage() {
  return <div>
    <PageHeader title="Process" subtitle="Section “From idea to final frame”. Nomor langkah otomatis mengikuti urutan."/>
    <ListCRUD table="process_steps" title="Langkah proses" reorder seed={DEFAULT_STEPS} setupSql={TOOLKIT_SQL}
      fields={[
        { key: 'title', label: 'Judul langkah', required: true, hint: 'Contoh: Idea, Plan, Craft' },
        { key: 'tags', label: 'Label kecil (pisah pakai koma)', hint: 'Contoh: Brief, References' },
        { key: 'description', label: 'Penjelasan', type: 'textarea', rows: 3, required: true, wide: true },
      ]}
      emptyItem={{ title: '', tags: '', description: '' }}
      renderSummary={(st) => st.title}
      renderMeta={st => `${st.tags || 'tanpa label'} · ${(st.description || '').slice(0, 70)}${(st.description || '').length > 70 ? '…' : ''}`}/>
    <p className="mt-4 text-xs text-slate-500">Ikon dan warna tiap langkah diatur otomatis sesuai urutan. Disarankan 3–6 langkah supaya tab tetap rapi.</p>
  </div>;
}

function AwardsPage() {
  return <div>
    <PageHeader title="Awards & Sertifikat"/>
    <ListCRUD table="awards" title="Awards"
      fields={[{ key: 'year', label: 'Tahun', required: true }, { key: 'title', label: 'Judul Award', required: true }, { key: 'event', label: 'Nama Event/Kompetisi' }]}
      emptyItem={{ year: '', title: '', event: '' }}
      renderSummary={a => `${a.title} — ${a.event || ''}`}
      renderMeta={a => a.year}/>
    <hr className="my-8 border-slate-200"/>
    <ListCRUD table="certificates" title="Sertifikat"
      fields={[{ key: 'title', label: 'Judul Sertifikat', required: true }, { key: 'year', label: 'Tahun' }, { key: 'image', label: 'Gambar Sertifikat', type: 'upload', required: true, wide: true }]}
      emptyItem={{ title: '', year: '', image: '' }}
      renderSummary={c => c.title}
      renderMeta={c => c.year}/>
  </div>;
}

const TEXTS_SQL = `-- Kolom teks situs (judul section, label tombol, kartu statistik) yang diedit lewat admin → menu "Teks Situs".
alter table public.site_settings add column if not exists texts jsonb not null default '{}'::jsonb;
`;

function TeksPage() {
  const { settings, loading, save } = useSiteSettings();
  const [f, setF] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { if (settings) setF({ ...DEFAULT_TEXTS, ...Object.fromEntries(Object.entries(settings.texts || {}).filter(([, v]) => typeof v === 'string' && v.trim())) }); }, [settings]);
  if (loading) return <p className="text-slate-500">Memuat…</p>;
  const missingColumn = settings && !('texts' in settings);
  const set = (k, v) => { setF(c => ({ ...c, [k]: v })); setSaved(false); };
  const onSave = async () => {
    setSaving(true); setError(''); setSaved(false);
    const { error } = await save({ texts: f });
    setSaving(false);
    if (error) setError(error.message); else setSaved(true);
  };
  const reset = () => { setF({ ...DEFAULT_TEXTS }); setSaved(false); };
  return <div>
    <PageHeader title="Teks Situs" subtitle="Judul tiap section, label tombol, dan 4 kartu statistik. Urutan grup sama dengan urutan di situs."/>
    {missingColumn && <div className={`${card} mb-5 border-amber-300 bg-amber-50`}>
      <p className="mb-1 text-sm font-semibold text-amber-900">Kolom “texts” belum ada di database</p>
      <p className="mb-3 text-xs text-amber-800">Jalankan <code>npm run db:migrate</code> di terminal, atau tempel SQL ini di Supabase → SQL Editor lalu Run. Setelah itu muat ulang halaman ini.</p>
      <pre className="overflow-auto rounded-lg bg-slate-900 p-3 text-[11px] text-slate-100 whitespace-pre-wrap">{TEXTS_SQL}</pre>
    </div>}
    {TEXT_GROUPS.map(g => <div key={g.title} className="mb-5">
      <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">{g.title}</h3>
      {g.note && <p className="mb-2 text-xs text-slate-500">{g.note}</p>}
      <div className={`${card} grid grid-cols-1 gap-4 sm:grid-cols-2`}>
        {g.keys.map(([k, lbl]) => <label key={k} className={label}>{lbl}<input className={input} value={f[k] ?? ''} onChange={e => set(k, e.target.value)} placeholder={DEFAULT_TEXTS[k]}/></label>)}
      </div>
    </div>)}
    <div className="flex flex-wrap items-center gap-3"><SaveBar saving={saving} saved={saved} error={error} onSave={onSave}/><button type="button" className={btnGhost} onClick={reset}>Kembalikan semua ke teks bawaan</button></div>
  </div>;
}

function KontakPage() {
  const { settings, loading, save } = useSiteSettings();
  const [f, setF] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  // Nilai lama di database (yang sudah tidak dipakai situs) diganti nilai terbaru agar form = tampilan situs. Tinggal klik Simpan.
  const CONTACT_NOW = { contact_instagram_handle: '@ceritazizi', contact_instagram_url: 'https://www.instagram.com/ceritazizi/', contact_whatsapp: '6285726073213', contact_phone_display: '+62 857-2607-3213', contact_location: 'Yogyakarta, Indonesia' };
  const CONTACT_OLD = { contact_instagram_handle: '@dododididaw', contact_instagram_url: 'https://www.instagram.com/dododididaw/', contact_whatsapp: '6287786923444', contact_phone_display: '+62 877-8692-3444' };
  const [stale, setStale] = useState(false);
  useEffect(() => {
    if (!settings) return;
    const o = { ...settings }; let changed = false;
    Object.keys(CONTACT_NOW).forEach(k => {
      const old = !o[k] || o[k] === CONTACT_OLD[k] || (k === 'contact_location' && /^indramayu/i.test(o[k]));
      if (old) { o[k] = CONTACT_NOW[k]; changed = true; }
    });
    setF(o); setStale(changed);
  }, [settings]);
  const set = (k, v) => { setF(c => ({ ...c, [k]: v })); setSaved(false); };
  const KEYS = ['contact_email', 'contact_instagram_handle', 'contact_instagram_url', 'contact_whatsapp', 'contact_phone_display', 'contact_location'];
  const onSave = async () => {
    setSaving(true); setError(''); setSaved(false);
    const payload = {}; KEYS.forEach(k => { payload[k] = (f[k] || '').trim(); });
    payload.contact_whatsapp = payload.contact_whatsapp.replace(/[^0-9]/g, '');
    const { error } = await save(payload);
    setSaving(false);
    if (error) setError(error.message); else setSaved(true);
  };
  const wa = (f?.contact_whatsapp || '').replace(/[^0-9]/g, '');
  return <div>
    <PageHeader title="Kontak" subtitle="Dipakai di kartu “Let’s work together” dan tombol kontak di situs."/>
    {stale && !saved && <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900"><b>Data di database masih versi lama.</b> Situs sudah menampilkan data terbaru (kolom di bawah sudah diisi sama dengan situs). Klik <b>Simpan Perubahan</b> sekali agar database ikut diperbarui.</div>}
    {loading || !f ? <p className="text-slate-500">Memuat…</p> : <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className={`${card} lg:col-span-3 grid grid-cols-1 gap-5 sm:grid-cols-2 content-start`}>
          <label className={`${label} sm:col-span-2`}>Email<input type="email" className={input} value={f.contact_email || ''} onChange={e => set('contact_email', e.target.value)} placeholder="nama@email.com"/><span className="text-xs font-normal text-slate-400">Tujuan tombol “Send an email” dan baris Email.</span></label>
          <label className={label}>Instagram (tampilan)<input className={input} value={f.contact_instagram_handle || ''} onChange={e => set('contact_instagram_handle', e.target.value)} placeholder="@username"/></label>
          <label className={label}>Instagram (link)<input className={input} value={f.contact_instagram_url || ''} onChange={e => set('contact_instagram_url', e.target.value)} placeholder="https://www.instagram.com/username/"/></label>
          <label className={label}>Nomor WhatsApp<input className={input} value={f.contact_whatsapp || ''} onChange={e => set('contact_whatsapp', e.target.value)} placeholder="6281234567890"/><span className="text-xs font-normal text-slate-400">Hanya angka, diawali kode negara (62). Tujuan tombol “Start a conversation”.</span></label>
          <label className={label}>Nomor telepon (tampilan)<input className={input} value={f.contact_phone_display || ''} onChange={e => set('contact_phone_display', e.target.value)} placeholder="+62 812-3456-7890"/></label>
          <label className={`${label} sm:col-span-2`}>Lokasi<input className={input} value={f.contact_location || ''} onChange={e => set('contact_location', e.target.value)} placeholder="Yogyakarta, Indonesia"/></label>
        </div>
        <div className={`${card} lg:col-span-2 self-start`}>
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">Tampil di situs</p>
          <div className="rounded-xl bg-slate-50 p-4 text-sm">
            <p className="font-semibold text-slate-800">Let’s work together.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a href={wa ? `https://wa.me/${wa}` : undefined} target="_blank" rel="noopener noreferrer" className="rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-white">Start a conversation</a>
              <a href={f.contact_email ? `mailto:${f.contact_email}` : undefined} className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700">Send an email</a>
            </div>
            <ul className="mt-4 space-y-1 text-xs text-slate-600">
              <li>Email: {f.contact_email || '—'}</li><li>Instagram: {f.contact_instagram_handle || '—'}</li>
              <li>Phone / WhatsApp: {f.contact_phone_display || '—'}</li><li>Based in: {f.contact_location || '—'}</li>
            </ul>
          </div>
          <p className="mt-3 text-xs text-slate-400">Klik dua tombol di atas untuk menguji tujuannya.</p>
        </div>
      </div>
      <SaveBar saving={saving} saved={saved} error={error} onSave={onSave}/>
    </>}
  </div>;
}

function StatCard({ icon: Icon, label: statLabel, value, tone }) {
  const tones = {
    blue: 'bg-blue-600 text-white',
    green: 'bg-emerald-500 text-white',
    white: 'bg-white text-slate-800 border border-slate-200',
  };
  const subtle = tone === 'white' ? 'text-slate-400' : 'text-white/70';
  return <div className={`rounded-2xl p-5 shadow-sm ${tones[tone]}`}>
    <div className="flex items-center justify-between mb-6">
      <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${tone === 'white' ? 'bg-slate-100' : 'bg-white/15'}`}><Icon size={17}/></span>
    </div>
    <p className={`text-xs font-medium ${subtle}`}>{statLabel}</p>
    <p className="mt-1 text-2xl font-bold">{value}</p>
  </div>;
}

function CategoryManager({ onChange }) {
  const [confirmNode, ask] = useConfirm();
  const [categories, setCategories] = useState([]);
  const [counts, setCounts] = useState({});
  const [name, setName] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const load = async () => {
    const { data } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });
    const list = data || [];
    setCategories(list);
    onChange && onChange(list.map(c => c.name));
    const { data: projects } = await supabase.from('projects').select('category');
    const c = {};
    (projects || []).forEach(p => { c[p.category] = (c[p.category] || 0) + 1; });
    setCounts(c);
  };
  useEffect(() => { load(); }, []);
  const add = async e => {
    e.preventDefault();
    if (!name.trim()) return;
    setAdding(true); setError('');
    const { error } = await supabase.from('categories').insert({ name: name.trim(), sort_order: categories.length });
    setAdding(false);
    if (error) { setError(error.message); notify('error', 'Gagal menambah kategori', errText(error)); } else { setName(''); notify('success', 'Kategori ditambahkan', `“${name.trim()}” sekarang bisa dipilih di Karya.`); load(); }
  };
  const remove = async cat => {
    const yes = await ask({ title: `Hapus kategori “${cat.name}”?`, message: 'Karya yang sudah memakai kategori ini TIDAK ikut terhapus. Hanya kategorinya yang dihapus dari daftar pilihan.' });
    if (!yes) return;
    const { data, error } = await supabase.from('categories').delete().eq('id', cat.id).select('id');
    if (error || !data || !data.length) { notify('error', 'Tidak bisa dihapus', error ? errText(error) : 'Database menolak penghapusan (izin hapus belum ada). Jalankan “npm run db:migrate”, lalu coba lagi.'); return; }
    notify('success', 'Kategori dihapus', `“${cat.name}” sudah dihapus dari daftar pilihan.`);
    load();
  };
  return <div className={`${card} mb-6`}>
    {confirmNode}
    <h3 className="mb-3 text-sm font-bold text-slate-800">Kelola Kategori</h3>
    <div className="mb-4 flex flex-wrap gap-2">
      {categories.map(c => <span key={c.id} className="inline-flex items-center gap-2 rounded-full bg-slate-100 pl-3 pr-1.5 py-1 text-xs font-medium text-slate-600">
        {c.name}<span className="text-slate-400">({counts[c.name] || 0})</span>
        <button onClick={() => remove(c)} className="flex h-4 w-4 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-rose-600"><X size={11}/></button>
      </span>)}
      {categories.length === 0 && <p className="text-xs text-slate-400">Belum ada kategori.</p>}
    </div>
    <form onSubmit={add} className="flex gap-2">
      <input className={input} value={name} onChange={e => setName(e.target.value)} placeholder="Nama kategori baru, mis. Wedding"/>
      <button type="submit" disabled={adding} className={btnPrimary}>{adding ? <Loader2 size={14} className="animate-spin"/> : <Plus size={14}/>}Tambah</button>
    </form>
    {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}
  </div>;
}

function KaryaPage() {
  const [total, setTotal] = useState(null);
  const [categoryNames, setCategoryNames] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    supabase.from('projects').select('id', { count: 'exact', head: true }).then(({ count }) => setTotal(count));
  }, [refreshKey]);
  return <div>
    <PageHeader title="Karya" subtitle="Project yang tampil di section Portfolio."/>
    {total !== null && <div className="mb-6"><StatCard icon={Film} label="Total Karya" value={total} tone="blue"/></div>}
    <CategoryManager onChange={setCategoryNames}/>
    <ListCRUD table="projects" title="Karya" orderBy="created_at"
      fields={[
        { key: 'title', label: 'Judul', required: true },
        { key: 'category', label: 'Kategori', type: 'select', options: categoryNames.length ? categoryNames : ['Film', 'Commercial'], required: true },
        { key: 'type', label: 'Sumber karya', type: 'select', options: [['youtube', 'YouTube'], ['link', 'Link lain (Instagram, TikTok, Vimeo, dll)'], ['video', 'Upload video (file sendiri)'], ['drive', 'Google Drive'], ['image', 'Gambar'], ['website', 'Website']], required: true },
        { key: 'year', label: 'Tahun' },
        { key: 'role', label: 'Peran' },
        { key: 'media', label: 'Karya', type: 'media', required: true, wide: true },
        { key: 'description', label: 'Deskripsi', type: 'textarea', wide: true },
        { key: 'image', label: 'Thumbnail', type: 'thumb', required: true, wide: true },
      ]}
      emptyItem={emptyProject}
      renderSummary={p => p.title}
      renderMeta={p => `${p.category}${p.year ? ' · ' + p.year : ''}`}
      onChanged={() => setRefreshKey(k => k + 1)}/>
  </div>;
}

// Urutan menu = urutan section di situs (atas → bawah)
const NAV = [
  { group: '1 · Hero (paling atas)', items: [
    ['profil', 'Profil & Hero', User, ProfilPage],
  ] },
  { group: '2 · Clients', items: [
    ['brands', 'Brands / Klien', Building2, BrandPage],
  ] },
  { group: '3 · Toolkit & Process', items: [
    ['toolkit', 'Toolkit (tools & skill)', Wrench, ToolkitPage],
    ['proses', 'Process (langkah kerja)', ListOrdered, ProsesPage],
  ] },
  { group: '4 · Work', items: [
    ['karya', 'Karya / Portofolio', Film, KaryaPage],
  ] },
  { group: '5 · Journey', items: [
    ['pengalaman', 'Pengalaman (Experience)', Briefcase, PengalamanPage],
    ['tentang', 'Pendidikan & Skill', BookOpen, TentangPage],
  ] },
  { group: '6 · Contact', items: [
    ['kontak', 'Kontak', Phone, KontakPage],
  ] },
  { group: 'Teks umum', items: [
    ['teks', 'Teks Situs (judul & tombol)', FileText, TeksPage],
  ] },
];
const NAV_FLAT = NAV.flatMap(g => g.items);

function Dashboard({ session }) {
  const validTabs = NAV_FLAT.map(x => x[0]);
  const [tab, setTabState] = useState(() => { try { const h = decodeURIComponent(location.hash.replace('#', '')); if (validTabs.includes(h)) return h; const l = localStorage.getItem('admin-tab'); if (validTabs.includes(l)) return l; } catch {} return 'profil'; });
  const mainRef = useRef(null);
  useEffect(() => {
    let y = 0; try { y = Number(sessionStorage.getItem(`admin-scroll-${tab}`)) || 0; } catch {}
    if (!y) { if (mainRef.current) mainRef.current.scrollTop = 0; return; }
    const ids = [120, 450, 1000].map(ms => setTimeout(() => { if (mainRef.current) mainRef.current.scrollTop = y; }, ms));
    return () => ids.forEach(clearTimeout);
  }, [tab]);
  const setTab = id => { setTabState(id); try { history.replaceState(null, '', `#${id}`); localStorage.setItem('admin-tab', id); } catch {} };
  useEffect(() => { const on = () => { const h = location.hash.replace('#', ''); if (validTabs.includes(h)) setTabState(h); }; window.addEventListener('hashchange', on); return () => window.removeEventListener('hashchange', on); }, []);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const active = NAV_FLAT.find(([id]) => id === tab);
  const Page = active[3];
  const activeLabel = active[1];
  return <div className="flex min-h-screen bg-slate-50">
    <aside className={`flex flex-shrink-0 flex-col overflow-hidden border-r border-slate-200 bg-white py-5 transition-all duration-300 ${sidebarOpen ? 'w-64 px-4' : 'w-[68px] px-2'}`}>
      <div className={`flex flex-col flex-1 min-h-0 ${sidebarOpen ? 'w-56' : 'w-[52px]'}`}>
        <button className={`mb-6 flex items-center gap-2.5 rounded-xl py-1.5 hover:bg-slate-50 transition whitespace-nowrap ${sidebarOpen ? 'px-2' : 'justify-center px-0'}`}>
          <ZMark size={36} className="flex-shrink-0"/>
          {sidebarOpen && <><div className="text-left"><p className="text-sm font-bold text-slate-900 leading-tight">AZIZI<span className="text-brand">.</span></p><p className="text-[11px] text-slate-400 leading-tight">Portfolio Admin</p></div>
          <ChevronDown size={14} className="ml-auto text-slate-400"/></>}
        </button>
        <nav className="flex flex-1 flex-col gap-5 overflow-y-auto overflow-x-hidden">
          {NAV.map((group, gi) => <div key={group.group} className={gi > 0 && !sidebarOpen ? 'mt-1 border-t border-slate-100 pt-2' : ''}>
            {sidebarOpen && <p className="mb-1.5 mt-1 px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap">{group.group}</p>}
            <div className="flex flex-col gap-0.5">
              {group.items.map(([id, nlabel, Icon]) => <button key={id} onClick={() => setTab(id)} title={sidebarOpen ? undefined : nlabel} className={`flex items-center gap-3 whitespace-nowrap rounded-lg py-2.5 text-sm font-medium transition ${sidebarOpen ? 'px-3' : 'justify-center px-0'} ${tab === id ? 'bg-brand/10 text-brand' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
                <Icon size={17} className="flex-shrink-0"/>{sidebarOpen && nlabel}
              </button>)}
            </div>
          </div>)}
        </nav>
        <div className="mt-4 border-t border-slate-100 pt-4">
          {sidebarOpen && <p className="mb-3 truncate px-1 text-xs text-slate-400">{session.user.email}</p>}
          <button onClick={() => supabase.auth.signOut()} title={sidebarOpen ? undefined : 'Keluar'} className={`flex w-full items-center gap-2 whitespace-nowrap rounded-lg py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition ${sidebarOpen ? 'px-3' : 'justify-center px-0'}`}><LogOut size={15} className="flex-shrink-0"/>{sidebarOpen && 'Keluar'}</button>
        </div>
      </div>
    </aside>
    <div className="flex flex-1 flex-col min-w-0">
      <header className="flex items-center gap-4 border-b border-slate-200 bg-white px-5 sm:px-8 py-3.5">
        <button onClick={() => setSidebarOpen(v => !v)} aria-label={sidebarOpen ? 'Tutup sidebar' : 'Buka sidebar'} className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"><Menu size={19}/></button>
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
          <input className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none transition" placeholder={`Cari di ${activeLabel}…`}/>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className="hidden sm:inline text-xs text-slate-400">{session.user.email}</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">{session.user.email?.[0]?.toUpperCase()}</div>
        </div>
      </header>
      <main ref={mainRef} onScroll={e => { try { sessionStorage.setItem(`admin-scroll-${tab}`, String(e.currentTarget.scrollTop)); } catch {} }} className="flex-1 overflow-y-auto px-8 py-8">
        <div className="mx-auto max-w-4xl"><Page/></div>
      </main>
    </div>
  </div>;
}

function AdminApp() {
  const [session, setSession] = useState(undefined);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => listener.subscription.unsubscribe();
  }, []);
  if (session === undefined) return <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-400"><Loader2 className="animate-spin mr-2" size={18}/>Memuat…</div>;
  if (!session) return <><LoginForm/><ToastHost/></>;
  return <><Dashboard session={session}/><ToastHost/></>;
}

createRoot(document.getElementById('root')).render(<AdminApp/>);
