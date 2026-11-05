/*
 * Castle Rock desktop hero backgrounds (November 5, 2026). The home, About Us and financing heroes are the client's own
 * composites in the Castle Rock GoHighLevel media library: overrides/overrides.json -> heroBackgrounds, the desktop
 * entries under https://assets.cdn.filesafe.space/gsqZfpbY5MmVessxREvK/media/. They are not part of the copied image
 * library, so the pages load them through next/image's optimizer (/_next/image?url=…&w=1920&q=75 — resized, WebP; the
 * originals are 1920x1080 PNGs of about 2 MB) and the page's desktop preload (client.tsx: <link rel="preload" as="image"
 * media="(min-width: 768px)" fetchpriority="high", rendered by components/GhlPage.tsx) points at that same URL, so the
 * LCP image starts downloading with the document.
 * For every such entry the page's desktop-only hero section (conversion-report.json heroBackgrounds, recorded by the
 * converter) gets the URL in every responsive variant of its `.bg-section-<id> { background: url(…) }` rule, and the
 * payload's bgImage value gets the media-library original (what the builder itself stores there; the value is appended
 * and the owner re-pointed, never overwritten in place — payload strings are deduplicated). The mobile-only hero
 * section is untouched: phones keep the shared background. Overlay, sizing and text treatment are the builder's own.
 * Entries that point anywhere else (the cloned library, mapped to local copies by the converter) are left alone.
 * Idempotent:  node scripts/castle-rock-heroes.mjs   (npm run heroes:castle-rock)   [--check: report only, exit 1 when out of date]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');
const CR_MEDIA = 'https://assets.cdn.filesafe.space/gsqZfpbY5MmVessxREvK/media/';
const DESKTOP_MEDIA = '(min-width: 768px)';
const WIDTH = 1920, QUALITY = 75; // 1920 is in next.config.ts's default deviceSizes; the optimizer never upscales
export const optimizedHero = (src) => `/_next/image?url=${encodeURIComponent(src)}&w=${WIDTH}&q=${QUALITY}`;
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const isDict = (v) => v && typeof v === 'object' && !Array.isArray(v);
const BS = String.fromCharCode(92);
const escapeJsonForScript = (json) => json.split('<').join(BS + 'u003C').split(String.fromCharCode(0x2028)).join(BS + 'u2028').split(String.fromCharCode(0x2029)).join(BS + 'u2029');

const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'overrides', 'overrides.json'), 'utf8')).heroBackgrounds || {};
const report = JSON.parse(fs.readFileSync(path.join(ROOT, 'conversion-report.json'), 'utf8')).heroBackgrounds || [];
const dirOf = (page) => path.join(ROOT, 'app', '(en)', page === 'index.html' ? '' : page.replace(/\.html$/, ''));

let changed = 0, applied = 0;
for (const [page, image] of Object.entries(cfg)) {
  const desktop = typeof image === 'string' ? image : image && image.desktop;
  if (!desktop || !desktop.startsWith(CR_MEDIA)) continue;
  const rep = report.find((h) => h.page === page); const dir = dirOf(page);
  if (!rep || !rep.desktop || !fs.existsSync(path.join(dir, 'content.ts'))) { console.log(`${page}: no desktop hero section recorded or no such page — skipped`); continue; }
  const id = rep.desktop; const url = optimizedHero(desktop);

  // ---- content.ts: the CSS rule (every responsive variant — the page's <style> blocks live in HEAD_HTML) and the payload
  //      node (BODY_HTML)
  const file = path.join(dir, 'content.ts'); let src = fs.readFileSync(file, 'utf8');
  const headM = src.match(/export const HEAD_HTML = ("(?:[^"\\]|\\.)*");/); const bodyM = src.match(/export const BODY_HTML = ("[\s\S]*");\s*$/);
  if (!headM || !bodyM) throw new Error(`${page}: no HEAD_HTML / BODY_HTML`);
  const head0 = JSON.parse(headM[1]); const before = JSON.parse(bodyM[1]); let body = before;
  const cssRe = new RegExp(`(\\.bg-${escapeRe(id)}\\s*\\{\\s*background:\\s*url\\()([^)]*)(\\))`, 'g');
  let variants = 0; const swap = (m, open, old, close) => { variants++; return `${open}${url}${close}`; };
  const head = head0.replace(cssRe, swap); body = body.replace(cssRe, swap);
  if (!variants) throw new Error(`${page}: no .bg-${id} background rule in the page CSS`);
  const pm = body.match(/(<script[^>]*id="__NUXT_DATA__"[^>]*>)([\s\S]*?)(<\/script>)/);
  let payload = 'none';
  if (pm) {
    const nodes = JSON.parse(pm[2]); let touched = false;
    const str = (i) => (typeof i === 'number' && i >= 0 && typeof nodes[i] === 'string' ? nodes[i] : null);
    const dict = (i) => (typeof i === 'number' && i >= 0 && isDict(nodes[i]) ? nodes[i] : null);
    for (const n of nodes) {
      if (!isDict(n) || str(n.id) !== id) continue;
      const extra = dict(n.extra); const bg = extra && dict(extra.bgImage); const val = bg && dict(bg.value);
      if (!val) continue;
      payload = 'ok';
      if (str(val.url) !== desktop) { val.url = nodes.push(desktop) - 1; if ('servingUrl' in val) val.servingUrl = nodes.push('') - 1; touched = true; }
    }
    if (touched) body = body.replace(pm[0], () => pm[1] + escapeJsonForScript(JSON.stringify(nodes)) + pm[3]);
  }
  const pageChanged = head !== head0 || body !== before;
  if (pageChanged && !CHECK) {
    if (head !== head0) src = src.replace(headM[1], () => JSON.stringify(head));
    if (body !== before) src = src.replace(bodyM[1], () => JSON.stringify(body));
    fs.writeFileSync(file, src);
  }

  // ---- client.tsx: the desktop preload (the LCP image on tablets and desktops)
  const clientFile = path.join(dir, 'client.tsx'); const client = fs.readFileSync(clientFile, 'utf8');
  const preM = client.match(/preload=\{(\[[\s\S]*?\])\}/); if (!preM) throw new Error(`${page}: no preload list in client.tsx`);
  const list = JSON.parse(preM[1]); let preChanged = false;
  for (const p of list) if (p.media === DESKTOP_MEDIA && p.href !== url) { p.href = url; preChanged = true; }
  if (!list.some((p) => p.media === DESKTOP_MEDIA)) { list.unshift({ href: url, media: DESKTOP_MEDIA }); preChanged = true; }
  if (preChanged && !CHECK) fs.writeFileSync(clientFile, client.replace(preM[0], () => `preload={${JSON.stringify(list)}}`));

  if (pageChanged || preChanged) changed++;
  applied++;
  console.log(`${page}`.padEnd(30) + ` ${id.padEnd(20)} css ${variants} variant(s) ${pageChanged ? '(updated)' : '(current)'}  payload ${payload}  preload ${preChanged ? 'updated' : 'current'}`);
}
console.log(`\n${applied} Castle Rock desktop hero(es): ${changed} page(s) ${CHECK ? 'out of date' : 'updated'}`);
if (CHECK && changed) process.exit(1);
