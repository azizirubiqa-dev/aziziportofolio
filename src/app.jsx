import React, { useState, useEffect, useRef, useContext, useMemo, createContext } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence, MotionConfig, useScroll, useTransform, useSpring, useReducedMotion, useMotionValueEvent, useAnimationFrame, useInView, animate, useMotionValue } from 'framer-motion';
import { ArrowUpRight, ArrowDown, ArrowRight, Play, X, Menu, Mail, Phone, MapPin, Instagram, Youtube, Download, Pause, Search, Plus, Minus, ChevronLeft, ChevronRight, ExternalLink, Sun, Moon } from 'lucide-react';
import brands from './data/brands.json';
import { supabase } from './supabaseClient';
import './styles.css';

const MotionContext = createContext(true);
const EASE = [0.22, 1, 0.36, 1];
const DEFAULT_CATEGORIES = ['Semua', 'Film', 'Commercial'];
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
  hero_description: 'Merangkai cerita. Menciptakan realita. Saya mengubah ide menjadi visual yang terasa, dari frame pertama hingga terakhir.',
  hero_location: 'INDRAMAYU, INDONESIA',
  stat_years: '3', stat_years_label: 'TAHUN DI INDUSTRI KREATIF',
  stat_projects: '20', stat_projects_label: 'PROYEK FILM DAN CERITA',
  stat_awards: '10',
  cv_url: './Asset/cv/Azizi_Editor.pdf.pdf',
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
  contact_instagram_handle: '@dododididaw',
  contact_instagram_url: 'https://www.instagram.com/dododididaw/',
  contact_whatsapp: '6287786923444',
  contact_phone_display: '+62 877-8692-3444',
  contact_location: 'Indramayu, Indonesia',
};

function Reveal({ children, className = '', delay = 0, as = 'div' }) {
  const enabled = useContext(MotionContext);
  const Component = motion[as];
  return <Component className={className} initial={enabled ? { opacity: 0, y: 32 } : false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.12 }} transition={{ duration: enabled ? 0.75 : 0, delay, ease: EASE }}>{children}</Component>;
}

function WipeReveal({ children, className = '', as = 'h2', delay = 0 }) {
  const enabled = useContext(MotionContext);
  const Component = motion[as];
  return <Component className={className} initial={enabled ? { clipPath: 'inset(0 0 100% 0)' } : false} whileInView={{ clipPath: 'inset(0 0 0% 0)' }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: enabled ? 0.85 : 0, delay, ease: EASE }}>{children}</Component>;
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
    <a className="wordmark" href="#home" aria-label="Azizi, beranda">AZIZI<span>®</span><i className="live-dot" aria-hidden="true"/></a>
    <nav className="desktop-nav" aria-label="Navigasi utama">{[['portfolio', 'Karya'], ['awards', 'Awards'], ['about', 'Tentang'], ['experience', 'Perjalanan'], ['contact', 'Kontak']].map(([id, label]) => <a key={id} href={`#${id}`} className={active === id ? 'active' : ''}>{label}</a>)}</nav>
    <div className="header-actions"><button className="motion-toggle" onClick={onToggle} aria-label={enabled ? 'Jeda animasi' : 'Aktifkan animasi'} aria-pressed={!enabled}>{enabled ? <Pause size={13} /> : <Play size={13} />}<span>Motion {enabled ? 'on' : 'off'}</span></button><button className="theme-toggle" onClick={onToggleTheme} aria-label={theme === 'dark' ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'} aria-pressed={theme === 'light'}>{theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}<span>{theme === 'dark' ? 'Terang' : 'Gelap'}</span></button><Magnetic href="#contact" className="header-contact"><span className="header-contact-label">Let’s talk</span><ArrowUpRight size={16} /></Magnetic><button className="menu-toggle icon-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Tutup menu' : 'Buka menu'}>{open ? <X /> : <Menu />}</button></div>
    <AnimatePresence>{open && <motion.nav id="mobile-menu" className="mobile-menu" aria-label="Navigasi mobile" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>{[['home', 'Beranda'], ['portfolio', 'Karya'], ['awards', 'Awards'], ['about', 'Tentang'], ['experience', 'Perjalanan'], ['contact', 'Kontak']].map(([id, label], i) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}><span>0{i + 1}</span>{label}<ArrowUpRight size={18} /></a>)}</motion.nav>}</AnimatePresence>
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
  return <section id="home" className="hero" ref={ref} onMouseMove={e => {
    const img = e.currentTarget.querySelector('.hero-portrait img'); if (!img) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    img.style.setProperty('--ry', `${x * 14}deg`); img.style.setProperty('--rx', `${-y * 8}deg`);
  }} onMouseLeave={e => { const img = e.currentTarget.querySelector('.hero-portrait img'); if (img) { img.style.setProperty('--ry', '0deg'); img.style.setProperty('--rx', '0deg'); } }}>
    <div className="hero-top"><span>{settings.hero_topline}<br/><span className="muted">{settings.hero_subtitle}</span></span><span className="availability"><i />AVAILABLE FOR COLLABORATION</span></div>
    <motion.div className="hero-title display" aria-hidden="true" style={enabled ? { y: titleY } : {}}><SplitText text="PORTFOLIO" delay={0.1} stagger={0.05} rise={50} rotate={6} blur={10} duration={0.9} shine/></motion.div>
    <div className="hero-glow" aria-hidden="true" />
    <motion.div className="hero-portrait" style={enabled ? { y: portraitCombinedY, scale: portraitScale } : {}}>{settings.portrait_url && <img src={settings.portrait_url} alt="Azizi mengenakan blazer hitam dengan pencahayaan studio merah" width="1024" height="1536" fetchPriority="high" />}</motion.div>
    <motion.div className="hero-intro" style={enabled ? { y: copyY } : {}} initial={enabled ? { opacity: 0, x: -35 } : false} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.35, ease: EASE }}>
      <SplitText as="p" className="handwriting" text="Hello, I’m" delay={0.4} stagger={0.035}/><h1 className="display"><SplitText as="span" text="AZIZI" delay={0.65} stagger={0.045}/><motion.span className="name-dot" initial={enabled ? { opacity: 0, y: 26, rotateZ: 10, filter: 'blur(6px)' } : false} animate={{ opacity: 1, y: 0, rotateZ: 0, filter: 'blur(0px)' }} transition={{ duration: 0.7, delay: 0.65 + 5 * 0.045, ease: [0.22, 1, 0.36, 1] }}>.</motion.span></h1><p className="hero-role">{settings.hero_role_line1}<br />{settings.hero_role_line2}</p><p className="hero-description">{settings.hero_description}</p>
      <Magnetic href="#portfolio" className="primary-link">Lihat karya saya <ArrowDown size={17}/></Magnetic>
      <span className="hero-location"><MapPin size={12} /> {settings.hero_location}</span>
    </motion.div>
    <motion.div className="hero-side" initial={enabled ? { opacity: 0, x: 30 } : false} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.55, ease: EASE }}>
      <div className="hero-manifesto"><span className="crosshair" aria-hidden="true">✳</span><p>Every frame.<br />A different feeling.</p></div>
      <div className="hero-stats"><div><span className="display"><CountUp to={parseInt(settings.stat_years, 10) || 0} delay={0.2}/><span>+</span></span><p>{settings.stat_years_label}</p></div><div><span className="display"><CountUp to={parseInt(settings.stat_projects, 10) || 0} delay={0.35}/><span>+</span></span><p>{settings.stat_projects_label}</p></div><div className="hero-award-stat"><span className="display"><CountUp to={parseInt(settings.stat_awards, 10) || 0} delay={0.5}/><span>+</span></span><a href="#awards" aria-label="Lihat penghargaan Azizi">AWARDS WON<ArrowUpRight size={12}/></a></div><a href={settings.cv_url} download><Download size={16}/><span>DOWNLOAD CV</span></a></div>
    </motion.div>
    <div className="hero-bottom"><button className="reel-button" onClick={() => featured[0] && onProject(featured[0])}><span className="play-circle"><Play size={12} fill="currentColor" /></span>PLAY SHOWREEL<span className="muted">FILM / VIDEO</span></button><span className="hero-scroll">SCROLL TO DISCOVER <ArrowDown size={13}/></span><span className="edition">SELECTED WORK / 2022–2026</span></div>
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
  const video = ['youtube', 'drive'].includes(project.type);
  return <motion.article ref={ref} className="project-card" layout initial={enabled ? { opacity: 0, y: 32, scale: 0.96 } : false} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: false, amount: 0.08 }} transition={{ duration: enabled ? 0.6 : 0, delay: (index % 3) * 0.06, ease: EASE }} exit={{ opacity: 0, scale: 0.96 }}>
    <motion.button className="project-open" style={enabled ? { rotateX, rotateY, transformPerspective: 800 } : {}} onPointerMove={tilt} onPointerLeave={untilt} onClick={() => onOpen(project)} aria-label={`Lihat ${project.title}`}><motion.div className="project-picture" style={enabled ? { y } : {}}><MediaImage src={project.image} alt={project.title}/></motion.div><span className="project-type">{project.type === 'render' ? '3D BREAKDOWN' : video ? 'FILM / VIDEO' : project.type === 'website' ? 'WEBSITE' : 'STILL / IMAGE'}</span><span className="project-hover">{video ? <Play fill="currentColor" size={18}/> : <ArrowUpRight size={22}/>}</span><span className="project-frame" aria-hidden="true" /></motion.button>
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

