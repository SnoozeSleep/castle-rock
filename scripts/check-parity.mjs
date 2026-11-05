/*
 * English / Spanish parity of the built pages, section by section (November 2026, "restore the Spanish site").
 * Reads the prerendered HTML of every English page and its Spanish twin (.next/server/app, after `npm run build`),
 * drops the shared chrome (header, footer, scripts, styles) and walks the two pages block by block:
 *   - the same blocks in the same order (h1–h5, p, li, summary, th/td, img, iframe, table, button);
 *   - the same number of sentences in each text block (a translation that lost or gained a sentence shows up here);
 *   - the same links (hrefs compared without the /es prefix; a blog post link is compared by its twin, lib/blog-nav.ts);
 *   - the same images, embeds (iframe src / data-src) and ids.
 * A difference is printed with both sides; INTENDED differences are listed in ALLOW with the reason.
 *
 *   node scripts/check-parity.mjs            every pair          exit 1 when a pair differs
 *   node scripts/check-parity.mjs /faq       one pair, verbose (every block side by side with --all)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, '.next', 'server', 'app');
const only = process.argv.slice(2).find((a) => a.startsWith('/'));
const ALL = process.argv.includes('--all');

/* Spanish slug of each English post (lib/blog-nav.ts BLOG_SLUG_ES) */
const navSrc = fs.readFileSync(path.join(ROOT, 'lib', 'blog-nav.ts'), 'utf8');
const SLUG_ES = {}; { const m = navSrc.match(/export const BLOG_SLUG_ES[^=]*=\s*\{([\s\S]*?)\};/); if (m) for (const p of m[1].matchAll(/'([^']+)':\s*'([^']+)'/g)) SLUG_ES[p[1]] = p[2]; }
const SLUG_EN = Object.fromEntries(Object.entries(SLUG_ES).map(([en, es]) => [es, en]));

/* intended differences: [route or '*', pattern on the printed difference, reason] */
const ALLOW = [
  ['/mattress-sales', /Premium materials\.Honest pricing\./, 'the English line lacks a space after its first period ("materials.Honest"), so it counts one sentence fewer'],
];

