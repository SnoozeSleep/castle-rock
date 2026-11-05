/*
 * The Spanish twins of the builder-generated pages: app/es/<route>/ is written FROM the English page app/(en)/<route>/
 * (November 2026, "restore the Spanish site"), so the two trees cannot drift apart — every section, image, embed, id
 * and class the English page has, the Spanish page has too, and only the words differ.
 *
 *   node scripts/es-sync.mjs              (npm run es:sync)     writes app/es/<route>/{content,client,scripts,page}
 *   node scripts/es-sync.mjs --check      reports what would change and every English segment without a translation
 *   node scripts/es-sync.mjs --contexts "Our"    prints the block each occurrence of a segment sits in (for @@ keys)
 *
 * How: the English server markup and every string of its hydration payload (hydration re-renders from the payload, so
 * both must agree) are translated text node by text node — and alt / title / placeholder / aria-label — through
 * overrides/i18n/es.castle-rock.json (English segment -> Spanish, whitespace collapsed exactly as scripts/i18n.mjs
 * does), and internal links get the /es prefix (a link to an English blog post goes to its Spanish twin,
 * lib/blog-nav.ts BLOG_SLUG_ES). GoHighLevel splits sentences across inline spans, so a segment can be a fragment; when
 * the same fragment needs a different translation in one sentence, the dictionary carries a contextual key:
 *     "Our @@ <the whole text of the paragraph / heading / list item it sits in>": "¡Nuestros"
 * which wins over the plain key. A segment that stays as it is in Spanish (a brand, the address, a review quoted in its
 * original English) is listed with itself as the value, so "not translated yet" never hides behind "same in Spanish".
 *
 * A segment without an entry stays English, is listed, and makes the run exit 1: add it to the dictionary.
 *
 * page.tsx keeps the Spanish title and description it already has (scripts/seo-metadata.mjs owns them) and takes
 * everything else from the English page; scripts.ts and client.tsx are the English ones (script ids prefixed es-).
 *
 * Run it after anything that changes the English pages, then the scripts that own a block in both languages:
 *   es:sync -> seo:meta -> integrations -> reviews:widget -> reviews -> schema -> lastmod
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';
import { norm, ATTRS, localizeHref } from './i18n.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EN = path.join(ROOT, 'app', '(en)');
const ES = path.join(ROOT, 'app', 'es');
export const DICT_FILE = path.join(ROOT, 'overrides', 'i18n', 'es.castle-rock.json');
export const SEP = ' @@ ';
const LOC = { locale: 'es', prefix: '/es' };
const SITE_HOSTS = new Set(['castlerock.snoozemattresscompany.com', 'www.castlerock.snoozemattresscompany.com']);
const SKIP_TAGS = new Set(['script', 'style', 'noscript', 'template', 'code', 'pre']);
const BLOCK = new Set(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'td', 'th', 'button', 'label', 'figcaption', 'blockquote', 'summary', 'dt', 'dd']);
/* Customer words are never translated: a review's text stays in the language it was written in, marked lang="en" on
   the Spanish page, and the reviewer's name is left alone (scripts/recent-reviews.mjs renders the cards). */
const VERBATIM = [{ cls: 'snz-reviews__text', lang: 'en' }, { cls: 'snz-reviews__who' }];
/* Word order the node-by-node translation cannot produce — applied to the English markup (page and payload copies)
   before it is translated; the Spanish text they introduce is listed in the dictionary with itself as the value. */