const TOOLS = [['pr', 'Premiere Pro'], ['ae', 'After Effects'], ['lr', 'Lightroom'], ['cc', 'CapCut']];
const TOOL_META = { pr: ['#a78bfa', 'Premiere Pro', 'CUTTING & TIMELINE'], ae: ['#c4a8ff', 'After Effects', 'MOTION & VFX'], lr: ['#31a8ff', 'Lightroom', 'COLOR & PHOTO GRADE'], cc: ['#22e1d6', 'CapCut', 'QUICK CUTS & REELS'] };
function ToolOrbit() {
  const enabled = useContext(MotionContext);
  const box = useRef(null), ring = useRef(null), back = useRef(null), front = useRef(null);
  const refs = useRef([]);
  const hovered = useRef(-1), entered = useRef(-1), label = useRef(null);
  useEffect(() => {
    const fKey = TOOLS.map(() => ''), hv = TOOLS.map(() => 0), pos = TOOLS.map(() => ({ x: 0, y: 0, f: false }));
    const N = TOOLS.length, GAP = 0.28, DUR = 3.8, TOTAL = DUR + GAP * (N - 1);
    const sm = x => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
    const trails = TOOLS.map(() => []);
    let parts = [], waves = [], raf, start = enabled ? null : -1e9, spin = 0, last = performance.now(), landed = false;
    let io;
    if (enabled && box.current) {
      io = new IntersectionObserver(([e]) => { if (e.isIntersecting && start === null) { start = performance.now() + 500; io.disconnect(); } }, { threshold: 0.35 });
      io.observe(box.current);
    }
    const frame = now => {
      const dt = Math.min(now - last, 34); last = now;
      const bx = box.current; if (!bx) return;
      const W = bx.clientWidth, H = bx.clientHeight, dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const ctxs = [back.current, front.current].map(c => {
        if (c.width !== Math.round(W * dpr) || c.height !== Math.round(H * dpr)) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); }
        const g = c.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H); g.lineCap = 'round'; return g;
      });
      if (hovered.current < 0) spin += dt * 0.0004;
      const seq = start === null ? -1 : (now - start) / 1000;
      const Rx = W * 0.27, Ry = W * 0.27, cx = W * 0.52, cy = W * 0.56, rx0 = W * 0.42, ry0 = W * 0.17, yStart = H * 0.97;
      const ringA = Math.max(0, Math.min(1, (seq - TOTAL * 0.55) / 1.2));
      if (ring.current) {
        const st = ring.current.style; st.left = `${cx}px`; st.top = `${cy}px`; st.width = `${Rx * 2}px`; st.height = `${Ry * 2}px`;
        if (!landed && seq >= TOTAL) {
          landed = true; ring.current.classList.add('is-landed'); waves.push({ x: cx, y: cy, life: 0 }, { x: cx, y: cy, life: -180 });
          for (let k = 0; k < 70; k++) { const a = Math.random() * Math.PI * 2, v = 0.15 + Math.random() * 0.45; parts.push({ x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0, max: 700 + Math.random() * 700, s: 4 + Math.random() * 7, f: false, gold: Math.random() < .5, t: k % 3 }); }
        }
      }
      TOOLS.forEach((_, i) => {
        const el = refs.current[i]; if (!el) return;
        const u = Math.max(0, Math.min(1, (seq - i * GAP) / DUR));
        if (u <= 0) { el.style.opacity = '0'; return; }
        const e = sm(u), inv = 1 - e;
        const th = spin * e + i * (Math.PI / 2) * e - 5 * Math.PI * inv;
        const rx = Rx + (rx0 - Rx) * inv, ry = ry0 + (Ry - ry0) * e * e * e;
        const x = cx + Math.cos(th) * rx, y = cy + (yStart - cy) * inv + Math.sin(th) * ry;
        const d = Math.sin(th) * (1 - e * e * e), isFront = d > 0.1;
        const meta = TOOL_META[TOOLS[i][0]], col = meta[0], hh = (hv[i] += ((hovered.current === i ? 1 : 0) - hv[i]) * (1 - Math.exp(-dt / 70)));
        pos[i].x = x; pos[i].y = y; pos[i].f = isFront;
        el.style.zIndex = hh > 0.02 ? 5 : (isFront ? 3 : 0);
        el.style.opacity = String(Math.min(1, u * 10));
        el.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%) scale(${(1 + 0.22 * d) * (0.6 + 0.4 * Math.min(1, u * 6)) * (1 + 0.5 * hh + 0.06 * hh * Math.sin(now * 0.02))}) rotate(${inv * 540 + hh * Math.sin(now * 0.012) * 12}deg)`;
        const fk = hh > 0.03 ? col : 'n'; if (fKey[i] !== fk) { fKey[i] = fk; el.style.filter = fk === 'n' ? 'drop-shadow(0 0 14px rgba(239,65,81,.7))' : `drop-shadow(0 0 24px ${col}) drop-shadow(0 0 6px ${col}aa)`; }
        const tr = trails[i]; tr.push({ x, y, f: isFront }); if (tr.length > 40) tr.shift();
        if (enabled && entered.current === i) {
          entered.current = -1;
          waves.push({ x, y, life: 0, r: 40, col }, { x, y, life: -160, r: 40, col }, { x, y, life: -320, r: 40, col });
          for (let k = 0; k < 44; k++) { const a = (k / 44) * Math.PI * 2 + Math.random() * 0.3, v = 0.12 + Math.random() * 0.4; parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0, max: 600 + Math.random() * 600, s: 4 + Math.random() * 8, f: true, col, t: k % 5 === 4 ? 4 : k % 3, tw: Math.random() * 6 }); }
        }
        if (enabled && hh > 0.5 && hovered.current === i) {
          for (let k = 0; k < 4; k++) { const a = Math.random() * Math.PI * 2, r0 = 30 + Math.random() * 14; parts.push({ x: x + Math.cos(a) * r0, y: y + Math.sin(a) * r0, vx: Math.cos(a) * 0.05, vy: Math.sin(a) * 0.05 - 0.07, life: 0, max: 500 + Math.random() * 500, s: 6 + Math.random() * 10, f: true, col, t: k === 0 ? 3 : (k === 1 ? 4 : k % 3), tw: Math.random() * 6 }); }
          const g = ctxs[1], tm = now * 0.003; g.save(); g.translate(x, y); g.strokeStyle = col; g.lineWidth = 2.5; g.setLineDash([10, 8]); g.rotate(tm); g.beginPath(); g.arc(0, 0, 54, 0, Math.PI * 2); g.stroke(); g.setLineDash([3, 10]); g.rotate(-tm * 2.4); g.lineWidth = 2; g.beginPath(); g.arc(0, 0, 66, 0, Math.PI * 2); g.stroke(); g.restore();
        }
        if (enabled) {
          const nf = u < 1 ? 2 : (Math.random() < 0.35 ? 1 : 0), ns = u < 1 ? 2 : (Math.random() < 0.2 ? 1 : 0);
          for (let k = 0; k < nf; k++) parts.push({ x: x + (Math.random() - .5) * 26, y: y + (Math.random() - .5) * 20, vx: (Math.random() - .5) * 0.05, vy: -0.05 - Math.random() * 0.1, life: 0, max: 450 + Math.random() * 450, s: 9 + Math.random() * 12, f: isFront, t: 3 });
          for (let k = 0; k < ns; k++) parts.push({ x: x + (Math.random() - .5) * 90, y: y + (Math.random() - .5) * 90, vx: (Math.random() - .5) * 0.03, vy: (Math.random() - .5) * 0.03, life: 0, max: 700 + Math.random() * 700, s: 6 + Math.random() * 9, f: isFront, t: 4, tw: Math.random() * 6 });
          if (u > 0 && u < 1) { const g = ctxs[isFront ? 1 : 0], r = 46 + 30 * inv, gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(255,120,90,${0.35 * inv + 0.1})`); gr.addColorStop(1, 'rgba(239,65,81,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); }
        }
      });
      if (ringA > 0) {
        { const g = ctxs[0]; g.save(); g.setLineDash([7, 9]); g.strokeStyle = `rgba(239,65,81,${0.6 * ringA})`; g.lineWidth = 1.5; g.beginPath(); g.ellipse(cx, cy, Rx, Ry, 0, 0, Math.PI * 2); g.stroke(); g.restore(); }
      }
      if (enabled) {
        trails.forEach((tr, i) => {
          const u = Math.max(0, Math.min(1, (seq - i * GAP) / DUR)), moving = 1 - sm(u) * 0.55;
          for (let j = 1; j < tr.length; j++) {
            const f = j / tr.length, g = ctxs[tr[j].f ? 1 : 0];
            g.strokeStyle = `hsla(${(355 + 45 * f) % 360},95%,58%,${f * 0.8 * moving})`;
            g.lineWidth = (2 + 11 * f) * (0.5 + 0.5 * moving);
            g.beginPath(); g.moveTo(tr[j - 1].x, tr[j - 1].y); g.lineTo(tr[j].x, tr[j].y); g.stroke();
          }
        });
        if (parts.length > 240) parts.splice(0, parts.length - 240);
        parts = parts.filter(p => (p.life += dt) < p.max);
        parts.forEach(p => {
          p.x += p.vx * dt; p.y += p.vy * dt;
          const k = 1 - p.life / p.max, g = ctxs[p.f ? 1 : 0], z = p.s * (0.4 + 0.6 * k);
          g.save(); g.translate(p.x, p.y); g.globalAlpha = k;
          g.fillStyle = g.strokeStyle = p.col || (p.gold ? '#ffcf4d' : '#ef4151');
          if (p.t === 3) { const r = Math.max(2, p.s * k), gr = g.createRadialGradient(0, 0, 0, 0, 0, r); gr.addColorStop(0, `rgba(255,236,140,${0.95})`); gr.addColorStop(0.4, 'rgba(255,150,40,.85)'); gr.addColorStop(1, 'rgba(230,40,30,0)'); g.fillStyle = gr; g.beginPath(); g.ellipse(0, 0, r * 0.7, r * 1.25, 0, 0, Math.PI * 2); g.fill(); }
          else if (p.t === 4) { const tw = Math.abs(Math.sin(p.life * 0.012 + p.tw)), r = p.s * tw; g.globalAlpha = k * (0.5 + 0.5 * tw); g.fillStyle = p.col ? '#ffffff' : '#fff6c8'; g.beginPath(); for (let q = 0; q < 8; q++) { const rr = q % 2 ? r * 0.22 : r, an = q * Math.PI / 4 - Math.PI / 2; g.lineTo(Math.cos(an) * rr, Math.sin(an) * rr); } g.closePath(); g.fill(); g.strokeStyle = p.col || '#ffb000'; g.lineWidth = 1; g.stroke(); }
          else if (p.t === 0) { g.rotate(Math.PI / 4 + p.life * 0.005); g.fillRect(-z / 2, -z / 2, z, z); }
          else if (p.t === 1) { g.rotate(p.life * 0.004); g.lineWidth = 2; g.beginPath(); g.moveTo(-z * 1.4, 0); g.lineTo(z * 1.4, 0); g.moveTo(0, -z * 1.4); g.lineTo(0, z * 1.4); g.stroke(); }
          else { g.rotate(p.life * 0.003); g.beginPath(); g.moveTo(-z * .6, -z * .8); g.lineTo(z, 0); g.lineTo(-z * .6, z * .8); g.closePath(); g.fill(); }
          g.restore();
        });
        waves = waves.filter(w => (w.life += dt) < 1100);
        waves.forEach(w => {
          if (w.life < 0) return;
          const k = w.life / 1100, g = ctxs[w.r ? 1 : 0];
          g.save(); g.globalAlpha = 1 - k; g.strokeStyle = w.col || '#ef4151'; g.lineWidth = 3 * (1 - k) + 1; g.beginPath();
          if (w.r) { g.arc(w.x, w.y, w.r + 90 * k, 0, Math.PI * 2); }
          else g.ellipse(w.x, w.y, Rx * (0.9 + 1.2 * k), Ry * (0.9 + 1.6 * k), 0, 0, Math.PI * 2);
          g.stroke(); g.restore();
        });
      }
      const hi = hovered.current;
      if (label.current) {
        if (hi >= 0) { const m = TOOL_META[TOOLS[hi][0]]; label.current.style.left = `${pos[hi].x}px`; label.current.style.top = `${pos[hi].y + 62}px`; label.current.style.setProperty('--c', m[0]); if (label.current.dataset.i !== String(hi)) { label.current.dataset.i = String(hi); label.current.innerHTML = `<b>${m[1]}</b><i>${m[2]}</i>`; } label.current.classList.add('on'); }
        else label.current.classList.remove('on');
      }
      if (enabled) raf = requestAnimationFrame(frame);
    };
    frame(performance.now());
    if (enabled) raf = requestAnimationFrame(frame);
    const onResize = () => frame(performance.now());
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); io && io.disconnect(); window.removeEventListener('resize', onResize); };
  }, [enabled]);
  return <div className="intro-orbit" ref={box} role="list" aria-label="Software yang digunakan">
    <canvas ref={back} className="orbit-canvas orbit-canvas-back" aria-hidden="true"/>
    <span className="intro-orbit-ring" ref={ring} aria-hidden="true"/>
    {TOOLS.map(([file, name], i) => <img key={file} ref={el => refs.current[i] = el} role="listitem" className="orbit-tool" src={`./Asset/svg/${file}.svg`} alt={name} title={name} width="44" height="44" onMouseEnter={() => { hovered.current = i; entered.current = i; }} onMouseLeave={() => { hovered.current = -1; }}/>)}
    <div className="orbit-label" ref={label} aria-hidden="true"/>
    <canvas ref={front} className="orbit-canvas orbit-canvas-front" aria-hidden="true"/>
  </div>;
}

