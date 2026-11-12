// Deskripsi hero: boleh teks biasa (lama) atau HTML sederhana dengan <strong> (tebal) dan <mark> (sorot biru).
// Teks lama tetap tampil sama: kata kunci terdeteksi otomatis, penanda **kata** = sorot biru.
const KW_A = /^(short-form videos?|ugc|high-converting|footage|cerita|film|iklan)$/i;
const KW_RE = /(\*\*.+?\*\*|short-form videos?|UGC|high-converting|move fast|viewer retention|visual pacing|clean execution|potongan pertama|warna terakhir|setiap footage)/gi;
const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const isHeroHtml = t => /<\/?(mark|strong|b|br|p|em|i|u|span|div|font)\b/i.test(t || '');

// hanya warna hex / rgb(a) yang lolos
const COLOR_OK = /^(#[0-9a-f]{3,8}|rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(,\s*(0|1|0?\.\d+)\s*)?\))$/i;
const okColor = c => (c && COLOR_OK.test(c.trim()) ? c.trim() : '');

export function sanitizeHero(html) {
  if (typeof DOMParser === 'undefined') return '';
  const doc = new DOMParser().parseFromString(`<div>${html || ''}</div>`, 'text/html');
  const root = doc.body.firstChild;
  const rename = (el, tag) => { const n = doc.createElement(tag); n.append(...el.childNodes); el.replaceWith(n); return n; };
  const walk = node => [...node.childNodes].forEach(ch => {
    if (ch.nodeType === 3) return;
    if (ch.nodeType !== 1) { ch.remove(); return; }
    const t = ch.tagName;
    if (['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED'].includes(t)) { ch.remove(); return; }
    walk(ch);
    if (t === 'B' || t === 'STRONG') { const n = t === 'B' ? rename(ch, 'strong') : ch; [...n.attributes].forEach(x => n.removeAttribute(x.name)); return; }
    if (t === 'I' || t === 'EM') { const n = t === 'I' ? rename(ch, 'em') : ch; [...n.attributes].forEach(x => n.removeAttribute(x.name)); return; }
    if (t === 'U') { [...ch.attributes].forEach(x => ch.removeAttribute(x.name)); return; }
    if (t === 'MARK' || t === 'SPAN' || t === 'FONT') {
      const color = okColor(t === 'FONT' ? ch.getAttribute('color') : ch.style.color);
      const bg = okColor(ch.style.backgroundColor);
      const bold = ch.style.fontWeight === 'bold' || Number(ch.style.fontWeight) >= 600;
      const italic = ch.style.fontStyle === 'italic';
      const under = (ch.style.textDecorationLine || ch.style.textDecoration || '').includes('underline');
      let node;
      if (t === 'MARK' || color || bg) {
        node = doc.createElement(t === 'MARK' ? 'mark' : 'span');
        const st = []; if (color) st.push(`color:${color}`); if (bg) st.push(`background-color:${bg}`);
        if (st.length) node.setAttribute('style', st.join(';'));
        node.append(...ch.childNodes);
      } else { node = doc.createDocumentFragment(); node.append(...ch.childNodes); }
      [[bold, 'strong'], [italic, 'em'], [under, 'u']].forEach(([on, tag]) => { if (on) { const w = doc.createElement(tag); w.append(node); node = w; } });
      ch.replaceWith(node);
      return;
    }
    if (t === 'BR') { ch.replaceWith(' '); return; }
    ch.replaceWith(...ch.childNodes);
  });
  walk(root);
  root.normalize();
  return root.innerHTML.replace(/\s+/g, ' ').trim();
}
export function heroToHtml(value) {
  const v = (value || '').trim();
  if (!v) return '';
  if (isHeroHtml(v)) return sanitizeHero(v);
  return v.split(KW_RE).map((t, i) => {
    if (!t) return '';
    if (i % 2 === 0) return esc(t);
    const manual = t.startsWith('**'), word = manual ? t.slice(2, -2) : t;
    return manual || KW_A.test(word) ? `<mark>${esc(word)}</mark>` : `<strong>${esc(word)}</strong>`;
  }).join('');
}

// HTML siap tampil di situs (kelas dipasang di sini; sudah disanitasi)
export const heroForDisplay = value => heroToHtml(value).replace(/<mark>/g, '<mark class="hl-a">').replace(/<strong>/g, '<mark class="hl-b">').replace(/<\/strong>/g, '</mark>');
