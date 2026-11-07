import React, { useState, useEffect, useRef, useContext, useMemo, createContext } from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { motion, AnimatePresence, MotionConfig, useScroll, useTransform, useSpring, useReducedMotion, useMotionValueEvent, useAnimationFrame, useInView, animate, useMotionValue } from 'framer-motion';
import { MessageCircle, Briefcase, Lightbulb, ClipboardList, Scissors, Palette, Flag, ArrowUpRight, ArrowDown, ArrowRight, Play, X, Menu, Mail, Phone, MapPin, Instagram, Download, Pause, Search, Plus, Minus, ChevronLeft, ChevronRight, ExternalLink, Sun, Moon } from 'lucide-react';
import brands from './data/brands.json';
import { supabase } from './supabaseClient';
import { toHtml, summaryOf } from './experience.js';
import './styles.css';
import './ios.css';

const MotionContext = createContext(true);
const EASE = [0.22, 1, 0.36, 1];
const DEFAULT_CATEGORIES = ['All', 'Film', 'Commercial'];
const FEATURED_KEYS = ['-xeDt_6XxJg', 'rfRnIAlNcvg'];
const DEFAULT_EXPERIENCES = [
  { date_label: '2026 · SEKARANG', title: 'Freelance Creative', place: 'Film & branded content', description: 'Mengembangkan konsep dan naskah film pendek, serta memproduksi konten sinematik untuk brand café, fashion, dan hijab. Dari storytelling sampai penyelesaian visual.' },
  { date_label: '2023 – 2025', title: 'VFX Artist', place: 'Film & commercial production', description: 'Compositing, CGI, matchmove, rotoscoping, dan breakdown editing. Terlibat dalam supervisi pengambilan gambar untuk kebutuhan post-production.' },
  { date_label: '2023 · 6 BULAN', title: 'VFX Internship', place: 'Dalang Digital Studio', description: 'Terlibat dalam produksi film dan iklan, mempelajari pipeline studio, serta berkolaborasi dalam workflow visual effects dan animasi.' },
  { date_label: '2022 – 2023', title: 'Freelance Editor', place: 'Video, photography & film', description: 'Menyunting video review hotel untuk YouTube, memotret pernikahan, dan berkolaborasi dalam film pendek sebagai editor dan aktor.' },
  { date_label: '2018 · SEKARANG', title: 'Content Creator', place: 'DuingZ Studio', description: 'Membuat konten gaming, coding, film pendek, dan eksperimen VFX. Tempat saya mencoba ide dan terus mengembangkan cara bercerita.' },
];
const DEFAULT_CERTIFICATES = [
  { title: 'Juara 1 Movie Event', year: '2025', image: './Asset/img/SERTIFIKAT/shortmovie.jpeg' },
  { title: 'Lulusan Terbaik 2', year: '2024', image: './Asset/img/SERTIFIKAT/juara2.jpg' },
  { title: 'Dalang Digital Studio', year: '2023', image: './Asset/img/SERTIFIKAT/dalang.jpg' },
  { title: 'Videolabs E-Course', year: '2024', image: './Asset/img/SERTIFIKAT/videolabs.jpg' },
];
const DEFAULT_AWARDS = [
  {year:'2025',title:'1st Place',event:'Indramayu Film Festival'},
  {year:'2024',title:'Best Competency Exam',event:'Animation Program'},
  {year:'2023',title:'Best Short Film',event:'Golkar Party'},
  {year:'2022',title:'1st Place, Short Film',event:'Hero Theme'},
  {year:'2021',title:'1st Place, Short Film',event:'Hero Theme'},
  {year:'2020',title:'Best Creative Video',event:'Creative Video Competition'},
];
const DEFAULT_SETTINGS = {
  hero_topline: 'VIDEO EDITOR', hero_subtitle: 'FILM STORYTELLER',
  hero_role_line1: 'VIDEO', hero_role_line2: 'EDITOR',
  hero_description: 'Crafting stories. Creating reality. I turn ideas into visuals you can feel, from the first frame to the last.',
  hero_location: 'INDRAMAYU, INDONESIA',
  stat_years: '3', stat_years_label: 'YEARS IN THE CREATIVE INDUSTRY',
  stat_projects: '20', stat_projects_label: 'FILM & STORY PROJECTS',
  stat_awards: '10',
  cv_url: '',
  portrait_url: '',
  intro_text: 'Halo, saya Azizi, video editor dari Indramayu. Saya percaya setiap footage punya cerita yang layak dirangkai dengan rapi, dari potongan pertama sampai warna terakhir.',
  about_bio: 'Saya Azizi, video editor dari Indramayu. Saya bekerja di antara film, iklan, dan post-production, menggabungkan sisi kreatif dan teknis untuk membangun cerita yang punya rasa.',
  skills: ['Video Editing', 'Color Grading', 'Storytelling'],
  education: [
    { title: 'SMKN 1 Indramayu', meta: 'Animasi', text: 'Animation, visual effects, CGI & digital media.' },
    { title: 'Dalang Digital Studio', meta: '2023', text: '6-month VFX & post-production internship.' },
    { title: 'Courses & Workshops', meta: '', text: 'Videolabs · RifqiArt · Mindplace' },
  ],
  contact_email: 'hello.azizi@gmail.com',
  contact_instagram_handle: '@ceritazizi',
  contact_instagram_url: 'https://www.instagram.com/ceritazizi/',
  contact_whatsapp: '6285726073213',
  contact_phone_display: '+62 857-2607-3213',
  contact_location: 'Yogyakarta, Indonesia',
};

// Foto lama beresolusi kecil (374x667) diganti versi 4K lokal. Hapus pemetaan ini setelah foto 4K diunggah lewat admin.
const fixPortrait = u => (u && u.includes('1793960928054-Add_a_subheading-removebg-preview')) ? './Asset/img/azizi-portrait-4k.webp' : u;

// Nilai kontak lama di database dipakai-ulang hanya jika belum diubah lewat admin (menu Kontak).
const LEGACY_CONTACT = { contact_instagram_handle: '@dododididaw', contact_instagram_url: 'https://www.instagram.com/dododididaw/', contact_whatsapp: '6287786923444', contact_phone_display: '+62 877-8692-3444' };
const freshContact = d => { const o = { ...d }; Object.keys(LEGACY_CONTACT).forEach(k => { if (!o[k] || o[k] === LEGACY_CONTACT[k]) o[k] = DEFAULT_SETTINGS[k]; }); return o; };

function Reveal({ children, className = '', delay = 0, as = 'div' }) {
  const enabled = useContext(MotionContext);
  const Component = motion[as];
  return <Component className={className} initial={enabled ? { opacity: 0, y: 32 } : false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.12 }} transition={{ duration: enabled ? 0.75 : 0, delay, ease: EASE }}>{children}</Component>;
}

function WipeReveal({ children, className = '', as = 'h2', delay = 0 }) {
  const enabled = useContext(MotionContext);
  const Component = motion[as];
  return <Component className={className} initial={enabled ? { opacity: 0, y: 26 } : false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: enabled ? 0.8 : 0, delay, ease: EASE }}>{children}</Component>;
}