const SIG_LINE = 'M24 114 C80 122 160 118 236 104';
function Signature() {
  const enabled = useContext(MotionContext);
  const root = useRef(null), pencil = useRef(null), wipe = useRef(null), line = useRef(null);
  const state = useRef({ raf: 0, running: false, seen: false });
  const setDone = () => { if (wipe.current) wipe.current.setAttribute('width', '330'); if (line.current) { line.current.style.strokeDasharray = 'none'; line.current.style.strokeDashoffset = '0'; } if (pencil.current) pencil.current.style.opacity = 0; };
  const play = React.useCallback(() => {
    const st = state.current, ln = line.current;
    if (st.running || !ln || !wipe.current) return;
    st.running = true;
    const L = ln.getTotalLength(), T1 = 2700, T2 = 3500, t0 = performance.now();
    wipe.current.setAttribute('width', '0'); ln.style.strokeDasharray = L; ln.style.strokeDashoffset = L;
    const tick = now => {
      const t = now - t0; let tip = null;
      if (t < T1) {
        const k = t / T1, x = 12 + 250 * (k + Math.sin(k * Math.PI * 6) * 0.015);
        wipe.current.setAttribute('width', String(Math.max(0, x)));
        tip = { x, y: 66 + Math.sin(k * Math.PI * 9) * 26 + (1 - Math.min(1, k * 6)) * 20 };
      } else {
        wipe.current.setAttribute('width', '330');
        const k = Math.min(1, (t - T1) / (T2 - T1));
        ln.style.strokeDashoffset = String(L * (1 - k));
        if (k < 1) tip = ln.getPointAtLength(L * k);
      }
      if (pencil.current) {
        if (tip) { pencil.current.setAttribute('transform', `translate(${tip.x} ${tip.y}) rotate(${40 + Math.sin(t * 0.02) * 5})`); pencil.current.style.opacity = 1; }
        else pencil.current.style.opacity = 0;
      }
      if (t < T2) st.raf = requestAnimationFrame(tick); else { st.running = false; setDone(); }
    };
    st.raf = requestAnimationFrame(tick);
  }, []);
  useEffect(() => {
    if (!enabled) { setDone(); return; }
    if (wipe.current) wipe.current.setAttribute('width', '0');
    if (line.current) { const l = line.current.getTotalLength(); line.current.style.strokeDasharray = l; line.current.style.strokeDashoffset = l; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !state.current.seen) { state.current.seen = true; setTimeout(play, 500); io.disconnect(); } }, { threshold: 0.6 });
    io.observe(root.current);
    return () => { io.disconnect(); cancelAnimationFrame(state.current.raf); state.current.running = false; };
  }, [enabled, play]);
  return <svg ref={root} className="intro-sig" viewBox="0 0 320 130" fill="none" role="img" aria-label="Tanda tangan Azizi" onMouseEnter={() => enabled && play()}>
    <defs><mask id="sig-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="330" height="130"><rect ref={wipe} x="0" y="0" width="330" height="130" fill="#fff"/></mask></defs>
    <text x="14" y="96" className="sig-text" mask="url(#sig-mask)">Azizi</text>
    <path ref={line} d={SIG_LINE} stroke="currentColor" strokeWidth="3.2" strokeLinecap="round"/>
    <g ref={pencil} style={{ opacity: 0 }} className="sig-pencil">
      <polygon points="0,0 -2.8,-7.5 2.8,-7.5" fill="#e8c9a0"/><polygon points="0,0 -1,-2.6 1,-2.6" fill="#2b2b2b"/>
      <rect x="-2.8" y="-28" width="5.6" height="20.5" fill="#ef4151"/><rect x="-2.8" y="-31" width="5.6" height="3" fill="#c9c9c9"/><rect x="-2.8" y="-35" width="5.6" height="4" rx="1.6" fill="#f2a6ad"/>
    </g>
  </svg>;
}

