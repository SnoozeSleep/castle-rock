/*
 * The Castle Rock storefront and team photos in the generated pages (November 5, 2026). Source of truth: lib/location.ts
 * STORE_PHOTO_URL / TEAM_PHOTO_URL (the client's GoHighLevel media library) and their alt texts; while a constant is
 * empty the navy "Photo coming soon" card (PHOTO_PLACEHOLDER) stands in. The pages load the photos through next/image's
 * optimizer (/_next/image?url=…&w=…&q=75, resized and as WebP — next.config.ts images.remotePatterns allows the host), so
 * the originals (a 1.3 MB JPEG and a 1 MB PNG) are never downloaded; the LocalBusiness `image` (lib/schema.ts) carries the original.
 *
 * Places (keyed by the alt text, which is unique to each photo in both states):
 *   - the storefront: every <img> whose alt is the storefront alt / placeholder alt — the location cards on the home
 *     page and every "Visit Us" block, the About Us storefront (page markup, the payload's custom-code HTML strings and
 *     the payload's image nodes, which hydration renders);
 *   - the team: the home page's "Meet Your Sleep Coaches" phone photo (<img>) and desktop column background
 *     (.bg-col-A9VUU2bm09, one optimizer size per builder breakpoint, in the page CSS and the payload's bgImage), and
 *     Step 05 "Take Home Better Sleep" of the 5-step flow on /about-us and /mattress-financing (custom code: markup +
 *     payload string);
 *   - the per-element aspect-ratio rules the converter wrote (<style data-snz-imgratio>, #image-<id> … aspect-ratio)
 *     follow the photo's proportions, so nothing shifts when it loads.
 * Idempotent:  node scripts/castle-rock-images.mjs   (npm run images:castle-rock)   [--check: report only, exit 1 when out of date]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');
const BS = String.fromCharCode(92);
const escapeJsonForScript = (json) => json.split('<').join(BS + 'u003C').split(String.fromCharCode(0x2028)).join(BS + 'u2028').split(String.fromCharCode(0x2029)).join(BS + 'u2029');
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const isDict = (v) => v && typeof v === 'object' && !Array.isArray(v);
const optimized = (src, w, q = 75) => `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=${q}`;

const loc = fs.readFileSync(path.join(ROOT, 'lib/location.ts'), 'utf8');
const str = (name) => (loc.match(new RegExp(`${name}\\s*[:=]\\s*'([^']*)'`)) || [, ''])[1];
const STORE_URL = str('STORE_PHOTO_URL'), TEAM_URL = str('TEAM_PHOTO_URL'), PLACEHOLDER = str('PHOTO_PLACEHOLDER');
const ALT = { store: str('storefrontAlt'), storePending: str('storefrontPlaceholderAlt'), team: str('teamAlt'), teamPending: str('teamPlaceholderAlt') };
if (!PLACEHOLDER || !ALT.store || !ALT.storePending || !ALT.team || !ALT.teamPending) throw new Error('lib/location.ts: photo constants not found');

/* the originals' intrinsic sizes (the optimizer never upscales, so the served size is min(width, original)); the
   placeholder SVG is 1600×1200 */
const ORIGINAL = { store: { w: 2048, h: 1536 }, team: { w: 680, h: 1020 } }; // the team photo is a 680px-wide portrait
const fit = (o, w) => { const width = Math.min(w, o.w); return { w: width, h: Math.round((o.h * width) / o.w) }; };
const PHOTOS = {
  store: STORE_URL
    ? { src: optimized(STORE_URL, 640), alt: ALT.store, ...fit(ORIGINAL.store, 640), original: STORE_URL }
    : { src: PLACEHOLDER, alt: ALT.storePending, w: 1600, h: 1200, original: PLACEHOLDER },
  team: TEAM_URL
    ? { src: optimized(TEAM_URL, 750), alt: ALT.team, ...fit(ORIGINAL.team, 750), original: TEAM_URL }
    : { src: PLACEHOLDER, alt: ALT.teamPending, w: 1600, h: 1200, original: PLACEHOLDER },
};
/* the home team column background, in every builder breakpoint (phone / tablet / desktop media queries): the photo is
   680px wide, so one optimizer size (750, the smallest configured size that covers it) serves all three */