function MediaImage({ src, alt, className = '', priority = false, ...props }) {
  const [state, setState] = useState('loading');
  const imgRef = useRef(null);
  useEffect(() => {
    const img = imgRef.current;
    // Cached images can finish before React attaches onLoad.
    setState(img?.complete ? (img.naturalWidth ? 'loaded' : 'error') : 'loading');
  }, [src]);
  return <span className={`media-image ${state} ${className}`}>
    {state === 'error' && <span className="image-fallback"><span className="display">R.</span><span>Pratinjau tidak tersedia</span></span>}
    <img ref={imgRef} src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} width="960" height="600" onLoad={() => setState('loaded')} onError={e => {
      if (e.currentTarget.src.includes('maxresdefault.jpg')) e.currentTarget.src = e.currentTarget.src.replace('maxresdefault.jpg', 'hqdefault.jpg');
      else setState('error');
    }} {...props} />
  </span>;
}

function Magnetic({ children, className = '', ...props }) {
  const enabled = useContext(MotionContext);
  const x = useSpring(0, { stiffness: 220, damping: 20 });
  const y = useSpring(0, { stiffness: 220, damping: 20 });
  return <motion.a className={className} style={{ x, y }} onPointerMove={e => {
    if (!enabled || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.12); y.set((e.clientY - r.top - r.height / 2) * 0.2);
  }} onPointerLeave={() => { x.set(0); y.set(0); }} {...props}>{children}</motion.a>;
}

function CursorGlow() {
  const enabled = useContext(MotionContext);
  const x = useSpring(0, { stiffness: 500, damping: 42 });
  const y = useSpring(0, { stiffness: 500, damping: 42 });
  const scale = useSpring(1, { stiffness: 300, damping: 24 });
  useEffect(() => {
    if (!enabled) return;
    const move = e => { if (e.pointerType !== 'mouse') return; x.set(e.clientX); y.set(e.clientY); };
    const over = e => { if (e.pointerType !== 'mouse') return; if (e.target.closest('a,button,input,select,textarea,summary,.comparison-stage')) scale.set(2.4); };
    const out = e => { if (e.pointerType !== 'mouse') return; if (e.target.closest('a,button,input,select,textarea,summary,.comparison-stage')) scale.set(1); };
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over);
    document.addEventListener('pointerout', out);
    return () => { window.removeEventListener('pointermove', move); document.removeEventListener('pointerover', over); document.removeEventListener('pointerout', out); };
  }, [enabled]);
  if (!enabled) return null;
  return <motion.div className="cursor-glow" style={{ translateX: x, translateY: y, scale }} aria-hidden="true" />;
}

function Header({ enabled, onToggle, theme, onToggleTheme }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }), { rootMargin: '-15% 0px -65% 0px' });
    document.querySelectorAll('main > section[id]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, []);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
    <a className="wordmark" href="#home" aria-label="Azizi, beranda">Azizi<i className="live-dot" aria-hidden="true"/></a>
    <nav className="desktop-nav" aria-label="Main navigation">{[['portfolio', 'Work'], ['about', 'Process'], ['experience', 'Journey'], ['contact', 'Contact']].map(([id, label]) => <a key={id} href={`#${id}`} className={active === id ? 'active' : ''}>{label}</a>)}</nav>
    <div className="header-actions"><button className="motion-toggle" onClick={onToggle} aria-label={enabled ? 'Pause animations' : 'Enable animations'} aria-pressed={!enabled}>{enabled ? <Pause size={13} /> : <Play size={13} />}<span>Motion {enabled ? 'on' : 'off'}</span></button><button className="theme-toggle" onClick={onToggleTheme} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} aria-pressed={theme === 'dark'}><span className="theme-icon"><Sun className="i-sun" size={16}/><Moon className="i-moon" size={16}/></span></button><Magnetic href="#contact" className="header-contact"><span className="header-contact-label">Let’s talk</span><ArrowUpRight size={16} /></Magnetic><button className="menu-toggle icon-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'}>{open ? <X /> : <Menu />}</button></div>
    <AnimatePresence>{open && <motion.nav id="mobile-menu" className="mobile-menu" aria-label="Mobile navigation" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>{[['home', 'Home'], ['portfolio', 'Work'], ['about', 'Process'], ['experience', 'Journey'], ['contact', 'Contact']].map(([id, label], i) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}><span>0{i + 1}</span>{label}<ArrowUpRight size={18} /></a>)}</motion.nav>}</AnimatePresence>
  </header>;
}

function SplitText({ text, as = 'span', className = '', delay = 0, stagger = 0.03, rise = 26, rotate = 10, blur = 6, duration = 0.7, shine = false }) {
  const enabled = useContext(MotionContext);
  const Component = motion[as];
  if (!enabled) return <Component className={className}>{text}</Component>;
  return <Component className={className} aria-label={text}>{[...text].map((ch, i) => <motion.span key={i} className={shine ? 'split-char shine-char' : 'split-char'} style={shine ? { animationDelay: `${-5.74 + i * 0.09}s` } : undefined} initial={{ opacity: 0, y: rise, rotateZ: i % 2 === 0 ? -rotate : rotate, filter: `blur(${blur}px)` }} animate={{ opacity: 1, y: 0, rotateZ: 0, filter: 'blur(0px)' }} transition={{ duration, delay: delay + i * stagger, ease: [0.22, 1, 0.36, 1] }} aria-hidden="true">{ch === ' ' ? ' ' : ch}</motion.span>)}</Component>;
}

function CountUp({ to, duration = 1.4, delay = 0.3 }) {
  const enabled = useContext(MotionContext);
  const [value, setValue] = useState(enabled ? 0 : to);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  useEffect(() => {
    if (!enabled || !inView) return;
    const controls = animate(0, to, { duration, delay, ease: [0.22, 1, 0.36, 1], onUpdate: v => setValue(Math.round(v)) });
    return () => controls.stop();
  }, [enabled, inView, to, duration, delay]);
  return <span ref={ref}>{value}</span>;
}

const KW_A = /^(short-form videos?|ugc|high-converting|footage|cerita|film|iklan)$/i;
const KW_RE = /(\*\*.+?\*\*|short-form videos?|UGC|high-converting|move fast|viewer retention|visual pacing|clean execution|potongan pertama|warna terakhir|setiap footage)/gi;
function RichText({ text }) {
  if (!text) return null;
  return text.split(KW_RE).map((t, i) => {
    if (!t) return null;
    if (i % 2 === 0) return <React.Fragment key={i}>{t}</React.Fragment>;
    const manual = t.startsWith('**'), word = manual ? t.slice(2, -2) : t;
    return <mark key={i} className={manual || KW_A.test(word) ? 'hl-a' : 'hl-b'}>{word}</mark>;
  });
}