const REORDER = [
  // "<a>Brooklyn Bedding</a> Sedona Mattress" -> "Colchón Sedona de <a>Brooklyn Bedding</a>" (the product leads in Spanish)
  { re: /(<a\b[^>]*brooklynbedding\.com[^>]*>Brooklyn Bedding<\/a>) Sedona Mattress/g, to: 'Colchón Sedona de $1' },
];
const reorder = (s) => REORDER.reduce((t, r) => t.replace(r.re, r.to), s);
const BS = String.fromCharCode(92);
const escapeJsonForScript = (json) => json.split('<').join(BS + 'u003C').split(String.fromCharCode(0x2028)).join(BS + 'u2028').split(String.fromCharCode(0x2029)).join(BS + 'u2029');
export const translatable = (t) => /[A-Za-z]{2,}/.test(t) && !/^\{\{.*\}\}$/.test(t) && !/^[\d\s.,:;()+\-–—/%$#&|©®™"'!?…•·]*$/.test(t);

export function loadDict(file = DICT_FILE) {
  const dict = new Map();
  for (const [k, v] of Object.entries(JSON.parse(fs.readFileSync(file, 'utf8')))) {
    const i = k.indexOf(SEP);
    dict.set(i === -1 ? norm(k) : norm(k.slice(0, i)) + SEP + norm(k.slice(i + SEP.length)), v);
  }
  return dict;
}

/* Spanish slug of each English blog post (lib/blog-nav.ts BLOG_SLUG_ES), so a link to a post lands on its twin */
function blogSlugs() {
  const src = fs.readFileSync(path.join(ROOT, 'lib', 'blog-nav.ts'), 'utf8');
  const m = src.match(/export const BLOG_SLUG_ES[^=]*=\s*\{([\s\S]*?)\};/);
  const out = {}; if (m) for (const p of m[1].matchAll(/'([^']+)':\s*'([^']+)'/g)) out[p[1]] = p[2];
  return out;
}

export function makeTranslator(dict, slugs = {}) {
  /* missing: segments of the server markup (what a visitor reads) without an entry; payloadOnly: segments that exist
     in the hydration payload alone — builder settings that are never rendered (the native form the embed replaced) */
  const stats = { hits: 0, missing: new Map(), payloadOnly: new Map(), used: new Set() };
  let bucket = stats.missing;
  const href = (h) => {
    const out = localizeHref(h, LOC, SITE_HOSTS);
    const post = /^\/es\/blog\/([^/?#]+)([?#].*)?$/.exec(out);
    return post ? (slugs[post[1]] ? `/es/blog/${slugs[post[1]]}${post[2] || ''}` : '/es/blog') : out;
  };
  /** one text value: the contextual entry first, then the plain one; surrounding whitespace is kept */
  const tr = (text, ctx, where, quiet) => {
    if (!text) return text;
    const m = /^(\s*)([\s\S]*?)(\s*)$/.exec(text); const core = norm(m[2]); if (!core) return text;
    let key = ctx ? core + SEP + ctx : null; let hit = key ? dict.get(key) : undefined;
    if (hit === undefined) { key = core; hit = dict.get(core); }
    if (hit === undefined) { if (!quiet && translatable(core)) { const e = bucket.get(core) || new Set(); e.add(where); bucket.set(core, e); } return text; }
    stats.hits++; stats.used.add(key);
    return m[1] + hit + m[3];
  };
  const tree = ($, root, where, onText) => {
    // the context of every text node is its block's ENGLISH text: read before anything in the block is translated
    const ctxOf = new Map(); const seenBlocks = new Map();
    const pre = (node) => {
      if (node.type === 'text') { if (!node.data.trim()) return; let p = node.parent; while (p && p.type === 'tag' && !BLOCK.has(p.name)) p = p.parent; if (!p || p.type !== 'tag') return; if (!seenBlocks.has(p)) seenBlocks.set(p, norm($(p).text())); ctxOf.set(node, seenBlocks.get(p)); return; }
      if (node.type !== 'tag' || SKIP_TAGS.has(node.name)) return;
      for (const c of node.children || []) pre(c);
    };
    for (const c of root.children || []) pre(c);
    const visit = (node) => {
      if (node.type === 'text') { const ctx = ctxOf.get(node) || ''; if (onText) onText(node.data, ctx); const t = tr(node.data, ctx, where); if (t !== node.data) node.data = t; return; }
      if (node.type !== 'tag') return;
      if (SKIP_TAGS.has(node.name)) return;
      const a = node.attribs || {};
      const cls = a.class ? a.class.split(/\s+/) : [];
      const verbatim = VERBATIM.find((v) => cls.includes(v.cls));
      if (verbatim) { if (verbatim.lang) a.lang = verbatim.lang; return; }
      if (a['data-snz-cross'] === 'en') a['data-snz-cross'] = 'es'; // the offer band names its language
      for (const k of ATTRS) if (a[k]) { const t = tr(a[k], '', where); if (t !== a[k]) a[k] = t; }
      if (node.name === 'input' && /^(submit|button)$/i.test(a.type || '') && a.value) { const t = tr(a.value, '', where); if (t !== a.value) a.value = t; }
      if (node.name === 'a' && a.href) { const h = href(a.href); if (h !== a.href) a.href = h; }
      for (const c of node.children || []) visit(c);
    };
    for (const c of root.children || []) visit(c);
  };
  const LOOKS_HTML = /<[a-z][^>]*>/i;
  const LOOKS_CSS = /[{};]\s*[a-z-]+\s*:/i;
  const HAS_ELEMENTS = /<(div|span|section|p|h[1-6]|ul|ol|li|a|img|button|nav|header|footer|article)\b[^>]*>/i;
  /** a payload string, as scripts/i18n.mjs translateString: markup node by node, plain text whole (or sentence by sentence), bare page paths prefixed */
  const payloadString = (s, where) => {
    if (typeof s !== 'string' || !s) return s;
    if (LOOKS_HTML.test(s) && (HAS_ELEMENTS.test(s) || (!LOOKS_CSS.test(s) && !s.includes('@import')))) {
      const src = reorder(s);
      const $ = cheerio.load(src, null, false); const before = stats.hits;
      bucket = stats.payloadOnly; tree($, $.root()[0], where); bucket = stats.missing;
      return stats.hits === before && src === s && !/href=|snz-reviews__text|data-snz-cross/.test(s) ? s : $.html();
    }
    if (s === '/') return s; // the builder's own root marker, not a link (it stays "/" in every locale)
    if (/^(https?:\/\/[^\s"'<>]+|\/[a-z0-9\-/]*)$/i.test(s)) return href(s);
    if (s.length > 4000 || /[{}<>]/.test(s)) return s;
    const t = tr(s, '', where, true); if (t !== s) return t;
    const parts = s.split(/(?<=[.!?])\s+/); if (parts.length < 2) return s;
    const out = parts.map((p) => tr(p, '', where, true));
    if (out.some((p, i) => p === parts[i] && /[A-Za-z]{2,}/.test(parts[i]))) return s;
    return out.join(' ');
  };
  return { stats, tree, payloadString, href };
}

const BODY_RE = /export const BODY_HTML = ("[\s\S]*");\s*$/;
const NUXT_RE = /(<script[^>]*id="__NUXT_DATA__"[^>]*>)([\s\S]*?)(<\/script>)/;
const HOLE = '<!--snz-nuxt-data-->';

/** content.ts of the English page -> content.ts of the Spanish page */
export function translateContent(source, T, where, onText) {
  const bodyM = source.match(BODY_RE); if (!bodyM) throw new Error(`${where}: no BODY_HTML`);
  const body = JSON.parse(bodyM[1]);
  const pm = body.match(NUXT_RE);
  const $ = cheerio.load(reorder(pm ? body.replace(pm[0], () => HOLE) : body), null, false);
  T.tree($, $.root()[0], where, onText);
  let out = $.html();
  if (pm) {
    const nodes = JSON.parse(pm[2]);
    for (let i = 0; i < nodes.length; i++) if (typeof nodes[i] === 'string') { const t = T.payloadString(nodes[i], where); if (t !== nodes[i]) nodes[i] = t; }
    if (!out.includes(HOLE)) throw new Error(`${where}: the payload placeholder did not survive`);
    out = out.replace(HOLE, () => pm[1] + escapeJsonForScript(JSON.stringify(nodes)) + pm[3]);
  }
  return source.replace(bodyM[1], () => JSON.stringify(out));
}

const META_RE = /export const metadata: Metadata = (\{[\s\S]*?\n\});\n/;
const esRoute = (route) => (route === '/' ? '/es' : `/es${route}`);
/** page.tsx: the English page with the Spanish title / description (kept from the existing Spanish page), URLs and locale */
function pageTsx(enSrc, esPrev, route) {
  const m = enSrc.match(META_RE); if (!m) throw new Error(`${route}: no metadata block in page.tsx`);
  const meta = JSON.parse(m[1]);
  const prev = esPrev && esPrev.match(META_RE) ? JSON.parse(esPrev.match(META_RE)[1]) : null;
  const swap = { [meta.title]: prev?.title || meta.title, [meta.description]: prev?.description || meta.description };
  const walk = (o) => { for (const k of Object.keys(o)) { if (typeof o[k] === 'string' && (k === 'title' || k === 'description') && swap[o[k]]) o[k] = swap[o[k]]; else if (o[k] && typeof o[k] === 'object' && !Array.isArray(o[k])) walk(o[k]); } };
  walk(meta);
  meta.alternates = { ...(meta.alternates || {}), canonical: esRoute(route) };
  if (meta.openGraph) { meta.openGraph.url = esRoute(route); meta.openGraph.locale = 'es_US'; }
  return enSrc.replace(m[1], () => JSON.stringify(meta, null, 2)).split('locale="en"').join('locale="es"');
}

function routes() {
  const out = [];
  (function walk(d, rel) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { if (e.isDirectory()) walk(path.join(d, e.name), `${rel}/${e.name}`); else if (e.name === 'content.ts') out.push(rel || '/'); } })(EN, '');
  return out.sort();
}

function main() {
  const CHECK = process.argv.includes('--check');
  const ci = process.argv.indexOf('--contexts'); const want = ci !== -1 ? norm(process.argv[ci + 1] || '') : null;
  const dict = loadDict();
  const T = makeTranslator(dict, blogSlugs());
  let changed = 0; const seen = new Map();
  for (const route of routes()) {
    const rel = route === '/' ? '' : route.slice(1);
    const from = path.join(EN, rel), to = path.join(ES, rel);
    const read = (d, f) => (fs.existsSync(path.join(d, f)) ? fs.readFileSync(path.join(d, f), 'utf8') : null);
    const onText = want ? (text, ctx) => { if (norm(text) === want) { const k = ctx; const e = seen.get(k) || new Set(); e.add(route); seen.set(k, e); } } : null;
    const files = {
      'content.ts': translateContent(read(from, 'content.ts'), T, route, onText),
      'client.tsx': read(from, 'client.tsx'),
      'scripts.ts': read(from, 'scripts.ts').replace(/"id": "(?!es-)/g, '"id": "es-'),
      'page.tsx': pageTsx(read(from, 'page.tsx'), read(to, 'page.tsx'), route),
    };
    for (const [name, text] of Object.entries(files)) {
      if (read(to, name) === text) continue;
      changed++; if (!want) console.log(`${CHECK ? 'would write' : 'wrote'} app/es${route === '/' ? '' : route}/${name}`);
      if (!CHECK && !want) { fs.mkdirSync(to, { recursive: true }); fs.writeFileSync(path.join(to, name), text); }
    }
  }
  if (want) { for (const [ctx, pages] of seen) console.log(`${JSON.stringify(want + SEP + ctx)}   [${[...pages].join(', ')}]`); return; }
  const unused = [...dict.keys()].filter((k) => !T.stats.used.has(k));
  console.log(`es-sync: ${routes().length} page(s), ${T.stats.hits} segment(s) translated, ${changed} file(s) ${CHECK ? 'would change' : 'written'}; dictionary ${dict.size} entr${dict.size === 1 ? 'y' : 'ies'}${unused.length ? `, ${unused.length} not used by any page` : ''}`);
  if (process.argv.includes('--unused')) for (const k of unused) console.log(`  unused: ${k.slice(0, 160)}`);
  const payloadOnly = [...T.stats.payloadOnly.keys()].filter((k) => !T.stats.missing.has(k));
  if (payloadOnly.length) console.log(`  ${payloadOnly.length} segment(s) exist in the hydration payload only (not rendered) and stay as they are: ${payloadOnly.map((k) => JSON.stringify(k.length > 48 ? k.slice(0, 48) + '…' : k)).join(', ')}`);
  if (T.stats.missing.size) {
    console.log(`\n${T.stats.missing.size} English segment(s) without a Spanish entry in ${path.relative(ROOT, DICT_FILE).replace(/\\/g, '/')}:`);
    for (const [seg, pages] of T.stats.missing) console.log(`  ${JSON.stringify(seg)}   [${[...pages].slice(0, 4).join(', ')}${pages.size > 4 ? ', …' : ''}]`);
    process.exit(1);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