function Intro({ settings }) {
  const ref = useRef(null);
  return <section id="intro" className="intro section-wrap" ref={ref}>
    <span className="intro-ring" aria-hidden="true"/>
    <div className="intro-photo" onMouseMove={e => {
      const inner = e.currentTarget.firstChild; const r = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      inner.style.setProperty('--ry', `${x * 16}deg`); inner.style.setProperty('--rx', `${-y * 16}deg`);
      inner.style.setProperty('--gx', `${(x + 0.5) * 100}%`); inner.style.setProperty('--gy', `${(y + 0.5) * 100}%`);
    }} onMouseLeave={e => { const i = e.currentTarget.firstChild; i.style.setProperty('--ry', '0deg'); i.style.setProperty('--rx', '0deg'); }}>
      <ToolOrbit/>
      <div className="intro-photo-inner">
        {settings.portrait_url && <img src={settings.portrait_url} alt="Azizi" loading="lazy" width="800" height="1066"/>}
      </div>
    </div>
    <Reveal className="intro-text">
      <span className="eyebrow intro-eyebrow"><i/>PERKENALAN SINGKAT</span>
      <span className="intro-hello">Hello, nice to meet you</span>
      <h2 className="display">SIAPA ITU AZIZI<span className="accent">?</span></h2>
      <p className="intro-lead">{settings.intro_text}</p>
      <Signature/>
      <div className="skill-tags intro-skills">{(settings.skills || []).map(t => <span key={t}>{t}</span>)}</div>
      <div className="intro-actions"><a className="intro-cta" href="#portfolio">LIHAT KARYA SAYA <ArrowUpRight size={16}/></a></div>
    </Reveal>
  </section>;
}