function Hero({ onProject, featured, settings }) {
  const ref = useRef(null);
  const enabled = useContext(MotionContext);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 85]);
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const portraitEntryY = useMotionValue(enabled ? 220 : 0);
  const portraitCombinedY = useTransform([portraitEntryY, portraitY], ([e, p]) => e + p);
  useEffect(() => {
    if (!enabled) return;
    const c1 = animate(portraitEntryY, 0, { duration: 1.1, delay: 0.2, ease: EASE });
    return () => { c1.stop(); };
  }, [enabled]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -55]);
  return <section id="home" className="hero" ref={ref}>
    <div className="hero-top"><span>{settings.hero_topline}<br/><span className="muted">{settings.hero_subtitle}</span></span></div>
    <motion.div className="hero-title display" aria-hidden="true" style={enabled ? { y: titleY } : {}}><SplitText text="Portfolio" delay={0.1} stagger={0.05} rise={50} rotate={6} blur={10} duration={0.9} shine/></motion.div>
    <motion.div className="hero-portrait" style={enabled ? { y: portraitCombinedY, scale: portraitScale } : {}}>{settings.portrait_url && <img src={settings.portrait_url} alt="Portrait of Azizi" width="1024" height="1536" fetchPriority="high" />}</motion.div>
    <motion.div className="hero-intro" style={enabled ? { y: copyY } : {}} initial={enabled ? { opacity: 0, x: -35 } : false} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.35, ease: EASE }}>
      <SplitText as="p" className="handwriting" text="Hi, I’m" delay={0.4} stagger={0.035}/><h1 className="display"><SplitText as="span" text="Azizi" delay={0.65} stagger={0.045}/><motion.span className="name-dot" initial={enabled ? { opacity: 0, y: 26, rotateZ: 10, filter: 'blur(6px)' } : false} animate={{ opacity: 1, y: 0, rotateZ: 0, filter: 'blur(0px)' }} transition={{ duration: 0.7, delay: 0.65 + 5 * 0.045, ease: [0.22, 1, 0.36, 1] }}>.</motion.span></h1><p className="hero-role"><span>{settings.hero_role_line1}</span><span>{settings.hero_role_line2}</span></p><p className="hero-description"><RichText text={settings.hero_description}/></p><div className="hero-skills">{(settings.skills || []).map(t => <span key={t}>{t}</span>)}</div>
      <div className="hero-actions"><Magnetic href="#portfolio" className="primary-link">View work <ArrowDown size={16}/></Magnetic>{settings.cv_url && <a className="secondary-link" href={settings.cv_url} target="_blank" rel="noopener noreferrer">View resume</a>}</div>
      <span className="hero-location"><MapPin size={12} /> {settings.hero_location}</span>
    </motion.div>
    <motion.div className="hero-side" initial={enabled ? { opacity: 0, x: 30 } : false} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.55, ease: EASE }}>
      
      <div className="hero-stats">{[[2, 'Years in creative industry', true], [20, 'Creative projects', true], [10, 'Achievements', true]].map(([n, label], i) => <div key={label}><span className="display"><CountUp to={n} delay={0.2 + i * 0.15}/><span>+</span></span><p>{label}</p></div>)}<div><span className="display stat-global">Global</span><p>International clients</p></div></div>
    </motion.div>
    <div className="hero-bottom"><span className="hero-scroll">Scroll to explore <ArrowDown size={13}/></span></div>
  </section>;
}

function ProjectCard({ project, index, onOpen }) {
  const enabled = useContext(MotionContext);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-12, 12]);
  const rotateX = useSpring(0, { stiffness: 220, damping: 22 });
  const rotateY = useSpring(0, { stiffness: 220, damping: 22 });
  const tilt = e => {
    if (!enabled || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    rotateY.set(((e.clientX - r.left) / r.width - 0.5) * 10);
    rotateX.set(((e.clientY - r.top) / r.height - 0.5) * -10);
  };
  const untilt = () => { rotateX.set(0); rotateY.set(0); };
  const video = ['youtube', 'drive', 'video'].includes(project.type);
  return <motion.article ref={ref} className="project-card" layout initial={enabled ? { opacity: 0, y: 32, scale: 0.96 } : false} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: false, amount: 0.08 }} transition={{ duration: enabled ? 0.6 : 0, delay: (index % 3) * 0.06, ease: EASE }} exit={{ opacity: 0, scale: 0.96 }}>
    <motion.button className="project-open" style={enabled ? { rotateX, rotateY, transformPerspective: 800 } : {}} onPointerMove={tilt} onPointerLeave={untilt} onClick={() => onOpen(project)} aria-label={`View ${project.title}`}><motion.div className="project-picture" style={enabled ? { y } : {}}><MediaImage src={project.image} alt={project.title}/></motion.div><span className="project-type">{project.type === 'render' ? '3D BREAKDOWN' : video ? 'FILM / VIDEO' : project.type === 'website' ? 'WEBSITE' : 'STILL / IMAGE'}</span><span className="project-hover">{video ? <Play fill="currentColor" size={18}/> : <ArrowUpRight size={22}/>}</span><span className="project-frame" aria-hidden="true" /></motion.button>
    <button className="project-caption" onClick={() => onOpen(project)}><span className="project-number display">{String(index + 1).padStart(2, '0')}</span><span><h3>{project.title}</h3><span className="project-category">{project.category}{project.year ? ` / ${project.year}` : ''}</span></span><ArrowUpRight size={20}/></button>
  </motion.article>;
}

function BrandStrip() {
  const enabled = useContext(MotionContext);
  const ref = useRef(null);
  const loopWidth = useRef(0);
  const inView = useInView(ref);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [showAll, setShowAll] = useState(false);
  useEffect(() => {
    if (!ref.current || showAll) return;
    const update = () => { loopWidth.current = ref.current?.querySelector('.brand-set')?.getBoundingClientRect().width || 0; };
    const observer = new ResizeObserver(update);
    observer.observe(ref.current); update();
    return () => observer.disconnect();
  }, [showAll]);
  useAnimationFrame((time, delta) => {
    if (!enabled || paused || interacting || !inView || showAll || !ref.current || !loopWidth.current) return;
    const el = ref.current;
    el.scrollLeft += Math.min(delta, 40) * 0.038;
    if (el.scrollLeft >= loopWidth.current) el.scrollLeft -= loopWidth.current;
  });
  const move = direction => { setPaused(true); ref.current?.scrollBy({ left: direction * ref.current.clientWidth * .7, behavior: enabled ? 'smooth' : 'instant' }); };
  return <Reveal className="brand-section"><div className="brand-heading"><p>BEEN PART OF<br/><strong>THE BIGGER PICTURE.</strong></p><div><button className="brand-all" onClick={() => setShowAll(v => !v)} aria-expanded={showAll} aria-controls="brand-collection">{showAll ? 'TAMPILKAN DERET' : `LIHAT SEMUA (${brands.length})`}{showAll ? <Minus size={14}/> : <Plus size={14}/>}</button>{!showAll && <><button className="icon-button brand-pause" aria-label={paused ? 'Putar animasi logo' : 'Jeda animasi logo'} aria-pressed={paused} onClick={() => setPaused(v => !v)}>{paused ? <Play size={13}/> : <Pause size={13}/>}</button><button className="icon-button" onClick={() => move(-1)} aria-label="Logo sebelumnya"><ChevronLeft size={17}/></button><button className="icon-button" onClick={() => move(1)} aria-label="Logo selanjutnya"><ChevronRight size={17}/></button></>}</div></div><div id="brand-collection" className={showAll ? 'brand-full-grid' : 'brand-viewport'} ref={ref} onPointerEnter={e => { if(e.pointerType==='mouse') setInteracting(true); }} onPointerLeave={() => setInteracting(false)} onPointerDown={() => setPaused(true)} onFocusCapture={() => setInteracting(true)} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setInteracting(false); }} tabIndex={showAll ? undefined : 0} role={showAll ? 'list' : 'region'} aria-label="Logo brand dan institusi, geser untuk melihat semuanya">
      {showAll ? brands.map(b => <div className="brand-logo" key={b.file} role="listitem"><img src={`./Asset/svg/brand/${b.file}`} alt={b.name} title={b.name} width="150" height="60" loading="lazy"/><span>{b.name}</span></div>) : <div className="brand-rail">{[0,1].map(copy => <div className="brand-set" key={copy} aria-hidden={copy === 1 ? true : undefined}>{brands.map(b => <div className="brand-logo" key={b.file}><img src={`./Asset/svg/brand/${b.file}`} alt={copy ? '' : b.name} title={b.name} width="150" height="60" loading="lazy" draggable="false"/></div>)}</div>)}</div>}
    </div></Reveal>;
}

