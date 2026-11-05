/*
 * Host-redirect probe (the "site broken on *.vercel.app" check of the November 2026 brief). Against a running server
 * build (npx next start -p 4173) it requests page routes and assets with a `*.vercel.app` Host header and reports the
 * status and Location of each:
 *   - built WITHOUT NEXT_PUBLIC_SITE_URL (as the preview deployment is until the domain is attached): everything 200,
 *     nothing redirects — middleware.ts is inert;
 *   - built WITH NEXT_PUBLIC_SITE_URL=https://example.invalid: page routes 308 to that origin (query kept), every
 *     asset, robots, sitemap, favicon and ghl-stub file 200 with no Location.
 *   node scripts/host-probe.mjs [expect-redirect]       (BASE=http://localhost:4173)
 */
const BASE = (process.env.BASE || 'http://localhost:4173').replace(/\/+$/, '');
const EXPECT_REDIRECT = process.argv.includes('expect-redirect');
const PAGES = ['/', '/about-us?utm=x', '/mattress-store-parker', '/blog', '/booking', '/no-such-page'];
const ASSETS = ['/favicon.ico', '/robots.txt', '/sitemap.xml', '/llms.txt', '/assets/castle-rock/photo-coming-soon.svg', '/snz-motion.js?v=mv2keep', '/ghl-stub/form/CR_FORM_ID', '/assets/filesafe/BljrSmLCnm4gF9LpsTRZ/media/6a9899f9da522bf173a9bd91.png.webp'];
let bad = 0;
const probe = async (p, host) => {
  const r = await fetch(BASE + p, { redirect: 'manual', headers: host ? { host, 'x-forwarded-host': host } : {} });
  return { status: r.status, location: r.headers.get('location') || '' };
};
// the home page's own stylesheet / chunk links, so the probe covers what the page really loads
const home = await (await fetch(BASE + '/')).text();
const linked = [...home.matchAll(/(?:href|src)="(\/_next\/[^"]+)"/g)].map((m) => m[1]).filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);
for (const [label, list, wantRedirect] of [['pages', PAGES, EXPECT_REDIRECT], ['assets', [...ASSETS, ...linked], false]]) {
  console.log(`\n== ${label} with Host: preview.vercel.app`);
  for (const p of list) {
    const r = await probe(p, 'preview.vercel.app');
    const ok = wantRedirect ? (r.status === 308 && r.location.startsWith('https://example.invalid')) : (r.status < 300 || (p === '/no-such-page' && r.status === 404));
    if (!ok) bad++;
    console.log(`  ${ok ? '✓' : '✗'} ${String(r.status).padEnd(4)} ${p.padEnd(70)} ${r.location}`);
  }
}
console.log(`\n== pages with Host: localhost (never redirected)`);
for (const p of ['/', '/booking']) { const r = await probe(p, null); const ok = r.status === 200; if (!ok) bad++; console.log(`  ${ok ? '✓' : '✗'} ${r.status} ${p}`); }
console.log(bad ? `\nPROBLEMS: ${bad}` : `\nOK: ${EXPECT_REDIRECT ? 'pages 308 to the canonical origin, assets untouched' : 'nothing redirects while NEXT_PUBLIC_SITE_URL is unset'}`);
process.exit(bad ? 1 : 0);