function Portfolio({ onProject, archive, featured, loading, categories }) {
  const [category, setCategory] = useState('Semua');
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [limit, setLimit] = useState(9);
  const results = archive.filter(p => (category === 'Semua' || p.category === category) && `${p.title} ${p.category} ${p.role}`.toLowerCase().includes(query.toLowerCase()));
  const projects = expanded || category !== 'Semua' || query ? results.slice(0, limit) : featured;
  return <section id="portfolio" className="portfolio section-wrap">
    <Reveal className="section-heading"><div><span className="eyebrow">01 / SELECTED WORK</span><WipeReveal as="h2">KARYA YANG BICARA<span className="accent">.</span></WipeReveal></div><button className="text-link" onClick={() => { if (expanded) { setExpanded(false); setCategory('Semua'); setQuery(''); } else { setExpanded(true); setLimit(9); } }}>{expanded ? 'KARYA PILIHAN' : 'SEMUA KARYA'}<ArrowRight size={21}/></button></Reveal>
    <Reveal className="portfolio-toolbar">
      <div className="filters" role="group" aria-label="Kategori karya">
        {categories.map(c => <button key={c} className={category === c ? 'selected' : ''} aria-pressed={category === c} onClick={() => { setCategory(c); setExpanded(true); setLimit(9); }}>{c}{c === category && <motion.span className="filter-line" layoutId="filter-line"/>}</button>)}
      </div>
      <label className="search-box"><Search size={15}/><span>Cari</span><input aria-label="Cari karya" type="search" placeholder="Judul atau kategori…" value={query} onChange={e => { setQuery(e.target.value); setExpanded(true); setLimit(9); }}/></label>
    </Reveal>
    <motion.div className="project-grid" layout><AnimatePresence mode="popLayout">{projects.map((p, i) => <ProjectCard key={p.category + p.title + p.media} project={p} index={i} onOpen={onProject}/>)}</AnimatePresence></motion.div>
    {loading && <div className="empty-state"><p>Memuat karya…</p></div>}
    {!loading && projects.length === 0 && <div className="empty-state"><p>Tidak ada karya untuk “{query}”.</p><button className="text-link" onClick={() => { setQuery(''); setCategory('Semua'); }}>Reset pencarian <X size={15}/></button></div>}
    {expanded && results.length > limit && <div className="load-more"><button className="outline-button" onClick={() => setLimit(v => v + 9)}>Tampilkan karya lainnya <Plus size={16}/></button><span>{projects.length} dari {results.length} karya</span></div>}
    <BrandStrip/>
  </section>;
}

