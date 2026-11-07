import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Film, User, BookOpen, Briefcase, Trophy, LogOut, Plus, Pencil, Trash2, X, Loader2, Search, ChevronDown, Clapperboard, Megaphone, Menu, Upload, FileText, Phone } from 'lucide-react';
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

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const submit = async e => {
    e.preventDefault();
    setLoading(true); setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
  };
  return <div className="min-h-screen flex items-center justify-center bg-slate-950 bg-[radial-gradient(circle_at_top,_#1a1012,_#09090b)] px-4">
    <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8 shadow-2xl">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-white font-bold text-lg">A</div>
        <h1 className="text-xl font-bold text-white">AZIZI<span className="text-brand">.</span> Admin</h1>
        <p className="mt-1 text-xs text-slate-400">Masuk untuk kelola portofolio</p>
      </div>
      <div className="flex flex-col gap-4">
        <label className={label}><span className="text-slate-300">Email</span><input className={input} type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus/></label>
        <label className={label}><span className="text-slate-300">Password</span><input className={input} type="password" value={password} onChange={e => setPassword(e.target.value)} required/></label>
        {error && <p className="text-sm text-rose-400">{error}</p>}
        <button type="submit" disabled={loading} className={`${btnPrimary} justify-center`}>{loading && <Loader2 size={15} className="animate-spin"/>}{loading ? 'Masuk…' : 'Masuk'}</button>
      </div>
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
    if (!error) setSettings(data);
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
      hero_topline: form.hero_topline, hero_subtitle: form.hero_subtitle,
      hero_role_line1: form.hero_role_line1, hero_role_line2: form.hero_role_line2,
      hero_description: form.hero_description, hero_location: form.hero_location,
      stat_years: form.stat_years, stat_years_label: form.stat_years_label,
      stat_projects: form.stat_projects, stat_projects_label: form.stat_projects_label,
      stat_awards: form.stat_awards, cv_url: form.cv_url, intro_text: form.intro_text, portrait_url: form.portrait_url,
    });
    setSaving(false);
    if (error) setError(error.message); else setSaved(true);
  };
  return <div>
    <PageHeader title="Profil & Hero" subtitle="Teks dan angka yang tampil di section pembuka situs."/>
    <div className={`${card} grid grid-cols-1 sm:grid-cols-2 gap-5`}>
      <label className={label}>Topline (atas judul besar)<input className={input} value={form.hero_topline || ''} onChange={e => set('hero_topline', e.target.value)}/></label>
      <label className={label}>Subtitle topline<input className={input} value={form.hero_subtitle || ''} onChange={e => set('hero_subtitle', e.target.value)}/></label>
      <label className={label}>Role baris 1<input className={input} value={form.hero_role_line1 || ''} onChange={e => set('hero_role_line1', e.target.value)}/></label>
      <label className={label}>Role baris 2<input className={input} value={form.hero_role_line2 || ''} onChange={e => set('hero_role_line2', e.target.value)}/></label>
      <label className={`${label} sm:col-span-2`}>Deskripsi Hero<textarea className={input} rows="2" value={form.hero_description || ''} onChange={e => set('hero_description', e.target.value)}/></label>
      <label className={label}>Lokasi<input className={input} value={form.hero_location || ''} onChange={e => set('hero_location', e.target.value)}/></label>
      <UploadField label="Foto Portrait (Hero)" value={form.portrait_url} onChange={v => set('portrait_url', v)} accept="image/*" placeholder="Upload foto baru" wide/>
      <UploadField label="CV" value={form.cv_url} onChange={v => set('cv_url', v)} accept="application/pdf" placeholder="Upload file PDF, atau paste link Google Drive" wide/>
      <label className={label}>Angka tahun<input className={input} value={form.stat_years || ''} onChange={e => set('stat_years', e.target.value)}/></label>
      <label className={label}>Label angka tahun<input className={input} value={form.stat_years_label || ''} onChange={e => set('stat_years_label', e.target.value)}/></label>
      <label className={label}>Angka proyek<input className={input} value={form.stat_projects || ''} onChange={e => set('stat_projects', e.target.value)}/></label>
      <label className={label}>Label angka proyek<input className={input} value={form.stat_projects_label || ''} onChange={e => set('stat_projects_label', e.target.value)}/></label>
      <label className={label}>Angka awards<input className={input} value={form.stat_awards || ''} onChange={e => set('stat_awards', e.target.value)}/></label>
      <label className={`${label} sm:col-span-2`}>Teks section "Perkenalan Singkat"<textarea className={input} rows="3" value={form.intro_text || ''} onChange={e => set('intro_text', e.target.value)}/></label>
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
  const removeEdu = i => setEducation(list => list.filter((_, idx) => idx !== i));
  const onSave = async () => {
    setSaving(true); setError(''); setSaved(false);
    const { error } = await save({ about_bio: bio, skills: skills.split(',').map(s => s.trim()).filter(Boolean), education });
    setSaving(false);
    if (error) setError(error.message); else setSaved(true);
  };
  return <div>
    <PageHeader title="Tentang Saya" subtitle="Bio, pendidikan, dan skill tags di section About."/>
    <div className={`${card} flex flex-col gap-5 mb-5`}>
      <label className={label}>Bio singkat<textarea className={input} rows="3" value={bio} onChange={e => { setBio(e.target.value); setSaved(false); }}/></label>
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

