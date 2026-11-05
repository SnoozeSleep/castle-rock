/*
 * The Spanish site in a real browser (Castle Rock, November 2026): every English page and its Spanish twin.
 *   node scripts/check-es.mjs [baseUrl] [--only /route] [--no-mobile]        default base http://localhost:4173
 * needs the built site running (`npm run build && npx next start -p 4173`) and Chrome (CHROME=<path> to override).
 *
 * Per pair, at 1280 px: both pages answer 200; <html lang> es / en; exactly one <h1>; the hreflang set (en-US, es-US,
 * x-default) and a self-canonical; the EN | ES toggle is a plain <a href> and round-trips (ES page -> its English page
 * -> back to the same Spanish page); every internal link on the Spanish page stays under /es; no visible English left
 * (customer reviews are exempt: they are marked lang="en"); no console or page errors; the tags fire with no
 * interaction — gtm.js for the container, gtag.js + a page_view hit for the GA4 property, the Simpli.fi tag once — and
 * the chat widget is the site's one script carrying the Spanish widget id on the Spanish page and the English id on its
 * English twin (lib/integrations.ts chatWidgetId; never the other language's id, never two scripts, at most one
 * <chat-widget>; a loader.js request beyond the site's own — the tag container's copy — is printed as a note);
 * form_embed.js at most once.
 * A second gtag.js request for the same property (the container's own copy) is a note too. At 390 px: no horizontal overflow, no errors. Then the dataLayer events on /es: phone_click,
 * directions_click, optin_submit, booking_confirmation and quiz_completed (the quiz webhook request is intercepted and
 * NOT sent: its body is read to confirm the store and the language; no lead is posted).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const BASE = args.find((a) => /^https?:/.test(a)) || 'http://localhost:4173';
const ONLY = args.includes('--only') ? args[args.indexOf('--only') + 1] : null;
const MOBILE = !args.includes('--no-mobile');
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const pick = (src, re) => (src.match(re) || [, ''])[1];
const integ = read('lib/integrations.ts');
const GTM = pick(integ, /gtmIds: \['([^']*)'/), GA4 = pick(integ, /ga4Id: '([^']*)'/), SIFI = pick(integ, /simplifiTagId: '([^']*)'/);
const CHAT = { en: pick(integ, /chatWidgetId: \{ en: '([^']*)'/), es: pick(integ, /chatWidgetId: \{ en: '[^']*', es: '([^']*)'/) };
const chatWant = (l) => (CHAT[l] ? [CHAT[l]] : []);
const chatIdsOf = (page) => page.evaluate(() => [...document.querySelectorAll('script[data-widget-id]')].map((s) => s.getAttribute('data-widget-id')));
const SLUG_ES = {}; { const m = read('lib/blog-nav.ts').match(/export const BLOG_SLUG_ES[^=]*=\s*\{([\s\S]*?)\};/); if (m) for (const p of m[1].matchAll(/'([^']+)':\s*'([^']+)'/g)) SLUG_ES[p[1]] = p[2]; }

/* the English routes, from the build */
const OUT = path.join(ROOT, '.next', 'server', 'app');
const enRoutes = [];
(function walk(d, rel) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) { if (!/^(_next|es|assets)$/.test(e.name) || rel) walk(p, `${rel}/${e.name}`); } else if (e.name.endsWith('.html') && !/^(404|_not-found|_global-error|ghl-stub)\.html$/.test(e.name) && !(e.name === 'es.html' && !rel)) enRoutes.push(`${rel}/${e.name.slice(0, -5)}`.replace(/\/index$/, '') || '/'); } })(OUT, '');
const twin = (route) => { const post = /^\/blog\/([^/]+)$/.exec(route); return post ? (SLUG_ES[post[1]] ? `/es/blog/${SLUG_ES[post[1]]}` : null) : route === '/' ? '/es' : `/es${route}`; };