const processSteps = [
  ['01', 'THE IDEA', 'Mendengar cerita Anda. Menentukan pesan, arah visual, dan rasa yang ingin dibawa.'],
  ['02', 'THE PLAN', 'Mengembangkan konsep, referensi, dan alur kerja yang sesuai dengan kebutuhan produksi.'],
  ['03', 'THE CRAFT', 'Editing, compositing, dan visual effects. Membentuk setiap detail menjadi satu cerita.'],
  ['04', 'THE POLISH', 'Menyatukan warna, ritme, dan suara. Memastikan setiap frame bekerja sebagaimana mestinya.'],
  ['05', 'THE FINAL FRAME', 'Review bersama, sentuhan terakhir, lalu hasil yang siap menemui penontonnya.'],
];
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
    <Reveal className="about-lead"><div><span className="eyebrow">02 / BEHIND THE FRAMES</span><WipeReveal as="h2" className="display">BUKAN SEKADAR VISUAL.<br/>TAPI CARA <span className="accent">BERCERITA.</span></WipeReveal></div><p>{settings.about_bio}</p></Reveal>
    <div className="studio-grid">
      <Reveal className="education-panel"><h3 className="panel-heading">EDUCATION & SKILLS</h3><p className="eyebrow accent">PENDIDIKAN</p>{education.map((e, i) => <div className="education-row" key={e.title + i}><strong>{e.title}</strong>{e.meta && <span>{e.meta}</span>}<p>{e.text}</p></div>)}<p className="eyebrow accent skills-heading">CREATIVE TOOLKIT</p><div className="skill-tags">{skills.map(s => <span key={s}>{s}</span>)}</div></Reveal>
      <div className="process-panel"><Reveal><h3 className="panel-heading">FROM IDEA TO FINAL FRAME</h3></Reveal><div className="process-list"><div className="process-track"><motion.div style={{ scaleY: enabled ? scrollYProgress : 1 }}/></div>{processSteps.map(([num, title, text], i) => <Reveal key={num} className="process-row" delay={i * 0.035}><span className="process-num display">{num}</span><span className="process-node"/><div><h4>{title}</h4><p>{text}</p></div></Reveal>)}</div></div>
      <Reveal className="quote-panel"><span className="quote-mark display">“</span><blockquote>Dari konsep<br/>dan storytelling,<br/><em>sampai visual<br/>yang sinematik.</em></blockquote><span className="handwriting">Azizi</span><div className="quote-bottom">LET’S MAKE<br/>THE NEXT FRAME COUNT.<span className="quote-symbol" aria-hidden="true">✳</span></div></Reveal>
    </div>
  </section>;
}