const CLIENTS = [['vizard', 'Vizard', 111], ['agent-opus', 'Agent Opus', 131], ['twizl', 'Twizl', 124], ['cimb-niaga-syariah', 'CIMB Niaga Syariah', 142], ['trends-masterhooks', 'Trends by Masterhooks', 200]];
function ClientsStrip() {
  const enabled = useContext(MotionContext);
  return <section className="clients-section section-wrap" aria-label="Clients">
    <Reveal className="section-heading"><div><span className="eyebrow">Clients</span><WipeReveal as="h2">Brands I’ve worked with<span className="accent">.</span></WipeReveal></div><span className="clients-count">{CLIENTS.length} brands</span></Reveal>
    <ul className="clients-row">{CLIENTS.map(([f, n, w], i) => <motion.li key={f} style={{ '--d': `${i * 0.7}s` }} {...(enabled ? { initial: { opacity: 0, y: 30, rotate: -3 }, whileInView: { opacity: 1, y: 0, rotate: 0 }, viewport: { once: true, amount: 0.5 }, transition: { type: 'spring', stiffness: 200, damping: 16, delay: i * 0.1 } } : {})}>
      <span className="client-logo"><img src={`./Asset/img/clients/${f}.png`} alt={n} title={n} loading="lazy" height="44" width={w}/></span>
    </motion.li>)}</ul>
  </section>;
}

function Portfolio({ onProject, archive, featured, loading, categories }) {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [limit, setLimit] = useState(9);
  const results = archive.filter(p => (category === 'All' || p.category === category) && `${p.title} ${p.category} ${p.role}`.toLowerCase().includes(query.toLowerCase()));
  const projects = expanded || category !== 'All' || query ? results.slice(0, limit) : featured;
  return <section id="portfolio" className="portfolio section-wrap">
    <Reveal className="section-heading"><div><span className="eyebrow">Selected work</span><WipeReveal as="h2">Work that speaks<span className="accent">.</span></WipeReveal></div><button className="text-link" onClick={() => { if (expanded) { setExpanded(false); setCategory('All'); setQuery(''); } else { setExpanded(true); setLimit(9); } }}>{expanded ? 'Selected work' : 'All work'}<ArrowRight size={21}/></button></Reveal>
    <Reveal className="portfolio-toolbar">
      <div className="filters" role="group" aria-label="Work categories">
        {categories.map(c => <button key={c} className={category === c ? 'selected' : ''} aria-pressed={category === c} onClick={() => { setCategory(c); setExpanded(true); setLimit(9); }}>{c}{c === category && <motion.span className="filter-line" layoutId="filter-line"/>}</button>)}
      </div>
      <label className="search-box"><Search size={15}/><span>Search</span><input aria-label="Search work" type="search" placeholder="Title or category…" value={query} onChange={e => { setQuery(e.target.value); setExpanded(true); setLimit(9); }}/></label>
    </Reveal>
    <motion.div className="project-grid" layout><AnimatePresence mode="popLayout">{projects.map((p, i) => <ProjectCard key={p.category + p.title + p.media} project={p} index={i} onOpen={onProject}/>)}</AnimatePresence></motion.div>
    {loading && <div className="empty-state"><p>Loading work…</p></div>}
    {!loading && projects.length === 0 && <div className="empty-state"><p>No work found for “{query}”.</p><button className="text-link" onClick={() => { setQuery(''); setCategory('All'); }}>Reset search <X size={15}/></button></div>}
    {expanded && results.length > limit && <div className="load-more"><button className="outline-button" onClick={() => setLimit(v => v + 9)}>Show more work <Plus size={16}/></button><span>{projects.length} of {results.length} projects</span></div>}
  </section>;
}