const html = (route) => { const f = path.join(OUT, route === '/' ? 'index.html' : `${route.slice(1)}.html`); return fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null; };
/* sentence ends; abbreviations ("N.A.", "a.m.", "p. ej.") and decimals are not ends */
const sentences = (t) => {
  const s = t.replace(/\b(?:[A-Za-z]\.){2,}/g, 'X').replace(/\b[ap]\.\s?m\./gi, 'X').replace(/(\d)\.(\d)/g, '$1$2').replace(/\b(?:p\. ej|etc|vs|Sr|Sra|Dr|St|No)\./g, 'X');
  return (s.match(/[.!?…]+(?=\s|$|["”’)])/g) || []).length || (s.trim() ? 1 : 0);
};
const unEs = (href) => {
  if (!href) return href;
  let h = href.replace(/^https?:\/\/[^/]+(?=\/)/, (m) => (/snoozemattresscompany\.com|localhost/.test(m) ? '' : m));
  if (h === '/es') return '/';
  if (h.startsWith('/es/')) { h = h.slice(3); const post = /^\/blog\/([^/?#]+)/.exec(h); if (post && SLUG_EN[post[1]]) h = h.replace(post[1], SLUG_EN[post[1]]); }
  return h;
};
function blocks(src) {
  const $ = cheerio.load(src);
  const root = $('#snz-app').length ? $('#snz-app') : $('body');
  // the site chrome (top bar, header, ticker, footer) is shared; a page's own <header> / breadcrumb <nav> is content
  root.children('header, footer, [class^="TopBar_"], .snooze-ticker-wrap').remove();
  $('script, style, noscript, template, svg, [hidden]').remove();
  const out = [];
  root.find('h1, h2, h3, h4, h5, p, li, summary, th, td, img, iframe, table, button, [role="heading"]').each((_, el) => {
    const $el = $(el); const tag = el.name;
    if (tag === 'img') { out.push({ tag, key: `img ${($el.attr('src') || '').replace(/&amp;/g, '&').slice(0, 140)}`, text: $el.attr('alt') || '' }); return; }
    if (tag === 'iframe') { out.push({ tag, key: `iframe ${$el.attr('data-src') || $el.attr('src') || ''} #${($el.attr('id') || '').replace(/_\d+$/, '')}`, text: $el.attr('title') || '' }); return; }
    if (tag === 'table') { out.push({ tag, key: `table ${$el.find('tr').length} rows`, text: '' }); return; }
    // a block that only wraps other blocks is described by them
    if ($el.find('p, li, h1, h2, h3, h4, h5, table').length && tag !== 'li' && tag !== 'td' && tag !== 'th') return;
    const own = $el.clone(); if (tag === 'li' || tag === 'td' || tag === 'th') own.find('ul, ol, table, p, h1, h2, h3, h4, h5').remove(); // those are blocks of their own
    const text = own.text().replace(/\s+/g, ' ').trim(); if (!text) return;
    const links = own.find('a[href]').map((__, a) => unEs($(a).attr('href'))).get().filter((h) => h && !/^(tel:|mailto:|#)/.test(h));
    const name = el.attribs.role === 'heading' && !/^h\d$/.test(tag) ? `h${el.attribs['aria-level'] || '?'}*` : tag;
    out.push({ tag: name, key: `${name} s${sentences(text)}${links.length ? ` -> ${links.join(' ')}` : ''}`, text });
  });
  return out;
}

const enRoutes = [];
(function walk(d, rel) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) { if (!/^(_next|es|assets)$/.test(e.name) || rel) walk(p, `${rel}/${e.name}`); } else if (e.name.endsWith('.html') && !/^(404|_not-found|_global-error|ghl-stub)\.html$/.test(e.name) && !(e.name === 'es.html' && !rel)) enRoutes.push(`${rel}/${e.name.slice(0, -5)}`.replace(/\/index$/, '') || '/'); } })(OUT, '');

let differing = 0, pairs = 0, allowed = 0;
for (const route of enRoutes.sort()) {
  if (only && route !== only) continue;
  const post = /^\/blog\/([^/]+)$/.exec(route);
  const esRoute = post ? (SLUG_ES[post[1]] ? `/es/blog/${SLUG_ES[post[1]]}` : null) : route === '/' ? '/es' : `/es${route}`;
  const en = html(route), es = esRoute ? html(esRoute) : null;
  if (!en) continue;
  if (!es) { console.log(`✗ ${route}: no Spanish twin${esRoute ? ` (${esRoute} not built)` : ''}`); differing++; continue; }
  pairs++;
  const a = blocks(en), b = blocks(es);
  const diffs = [];
  // align by longest common subsequence of the structural keys, so one missing block does not shift everything after it
  const n = a.length, m = b.length; const L = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = a[i].key === b[j].key ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  let i = 0, j = 0; const rows = [];
  while (i < n && j < m) { if (a[i].key === b[j].key) { rows.push([a[i++], b[j++]]); } else if (L[i + 1][j] >= L[i][j + 1]) rows.push([a[i++], null]); else rows.push([null, b[j++]]); }
  while (i < n) rows.push([a[i++], null]); while (j < m) rows.push([null, b[j++]]);
  for (let k = 0; k < rows.length; k++) {
    const [x, y] = rows[k];
    if (x && y) { if (ALL) console.log(`    = ${x.key.slice(0, 60).padEnd(60)} | ${x.text.slice(0, 70)} | ${y.text.slice(0, 70)}`); continue; }
    // an EN-only block directly followed by an ES-only block of the same tag is one block that differs
    const next = rows[k + 1];
    if (x && next && !next[0] && next[1] && next[1].tag === x.tag) { diffs.push(`~ ${x.tag}: EN [${x.key}] ${JSON.stringify(x.text.slice(0, 160))}\n        ES [${next[1].key}] ${JSON.stringify(next[1].text.slice(0, 160))}`); k++; continue; }
    diffs.push(x ? `- only EN [${x.key}] ${JSON.stringify(x.text.slice(0, 160))}` : `+ only ES [${y.key}] ${JSON.stringify(y.text.slice(0, 160))}`);
  }
  const real = diffs.filter((d) => { const ok = ALLOW.find(([r, re]) => (r === '*' || r === route) && re.test(d)); if (ok) allowed++; return !ok; });
  if (real.length) { differing++; console.log(`✗ ${route} | ${esRoute}: ${a.length} / ${b.length} blocks, ${real.length} difference(s)`); for (const d of real.slice(0, only ? 400 : 12)) console.log(`    ${d}`); if (!only && real.length > 12) console.log(`    … ${real.length - 12} more (node scripts/check-parity.mjs ${route})`); }
  else console.log(`✓ ${route} | ${esRoute}: ${a.length} blocks, same structure, sentence counts, links, images and embeds`);
}
console.log(`\n${pairs} pair(s) compared; ${differing ? `${differing} differ` : 'all in step'}${allowed ? `; ${allowed} intended difference(s) allowed` : ''}`);
if (differing) process.exit(1);
