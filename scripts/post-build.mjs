/*
 * Post-build gate for the prerendered pages (Castle Rock, CO, November 2026; .next/server/app for the server build, out/
 * for a static export). Runs at the end of `npm run build` — locally and on Vercel (.vercelignore keeps this one file of
 * scripts/ in the upload) — and fails the build when the output would ship something the Castle Rock store must never
 * show:
 *   - a page without exactly one LocalBusiness node in its JSON-LD, or whose canonical is not on SITE_URL (lib/location.ts);
 *   - a previous-location marker: the McAllen name, phone, ZIP, GBP place id, tracking / CRM ids, the McAllen
 *     storefront / team / hero photos, or the McAllen GoHighLevel location id anywhere but inside an image path (the
 *     shared image library was copied from that account);
 *   - a missing sitemap.xml / robots.txt / index.html.
 * Self-contained on purpose (no imports from the other scripts, which are not uploaded). Exit code 1 = broken build,
 * so a bad export never reaches production. scripts/relocate-castle-rock.mjs skips this file (the markers are the point).
 *   node scripts/post-build.mjs            (part of `npm run build`)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
/* the canonical origin, resolved like lib/location.ts: NEXT_PUBLIC_SITE_URL, else Vercel's production URL, else the
   deployment URL, else localhost — never a hardcoded domain */
const envOrigin = (v, scheme = 'https') => { const s = (v || '').trim().replace(/\/+$/, ''); return s ? (/^https?:\/\//.test(s) ? s : `${scheme}://${s}`) : ''; };
const SITE_URL = envOrigin(process.env.NEXT_PUBLIC_SITE_URL) || envOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL) || envOrigin(process.env.VERCEL_URL) || 'http://localhost:3000';
/* the prerendered pages: the static export (out/) when it exists, else Next's server output (.next/server/app) */
const OUT = fs.existsSync(path.join(ROOT, 'out')) ? path.join(ROOT, 'out') : path.join(ROOT, '.next', 'server', 'app');

const MARKERS = [
  ['McAllen', /mcallen/gi],
  ['McAllen phone', /586[-. ]?5646|9565865646|\(956\)/g],
  ['McAllen ZIP / street', /78504|7913 N(?:orth)? 10th/g],
  ['McAllen GBP place id', /ChIJBYBxOXChZYYR48f71GAS7YY/g],
  ['McAllen tracking ids', /G-9R1JGVBRBR|G-TS1RXQVPYT|b781856a-502d-46d8-a1da-c8e46665edab/g],
  ['McAllen CRM ids', /6ada7129c5fa6117307c554f|6ada73894325b023027e7371|00b3cdec-7a6f-4184-95ec-81210f1e7bc8|0BTnYKylVR6OcWJug3r8|lrAns7Z8j3vEJW3DC0Yr|67f5847f79c4ab793baf0087/g],
  ['McAllen storefront / team / hero photos', /684480ff2c95c570cfc22e24|6a7578249a9c7792ea5a8b22|699c969010bc9c1e4d659063|69a1cbdf917b4b217201b5ff|69a601e75a52f4e92a27dcf5/g],
  ['McAllen GHL location id outside image paths', /ARD47WoZpqaZSQ9MSxLD(?!(?:\/|\\u002F|\\\\u002F)media(?:\/|\\u002F|\\\\u002F))/g],
  ['Texas', /\bTX\b|Texas|Rio Grande|Edinburg|Pharr|Winter Texan/g],
  ['Spanish route', /href="\/es(?:\/|")/g],
];

function walk(dir, out = []) { for (const e of fs.readdirSync(dir, { withFileTypes: true })) { const p = path.join(dir, e.name); if (e.isDirectory()) { if (e.name !== '_next' && e.name !== 'assets') walk(p, out); } else if (/\.(html|xml|txt|js|body)$/.test(e.name)) out.push(p); } return out; }

const problems = [];
// the export writes sitemap.xml / robots.txt as files; the server build prerenders them as <name>.body next to the route
for (const f of ['index.html', 'sitemap.xml', 'robots.txt']) if (!fs.existsSync(path.join(OUT, f)) && !fs.existsSync(path.join(OUT, f + '.body'))) problems.push(`missing ${path.relative(ROOT, OUT)}/${f}`);
const files = fs.existsSync(OUT) ? walk(OUT) : [];
let pages = 0;
for (const f of files) {
  const rel = path.relative(OUT, f).replace(/\\/g, '/');
  const s = fs.readFileSync(f, 'utf8');
  for (const [name, re] of MARKERS) { const m = s.match(re); if (m) problems.push(`${rel}: ${name} ×${m.length} (e.g. "${m[0]}")`); }
  if (!rel.endsWith('.html') || /^(404|_not-found|ghl-stub)\.html$/.test(rel)) continue;
  pages++;
  // the store's own node: @type ["FurnitureStore","LocalBusiness"] inside the page's one JSON-LD graph (lib/schema.ts)
  const blocks = [...s.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const stores = blocks.flatMap((b) => b.match(/"@type":\["FurnitureStore","LocalBusiness"\]/g) || []);
  if (blocks.length !== 1 || stores.length !== 1) problems.push(`${rel}: ${blocks.length} JSON-LD block(s), ${stores.length} LocalBusiness node(s) (expected 1 and 1)`);
  const canonical = (s.match(/rel="canonical" href="([^"]+)"/) || [])[1] || '';
  if (!canonical.startsWith(SITE_URL)) problems.push(`${rel}: canonical "${canonical}" not on ${SITE_URL}`);
}
if (problems.length) {
  console.error(`post-build: ${problems.length} problem(s) in the export — build failed`);
  for (const p of problems.slice(0, 40)) console.error('  ✗ ' + p);
  if (problems.length > 40) console.error(`  … ${problems.length - 40} more`);
  process.exit(1);
}
console.log(`post-build: OK — ${pages} pages in ${path.relative(ROOT, OUT)}, one LocalBusiness node each, canonicals on ${SITE_URL}, no previous-location markers`);