const processSteps = [
  ['01', 'Idea', 'Listening to your story. Defining the message, the visual direction, and the feeling to carry.', ['Brief', 'References']],
  ['02', 'Plan', 'Developing the concept, references, and a workflow that fits what the production needs.', ['Storyboard', 'Workflow']],
  ['03', 'Craft', 'Editing, compositing, and visual effects. Shaping every detail into one story.', ['Editing', 'VFX']],
  ['04', 'Polish', 'Aligning color, rhythm, and sound. Making sure every frame does its job.', ['Color', 'Sound']],
  ['05', 'Final frame', 'Review together, final touches, then a result ready to meet its audience.', ['Review', 'Delivery']],
];
const PROCESS_ICONS = [Lightbulb, ClipboardList, Scissors, Palette, Flag];
const PROCESS_COLORS = [['#0a84ff', '#2f6bff'], ['#2f6bff', '#5e5ce6'], ['#5e5ce6', '#af52de'], ['#af52de', '#ff2d55'], ['#ff2d55', '#ff9500']];
function ProcessPanel() {
  const enabled = useContext(MotionContext);
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState(false);
  const N = processSteps.length, DUR = 5200;
  const playing = enabled && inView && !hover;
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => setActive(a => (a + 1) % N), DUR);
    return () => clearTimeout(t);
  }, [active, playing, N]);
  const [num, title, text, tags] = processSteps[active];
  const [c1, c2] = PROCESS_COLORS[active];
  const go = d => setActive(a => (a + d + N) % N);
  return <div className="process-panel pp"><Reveal><p className="eyebrow">Process</p><h3 className="panel-heading">From idea to final frame</h3></Reveal>
    <div className="pp-wrap" ref={ref} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div className="pp-tabs" role="tablist" aria-label="Process steps">
        {processSteps.map(([n, t], i) => { const Icon = PROCESS_ICONS[i]; const on = i === active; return <button key={n} role="tab" aria-selected={on} aria-label={`Step ${n}: ${t}`} className={`pp-tab${on ? ' on' : ''}`} onClick={() => setActive(i)}>
          {on && <motion.span layoutId="pp-pill" className="pp-pill" style={{ background: `linear-gradient(135deg, ${PROCESS_COLORS[i][0]}, ${PROCESS_COLORS[i][1]})` }} transition={{ type: 'spring', stiffness: 380, damping: 30 }}/>}
          <Icon size={16}/><span className="pp-tab-n">{n}</span>
        </button>; })}
      </div>
      <div className="pp-card" style={{ '--c1': c1, '--c2': c2 }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={active} className="pp-slide" role="tabpanel" initial={enabled ? { opacity: 0, x: 28 } : false} animate={{ opacity: 1, x: 0 }} exit={enabled ? { opacity: 0, x: -28 } : { opacity: 0 }} transition={{ duration: 0.32, ease: EASE }}>
            <p className="pp-step">Step {num} of {String(N).padStart(2, '0')}</p>
            <h4>{title}</h4>
            <p className="pp-desc">{text}</p>
            <div className="step-tags">{tags.map(t => <span key={t}>{t}</span>)}</div>
          </motion.div>
        </AnimatePresence>
        <div className="pp-foot">
          <div className="pp-dots">{processSteps.map((_, i) => <i key={i} className={i === active ? 'on' : ''}/>)}</div>
          <div className="pp-nav"><button onClick={() => go(-1)} aria-label="Previous step"><ChevronLeft size={18}/></button><button onClick={() => go(1)} aria-label="Next step"><ChevronRight size={18}/></button></div>
        </div>
        <div className="pp-bar" aria-hidden="true"><motion.i key={`${active}-${playing}`} initial={{ scaleX: 0 }} animate={{ scaleX: playing ? 1 : 0 }} transition={{ duration: playing ? DUR / 1000 : 0, ease: 'linear' }}/></div>
      </div>
    </div>
  </div>;
}
function Awards({onProject, awards, certificates}) {
  const [expanded,setExpanded] = useState(false);
  const laurelPath = 'M48 94C8 68 9 30 35 5M22 61C8 60 3 49 3 44c12 0 19 6 19 17zm-5-19C5 35 6 23 8 19c11 5 13 14 9 23zm7-20C15 12 20 3 24 0c7 8 6 16 0 22zM31 79C17 79 8 70 7 64c13-2 22 4 24 15zm-3-18c-5-10-2-19 7-25 5 11 1 20-7 25zm10 24c-6-11-4-20 5-27 6 9 5 20-5 27z';
  return <section id="awards" className={`recognition section-wrap ${expanded ? 'awards-expanded' : ''}`}>
    <Reveal className="recognition-intro">
      <span className="eyebrow">RECOGNITION & AWARDS</span>
      <WipeReveal as="h2" className="display">THE WORK.<br/><span className="accent">THE RECOGNITION.</span></WipeReveal>
      <div className="award-total">
        <svg viewBox="0 0 60 100" aria-hidden="true"><path d={laurelPath} fill="currentColor"/></svg>
        <span className="display">{awards.length}<span>+</span></span>
        <svg viewBox="0 0 60 100" aria-hidden="true"><g transform="translate(60 0) scale(-1 1)"><path d={laurelPath} fill="currentColor"/></g></svg>
        <span className="award-total-label">AWARDS WON</span>
      </div>
      <p>Cerita yang dibuat dengan sepenuh hati.<br/>Penghargaan yang jadi alasan untuk terus berkarya.</p>
      {certificates[0] && <button className="text-link award-proof" onClick={()=>onProject({...certificates[0],type:'image',media:certificates[0].image,category:'Award',description:`${certificates[0].title}${certificates[0].year ? ', ' + certificates[0].year : ''}.`})}>LIHAT SERTIFIKAT<ArrowUpRight size={18}/></button>}
    </Reveal>
    <div className="recognition-list">
      <div className="recognition-list-head"><span>SELECTED RECOGNITION</span><span>2020 – 2025</span></div>
      <ol id="recognition-list">{awards.map((award,i)=><Reveal as="li" className={`recognition-row ${i>2?'additional-award':''}`} key={award.id || award.year + i} delay={i*.045}>
        <span className="award-index">0{i+1}</span>
        <div><h3>{award.title}</h3><p>{award.event}</p></div>
        <span className="award-year display">{award.year}</span>
      </Reveal>)}</ol>
      <button className="award-expand" aria-expanded={expanded} aria-controls="recognition-list" onClick={()=>setExpanded(v=>!v)}>{expanded?'Ringkas penghargaan':'Lihat penghargaan lainnya'}{expanded?<Minus size={16}/>:<Plus size={16}/>}</button>
    </div>
  </section>;
}
function Breakdown() {
  const scene = featured.find(p => p.type === 'render');
  const ref = useRef(null);
  const enabled = useContext(MotionContext);
  const [manual, setManual] = useState(false);
  const [cut, setCut] = useState(65);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  useMotionValueEvent(scrollYProgress, 'change', v => { if (!manual && enabled) setCut(Math.round(90 - v * 80)); });
  const titleX = useTransform(scrollYProgress, [0, 1], [30, -30]);
  if (!scene) return null;
  const resize = url => url.replace('/upload/', '/upload/c_scale,w_1200,q_auto,f_auto/');
  return <section className="breakdown section-wrap" ref={ref} aria-labelledby="breakdown-title"><Reveal className="breakdown-copy"><span className="eyebrow">A LOOK UNDER THE SURFACE</span><motion.h2 id="breakdown-title" className="display" style={enabled ? { x: titleX } : {}} initial={enabled ? { clipPath: 'inset(0 0 100% 0)' } : false} whileInView={{ clipPath: 'inset(0 0 0% 0)' }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: enabled ? 0.85 : 0, ease: EASE }}>FROM RAW.<br/><span className="accent">TO REAL.</span></motion.h2><p>Satu scene. Berlapis proses.<br/>Lihat bagaimana sebuah 3D environment berubah dari bentuk dasar menjadi dunia yang hidup.</p><span className="breakdown-credit">CYBERPUNK ENVIRONMENT / 2025<br/>3D ARTIST · LIGHTING · RENDERING</span></Reveal><Reveal className="comparison"><div className="comparison-stage" style={{'--cut': `${enabled || manual ? cut : 50}%`}}><MediaImage src={resize(scene.renders[0].solid)} alt="Cyberpunk environment sebelum material dan pencahayaan"/><div className="comparison-final"><MediaImage src={resize(scene.renders[0].final)} alt="Cyberpunk environment hasil render akhir"/></div><span className="comparison-label raw-label">SOLID VIEW</span><span className="comparison-label final-label">FINAL RENDER</span><div className="comparison-divider"><span><ChevronLeft size={14}/><ChevronRight size={14}/></span></div><input aria-label="Perbandingan sebelum dan sesudah render" aria-valuetext={`${cut}% solid, ${100-cut}% final render`} type="range" min="0" max="100" value={cut} onChange={e => { setManual(true); setCut(Number(e.target.value)); }}/></div><div className="comparison-caption"><span>GESER UNTUK MELIHAT PROSESNYA</span><span>DRAG / SCROLL</span></div></Reveal></section>;
}
function About({ settings }) {
  const enabled = useContext(MotionContext);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 75%'] });
  const education = settings.education || [];
  const skills = settings.skills || [];
  return <section id="about" className="about section-wrap" ref={ref}>
    <div className="tp-grid">
      <ToolsStrip settings={settings}/>
      <ProcessPanel/>
    </div>
  </section>;
}

const EXP_EN = {
  'Mengembangkan konsep dan naskah film pendek, serta memproduksi konten sinematik untuk brand café, fashion, dan hijab. Dari storytelling sampai penyelesaian visual.': 'Developing concepts and scripts for short films, and producing cinematic content for café, fashion, and hijab brands. From storytelling to final visuals.',
  'Compositing, CGI, matchmove, rotoscoping, dan breakdown editing. Terlibat dalam supervisi pengambilan gambar untuk kebutuhan post-production.': 'Compositing, CGI, matchmove, rotoscoping, and breakdown editing. Involved in on-set supervision for post-production needs.',
  'Terlibat dalam produksi film dan iklan, mempelajari pipeline studio, serta berkolaborasi dalam workflow visual effects dan animasi.': 'Contributed to film and commercial production, learned the studio pipeline, and collaborated on visual effects and animation workflows.',
  'Menyunting video review hotel untuk YouTube, memotret pernikahan, dan berkolaborasi dalam film pendek sebagai editor dan aktor.': 'Edited hotel review videos for YouTube, photographed weddings, and collaborated on short films as an editor and actor.',
  'Membuat konten gaming, coding, film pendek, dan eksperimen VFX. Tempat saya mencoba ide dan terus mengembangkan cara bercerita.': 'Creating gaming, coding, short film, and VFX experiment content. A place to try ideas and keep growing as a storyteller.',
  'SEKARANG': 'PRESENT', 'BULAN': 'MONTHS',
};
const CERT_EN = { 'Juara 1 Movie Event': '1st Place, Movie Event', 'Lulusan Terbaik 2': '2nd Best Graduate' };
const tEn = t => (t && EXP_EN[t]) || t;
const STAT_EN = { 'TAHUN DI INDUSTRI KREATIF': 'YEARS IN THE CREATIVE INDUSTRY', 'PROYEK FILM DAN CERITA': 'FILM & STORY PROJECTS' };
const dateEn = d => d ? d.replace('SEKARANG', 'PRESENT').replace('BULAN', 'MONTHS') : d;
const richOf = t => toHtml(tEn(t));
const shortOf = t => summaryOf(tEn(t));