const ENGLISH = /\b(the|and|with|your|our|for|you|from|mattress|mattresses|sleep|book|appointment|financing|available|learn more|get in touch|read|visit us|home|about us|frequently asked|minutes?|related|share|by)\b/i;
const BRANDS = /Snooze|Dream Mapping|Sleep Coach|Sleep Fit|Zcliner|SleepRecliner|SleepCorner|Infinity|Synchrony|Wells Fargo|Snap Finance|Promenade|http|@|Beautyrest|Stearns|Tempur|Brooklyn Bedding|King Koil|Spring Air|Bedgear|Helix|DreamFit|BedTech|Sealy|Serta|Nectar|Copper Collection|GlacioTex|Black Friday|Google|Facebook|Instagram|memory foam|queen|king|full|twin|split king/i;

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, protocolTimeout: 240000, args: ['--no-first-run', '--disable-gpu', '--hide-scrollbars'] });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let problems = 0; const flag = (m) => { problems++; console.log('  !! ' + m); };
const rows = []; const notes = { gtagTwice: [], chatLoader: [] };
/* console noise that is not the site's: the bot check inside the GoHighLevel form iframe (Cloudflare Turnstile) probes
   the console with invisible `%c` messages */
const NOISE = /font-size:0;color:transparent/;

async function open(route, width, track) {
  const page = await browser.newPage(); await page.setViewport({ width, height: 900, isMobile: width < 800, hasTouch: width < 800 });
  const errors = [], req = [];
  page.on('pageerror', (e) => errors.push('pageerror ' + String(e.message || e).slice(0, 120)));
  page.on('console', (m) => { const t = m.text(); if (NOISE.test(t)) return; if (m.type() === 'error' && !/Failed to load resource/.test(t)) errors.push(t.slice(0, 140)); else if (/hydrat|mismatch/i.test(t)) errors.push(t.slice(0, 140)); });
  page.on('response', (r) => { if (r.status() >= 400 && new URL(r.url()).origin === new URL(BASE).origin) errors.push(`${r.status()} ${r.url().replace(BASE, '').slice(0, 80)}`); });
  if (track) page.on('request', (q) => req.push(q.url()));
  const res = await page.goto(BASE + route, { waitUntil: 'networkidle2', timeout: 120000 }).catch(() => null);
  await wait(track ? 3500 : 800);
  // the chat widget script is added after load, when the browser is idle (next/script lazyOnload)
  if (CHAT.en || CHAT.es) await page.waitForFunction(() => document.querySelector('script[data-widget-id]'), { timeout: 10000 }).catch(() => {});
  return { page, errors, req, status: res ? res.status() : 0 };
}

