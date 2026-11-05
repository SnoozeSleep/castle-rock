/*
 * The LeadConnector reviews widget in "Some of Our Happy Customers" (Castle Rock, CO, November 2026).
 *
 * Every generated page that carried the previous location's widget gets the Castle Rock widget: one iframe
 *   class "lc_reviews_widget", src https://reputationhub.site/reputation/widgets/review_widget/<ghlLocationId>?widgetId=<reviewsWidgetId>,
 *   frameborder 0, scrolling no, style min-width:100%; width:100%, loading="lazy", title="Customer reviews"
 * followed by a "Read more reviews on Google" link that stays `hidden` until the store's Place ID is supplied
 * (lib/location.ts [CR_PLACE_ID]). The widget's loader, review-widget.js, is NOT inlined here:
 * components/GhlEmbedScripts.tsx loads it once per page (next/script lazyOnload) when the page has the iframe. Written
 * into the page markup AND the Nuxt payload (hydration re-renders from the payload). scripts/recent-reviews.mjs places
 * the review cards above the iframe afterwards (run it after this script; lib/reviews.json ships empty).
 * While the ids are empty ([CR_GHL_LOCATION_ID] / [CR_REVIEWS_WIDGET_ID]) the section keeps its shell and shows a
 * one-line notice with the store's phone and e-mail instead of a widget — nothing of the previous location is left.
 *
 *   node scripts/reviews-widget.mjs           (npm run reviews:widget)   idempotent: the block sits between markers
 *   node scripts/reviews-widget.mjs --check                              report only
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');
const BS = String.fromCharCode(92);
const escapeJsonForScript = (json) => json.split('<').join(BS + 'u003C').split(String.fromCharCode(0x2028)).join(BS + 'u2028').split(String.fromCharCode(0x2029)).join(BS + 'u2029');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const integrations = fs.readFileSync(path.join(ROOT, 'lib/integrations.ts'), 'utf8');
const LOC_ID = (integrations.match(/ghlLocationId: '([^']*)'/) || [, ''])[1].trim();
const WIDGET_ID = (integrations.match(/reviewsWidgetId: '([^']*)'/) || [, ''])[1].trim();
const loc = fs.readFileSync(path.join(ROOT, 'lib/location.ts'), 'utf8');
const PLACE_ID = (loc.match(/const PLACE_ID = '([^']*)'/) || [, ''])[1];
const GBP_URL = PLACE_ID ? `https://www.google.com/maps/place/?q=place_id:${PLACE_ID}` : '';
const PHONE = (loc.match(/phone: '([^']*)'/) || [, ''])[1];
const PHONE_HREF = (loc.match(/phoneHref: '([^']*)'/) || [, ''])[1];
const EMAIL = (loc.match(/email: '([^']*)'/) || [, ''])[1];
const CITY = (loc.match(/city: '([^']*)'/) || [, ''])[1];

const START = '<!--snz-reviews-widget-->', END = '<!--/snz-reviews-widget-->';
/* a previous widget embed in either encoding: the loader script (optional) and the iframe */
const OLD_WIDGET = /(?:<script[^>]*review-widget\.js[^>]*><\/script>\s*)?<iframe[^>]*\blc_reviews_widget\b[^>]*>\s*(?:<\/iframe>)?/g;
const LABELS = {
  en: {
    title: 'Customer reviews', more: 'Read more reviews on Google',
    pending: `Customer reviews for the ${CITY} store are being connected. Call <a href="${PHONE_HREF}">${PHONE}</a> or email <a href="mailto:${EMAIL}">${EMAIL}</a>.`,
  },
  es: {
    title: 'Reseñas de clientes', more: 'Lee más reseñas en Google',
    pending: `Las reseñas de clientes de la tienda de ${CITY} están por conectarse. Llama al <a href="${PHONE_HREF}">${PHONE}</a> o escribe a <a href="mailto:${EMAIL}">${EMAIL}</a>.`,
  },
};
const more = (t) => GBP_URL
  ? `<p class="snz-reviews-more"><a class="snz-reviews-more__link" href="${esc(GBP_URL)}" target="_blank" rel="noopener noreferrer">${t.more}</a></p>`
  : `<p class="snz-reviews-more" hidden aria-hidden="true"><a class="snz-reviews-more__link" href="#" tabindex="-1">${t.more}</a></p>`;
/* The builder renders every section twice (a desktop-only and a mobile-only copy), so a page carries two widget
   iframes and the copy that is hidden at the visitor's viewport would load the widget too — the LeadConnector URL-error
   fix (November 5, 2026): every iframe starts with the site's placeholder src and carries the live URL in data-src; the
   inline script right after it gives the live src ONLY to the copy that is laid out (at parse time, so before
   review-widget.js, and again when the viewport crosses the breakpoint). The hidden copy keeps the placeholder. */