const COLUMN = TEAM_URL ? { phone: optimized(TEAM_URL, 750), tablet: optimized(TEAM_URL, 750), desktop: optimized(TEAM_URL, 750) } : { phone: PLACEHOLDER, tablet: PLACEHOLDER, desktop: PLACEHOLDER };
const COLUMN_ID = 'col-A9VUU2bm09';
const ALTS = { store: [ALT.store, ALT.storePending], team: [ALT.team, ALT.teamPending] };
const kindOf = (alt) => (ALTS.store.includes(alt) ? 'store' : ALTS.team.includes(alt) ? 'team' : null);

/* <img src="…" alt="<one of the four alts>" …> in HTML (page markup or a payload string): src, alt, width and height follow the photo */
const IMG = /(<img\b[^>]*?\bsrc=")([^"]*)(" alt=")([^"]*)(")([^>]*)>/g;
function html(s) {
  return s.replace(IMG, (m, open, src, mid, alt, q, rest) => {
    const k = kindOf(alt); if (!k) return m;
    const p = PHOTOS[k];
    const attrs = rest.replace(/ width="\d+" height="\d+"/, ` width="${p.w}" height="${p.h}"`);
    return `${open}${p.src}${mid}${p.alt}${q}${attrs}>`;
  });
}
/* the column background rules: `.bg-col-A9VUU2bm09 { background: url(…) }` inside @media (max-width: 480px) /
   (min-width: 481px) and (max-width: 1024px) / (min-width: 1025px) */
function css(s) {
  const rule = (media, src) => s.replace(new RegExp(`(@media \\(${media}\\)\\s*\\{\\s*\\.bg-${COLUMN_ID}\\s*\\{\\s*background:\\s*url\\()[^)]*(\\))`, 'g'), `$1${src}$2`);
  s = rule('max-width: 480px', COLUMN.phone);
  s = rule('min-width: 481px\\) and \\(max-width: 1024px', COLUMN.tablet);
  s = rule('min-width: 1025px', COLUMN.desktop);
  return s;
}
/* #image-<id> .image-container img{aspect-ratio:W/H} for an element whose <img> is one of the photos */
function ratios(headAndBody, markup) {
  const ids = {};
  for (const m of markup.matchAll(/cimage-([A-Za-z0-9_-]+)"><div><div><img\b[^>]*?\balt="([^"]*)"/g)) { const k = kindOf(m[2]); if (k) ids[m[1]] = k; }
  let out = headAndBody;
  for (const [id, k] of Object.entries(ids)) out = out.replace(new RegExp(`(#image-${escapeRe(id)} \\.image-container img\\{aspect-ratio:)\\d+\\/\\d+(\\})`, 'g'), `$1${PHOTOS[k].w}/${PHOTOS[k].h}$2`);
  return out;
}

const files = []; (function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (e.name === 'content.ts') files.push(p); } })(path.join(ROOT, 'app'));
let changed = 0, touched = { imgs: 0, nodes: 0, column: 0, orphans: 0 };
for (const file of files) {
  const rel = path.relative(ROOT, file).split(path.sep).join('/');
  let src = fs.readFileSync(file, 'utf8');
  const headM = src.match(/export const HEAD_HTML = ("(?:[^"\\]|\\.)*");/); const bodyM = src.match(/export const BODY_HTML = ("[\s\S]*");\s*$/);
  if (!headM || !bodyM) continue;
  const head0 = JSON.parse(headM[1]); const body0 = JSON.parse(bodyM[1]);
  const pm = body0.match(/(<script[^>]*id="__NUXT_DATA__"[^>]*>)([\s\S]*?)(<\/script>)/);
  let markup = pm ? body0.replace(pm[0], '\u0000PAYLOAD\u0000') : body0;
  const imgsBefore = (markup.match(IMG) || []).filter((t) => kindOf((t.match(/ alt="([^"]*)"/) || [])[1])).length;
  markup = css(html(markup));
  let head = ratios(css(head0), markup); markup = ratios(markup, markup);
  let payload = pm ? pm[0] : '';
  if (pm) {
    const nodes = JSON.parse(pm[2]); let any = false;
    const s = (i) => (typeof i === 'number' && i >= 0 && typeof nodes[i] === 'string' ? nodes[i] : null);
    const d = (i) => (typeof i === 'number' && i >= 0 && isDict(nodes[i]) ? nodes[i] : null);
    // custom-code HTML strings and the column CSS inside payload strings
    for (let i = 0; i < nodes.length; i++) if (typeof nodes[i] === 'string' && (/<img\b/.test(nodes[i]) || nodes[i].includes(COLUMN_ID))) { const v = css(html(nodes[i])); if (v !== nodes[i]) { nodes[i] = v; any = true; } }
    // the builder's image nodes: { url, altText } — the alt tells which photo; strings are deduplicated, so a new string is appended and the node re-pointed
    for (const n of nodes) {
      if (!isDict(n) || typeof n.url !== 'number' || typeof n.altText !== 'number') continue;
      const k = kindOf(s(n.altText)); if (!k) continue;
      const p = PHOTOS[k];
      if (s(n.url) !== p.src) { n.url = nodes.push(p.src) - 1; any = true; }
      if (s(n.altText) !== p.alt) { n.altText = nodes.push(p.alt) - 1; any = true; }
      touched.nodes++;
    }
    // the home team column's bgImage (the builder stores the original there): the original photo, or the placeholder
    for (const n of nodes) {
      if (!isDict(n) || s(n.id) !== COLUMN_ID) continue;
      const extra = d(n.extra); const bg = extra && d(extra.bgImage); const val = bg && d(bg.value); if (!val) continue;
      if (s(val.url) !== PHOTOS.team.original) { val.url = nodes.push(PHOTOS.team.original) - 1; if ('servingUrl' in val) val.servingUrl = nodes.push('') - 1; any = true; }
      touched.column++;
    }
    // a placeholder string the payload root no longer reaches — its nodes were re-pointed at the appended strings above,
    // or it sits in the builder's own schema block, which scripts/page-schema.mjs unlinked — is emptied once both photos
    // are live, so no trace of the placeholder card ships (indices never shift: the entry stays, empty)
    if (STORE_URL && TEAM_URL && nodes.includes(PLACEHOLDER)) {
      const kids = (n) => (Array.isArray(n) ? n : isDict(n) ? Object.values(n) : []).filter((v) => typeof v === 'number' && v >= 0);
      const seen = new Set(); const stack = [0];
      while (stack.length) { const i = stack.pop(); if (seen.has(i) || i >= nodes.length) continue; seen.add(i); for (const k of kids(nodes[i])) stack.push(k); }
      for (let i = 0; i < nodes.length; i++) if (nodes[i] === PLACEHOLDER && !seen.has(i)) { nodes[i] = ''; any = true; touched.orphans++; }
    }
    if (any) payload = pm[1] + escapeJsonForScript(JSON.stringify(nodes)) + pm[3];
  }
  const body = pm ? markup.replace('\u0000PAYLOAD\u0000', () => payload) : markup;
  touched.imgs += imgsBefore;
  if (head !== head0 || body !== body0) {
    changed++;
    if (!CHECK) { if (head !== head0) src = src.replace(headM[1], () => JSON.stringify(head)); if (body !== body0) src = src.replace(bodyM[1], () => JSON.stringify(body)); fs.writeFileSync(file, src); }
    console.log(`${rel}: ${imgsBefore} photo <img>(s) ${CHECK ? 'out of date' : 'updated'}`);
  }
}
console.log(`castle-rock-images: storefront ${STORE_URL ? 'live (' + PHOTOS.store.src + ')' : 'placeholder'}; team ${TEAM_URL ? 'live (' + PHOTOS.team.src + ')' : 'placeholder'}; ${changed} page(s) ${CHECK ? 'out of date' : 'changed'}, ${touched.imgs} <img> in markup, ${touched.nodes} payload image nodes, ${touched.column} column background(s), ${touched.orphans} unreachable placeholder string(s) emptied`);
if (CHECK && changed) process.exit(1);