console.log(`Spanish site check on ${BASE} — ${enRoutes.length} English page(s)\n`);
for (const en of enRoutes.sort()) {
  if (ONLY && en !== ONLY) continue;
  const es = twin(en);
  if (!es) { flag(`${en}: no Spanish twin`); rows.push([en, '—']); continue; }
  const S = await open(es, 1280, true);
  const info = await S.page.evaluate((englishSrc, brandsSrc) => {
    const ENGLISH = new RegExp(englishSrc, 'i'), BRANDS = new RegExp(brandsSrc, 'i');
    const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden'; };
    const rel = (h) => (h || '').replace(/^https?:\/\/[^/]+/, '') || '/';
    const alts = Object.fromEntries([...document.querySelectorAll('link[rel="alternate"][hreflang]')].map((l) => [l.getAttribute('hreflang'), rel(l.getAttribute('href'))]));
    const toggles = [...document.querySelectorAll('a[hreflang]')].filter((a) => !a.closest('main')).map((a) => ({ lang: a.getAttribute('hreflang'), href: a.getAttribute('href'), tag: a.tagName, onclick: !!a.getAttribute('onclick') }));
    const internal = [...document.querySelectorAll('a[href]:not([hreflang])')].map((a) => a.getAttribute('href')).filter((h) => h && h.startsWith('/') && !h.startsWith('//')).map((h) => h.split(/[?#]/)[0]).filter((p) => !/^\/(assets|ghl-stub|_next)\//.test(p) && !/\.[a-z0-9]{2,5}$/i.test(p));
    const off = [...new Set(internal.filter((p) => !(p === '/es' || p.startsWith('/es/'))))];
    const left = [];
    for (const e of document.querySelectorAll('h1,h2,h3,h4,p,li,a,button,span,td,th,summary,label')) {
      if (e.children.length || !vis(e) || e.closest('[lang="en"]') || e.closest('iframe')) continue;
      const t = (e.textContent || '').replace(/\s+/g, ' ').trim(); if (t.length < 8 || BRANDS.test(t)) continue;
      if (ENGLISH.test(t)) left.push(t.slice(0, 70));
    }
    return {
      lang: document.documentElement.lang, h1: document.querySelectorAll('h1').length, title: document.title, alts, toggles, off: off.slice(0, 6),
      canonical: rel((document.querySelector('link[rel="canonical"]') || {}).href || ''), robots: (document.querySelector('meta[name="robots"]') || {}).content || '',
      left: [...new Set(left)].slice(0, 5), leftN: new Set(left).size, scrollW: document.documentElement.scrollWidth,
      // the site's widget script(s) (components/ChatWidget.tsx: next/script with data-widget-id) and any widget that rendered
      chatIds: [...document.querySelectorAll('script[data-widget-id]')].map((s) => s.getAttribute('data-widget-id')), chatRendered: document.querySelectorAll('chat-widget').length,
      formEmbed: [...document.scripts].filter((s) => /form_embed\.js/.test(s.src)).length,
      events: (window.dataLayer || []).filter((e) => e && typeof e.event === 'string').map((e) => e.event),
    };
  }, ENGLISH.source, BRANDS.source);
  const n = (re) => S.req.filter((u) => re.test(u)).length;
  const hits = S.req.filter((u) => /\/g\/collect\?/.test(u) && u.includes('tid=' + GA4)).length;
  const tags = { gtm: n(new RegExp('gtm\\.js\\?id=' + GTM)), gtag: n(new RegExp('gtag/js\\?id=' + GA4)), hits, sifi: n(new RegExp('sifitag/' + SIFI)), chat: n(/widgets\.leadconnectorhq\.com\/loader\.js|chat-widget\/loader\.js/), loader: n(/widgets\.leadconnectorhq\.com\/loader\.js/) };
  const noindex = /noindex/.test(info.robots); const post = /^\/blog\/./.test(en);
  if (S.status !== 200) flag(`${es}: HTTP ${S.status}`);
  if (info.lang !== 'es') flag(`${es}: <html lang="${info.lang}">`);
  if (info.h1 !== 1) flag(`${es}: ${info.h1} <h1>`);
  if (!noindex && !(info.alts['en-US'] === en && info.alts['es-US'] === es && info.alts['x-default'] === en)) flag(`${es}: hreflang ${JSON.stringify(info.alts)}`);
  if (!noindex && info.canonical !== es) flag(`${es}: canonical ${info.canonical}`);
  const toEn = info.toggles.filter((t) => t.lang === 'en');
  if (!toEn.length || toEn.some((t) => t.tag !== 'A' || t.onclick || t.href !== en)) flag(`${es}: toggle to English ${JSON.stringify(toEn.slice(0, 2))} (expected a plain <a href="${en}">)`);
  if (info.off.length) flag(`${es}: links leaving /es: ${info.off.join(' ')}`);
  if (info.leftN) flag(`${es}: visible English: ${info.left.join(' | ')}`);
  if (S.errors.length) flag(`${es}: ${S.errors.length} console/page error(s): ${[...new Set(S.errors)].slice(0, 3).join(' | ')}`);
  if (tags.gtm < 1 || tags.gtag < 1 || tags.hits < 1 || tags.sifi !== 1) flag(`${es}: tags gtm.js ×${tags.gtm}, gtag.js ×${tags.gtag}, GA4 hits ×${tags.hits}, Simpli.fi ×${tags.sifi}`);
  // the site requests gtag.js once; a second request is the tag container loading its own copy of the same property
  if (tags.gtag > 1) notes.gtagTwice.push(es);
  // the chat widget: one script with the Spanish id, never the English one, never two
  if (JSON.stringify(info.chatIds) !== JSON.stringify(chatWant('es'))) flag(`${es}: chat widget ids ${JSON.stringify(info.chatIds)} (expected ${JSON.stringify(chatWant('es'))})`);
  if (info.chatRendered > 1) flag(`${es}: ${info.chatRendered} <chat-widget> elements`);
  // loader.js requested more often than the site's own script: the tag container's copy (reported, not a site fault)
  if (tags.loader > chatWant('es').length) notes.chatLoader.push(es);
  if (info.formEmbed > 1) flag(`${es}: form_embed.js ×${info.formEmbed}`);
  if (info.scrollW > 1280) flag(`${es}: horizontal overflow at 1280 (${info.scrollW})`);
  await S.page.close();
  // the English page: its toggle must come back to this Spanish page
  const E = await open(en, 1280, false);
  const back = await E.page.evaluate(() => ({ lang: document.documentElement.lang, h1: document.querySelectorAll('h1').length, es: [...document.querySelectorAll('a[hreflang="es"]')].filter((a) => !a.closest('main')).map((a) => a.getAttribute('href')) }));
  if (E.status !== 200) flag(`${en}: HTTP ${E.status}`);
  if (back.lang !== 'en') flag(`${en}: <html lang="${back.lang}">`);
  if (back.h1 !== 1) flag(`${en}: ${back.h1} <h1>`);
  if (!back.es.length || back.es.some((h) => h !== es)) flag(`${en}: toggle to Spanish ${JSON.stringify(back.es.slice(0, 2))} (expected ${es})`);
  const enChat = await chatIdsOf(E.page);
  if (JSON.stringify(enChat) !== JSON.stringify(chatWant('en'))) flag(`${en}: chat widget ids ${JSON.stringify(enChat)} (expected ${JSON.stringify(chatWant('en'))})`);
  if (E.errors.length) flag(`${en}: ${E.errors.length} console/page error(s): ${[...new Set(E.errors)].slice(0, 2).join(' | ')}`);
  await E.page.close();
  let mobile = '';
  if (MOBILE) {
    const M = await open(es, 390, false);
    const w = await M.page.evaluate(() => document.documentElement.scrollWidth);
    if (w > 390) flag(`${es}: horizontal overflow at 390 (${w})`);
    if (M.errors.length) flag(`${es} @390: ${M.errors.length} error(s): ${[...new Set(M.errors)].slice(0, 2).join(' | ')}`);
    mobile = ` 390:${w <= 390 ? 'ok' : w}`;
    await M.page.close();
  }
  rows.push([en, es]);
  console.log(`  ${en.padEnd(46)} ${es.padEnd(52)} ${S.status} h1=${info.h1} toggle ${toEn.length && toEn[0].href === en && back.es[0] === es ? 'round-trips' : 'BROKEN'} tags ${tags.gtm}/${tags.gtag}/${tags.hits}/${tags.sifi} chat ${tags.chat} errors ${S.errors.length + E.errors.length}${mobile}`);
}

if (!ONLY) {
  // ---- the dataLayer events on /es (no lead is posted: the quiz webhook request is intercepted)
  const p = await browser.newPage(); await p.setViewport({ width: 1366, height: 900 });
  const ev = () => p.evaluate(() => (window.dataLayer || []).filter((e) => e && typeof e.event === 'string').map((e) => e.event));
  await p.goto(BASE + '/es', { waitUntil: 'networkidle2', timeout: 120000 }); await wait(1500);
  await p.evaluate(() => { document.addEventListener('click', (e) => { const a = e.target.closest && e.target.closest('a'); if (a) e.preventDefault(); }, true); const t = document.querySelector('a[href^="tel:"]'); if (t) t.click(); const m = document.querySelector('a[href*="google.com/maps"]'); if (m) m.click(); });
  await wait(600); const home = await ev();
  const got = { phone_click: home.includes('phone_click'), directions_click: home.includes('directions_click') };
  for (const [route, name] of [['/es/thank/you', 'optin_submit'], ['/es/dream/map/thank/you', 'booking_confirmation']]) { await p.goto(BASE + route, { waitUntil: 'networkidle2', timeout: 120000 }); await wait(1200); got[name] = (await ev()).includes(name); }
  await p.setRequestInterception(true); const posted = [];
  p.on('request', (q) => { if (/leadconnectorhq\.com\/hooks\//.test(q.url())) { posted.push({ url: q.url(), body: q.postData() || '' }); q.abort(); } else q.continue(); });
  await p.goto(BASE + '/es/sleep-quiz', { waitUntil: 'networkidle2', timeout: 120000 });
  await p.waitForSelector('#start', { timeout: 30000 }); await p.click('#start');
  for (let i = 0; i < 5; i++) { await p.waitForSelector('.answer', { visible: true, timeout: 15000 }); await p.evaluate(() => document.querySelector('.answer').click()); await wait(700); }
  await p.waitForSelector('#leadForm', { visible: true, timeout: 15000 });
  await p.type('#fn', 'TEST'); await p.type('#ln', 'Spanish check'); await p.type('#em', 'test-es@example.com'); await p.type('#ph', '3035550197'); await p.click('#submitBtn'); await wait(4500);
  got.quiz_completed = (await ev()).includes('quiz_completed');
  console.log(`\ndataLayer events on /es: ${Object.entries(got).map(([k, v]) => `${k}=${v}`).join(' ')}`);
  for (const [k, v] of Object.entries(got)) if (!v) flag(`event ${k} did not fire on /es`);
  const hook = pick(integ, /quizWebhookUrl: '([^']*)'/);
  if (posted.length !== 1) flag(`quiz webhook requests: ${posted.length} (expected 1, intercepted)`);
  else {
    // the quiz posts form-encoded (no CORS preflight); the page also keeps the payload it built
    let body = Object.fromEntries(new URLSearchParams(posted[0].body));
    if (!body.lang) body = (await p.evaluate(() => window.__sleepFitLastPayload)) || {};
    const flat = JSON.stringify(body);
    console.log(`quiz webhook (intercepted, not sent): ${posted[0].url === hook ? 'the Castle Rock hook' : posted[0].url}; lang=${body.lang}; store_name=${body.store_name}; page_url=${body.page_url}`);
    if (posted[0].url !== hook) flag('quiz webhook URL is not lib/integrations.ts quizWebhookUrl');
    if (body.lang !== 'es') flag(`quiz payload lang=${body.lang}`);
    if (!/Castle Rock/.test(flat)) flag('quiz payload does not name Castle Rock');
  }
  await p.close();
}
await browser.close();
console.log(`\n${rows.length} pair(s): ${rows.filter((r) => r[1] !== '—').length} with a Spanish twin`);
if (notes.gtagTwice.length) console.log(`note: gtag.js for ${GA4} was requested twice on ${notes.gtagTwice.length} Spanish page(s) — the site's own request plus the tag container's copy of the same property (container setting, not the site)`);
if (notes.chatLoader.length) console.log(`note: the LeadConnector chat loader (widgets.leadconnectorhq.com/loader.js) was requested on ${notes.chatLoader.length} Spanish page(s) more often than the site's own widget script — the tag container ${GTM} loads its own copy (container setting, not the site)`);
console.log(problems ? `PROBLEMS: ${problems}` : 'spanish check ok');
process.exit(problems ? 1 : 0);