const placeholderSrc = () => `/ghl-stub/widget/reviews/${LOC_ID}?widgetId=${WIDGET_ID}`;
const liveSrc = () => `https://reputationhub.site/reputation/widgets/review_widget/${LOC_ID}?widgetId=${WIDGET_ID}`;
const SWAP = `<script>(function(){function live(){var f=document.querySelectorAll('iframe.lc_reviews_widget[data-src]');for(var i=0;i<f.length;i++){var x=f[i];if(x.getClientRects().length&&x.getAttribute('src')!==x.getAttribute('data-src'))x.setAttribute('src',x.getAttribute('data-src'));}}live();if(!window.__snzReviewsSwap){window.__snzReviewsSwap=1;window.addEventListener('resize',live);document.addEventListener('DOMContentLoaded',live);}})();</script>`;
const blockFor = (t) => LOC_ID && WIDGET_ID
  ? `${START}<iframe loading="lazy" class="lc_reviews_widget" title="${t.title}" src="${placeholderSrc()}" data-src="${liveSrc()}" frameborder="0" scrolling="no" style="min-width: 100%; width: 100%;"></iframe>${SWAP}${more(t)}${END}`
  : `${START}<p class="snz-reviews-more" data-snz-reviews="pending">${t.pending}</p>${END}`;

const strip = (html) => html.replace(new RegExp(`${START}[\\s\\S]*?${END}`, 'g'), '');
const apply = (html, block) => { let s = strip(html); let n = 0; s = s.replace(OLD_WIDGET, () => { n++; return block; }); return { s, n }; };
/* a page already carrying the markers: re-render the block in place */
const refresh = (html, block) => { let n = 0; const s = html.replace(new RegExp(`${START}[\\s\\S]*?${END}`, 'g'), () => { n++; return block; }); return { s, n }; };

const files = []; (function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (e.name === 'content.ts') files.push(p); } })(path.join(ROOT, 'app', '(en)')); // the English pages only: app/es is written from them by scripts/es-sync.mjs (npm run es:sync)
let changed = 0, placed = 0;
for (const f of files) {
  const rel = path.relative(ROOT, f).split(path.sep).join('/');
  const block = blockFor(LABELS[rel.startsWith('app/es/') ? 'es' : 'en']);
  const src = fs.readFileSync(f, 'utf8'); if (!/lc_reviews_widget|snz-reviews-widget/.test(src)) continue;
  const bodyM = src.match(/export const BODY_HTML = ("[\s\S]*");\s*$/); if (!bodyM) continue;
  const body = JSON.parse(bodyM[1]);
  const pm = body.match(/(<script[^>]*id="__NUXT_DATA__"[^>]*>)([\s\S]*?)(<\/script>)/);
  const markup = pm ? body.replace(pm[0], '\u0000PAYLOAD\u0000') : body;
  const render = (html) => { const r = refresh(html, block); return r.n ? r.s : apply(html, block).s; };
  const newMarkup = render(markup);
  let newPayload = pm ? pm[0] : '';
  if (pm) {
    const nodes = JSON.parse(pm[2]); let touched = false;
    for (let i = 0; i < nodes.length; i++) if (typeof nodes[i] === 'string' && /lc_reviews_widget|snz-reviews-widget/.test(nodes[i])) { const v = render(nodes[i]); if (v !== nodes[i]) { nodes[i] = v; touched = true; } }
    if (touched) newPayload = pm[1] + escapeJsonForScript(JSON.stringify(nodes)) + pm[3];
  }
  const next = pm ? newMarkup.replace('\u0000PAYLOAD\u0000', () => newPayload) : newMarkup;
  const n = newMarkup.split(START).length - 1; placed += n;
  if (next !== body) { changed++; if (!CHECK) fs.writeFileSync(f, src.replace(bodyM[1], () => JSON.stringify(next))); console.log(`${rel}: ${n} widget block(s) in the markup`); }
}
console.log(`reviews-widget: ${LOC_ID && WIDGET_ID ? `widget ${LOC_ID}?widgetId=${WIDGET_ID} (live src on the visible copy, the placeholder on the hidden one)` : 'ids missing — pending notice with the phone and e-mail'}; ${changed} page(s) ${CHECK ? 'would change' : 'changed'}, ${placed} blocks in markup; "Read more reviews on Google" ${GBP_URL ? 'live' : 'hidden until [CR_PLACE_ID]'}`);