function ListCRUD({ table, title, fields, renderSummary, renderMeta, emptyItem, orderBy = 'sort_order', onChanged }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from(table).select('*').order(orderBy, { ascending: true });
    if (!error) setItems(data || []);
    setLoading(false);
    onChanged && onChanged();
  };
  useEffect(() => { load(); }, []);
  const remove = async id => {
    if (!window.confirm('Hapus item ini?')) return;
    await supabase.from(table).delete().eq('id', id);
    load();
  };
  return <div>
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-lg font-bold text-slate-900">{title} <span className="text-slate-400 font-normal">({items.length})</span></h3>
      <button onClick={() => setEditing(editing === 'new' ? null : 'new')} className={btnPrimary}>{editing === 'new' ? <X size={15}/> : <Plus size={15}/>}{editing === 'new' ? 'Batal' : 'Tambah'}</button>
    </div>
    {editing === 'new' && <ItemForm table={table} fields={fields} emptyItem={emptyItem} onDone={() => { setEditing(null); load(); }}/>}
    {typeof editing === 'object' && editing && <ItemForm table={table} fields={fields} initial={editing} emptyItem={emptyItem} onDone={() => { setEditing(null); load(); }}/>}
    {!editing && (loading ? <p className="text-slate-500">Memuat…</p> : <div className="flex flex-col gap-2">
      {items.length === 0 && <p className="text-sm text-slate-400">Belum ada data.</p>}
      {items.map(item => <div key={item.id} className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3">
        <div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-800">{renderSummary(item)}</p>{renderMeta && <p className="text-xs text-slate-400">{renderMeta(item)}</p>}</div>
        <div className="flex flex-shrink-0 gap-2">
          <button onClick={() => setEditing(item)} className={btnIcon}><Pencil size={13}/>Edit</button>
          <button onClick={() => remove(item.id)} className={btnDanger}><Trash2 size={13}/>Hapus</button>
        </div>
      </div>)}
    </div>)}
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
  drive: { label: 'File Google Drive', placeholder: 'ID file Google Drive', hint: 'ID ada di link Drive: …/file/d/ID/view' },
  website: { label: 'Alamat website', placeholder: 'https://…', hint: '' },
};

function MediaField({ form, set }) {
  const t = form.type;
  if (t === 'video') return <UploadField label="Upload video (MP4 / WebM / MOV)" value={form.media} onChange={v => set('media', v)} accept="video/*" placeholder="Pilih file video dari komputer" wide required/>;
  if (t === 'image') return <UploadField label="Upload gambar" value={form.media} onChange={v => set('media', v)} accept="image/*" placeholder="Pilih gambar dari komputer" wide required/>;
  const info = MEDIA_INFO[t] || MEDIA_INFO.youtube;
  return <label className={`${label} sm:col-span-2`}>{info.label}
    <input className={input} value={form.media || ''} required placeholder={info.placeholder} onChange={e => { const v = t === 'youtube' ? ytId(e.target.value) : e.target.value; set('media', v); if (t === 'youtube' && v.length === 11 && !form.image) set('image', `https://img.youtube.com/vi/${v}/hqdefault.jpg`); }}/>
    {info.hint && <span className="text-xs font-normal text-slate-400">{info.hint}</span>}
  </label>;
}

