/*
 * Screenshots of the built site for the review report (VERIFY step of the November 2026 brief): desktop (1366×900) and
 * mobile (390×844) full-page captures of the home, About Us, booking, contact and financing pages, plus the home hero
 * and the open "Our Products" dropdown / mobile drawer. Console errors and failed requests per page are printed at the
 * end.
 *   npx next start -p 4173                             # the server build (or BASE=… to point elsewhere)
 *   node scripts/screenshots.mjs [outDir]              # default docs/screenshots/verify
 * Uses the local Edge or Chrome through puppeteer-core (BROWSER_PATH to override), like scripts/verify.mjs.
 */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = (process.env.BASE || 'http://localhost:4173').replace(/\/+$/, '');
const OUT = path.resolve(process.argv[2] || path.join(ROOT, 'docs', 'screenshots', 'verify'));
const BROWSER = process.env.BROWSER_PATH || ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((p) => fs.existsSync(p));
if (!BROWSER) throw new Error('no Edge/Chrome found: set BROWSER_PATH');
fs.mkdirSync(OUT, { recursive: true });

/* PAGES=name=/route,name=/route overrides the list (and skips the dropdown / drawer captures), e.g. the blog pass:
   PAGES=blog=/blog,post-moving=/blog/moving-to-castle-rock-mattress-guide node scripts/screenshots.mjs docs/screenshots/blog */
const CUSTOM = process.env.PAGES ? process.env.PAGES.split(',').map((s) => s.split('=')) : null;
const PAGES = CUSTOM || [['home', '/'], ['about-us', '/about-us'], ['booking', '/booking'], ['contact-us', '/contact-us'], ['mattress-financing', '/mattress-financing']];
const VIEWPORTS = { desktop: { width: 1366, height: 900 }, mobile: { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const issues = {};

const settle = async (page) => {
  // slow steps: the site's reveal (snz-motion.js) only completes when each section crosses the viewport at a reading
  // pace; fast scrolls leave sections mid-fade and lazy frames (the footer map) unloaded in the capture
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 350) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 180)); } await new Promise((r) => setTimeout(r, 2500)); window.scrollTo(0, 0); });
  await page.evaluate(() => Promise.race([
    Promise.all([...document.images].filter((i) => !i.complete).map((i) => new Promise((r) => { i.addEventListener('load', r, { once: true }); i.addEventListener('error', r, { once: true }); }))),
    new Promise((r) => setTimeout(r, 4000)),
  ]));
  await wait(1200);
};
const open = async (browser, route, vp) => {
  const page = await browser.newPage(); await page.setViewport(vp);
  const key = `${route} (${vp.width}px)`; issues[key] = { console: [], failed: [], first: [] };
  page.on('console', (m) => { if (m.type() === 'error') issues[key].console.push(m.text().slice(0, 160)); });
  page.on('requestfailed', (q) => { if (!q.url().startsWith('data:')) issues[key].failed.push(`${q.url().slice(0, 120)} ${q.failure()?.errorText || ''}`); });
  page.on('response', (s) => { if (s.status() >= 400) { const line = `HTTP ${s.status()} ${s.url().slice(0, 120)}`; issues[key].failed.push(line); if (s.url().startsWith(BASE)) issues[key].first.push(line); } });
  await page.goto(BASE + route, { waitUntil: 'networkidle2', timeout: 90000 }).catch((e) => console.log(`goto ${route}: ${e.message.slice(0, 80)}`));
  return page;
};

const browser = await puppeteer.launch({ executablePath: BROWSER, headless: true, protocolTimeout: 240000, args: ['--no-first-run', '--disable-gpu', '--hide-scrollbars'] });
try {
  for (const [vpName, vp] of Object.entries(VIEWPORTS)) {
    for (const [name, route] of PAGES) {
      const page = await open(browser, route, vp);
      await settle(page);
      const file = path.join(OUT, `${name}-${vpName}.jpg`);
      await page.screenshot({ path: file, fullPage: true, type: 'jpeg', quality: 72 });
      console.log(`${vpName.padEnd(8)} ${route.padEnd(20)} ${path.basename(file)}`);
      if (route === '/') {
        await page.evaluate(() => window.scrollTo(0, 0)); await wait(400);
        await page.screenshot({ path: path.join(OUT, `home-hero-${vpName}.png`), clip: { x: 0, y: 0, width: vp.width, height: vp.height } });
        // fonts and icons: Poppins + Font Awesome must be the fonts in use, the inline SVG icons present
        const fonts = await page.evaluate(() => [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family).filter((v, i, a) => a.indexOf(v) === i));
        const icons = await page.evaluate(() => document.querySelectorAll('svg').length);
        const h1 = await page.evaluate(() => { const h = document.querySelector('h1'); return h ? { text: h.textContent.replace(/\s+/g, ' ').trim().slice(0, 60), opacity: getComputedStyle(h).opacity } : null; });
        console.log(`  fonts loaded: ${fonts.join(', ')}; inline svg: ${icons}; h1: ${JSON.stringify(h1)}`);
      }
      await page.close();
    }
  }
  if (!CUSTOM) { const page = await open(browser, '/', VIEWPORTS.desktop); await wait(500);
    const trigger = await page.$('button[aria-label="Open Our Products menu"]');
    if (trigger) { await trigger.click(); await wait(700); } else console.log('dropdown trigger not found');
    await page.screenshot({ path: path.join(OUT, 'nav-dropdown-desktop.png') }); console.log('desktop  dropdown             nav-dropdown-desktop.png'); await page.close(); }
  if (!CUSTOM) { const page = await open(browser, '/', VIEWPORTS.mobile); await wait(500);
    const burger = await page.$('button[aria-label="Open menu"]');
    if (burger) { await burger.click(); await wait(900); } else console.log('menu button not found');
    await page.screenshot({ path: path.join(OUT, 'mobile-drawer.png') }); console.log('mobile   drawer               mobile-drawer.png'); await page.close(); }
} finally { await browser.close(); }
console.log('\nconsole errors / failed requests per page:');
for (const [k, v] of Object.entries(issues)) console.log(`  ${k}: ${v.console.length} console error(s), ${v.failed.length} failed request(s), ${v.first.length} first-party 4xx/5xx${v.console.length ? '\n    ' + [...new Set(v.console)].slice(0, 4).join('\n    ') : ''}${v.failed.length ? '\n    ' + [...new Set(v.failed)].slice(0, 4).join('\n    ') : ''}`);
console.log(`\n${fs.readdirSync(OUT).length} files in ${OUT}`);