function ExperienceModal({ experiences, onClose }) {
  const enabled = useContext(MotionContext);
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [onClose]);
  return <motion.div className="exp-backdrop" role="dialog" aria-modal="true" aria-labelledby="exp-title" onClick={onClose} initial={enabled ? { opacity: 0 } : false} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
    <motion.div className="exp-modal" onClick={e => e.stopPropagation()} initial={enabled ? { opacity: 0, y: 40, scale: 0.97 } : false} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.98 }} transition={{ type: 'spring', stiffness: 260, damping: 28 }}>
      <header className="exp-head"><div><p className="eyebrow">Experience</p><h3 id="exp-title">Work experience</h3></div><button className="exp-close" onClick={onClose} aria-label="Close"><X size={18}/></button></header>
      <div className="exp-body">
        {experiences.map(job => <article className="exp-item" key={job.id || job.title}>
          <p className="exp-date">{dateEn(job.date_label)}</p>
          <h4>{job.title}</h4>
          {job.place && <p className="exp-company">{job.place}</p>}
          <div className="exp-rich" dangerouslySetInnerHTML={{ __html: richOf(job.description) }}/>
        </article>)}
      </div>
    </motion.div>
  </motion.div>;
}

function Journey({ onProject, experiences, certificates, settings }) {
  const [details, setDetails] = useState(false);
  const education = settings.education || [];
  const skills = settings.skills || [];
  return <section id="experience" className="journey section-wrap">
    <Reveal className="section-heading"><div><span className="eyebrow">Journey</span><WipeReveal as="h2">Always moving. Always creating<span className="accent">.</span></WipeReveal></div></Reveal>
    <div className="journey-grid"><Reveal className="education-panel"><h3 className="panel-heading">Education & skills</h3><p className="eyebrow accent">Education</p>{education.map((e, i) => <div className="education-row" key={e.title + i}><strong>{e.title}</strong>{e.meta && <span>{e.meta}</span>}<p>{e.text}</p></div>)}<p className="eyebrow accent skills-heading">Creative toolkit</p><div className="skill-tags">{skills.map(s => <span key={s}>{s}</span>)}</div></Reveal>
    <div className="experience-list">
      <div className="exp-list-head"><h3 className="panel-heading">Experience</h3><button className="exp-more" onClick={() => setDetails(true)}>View details<ChevronRight size={16}/></button></div>
      {experiences.slice(0, 3).map((job, i) => <Reveal className="experience-row exp-static" key={job.id || job.title} delay={i * 0.04}><span className="experience-date">{dateEn(job.date_label)}</span><div><h3>{job.title}</h3><span className="experience-place">{job.place}</span>{job.description && <p className="exp-short">{shortOf(job.description)}</p>}</div></Reveal>)}
    </div></div>
    <AnimatePresence>{details && <ExperienceModal experiences={experiences} onClose={() => setDetails(false)}/>}</AnimatePresence>
  </section>;
}

