// Deskripsi pengalaman disimpan sebagai HTML sederhana (rich text) di kolom "description".
// Data lama berupa teks biasa tetap dibaca: tiap kalimat / baris "- " menjadi poin.

const ALLOWED = new Set(['P', 'BR', 'STRONG', 'B', 'EM', 'I', 'U', 'UL', 'OL', 'LI', 'A', 'DIV', 'SPAN']);

export function sanitizeHtml(html) {
  if (typeof DOMParser === 'undefined') return '';
  const doc = new DOMParser().parseFromString(`<div>${html || ''}</div>`, 'text/html');
  const walk = node => {
    [...node.childNodes].forEach(ch => {
      if (ch.nodeType === 3) return;
      if (ch.nodeType !== 1) { ch.remove(); return; }
      if (!ALLOWED.has(ch.tagName)) {
        if (['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED'].includes(ch.tagName)) { ch.remove(); return; }
        walk(ch);
        ch.replaceWith(...ch.childNodes);
        return;
      }
      const href = ch.tagName === 'A' ? ch.getAttribute('href') || '' : '';
      [...ch.attributes].forEach(a => ch.removeAttribute(a.name));
      if (ch.tagName === 'A') {
        if (/^(https?:|mailto:)/i.test(href)) { ch.setAttribute('href', href); ch.setAttribute('target', '_blank'); ch.setAttribute('rel', 'noopener noreferrer'); }
        else { ch.replaceWith(...ch.childNodes); return; }
      }
      walk(ch);
    });
  };
  walk(doc.body.firstChild);
  return doc.body.firstChild.innerHTML.trim();
}

const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// teks biasa -> HTML
function plainToHtml(text) {
  const lines = (text || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (!lines.length) return '';
  const isBullet = l => /^[-•*]\s+/.test(l);
  const bullets = lines.filter(isBullet).map(l => l.replace(/^[-•*]\s+/, ''));
  const plain = lines.filter(l => !isBullet(l)).join(' ');
  if (bullets.length) return (plain ? `<p>${esc(plain)}</p>` : '') + `<ul>${bullets.map(b => `<li>${esc(b)}</li>`).join('')}</ul>`;
  const sentences = text.replace(/\s+/g, ' ').trim().split(/(?<=[.!?])\s+/).filter(Boolean);
  return `<ul>${sentences.map(b => `<li>${esc(b)}</li>`).join('')}</ul>`;
}

const looksLikeHtml = t => /<\/?(p|ul|ol|li|br|strong|em|b|i|u|div|a|span)\b/i.test(t || '');

// nilai database (HTML atau teks biasa) -> HTML aman siap tampil
export function toHtml(value) {
  const v = (value || '').trim();
  if (!v) return '';
  return looksLikeHtml(v) ? sanitizeHtml(v) : sanitizeHtml(plainToHtml(v));
}

// ringkasan tampilan depan: paragraf pertama, atau poin pertama
export function summaryOf(value) {
  const html = toHtml(value);
  if (!html || typeof DOMParser === 'undefined') return '';
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html').body.firstChild;
  const first = doc.querySelector('p, li, div');
  return (first ? first.textContent : doc.textContent).trim();
}
