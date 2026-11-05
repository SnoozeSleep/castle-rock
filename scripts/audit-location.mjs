#!/usr/bin/env node
/**
 * Location audit for the Castle Rock, CO build (November 2026): previous-location leftovers + Castle Rock data
 * consistency, over the source tree and every prerendered page.
 *   npm run build && node scripts/audit-location.mjs      (npm run audit)
 * Exit code 1 when an unintended leftover, a missing Castle Rock value or a metadata rule violation is found.
 *
 * Checked on every built route (.next/server/app, or out/ for a static export): the NAP (6360 Promenade Pkwy, Castle Rock,
 * CO 80108, (303) 736-8465 as text and as tel:+13037368465), the hours, the social links, the Maps query, the one
 * LocalBusiness node (address, telephone, email, two opening-hours rules, sameAs without empty entries, areaServed the
 * six cities, no AggregateRating / Review / legalName, no geo / hasMap while the Place ID is missing), the canonical on
 * SITE_URL, the title rule ("| Snooze Mattress", <= 60, names Castle Rock), description <= 155, one H1, no hreflang
 * alternates (English only), and that no previous-location string, photo or integration id is left.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const envOrigin = (v, scheme = 'https') => { const s = (v || '').trim().replace(/\/+$/, ''); return s ? (/^https?:\/\//.test(s) ? s : `${scheme}://${s}`) : ''; };
const SITE_URL = envOrigin(process.env.NEXT_PUBLIC_SITE_URL) || envOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL) || envOrigin(process.env.VERCEL_URL) || 'http://localhost:3000';
const EXPORT_DIR = fs.existsSync(path.join(ROOT, 'out')) ? path.join(ROOT, 'out') : path.join(ROOT, '.next', 'server', 'app');
// AUDIT_OUT=<dir> audits another build (e.g. the clean-checkout build) with this tree as the source
const OUT = process.env.AUDIT_OUT || EXPORT_DIR;
const CR = {
  street: '6360 Promenade Pkwy', cityZip: 'Castle Rock, CO 80108', phone: '(303) 736-8465', tel: 'tel:+13037368465',
  email: 'keithc@snoozemattresscompany.com',
  fb: 'https://www.facebook.com/SnoozeMattressCoCastleRock/', ig: 'https://www.instagram.com/snoozemattress_denver/',
  mapsQ: '6360+Promenade+Pkwy%2C+Castle+Rock%2C+CO+80108',
  hoursEn: ['Mon–Sat 10 AM–7 PM', 'Sun 11 AM–6 PM'],
  areas: ['Castle Rock', 'Parker', 'Lone Tree', 'Highlands Ranch', 'Castle Pines', 'Centennial'],
};

/* previous-location strings and ids; each with an "allowed context" test (true = expected there) */
const tooling = (ctx, file) => /^scripts\/(relocate|relocate-castle-rock|audit-location|brand-nap|post-build)\.mjs$|^README\.md$/.test(file);
const LEFTOVERS = [
  // vercel.json keeps the McAllen blog slugs as redirect SOURCES (308 -> /blog): intended
  { name: 'McAllen', re: /mcallen/gi, ok: (ctx, file) => tooling(ctx, file) || (file === 'vercel.json' && /"source": "\/(?:es\/)?blog\/[^"]*mcallen/.test(ctx)) },
  { name: 'Texas / TX', re: /\bTX\b|Texas|Rio Grande|the Valley|el Valle|South Texas|Winter Texan|tamalada|quincea|Hidalgo|Harlingen|Monterrey|Edinburg|Pharr|\bMission\b/g, ok: (ctx, file) => tooling(ctx, file) || /scripts\//.test(file) },
  { name: 'old phone', re: /956[-. )]*586[-. ]*5646|9565865646/g, ok: tooling },
  { name: 'old address', re: /7913\s*\+?\s*N(?:orth)?\s*\+?\s*10th|78504/g, ok: (ctx, file) => tooling(ctx, file) || /unsplash\.com\/photo-1597852075012/.test(ctx) },
  { name: 'old e-mail / socials', re: /northmcallen@|snoozemcallen|SnoozeMcAllen|Snooze-Mattress-Wellness-61575812121380/gi, ok: tooling },
  { name: 'old GBP place id', re: /ChIJBYBxOXChZYYR48f71GAS7YY/g, ok: tooling },
  { name: 'old hours', re: /Sun(?:day)? 12[ –-]+6|12[ –-]+6 PM|Su 12:00-18:00|America\/Chicago/g, ok: (ctx, file) => tooling(ctx, file) || /scripts\//.test(file) },
  { name: 'old domain', re: /mcallen\.snoozemattresscompany\.com|brownsville-webiste|rockwall\.snoozemattresscompany/gi, ok: (ctx, file) => tooling(ctx, file) || /scripts\//.test(file) },
  { name: 'Englander / Puffy', re: /Englander|Puffy/g, ok: (ctx, file) => /scripts\/|README/.test(file) },
  { name: 'optin-page (only the redirect rule may name it)', re: /optin-page/g, ok: (ctx, file) => /vercel\.json|scripts\/|README/.test(file) },
  // GTM-TVPN94M is the shared store container and belongs on the Castle Rock site too (supplied November 5, 2026); the
  // McAllen GA4 properties and its Simpli.fi tag do not
  { name: 'McAllen tracking ids', re: /G-9R1JGVBRBR|G-TS1RXQVPYT|b781856a/g, ok: (ctx, file) => /scripts\/|README/.test(file) },
  { name: 'McAllen CRM ids (chat, quiz webhook, form, calendar, reviews)', re: /6ada7129c5fa6117307c554f|6ada73894325b023027e7371|00b3cdec-7a6f-4184-95ec-81210f1e7bc8|0BTnYKylVR6OcWJug3r8|lrAns7Z8j3vEJW3DC0Yr|67f5847f79c4ab793baf0087/g, ok: (ctx, file) => /scripts\/|README/.test(file) },
  { name: 'McAllen storefront / team / hero photos', re: /684480ff2c95c570cfc22e24|6a7578249a9c7792ea5a8b22|699c969010bc9c1e4d659063|69a1cbdf917b4b217201b5ff|69a601e75a52f4e92a27dcf5/g, ok: (ctx, file) => /scripts\/|README|asset-map|conversion-report|overrides\/overrides\.json|public\/ghl-offline-shim\.js|lib\/ghl-shim\.ts/.test(file) },
  // the McAllen GoHighLevel sub-account id is the base path of the shared image library: allowed in image URLs only
  { name: 'McAllen GHL location id outside image URLs', re: /ARD47WoZpqaZSQ9MSxLD/g, ok: (ctx, file) => /ARD47WoZpqaZSQ9MSxLD(?:\/|\\u002F|\\\\u002F)media(?:\/|\\u002F|\\\\u002F)|filesafe\/ARD47|imageReplacements|BANNER_PATH|image-variants|asset-map|conversion-report/.test(ctx) || /scripts\/|README|lib\/ghl-shim\.ts|public\/ghl-offline-shim\.js/.test(file) },
  { name: 'reviews / staff names', re: /Xandria|Karina R\.|Lydia,|\bPablo\b|\bElias\b/g, ok: tooling },
  { name: 'drive times', re: /minute drive|minutos en auto|drive time/gi, ok: (ctx, file) => tooling(ctx, file) || /no drive times/i.test(ctx) },
  { name: 'Spanish route', re: /\/es\//g, ok: (ctx, file) => tooling(ctx, file) || /scripts\/|vercel\.json/.test(file) },
];

const SKIP = new Set(['node_modules', '.next', '.git', 'verify-out', '.vercel', 'out', 'assets', 'chunks', 'docs']);
function walk(dir, out = []) { for (const e of fs.readdirSync(dir, { withFileTypes: true })) { if (SKIP.has(e.name)) continue; const p = path.join(dir, e.name); if (e.isDirectory()) walk(p, out); else if (/\.(ts|tsx|mjs|js|json|html|css|md)$/.test(e.name) && !/package-lock|tsbuildinfo|asset-map|conversion-report|segments\.json|missing\.json/.test(e.name)) out.push(p); } return out; }
function walkHtml(dir, out = []) { if (!fs.existsSync(dir)) return out; for (const e of fs.readdirSync(dir, { withFileTypes: true })) { const p = path.join(dir, e.name); if (e.isDirectory()) { if (e.name !== '_next') walkHtml(p, out); } else if (e.name.endsWith('.html') && !/^(404|_not-found|ghl-stub)\.html$/.test(e.name)) out.push(p); } return out; }
const rel = (p) => path.relative(ROOT, p).replace(/\\/g, '/');

let problems = 0;
function scan(files, label) {
  console.log(`\n=== ${label}: ${files.length} file(s) ===`);
  const found = {};
  for (const f of files) {
    const r = rel(f);
    const s = fs.readFileSync(f, 'utf8');
    for (const L of LEFTOVERS) {
      const re = new RegExp(L.re.source, L.re.flags); let m;
      while ((m = re.exec(s))) { const ctx = s.slice(Math.max(0, m.index - 70), m.index + m[0].length + 70).replace(/\s+/g, ' '); if (L.ok(ctx, r)) continue; (found[L.name] ??= []).push(`${r}: …${ctx}…`); }
    }
  }
  for (const [name, hits] of Object.entries(found)) { problems += hits.length; console.log(`  ✗ ${name}: ${hits.length} hit(s)`); for (const h of hits.slice(0, 5)) console.log(`      ${h.slice(0, 230)}`); if (hits.length > 5) console.log(`      … ${hits.length - 5} more`); }
  if (!Object.keys(found).length) console.log('  ✓ no unintended leftovers');
}

scan(walk(ROOT).concat([path.join(ROOT, 'public', 'ghl-stub.html')].filter(fs.existsSync)), 'source tree');
const html = walkHtml(OUT);
scan(html, `built routes (${path.relative(ROOT, OUT)})`);

// ---- Castle Rock data and the metadata rules on every built route
console.log('\n=== Castle Rock data per built route ===');
const count = (s, needle) => s.split(needle).length - 1;
const rows = [];
for (const f of html) {
  const s = fs.readFileSync(f, 'utf8'); const r = '/' + path.relative(OUT, f).replace(/\\/g, '/').replace(/\.html$/, '').replace(/(^|\/)index$/, '').replace(/\/$/, '');
  const route = r === '/' || r === '' ? '/' : r;
  const noindex = /<meta name="robots" content="noindex/.test(s);
  const blocks = [...s.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => { try { return JSON.parse(m[1]); } catch { return null; } });
  const nodes = blocks.flatMap((b) => (b && Array.isArray(b['@graph']) ? b['@graph'] : b ? [b] : []));
  const stores = nodes.filter((d) => d && Array.isArray(d['@type']) && d['@type'].includes('LocalBusiness'));
  const store = stores[0];
  const hoursOk = store && Array.isArray(store.openingHoursSpecification) && store.openingHoursSpecification.length === 2 && store.openingHoursSpecification[0].opens === '10:00' && store.openingHoursSpecification[0].closes === '19:00' && store.openingHoursSpecification[1].opens === '11:00' && store.openingHoursSpecification[1].closes === '18:00';
  const placeId = fs.readFileSync(path.join(ROOT, 'lib/location.ts'), 'utf8').match(/const PLACE_ID = '([^']*)'/)?.[1] || '';
  const ldOk = !!store && stores.length === 1 && blocks.length === 1 && store.address?.streetAddress === CR.street && store.address?.addressLocality === 'Castle Rock' && store.address?.addressRegion === 'CO' && store.address?.postalCode === '80108' && /3037368465|303\) 736-8465|303-736-8465/.test(String(store.telephone)) && store.email === CR.email && Array.isArray(store.sameAs) && store.sameAs.every(Boolean) && store.sameAs.includes(CR.fb) && store.sameAs.includes(CR.ig) && Array.isArray(store.areaServed) && store.areaServed.map((a) => a.name).join('|') === CR.areas.join('|') && hoursOk && String(store['@id']).startsWith(SITE_URL) && !('aggregateRating' in store) && !('legalName' in store) && !('review' in store) && (placeId ? !!store.hasMap : !('hasMap' in store) && !('geo' in store));
  const decode = (t) => t.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  const title = decode((s.match(/<title>([^<]*)<\/title>/) || [])[1] || '');
  const desc = decode((s.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '');
  const h1 = (s.match(/<h1[\s>]/g) || []).length;
  const canonical = (s.match(/rel="canonical" href="([^"]+)"/) || [])[1] || '';
  const hreflang = /hrefLang="|hreflang="/.test(s); // English only, no hreflang alternates
  const row = {
    route, address: count(s, CR.street), cityZip: count(s, CR.cityZip), phone: count(s, CR.phone), tel: count(s, CR.tel),
    fb: count(s, `href="${CR.fb}"`), ig: count(s, `href="${CR.ig}"`), hours: CR.hoursEn.every((h) => s.includes(h)), maps: count(s, CR.mapsQ), jsonld: ldOk,
    canonical, title, titleLen: title.length, descLen: desc.length, h1, hreflang, noindex,
  };
  rows.push(row);
  const bad = [];
  if (!row.address || !row.phone || !row.tel || !row.fb || !row.ig || !row.hours || !row.maps || !row.jsonld) bad.push('missing Castle Rock data' + (row.jsonld ? '' : ' (LocalBusiness node)'));
  if (!row.canonical.startsWith(SITE_URL)) bad.push('canonical ' + row.canonical);
  // the confirmation pages are noindex (short titles by design); the quiz draws its H1 client-side (public/sleep-fit-quiz.js)
  if (!noindex && !/\| Snooze Mattress$/.test(title)) bad.push(`title does not end "| Snooze Mattress": ${title}`);
  if (title.length > 60) bad.push(`title ${title.length} chars`);
  // blog posts carry the client's own SEO titles (topical, not local); every other indexable page names Castle Rock
  if (!noindex && !/Castle Rock/.test(title) && !/^\/blog\/./.test(route)) bad.push(`title without "Castle Rock": ${title}`);
  if (desc.length > 155) bad.push(`description ${desc.length} chars`);
  if (!desc) bad.push('no description');
  if (h1 !== 1 && !/\/sleep-quiz$/.test(route)) bad.push(`${h1} h1`);
  if (hreflang) bad.push('hreflang alternates present (English-only site)');
  if (bad.length) { problems++; console.log(`  ✗ ${route}: ${bad.join('; ')}`); }
}
console.log(`  routes checked: ${rows.length}; all carry the Castle Rock NAP, tel:+1…, Facebook + Instagram, hours, Maps query, one valid LocalBusiness node, canonical on ${SITE_URL}: ${rows.every((x) => x.address && x.phone && x.tel && x.fb && x.ig && x.hours && x.maps && x.jsonld && x.canonical.startsWith(SITE_URL)) ? 'YES' : 'NO'}`);
console.log(`  noindex routes: ${rows.filter((x) => x.noindex).map((x) => x.route).join(', ') || 'none'}`);

// ---- integrations in the built routes
console.log('\n=== integrations in built routes ===');
const w = { calendar: /widget\/booking\/([A-Za-z0-9_\[\]-]+)/g, form: /widget\/form\/([A-Za-z0-9_\[\]-]+)/g, 'form placeholder': /ghl-stub\/form\/([A-Za-z0-9_\[\]-]+)/g, reviews: /review_widget\/([A-Za-z0-9]+)\?widgetId=([a-f0-9]+)/g, 'reviews placeholder': /data-snz-reviews="(pending)"/g, gtm: /googletagmanager\.com\/gtm\.js\?id=([A-Z0-9-]+)|ns\.html\?id=([A-Z0-9-]+)/g, ga4: /gtag\/js\?id=([A-Z0-9-]+)/g, chat: /data-widget-id="([a-f0-9]+)"/g, simplifi: /tag\.simpli\.fi\/sifitag\/([a-z0-9-]+)/g };
for (const [k, re] of Object.entries(w)) { const ids = new Map(); for (const f of html) { const s = fs.readFileSync(f, 'utf8'); for (const m of s.matchAll(re)) { const id = m.slice(1).filter(Boolean).join('/'); (ids.get(id) || ids.set(id, new Set()).get(id)).add(rel(f)); } } if (!ids.size) console.log(`  ${k}: none`); for (const [id, pages] of ids) console.log(`  ${k}: ${id} on ${pages.size} route(s)`); }

console.log(`\n${problems ? `PROBLEMS: ${problems}` : 'CLEAN: no unintended leftovers, Castle Rock data consistent on every route'}`);
process.exit(problems ? 1 : 0);