function Contact({ onProject, featured, settings }) {
  const [sent, setSent] = useState(false);
  const send = e => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const text = `Hi Azizi, I’m ${data.get('name')}.\n\nProject type: ${data.get('type')}\n${data.get('message')}`;
    window.open(`https://wa.me/${settings.contact_whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    setSent(true);
  };
  return <section id="contact" className="contact section-wrap">
    <div className="contact-grid"><Reveal className="contact-intro"><span className="eyebrow">Contact</span><WipeReveal as="h2" className="display">Let’s work<br/>together<span className="accent">.</span></WipeReveal><p>Have a story to tell?<br/>Let’s make something worth watching.</p><div className="contact-actions"><Magnetic href={`https://wa.me/${settings.contact_whatsapp}`} target="_blank" rel="noopener noreferrer" className="contact-cta contact-btn"><span className="round-arrow"><ArrowUpRight size={21}/></span>Start a conversation</Magnetic><a className="contact-secondary contact-btn" href={`mailto:${settings.contact_email}`}>Send an email</a>{settings.cv_url && <a className="contact-resume contact-btn" href={settings.cv_url} target="_blank" rel="noopener noreferrer"><Download size={18}/>View resume</a>}</div></Reveal>
    <Reveal className="contact-links" delay={0.1}><a href={`mailto:${settings.contact_email}`}><Mail/><span><small>Email</small>{settings.contact_email}</span><ArrowUpRight size={16}/></a><a href={settings.contact_instagram_url} target="_blank" rel="noopener noreferrer"><Instagram/><span><small>Instagram</small>{settings.contact_instagram_handle}</span><ArrowUpRight size={16}/></a><a href={`tel:+${settings.contact_whatsapp}`}><Phone/><span><small>Phone / WhatsApp</small>{settings.contact_phone_display}</span><ArrowUpRight size={16}/></a><div><MapPin/><span><small>Based in</small>{(/^indramayu/i.test(settings.contact_location || '') ? (settings.hero_location || '') : (settings.contact_location || settings.hero_location || '')).replace(/[\u{1F1E6}-\u{1F1FF}]/gu, '').trim().replace(/(^|[\s,])([A-Za-z])([A-Za-z]*)/g, (m, sp, f, r) => sp + f.toUpperCase() + r.toLowerCase())}</span></div></Reveal>
</div>
    <Reveal><details className="project-brief"><summary><span className="brief-icon"><MessageCircle size={22}/></span><span className="brief-text"><b>Tell me about your project</b><small>Share your idea, needs, and timeline. It opens as a draft in WhatsApp.</small></span><span className="brief-chips" aria-hidden="true"><i>Film</i><i>Commercial</i><i>Collab</i></span><Plus size={19}/></summary><form onSubmit={send}><label>Your name<input name="name" required placeholder="Name or brand" autoComplete="name" maxLength="100"/></label><label>Project type<select name="type"><option>Film & Video Editing</option><option>Commercial Content</option><option>Other collaboration</option></select></label><label className="brief-message">About the project<textarea name="message" required rows="3" placeholder="Share your idea, needs, and rough timeline…" maxLength="3000"/></label><button className="solid-button" type="submit">Continue on WhatsApp <ArrowUpRight size={18}/></button><p className="form-note" role="status">{sent ? 'Message drafted in WhatsApp. Press Send there to start the conversation.' : 'Your brief opens as a draft message in WhatsApp.'}</p></form></details></Reveal>
  </section>;
}

function ProjectDialog({ project, onClose }) {
  const ref = useRef(null);
  const [renderMode, setRenderMode] = useState('final');
  const [shot, setShot] = useState(0);
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [mediaFailed, setMediaFailed] = useState(false);
  const [retried, setRetried] = useState(0);
  const enabled = useContext(MotionContext);
  const activeShot = project.type === 'render' ? project.renders[shot] : null;
  const embedType = activeShot?.video ? 'youtube' : activeShot?.drive ? 'drive' : project.type;
  const embedMedia = activeShot?.video || activeShot?.drive?.match(/\/d\/([^/]+)/)?.[1] || project.media;
  const isVideo = ['youtube', 'drive'].includes(embedType);
  const isUpload = project.type === 'video';
  const availableModes = [['layout', 'Layout'], ['solid', 'Solid'], ['material', 'Material'], ['lighting', 'Lighting'], ['final', 'Final render']].filter(([mode]) => activeShot?.[mode] && !(mode === 'solid' && activeShot.hideSolidMode));
  const effectiveMode = activeShot?.[renderMode] ? renderMode : availableModes[0]?.[0];
  const rendered = activeShot?.[effectiveMode] || activeShot?.image || project.image;
  const sourceUrl = embedType === 'youtube' ? `https://www.youtube.com/watch?v=${embedMedia}` : embedType === 'drive' ? `https://drive.google.com/file/d/${embedMedia}/view` : project.type === 'render' ? rendered : isUpload ? '' : project.media || project.image;
  const changeShot = next => { setMediaLoaded(false); setMediaFailed(false); setShot(next); };
  useEffect(() => {
    const previous = document.activeElement;
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current?.focus();
    const listener = e => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const nodes = [...ref.current.querySelectorAll('button, a[href], input, select, textarea, iframe')].filter(n => !n.disabled && n.getClientRects().length);
        const first = nodes[0]; const last = nodes.at(-1);
        if (e.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener('keydown', listener);
    return () => { document.body.style.overflow = old; window.removeEventListener('keydown', listener); previous?.focus(); };
  }, [onClose]);
  useEffect(() => {
    if (!isVideo) return;
    const timer = setTimeout(() => { if (!mediaLoaded) setMediaFailed(true); }, 14000);
    return () => clearTimeout(timer);
  }, [mediaLoaded, retried, isVideo, embedMedia]);
  return <motion.div className="dialog-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <motion.div ref={ref} className="project-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" tabIndex="-1" initial={enabled ? { y: 45, scale: 0.97 } : false} animate={{ y: 0, scale: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}>
      <div className="dialog-heading"><span className="eyebrow">{project.category} {project.year && ` / ${project.year}`}</span><button onClick={onClose} className="icon-button" aria-label="Close"><X/></button></div>
      <div className={`dialog-media ${!isVideo && !isUpload ? 'still' : ''}${isUpload ? ' native' : ''}`}>
        {isVideo ? <>{!mediaLoaded && <div className="media-loading" role="status">{mediaFailed ? <><p>Preview unavailable. Open the original source to watch.</p><button className="outline-button" onClick={() => { setMediaFailed(false); setMediaLoaded(false); setRetried(v => v + 1); }}>Coba lagi</button></> : <><span className={enabled ? 'loading-ring' : 'loading-ring paused'}/><p>Loading film…</p></>}</div>}<iframe key={`${embedMedia}-${retried}`} src={embedType === 'youtube' ? `https://www.youtube-nocookie.com/embed/${embedMedia}?autoplay=1&rel=0` : `https://drive.google.com/file/d/${embedMedia}/preview`} title={project.title} width="1280" height="720" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen onLoad={() => { setMediaLoaded(true); setMediaFailed(false); }} onError={() => setMediaFailed(true)}/></> : isUpload ? <video key={project.media} src={project.media} poster={project.image || undefined} controls autoPlay playsInline preload="metadata" controlsList="nodownload"/> : <MediaImage src={rendered} alt={project.title} priority/>}
      </div>
      {project.type === 'render' && (availableModes.length > 0 || project.renders.length > 1) && <div className="render-controls"><div role="group" aria-label="Tahap render">{availableModes.map(([mode, label]) => <button key={mode} className={effectiveMode === mode ? 'selected' : ''} onClick={() => setRenderMode(mode)} aria-pressed={effectiveMode === mode}>{label}</button>)}</div>{project.renders.length > 1 && <div className="shot-controls"><button className="icon-button" aria-label="Shot sebelumnya" onClick={() => changeShot((shot - 1 + project.renders.length) % project.renders.length)}><ChevronLeft/></button><span>SHOT {shot + 1} / {project.renders.length}</span><button className="icon-button" aria-label="Shot selanjutnya" onClick={() => changeShot((shot + 1) % project.renders.length)}><ChevronRight/></button></div>}</div>}
      <div className="dialog-description"><div><h2 id="dialog-title">{project.title}</h2>{project.role && <span className="accent">{project.role}</span>}<p>{project.description}</p></div>{sourceUrl && <a className="outline-button" href={sourceUrl} target="_blank" rel="noopener noreferrer">{project.type === 'website' ? 'Kunjungi website' : 'Open original source'}<ExternalLink size={15}/></a>}</div>
      {isVideo && <p className="embed-note">Jika video dibatasi oleh pemiliknya, gunakan “Open original source”.</p>}
    </motion.div>
  </motion.div>;
}

const STRIP_TOOLS = [['cc', 'CapCut', './Asset/svg/cc.svg'], ['pr', 'Premiere Pro', './Asset/svg/pr.svg'], ['ae', 'After Effects', './Asset/svg/ae.svg'], ['tool-green', 'Affinity by Canva', './Asset/img/tools/tool-green.png']];
function ToolsStrip({ settings }) {
  const enabled = useContext(MotionContext);
  const skills = settings.skills || [];
  const pop = i => enabled ? { initial: { opacity: 0, y: 36, scale: 0.55 }, whileInView: { opacity: 1, y: 0, scale: 1 }, viewport: { once: true, amount: 0.6 }, transition: { type: 'spring', stiffness: 260, damping: 15, delay: 0.1 + i * 0.09 } } : {};
  return <div className="tools-col" aria-label="Tools and skills">
    <Reveal><p className="eyebrow">Toolkit</p><h3 className="panel-heading">The tools behind the work</h3></Reveal>
    <div className="tools-wrap">
      <ul className="dock" aria-label="Tools I edit with">{STRIP_TOOLS.map(([f, n, src], i) => <motion.li className="dock-item" key={f} {...pop(i)}>
        <img src={src} alt={n || 'Tool'} width="64" height="64" draggable="false"/>
        {n && <span className="dock-tip">{n}</span>}
      </motion.li>)}</ul>
      <ul className="skill-pills">{skills.map((t, i) => <motion.li key={t} {...(enabled ? { initial: { opacity: 0, x: 24 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true, amount: 0.6 }, transition: { duration: 0.6, delay: 0.5 + i * 0.1, ease: EASE } } : {})}>{t}</motion.li>)}</ul>
    </div>
  </div>;
}

function FloatingCTA() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let past = false, atContact = false;
    const upd = () => setShow(past && !atContact);
    const onScroll = () => { past = window.scrollY > 600; upd(); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const c = document.getElementById('contact');
    const io = c ? new IntersectionObserver(([e]) => { atContact = e.isIntersecting; upd(); }, { threshold: 0.25 }) : null;
    if (io) io.observe(c);
    return () => { window.removeEventListener('scroll', onScroll); io && io.disconnect(); };
  }, []);
  return <a className={`float-cta${show ? ' on' : ''}`} href="#contact" tabIndex={show ? 0 : -1} aria-hidden={!show}><Briefcase size={17}/>Work with Azizi</a>;
}