function Journey({ onProject, experiences, certificates, settings }) {
  const [open, setOpen] = useState(0);
  return <section id="experience" className="journey section-wrap">
    <Reveal className="section-heading"><div><span className="eyebrow">03 / THE JOURNEY</span><WipeReveal as="h2">TERUS BERGERAK. TERUS BERKARYA<span className="accent">.</span></WipeReveal></div><a className="text-link" href={settings.cv_url} download>RESUME<Download size={16}/></a></Reveal>
    <div className="journey-grid"><div className="experience-list">{experiences.map((job, i) => <Reveal className={`experience-row ${open === i ? 'is-open' : ''}`} key={job.id || job.title}><button aria-expanded={open === i} aria-controls={`job-${i}`} onClick={() => setOpen(open === i ? null : i)}><span className="experience-date">{job.date_label}</span><span><h3>{job.title}</h3><span className="experience-place">{job.place}</span></span>{open === i ? <Minus size={18}/> : <Plus size={18}/>}</button><AnimatePresence initial={false}>{open === i && <motion.div id={`job-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}><p>{job.description}</p></motion.div>}</AnimatePresence></Reveal>)}</div>
    <Reveal className="awards-panel"><p className="eyebrow">A FEW MILESTONES</p><h3 className="display">LITTLE WINS.<br/><span className="accent">BIG MEANING.</span></h3><div className="award-list">{certificates.map((cert, i) => <button key={cert.id || cert.title} onClick={() => onProject({ ...cert, type: 'image', media: cert.image, category: 'Certificate', description: 'Sertifikat dan penghargaan dari arsip Azizi.' })}><span>{String(i + 1).padStart(2, '0')}</span><span>{cert.title}<small>{cert.year}</small></span><ArrowUpRight size={19}/></button>)}</div></Reveal></div>
  </section>;
}

function Contact({ onProject, featured, settings }) {
  const [sent, setSent] = useState(false);
  const send = e => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const text = `Halo Azizi, saya ${data.get('name')}.\n\nJenis proyek: ${data.get('type')}\n${data.get('message')}`;
    window.open(`https://wa.me/${settings.contact_whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    setSent(true);
  };
  return <section id="contact" className="contact section-wrap">
    <div className="contact-grid"><Reveal className="contact-intro"><span className="eyebrow">04 / YOUR NEXT STORY</span><WipeReveal as="h2" className="display">LET’S WORK<br/>TOGETHER<span className="accent">.</span></WipeReveal><p>Punya cerita yang ingin diwujudkan?<br/>Mari buat sesuatu yang layak ditonton.</p><Magnetic href={`https://wa.me/${settings.contact_whatsapp}`} target="_blank" rel="noopener noreferrer" className="contact-cta"><span className="round-arrow"><ArrowUpRight size={21}/></span>MULAI PERCAKAPAN</Magnetic></Reveal>
    <Reveal className="contact-links" delay={0.1}><a href={`mailto:${settings.contact_email}`}><Mail/><span><small>EMAIL</small>{settings.contact_email}</span><ArrowUpRight size={16}/></a><a href={settings.contact_instagram_url} target="_blank" rel="noopener noreferrer"><Instagram/><span><small>INSTAGRAM</small>{settings.contact_instagram_handle}</span><ArrowUpRight size={16}/></a><a href={`tel:+${settings.contact_whatsapp}`}><Phone/><span><small>PHONE / WHATSAPP</small>{settings.contact_phone_display}</span><ArrowUpRight size={16}/></a><div><MapPin/><span><small>BASED IN</small>{settings.contact_location}</span></div></Reveal>
    <Reveal className="contact-reel" delay={0.2}><button onClick={() => featured[0] && onProject(featured[0])} aria-label="Putar showreel Azizi"><div className="reel-screen"><span className="reel-screen-top">AZIZI®<span>FILM / SHOWREEL</span></span><MediaImage src={featured[0]?.image} alt="Showreel Azizi"/><span className="reel-screen-title display">MAKE IT<br/><span>FEEL REAL.</span></span><span className="play-circle"><Play size={18} fill="currentColor"/></span></div><span className="reel-caption">PRESS PLAY. ENTER MY WORLD.</span></button></Reveal></div>
    <Reveal><details className="project-brief"><summary>Ceritakan proyek Anda <Plus size={19}/></summary><form onSubmit={send}><label>Nama Anda<input name="name" required placeholder="Nama atau brand" autoComplete="name" maxLength="100"/></label><label>Jenis proyek<select name="type"><option>Film & Video Editing</option><option>Commercial Content</option><option>Kolaborasi lainnya</option></select></label><label className="brief-message">Tentang proyek<textarea name="message" required rows="3" placeholder="Ceritakan ide, kebutuhan, dan perkiraan waktunya…" maxLength="3000"/></label><button className="solid-button" type="submit">Lanjut ke WhatsApp <ArrowUpRight size={18}/></button><p className="form-note" role="status">{sent ? 'Draft pesan siap di WhatsApp. Tekan Kirim di sana untuk memulai percakapan.' : 'Brief akan dibuka sebagai draft pesan di WhatsApp.'}</p></form></details></Reveal>
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
  const availableModes = [['layout', 'Layout'], ['solid', 'Solid'], ['material', 'Material'], ['lighting', 'Lighting'], ['final', 'Final render']].filter(([mode]) => activeShot?.[mode] && !(mode === 'solid' && activeShot.hideSolidMode));
  const effectiveMode = activeShot?.[renderMode] ? renderMode : availableModes[0]?.[0];
  const rendered = activeShot?.[effectiveMode] || activeShot?.image || project.image;
  const sourceUrl = embedType === 'youtube' ? `https://www.youtube.com/watch?v=${embedMedia}` : embedType === 'drive' ? `https://drive.google.com/file/d/${embedMedia}/view` : project.type === 'render' ? rendered : project.media || project.image;
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
      <div className="dialog-heading"><span className="eyebrow">{project.category} {project.year && ` / ${project.year}`}</span><button onClick={onClose} className="icon-button" aria-label="Tutup karya"><X/></button></div>
      <div className={`dialog-media ${!isVideo ? 'still' : ''}`}>
        {isVideo ? <>{!mediaLoaded && <div className="media-loading" role="status">{mediaFailed ? <><p>Preview belum bisa dimuat. Buka sumber aslinya untuk menonton.</p><button className="outline-button" onClick={() => { setMediaFailed(false); setMediaLoaded(false); setRetried(v => v + 1); }}>Coba lagi</button></> : <><span className={enabled ? 'loading-ring' : 'loading-ring paused'}/><p>Memuat film…</p></>}</div>}<iframe key={`${embedMedia}-${retried}`} src={embedType === 'youtube' ? `https://www.youtube-nocookie.com/embed/${embedMedia}?autoplay=1&rel=0` : `https://drive.google.com/file/d/${embedMedia}/preview`} title={project.title} width="1280" height="720" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen onLoad={() => { setMediaLoaded(true); setMediaFailed(false); }} onError={() => setMediaFailed(true)}/></> : <MediaImage src={rendered} alt={project.title} priority/>}
      </div>
      {project.type === 'render' && (availableModes.length > 0 || project.renders.length > 1) && <div className="render-controls"><div role="group" aria-label="Tahap render">{availableModes.map(([mode, label]) => <button key={mode} className={effectiveMode === mode ? 'selected' : ''} onClick={() => setRenderMode(mode)} aria-pressed={effectiveMode === mode}>{label}</button>)}</div>{project.renders.length > 1 && <div className="shot-controls"><button className="icon-button" aria-label="Shot sebelumnya" onClick={() => changeShot((shot - 1 + project.renders.length) % project.renders.length)}><ChevronLeft/></button><span>SHOT {shot + 1} / {project.renders.length}</span><button className="icon-button" aria-label="Shot selanjutnya" onClick={() => changeShot((shot + 1) % project.renders.length)}><ChevronRight/></button></div>}</div>}
      <div className="dialog-description"><div><h2 id="dialog-title">{project.title}</h2>{project.role && <span className="accent">{project.role}</span>}<p>{project.description}</p></div>{sourceUrl && <a className="outline-button" href={sourceUrl} target="_blank" rel="noopener noreferrer">{project.type === 'website' ? 'Kunjungi website' : 'Buka sumber asli'}<ExternalLink size={15}/></a>}</div>
      {isVideo && <p className="embed-note">Jika video dibatasi oleh pemiliknya, gunakan “Buka sumber asli”.</p>}
    </motion.div>
  </motion.div>;
}

function TravelingPortrait({ portraitUrl }) {
  const enabled = useContext(MotionContext);
  const elRef = useRef(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    let raf = null;
    const activeRef = { current: false };
    const state = { top: 0, left: 0, width: 0, height: 0, p: 0, inited: false };
    const loop = () => {
      const heroPhoto = document.querySelector('#home .hero-portrait');
      const introPhoto = document.querySelector('#intro .intro-photo');
      const node = elRef.current;
      if (heroPhoto && introPhoto && node) {
        const hr = heroPhoto.getBoundingClientRect();
        const ir = introPhoto.getBoundingClientRect();
        const vh = window.innerHeight;
        const raw = (vh - ir.top) / (vh * 0.65);
        const targetP = Math.max(0, Math.min(1, raw));
        const targetTop = hr.top + (ir.top - hr.top) * targetP;
        const targetLeft = hr.left + (ir.left - hr.left) * targetP;
        const targetWidth = hr.width + (ir.width - hr.width) * targetP;
        const targetHeight = hr.height + (ir.height - hr.height) * targetP;
        if (!state.inited || targetP < 0.02) {
          state.top = targetTop; state.left = targetLeft; state.width = targetWidth; state.height = targetHeight; state.p = targetP;
          state.inited = true;
        } else {
          const ease = 0.1;
          state.top += (targetTop - state.top) * ease;
          state.left += (targetLeft - state.left) * ease;
          state.width += (targetWidth - state.width) * ease;
          state.height += (targetHeight - state.height) * ease;
          state.p += (targetP - state.p) * ease;
        }
        const p = state.p;
        const clamp01 = x => Math.max(0, Math.min(1, x));
        const heroOpacity = 1 - clamp01(p / 0.2);
        const introOpacity = clamp01((p - 0.8) / 0.2);
        const cloneOpacity = clamp01(p / 0.2) - clamp01((p - 0.8) / 0.2);
        const isActive = cloneOpacity > 0.01;
        if (isActive !== activeRef.current) { activeRef.current = isActive; setActive(isActive); }
        node.style.opacity = String(cloneOpacity);
        node.style.transform = `translate(${state.left}px, ${state.top}px)`;
        node.style.width = `${state.width}px`;
        node.style.height = `${state.height}px`;
        heroPhoto.style.opacity = String(heroOpacity);
        introPhoto.style.opacity = String(introOpacity);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      const heroPhoto = document.querySelector('#home .hero-portrait');
      const introPhoto = document.querySelector('#intro .intro-photo');
      if (heroPhoto) heroPhoto.style.opacity = '';
      if (introPhoto) introPhoto.style.opacity = '';
    };
  }, [enabled]);
  if (!enabled) return null;
  return <div ref={elRef} className={`traveling-portrait${active ? ' is-active' : ''}`} aria-hidden="true">{portraitUrl && <img src={portraitUrl} alt=""/>}</div>;
}

function FloatingPortrait({ portraitUrl }) {
  const enabled = useContext(MotionContext);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    const hero = document.getElementById('home');
    const about = document.getElementById('about');
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
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('azizi-theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {}
    return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });
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
    return { ...DEFAULT_SETTINGS, portrait_url: cached };
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
        setSettings(s => ({ ...s, ...data }));
        try { if (data.portrait_url) localStorage.setItem('azizi-portrait', data.portrait_url); } catch {}
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
      if (active && !error && data && data.length) setCategories(['Semua', ...data.map(c => c.name)]);
    });
    return () => { active = false; };
  }, []);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 28, restDelta: 0.001 });
  useEffect(() => { document.documentElement.dataset.motion = enabled ? 'on' : 'off'; }, [enabled]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('azizi-theme', theme); } catch {}
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#090909' : '#f5f3ee');
  }, [theme]);
  const toggle = () => { setMotionOn(!motionOn); try { localStorage.setItem('azizi-motion', motionOn ? 'off' : 'on'); } catch {} };
  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');
  const close = React.useCallback(() => setProject(null), []);
  return <MotionContext.Provider value={enabled}>
    <MotionConfig reducedMotion={enabled ? 'user' : 'always'} transition={{ ease: EASE }}>
      <a className="skip-link" href="#portfolio">Lewati ke karya</a>
      <CursorGlow/>
      <TravelingPortrait portraitUrl={settings.portrait_url}/>
      <FloatingPortrait portraitUrl={settings.portrait_url}/>
      <motion.div className="reading-progress" style={{ scaleX: enabled ? progress : scrollYProgress }}/>
      <Header enabled={enabled} onToggle={toggle} theme={theme} onToggleTheme={toggleTheme}/>
      <main>
        <Hero onProject={setProject} featured={featured} settings={settings}/>
        <Intro settings={settings}/>
        <Portfolio onProject={setProject} archive={archive} featured={featured} loading={archiveLoading} categories={categories}/>
        <Awards onProject={setProject} awards={awards} certificates={certificates}/>
        <About settings={settings}/>
        <Journey onProject={setProject} experiences={experiences} certificates={certificates} settings={settings}/>
        <Contact onProject={setProject} featured={featured} settings={settings}/>
      </main>
      <footer className="footer">
        <a className="wordmark" href="#home">AZIZI<span>®</span></a>
        <span>© {new Date().getFullYear()} AZIZI. EVERY FRAME HAS A PURPOSE.</span>
        <div>
          <a href="https://www.youtube.com/@DuingZStudio" target="_blank" rel="noopener noreferrer" aria-label="YouTube DuingZ Studio"><Youtube size={17}/></a>
          <a href="https://www.instagram.com/dododididaw/" target="_blank" rel="noopener noreferrer" aria-label="Instagram dododididaw"><Instagram size={17}/></a>
          <a href="#home" aria-label="Kembali ke atas"><ArrowUpRight size={18}/></a>
        </div>
      </footer>
      <AnimatePresence>{project && <ProjectDialog key={project.title} project={project} onClose={close}/>}</AnimatePresence>
    </MotionConfig>
  </MotionContext.Provider>;
}

createRoot(document.getElementById('root')).render(<App/>);