function ThumbField({ form, set }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const canVideo = form.type === 'video' && form.media;
  const canYt = form.type === 'youtube' && form.media && form.media.length === 11;
  const fromVideo = async () => {
    setBusy(true); setErr('');
    try { const blob = await captureFrame(form.media); set('image', await uploadBlob(blob, 'thumb.jpg')); }
    catch (e) { setErr(e.message || 'Gagal membuat thumbnail.'); }
    setBusy(false);
  };
  return <div className="sm:col-span-2">
    <UploadField label="Thumbnail (gambar sampul)" value={form.image} onChange={v => set('image', v)} accept="image/*" placeholder="Upload gambar sampul atau tempel link gambar" wide required/>
    {(canVideo || canYt) && <div className="mt-2 flex flex-wrap items-center gap-2">
      {canVideo && <button type="button" onClick={fromVideo} disabled={busy} className={btnGhost}>{busy ? <Loader2 size={14} className="animate-spin"/> : <Film size={14}/>}{busy ? 'Membuat…' : 'Buat thumbnail dari video'}</button>}
      {canYt && <button type="button" onClick={() => set('image', `https://img.youtube.com/vi/${form.media}/hqdefault.jpg`)} className={btnGhost}><Film size={14}/>Pakai thumbnail YouTube</button>}
      {err && <span className="text-xs text-rose-600">{err}</span>}
    </div>}
  </div>;
}

function ItemForm({ table, fields, initial, emptyItem, onDone }) {
  const [form, setForm] = useState(initial || emptyItem);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const submit = async e => {
    e.preventDefault();
    setSaving(true); setError('');
    const payload = {}; fields.forEach(f => { payload[f.key] = form[f.key]; });
    const res = form.id ? await supabase.from(table).update(payload).eq('id', form.id) : await supabase.from(table).insert(payload);
    setSaving(false);
    if (res.error) setError(res.error.message); else onDone();
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
      <p className="mt-4 text-xs text-slate-500">Urutan tampil mengikuti kolom urutan di database (sort_order). Perubahan langsung terlihat setelah halaman situs di-refresh.</p>
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

function KontakPage() {
  const { settings, loading, save } = useSiteSettings();
  const [f, setF] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { if (settings) setF(settings); }, [settings]);
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
    if (error) setError(error.message); else { setName(''); load(); }
  };
  const remove = async cat => {
    if (!window.confirm(`Hapus kategori "${cat.name}"? (Karya yang sudah pakai kategori ini TIDAK akan terhapus, cuma kategorinya yang dihapus dari daftar pilihan)`)) return;
    await supabase.from('categories').delete().eq('id', cat.id);
    load();
  };
  return <div className={`${card} mb-6`}>
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
        { key: 'type', label: 'Sumber karya', type: 'select', options: [['youtube', 'YouTube'], ['video', 'Upload video (file sendiri)'], ['drive', 'Google Drive'], ['image', 'Gambar'], ['website', 'Website']], required: true },
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

const NAV = [
  { group: 'KONTEN UTAMA', items: [
    ['karya', 'Karya', Film, KaryaPage],
  ] },
  { group: 'PROFIL SITUS', items: [
    ['profil', 'Profil & Hero', User, ProfilPage],
    ['tentang', 'Tentang Saya', BookOpen, TentangPage],
    ['pengalaman', 'Pengalaman', Briefcase, PengalamanPage],
    ['kontak', 'Kontak', Phone, KontakPage],
    ['awards', 'Awards & Sertifikat', Trophy, AwardsPage],
  ] },
];
const NAV_FLAT = NAV.flatMap(g => g.items);

function Dashboard({ session }) {
  const [tab, setTab] = useState('karya');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const active = NAV_FLAT.find(([id]) => id === tab);
  const Page = active[3];
  const activeLabel = active[1];
  return <div className="flex min-h-screen bg-slate-50">
    <aside className={`flex flex-shrink-0 flex-col overflow-hidden border-r border-slate-200 bg-white py-5 transition-all duration-300 ${sidebarOpen ? 'w-64 px-4' : 'w-[68px] px-2'}`}>
      <div className={`flex flex-col flex-1 min-h-0 ${sidebarOpen ? 'w-56' : 'w-[52px]'}`}>
        <button className={`mb-6 flex items-center gap-2.5 rounded-xl py-1.5 hover:bg-slate-50 transition whitespace-nowrap ${sidebarOpen ? 'px-2' : 'justify-center px-0'}`}>
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white">A</div>
          {sidebarOpen && <><div className="text-left"><p className="text-sm font-bold text-slate-900 leading-tight">AZIZI<span className="text-brand">.</span></p><p className="text-[11px] text-slate-400 leading-tight">Portfolio Admin</p></div>
          <ChevronDown size={14} className="ml-auto text-slate-400"/></>}
        </button>
        <nav className="flex flex-1 flex-col gap-5 overflow-y-auto overflow-x-hidden">
          {NAV.map(group => <div key={group.group}>
            {sidebarOpen && <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap">{group.group}</p>}
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
      <main className="flex-1 overflow-y-auto px-8 py-8">
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
  if (!session) return <LoginForm/>;
  return <Dashboard session={session}/>;
}

createRoot(document.getElementById('root')).render(<AdminApp/>);