function FloatingPortrait({ portraitUrl }) {
  const enabled = useContext(MotionContext);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    const hero = document.getElementById('home');
    const about = document.getElementById('contact');
    if (!hero || !about) return;
    let heroPast = false, aboutReached = false;
    const update = () => setVisible(heroPast && !aboutReached);
    const heroObs = new IntersectionObserver(([e]) => { heroPast = !e.isIntersecting && e.boundingClientRect.top < 0; update(); }, { threshold: 0 });
    const aboutObs = new IntersectionObserver(([e]) => { aboutReached = e.isIntersecting; update(); }, { threshold: 0.15 });
    heroObs.observe(hero);
    aboutObs.observe(about);
    return () => { heroObs.disconnect(); aboutObs.disconnect(); };
  }, [enabled]);
  if (!enabled) return null;
  return <AnimatePresence>{visible && <motion.div className="floating-portrait" aria-hidden="true" initial={{ opacity: 0, scale: 0.6, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.6, y: -20 }} transition={{ duration: 0.5, ease: EASE }}>{portraitUrl && <img src={portraitUrl} alt=""/>}</motion.div>}</AnimatePresence>;
}

function App() {
  const reduced = useReducedMotion();
  const [motionOn, setMotionOn] = useState(() => { try { return localStorage.getItem('azizi-motion') !== 'off'; } catch { return true; } });
  const enabled = motionOn && !reduced;
  const [theme, setTheme] = useState(() => { try { const t = localStorage.getItem('azizi-theme'); return t === 'dark' ? 'dark' : 'light'; } catch { return 'light'; } });
  const [project, setProject] = useState(null);
  const [archive, setArchive] = useState([]);
  const [archiveLoading, setArchiveLoading] = useState(true);
  useEffect(() => {
    let active = true;
    supabase.from('projects').select('*').order('created_at', { ascending: true }).then(({ data, error }) => {
      if (!active) return;
      if (error) { console.error('Gagal memuat karya dari Supabase:', error.message); setArchive([]); }
      else setArchive(data || []);
      setArchiveLoading(false);
    });
    return () => { active = false; };
  }, []);
  const featured = useMemo(() => FEATURED_KEYS.map(key => archive.find(p => p.media === key || p.title === key)).filter(Boolean), [archive]);
  const [settings, setSettings] = useState(() => {
    let cached = '';
    try { cached = localStorage.getItem('azizi-portrait') || ''; } catch {}
    let cv = ''; try { cv = localStorage.getItem('azizi-cv') || ''; } catch {}
    return { ...DEFAULT_SETTINGS, portrait_url: fixPortrait(cached), cv_url: cv };
  });
  const [experiences, setExperiences] = useState(DEFAULT_EXPERIENCES);
  const [awards, setAwards] = useState(DEFAULT_AWARDS);
  const [certificates, setCertificates] = useState(DEFAULT_CERTIFICATES);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  useEffect(() => {
    let active = true;
    supabase.from('site_settings').select('*').eq('id', 1).single().then(({ data, error }) => {
      if (!active) return;
      if (!error && data) {
        setSettings(s => ({ ...s, ...freshContact(data), portrait_url: fixPortrait(data.portrait_url) }));
        try { if (data.portrait_url) localStorage.setItem('azizi-portrait', fixPortrait(data.portrait_url)); if (data.cv_url) localStorage.setItem('azizi-cv', data.cv_url); else localStorage.removeItem('azizi-cv'); } catch {}
      }
      setSettings(s => s.portrait_url ? s : { ...s, portrait_url: './Asset/img/azizi-portrait.png' });
    });
    supabase.from('experience').select('*').order('sort_order', { ascending: true }).then(({ data, error }) => {
      if (active && !error && data && data.length) setExperiences(data);
    });
    supabase.from('awards').select('*').order('sort_order', { ascending: true }).then(({ data, error }) => {
      if (active && !error && data && data.length) setAwards(data);
    });
    supabase.from('certificates').select('*').order('sort_order', { ascending: true }).then(({ data, error }) => {
      if (active && !error && data && data.length) setCertificates(data);
    });
    supabase.from('categories').select('*').order('sort_order', { ascending: true }).then(({ data, error }) => {
      if (active && !error && data && data.length) setCategories(['All', ...data.map(c => c.name)]);
    });
    return () => { active = false; };
  }, []);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 28, restDelta: 0.001 });
  useEffect(() => { document.documentElement.dataset.motion = enabled ? 'on' : 'off'; }, [enabled]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#1a1f2b' : '#f7f8fb');
    try { localStorage.setItem('azizi-theme', theme); } catch {}
  }, [theme]);
  const toggleTheme = e => {
    const next = theme === 'dark' ? 'light' : 'dark';
    const root = document.documentElement;
    if (!enabled) { setTheme(next); return; }
    const r = e && e.currentTarget ? e.currentTarget.getBoundingClientRect() : null;
    const x = r ? r.left + r.width / 2 : window.innerWidth - 60, y = r ? r.top + r.height / 2 : 40;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    if (document.startViewTransition) {
      root.dataset.vt = 'on';
      const t = document.startViewTransition(() => { flushSync(() => setTheme(next)); root.dataset.theme = next; });
      t.ready.then(() => root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] }, { duration: 650, easing: 'cubic-bezier(.4,0,.2,1)', pseudoElement: '::view-transition-new(root)' })).catch(() => {});
      t.finished.finally(() => { delete root.dataset.vt; });
    } else {
      root.classList.add('theme-fade');
      setTheme(next);
      setTimeout(() => root.classList.remove('theme-fade'), 600);
    }
  };
  const toggle = () => { setMotionOn(!motionOn); try { localStorage.setItem('azizi-motion', motionOn ? 'off' : 'on'); } catch {} };
    const close = React.useCallback(() => setProject(null), []);
  return <MotionContext.Provider value={enabled}>
    <MotionConfig reducedMotion={enabled ? 'user' : 'always'} transition={{ ease: EASE }}>
      <a className="skip-link" href="#portfolio">Skip to work</a>
      <FloatingPortrait portraitUrl={settings.portrait_url}/>
      <FloatingCTA/>
      <motion.div className="reading-progress" style={{ scaleX: enabled ? progress : scrollYProgress }}/>
      <Header enabled={enabled} onToggle={toggle} theme={theme} onToggleTheme={toggleTheme}/>
      <main>
        <Hero onProject={setProject} featured={featured} settings={settings}/>
        <ClientsStrip/>
        <About settings={settings}/>
        <Portfolio onProject={setProject} archive={archive} featured={featured} loading={archiveLoading} categories={categories}/>
        <Journey onProject={setProject} experiences={experiences} certificates={certificates} settings={settings}/>
        <Contact onProject={setProject} featured={featured} settings={settings}/>
      </main>
      <footer className="footer">
        <a className="wordmark" href="#home">Azizi</a>
        <span>© {new Date().getFullYear()} Azizi. Every frame has a purpose.</span>
        <div>
          <a href={settings.contact_instagram_url} target="_blank" rel="noopener noreferrer" aria-label={`Instagram ${settings.contact_instagram_handle}`}><Instagram size={17}/></a>
          <a href="#home" aria-label="Kembali ke atas"><ArrowUpRight size={18}/></a>
        </div>
      </footer>
      <AnimatePresence>{project && <ProjectDialog key={project.title} project={project} onClose={close}/>}</AnimatePresence>
    </MotionConfig>
  </MotionContext.Provider>;
}

createRoot(document.getElementById('root')).render(<App/>);
