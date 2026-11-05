/*
 * Integration ids in the generated pages (Castle Rock, CO, November 2026).
 *
 * The LeadConnector opt-in form is embedded as an <iframe> in the builder markup of 9 routes (the contact page and the
 * popup form on the product pages), in the page markup AND in the Nuxt hydration payload, with the form id in four
 * places per embed (src, id="inline-<id>", data-layout-iframe-id, data-form-id). The id is the client's, per location:
 * this script writes lib/integrations.ts formId (and formHeight, the snippet's data-height) into every embed. While no id is configured the
 * iframes point at the site's own placeholder page (/ghl-stub/form/… → public/ghl-stub.html through the rewrite in
 * next.config.ts / vercel.json: a "being connected" card with the store's phone and e-mail) and carry the literal token
 * CR_FORM_ID, so nothing posts anywhere and nothing of the previous location is left; once the id is set the embeds
 * point back at the live widget host.
 * The inline form_embed.js loader leaves the markup either way: components/GhlEmbedScripts.tsx loads it once per page,
 * only where an embed exists.
 *
 *   node scripts/integrations.mjs           (npm run integrations)   idempotent
 *   node scripts/integrations.mjs --check                             report only
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');
const WIDGET_HOST = 'https://link.snoozesleep.com';
const TOKEN = 'CR_FORM_ID';
const PREVIOUS_IDS = ['0BTnYKylVR6OcWJug3r8']; // the previous location's opt-in form

const src = fs.readFileSync(path.join(ROOT, 'lib/integrations.ts'), 'utf8');
const formId = (src.match(/formId: '([^']*)'/) || [, ''])[1].trim();
const formHeight = +(src.match(/formHeight: (\d+)/) || [, '744'])[1]; // the snippet's data-height (744 on the previous location's form)
const target = formId || TOKEN;
const known = [...PREVIOUS_IDS, TOKEN, ...(formId ? [formId] : [])];
const anyId = `(?:${known.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`;
/* the src may be the live host or the placeholder path; slashes may be JSON-escaped inside the payload */
const SRC = new RegExp(`(?:${WIDGET_HOST.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}|\\\\?/ghl-stub)((?:/|\\\\\\\\u002F)widget(?:/|\\\\\\\\u002F)form(?:/|\\\\\\\\u002F)|/form/)${anyId}`, 'g');
const ID_ATTRS = new RegExp(`(inline-|data-form-id=\\\\*")${anyId}`, 'g');
const newSrc = formId ? `${WIDGET_HOST}/widget/form/${formId}` : `/ghl-stub/form/${TOKEN}`;

/* The payload copy of each embed. Hydration re-renders the builder's custom-code HTML from the Nuxt payload string, so
   what the visitor's DOM ends up with is the payload copy, not the page markup (seen in the browser, November 5, 2026: the
   iframe's title read "Optin" and its reserved height was gone after hydration). The copy therefore carries the same
   title ("Contact form") and, for the inline embed, the same reserved height as the markup. The payload is parsed, not
   pattern-matched across its escape levels; a string is changed in place (both copies of the section own their string). */
const BS = String.fromCharCode(92);
const escapeJsonForScript = (json) => json.split('<').join(BS + 'u003C').split(String.fromCharCode(0x2028)).join(BS + 'u2028').split(String.fromCharCode(0x2029)).join(BS + 'u2029');
function payloadCopy(source) {
  const bodyM = source.match(/export const BODY_HTML = ("[\s\S]*");\s*$/); if (!bodyM) return source;
  const body = JSON.parse(bodyM[1]);
  const pm = body.match(/(<script[^>]*id="__NUXT_DATA__"[^>]*>)([\s\S]*?)(<\/script>)/); if (!pm) return source;
  const nodes = JSON.parse(pm[2]); let any = false;
  // the reserved height belongs to the INLINE embed only (the contact page, whose markup carries the iframe); on the
  // product pages the form lives in the popup alone (payload only) and keeps the builder's height:100% of its popup
  const inline = /<iframe\b[^>]*data-form-name="Optin"/.test(body.replace(pm[0], ''));
  const height = inline ? `${formHeight}px` : '100%';
  for (let i = 0; i < nodes.length; i++) {
    const v = nodes[i]; if (typeof v !== 'string' || !/<iframe\b[^>]*data-form-name="Optin"/.test(v)) continue;
    const next = v.replace(/<iframe\b[^>]*data-form-name="Optin"[^>]*>/g, (tag) => tag
      .replace(/title="(?:Optin|Contact form)"/, 'title="Contact form"')
      .replace(/(style="width:100%;height:)(?:100%|\d+px)(;border:none;border-radius:3px")/, `$1${height}$2`));
    if (next !== v) { nodes[i] = next; any = true; }
  }
  if (!any) return source;
  const newBody = body.replace(pm[0], () => pm[1] + escapeJsonForScript(JSON.stringify(nodes)) + pm[3]);
  return source.replace(bodyM[1], () => JSON.stringify(newBody));
}

const files = []; (function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (e.name === 'content.ts') files.push(p); } })(path.join(ROOT, 'app', '(en)')); // the English pages only: app/es is written from them by scripts/es-sync.mjs (npm run es:sync)
let changed = 0, embeds = 0;
for (const f of files) {
  const s = fs.readFileSync(f, 'utf8');
  if (!new RegExp(anyId).test(s)) continue;
  let n = s.replace(SRC, (m, sep) => (sep.includes('u002F') ? newSrc.replace(/\//g, '\\\\u002F') : newSrc));
  n = n.replace(ID_ATTRS, (m, attr) => `${attr}${target}`);
  // the builder's own form element config carries the id too (payload value, field CSS ids "#el_<id>_first_name_0",
  // the "$sschedule-gate:<id>" state key): every remaining bare occurrence follows
  n = n.replace(new RegExp(anyId, 'g'), target);
  // the embed's title is "Contact form"; data-height is the client snippet's value (lib/integrations.ts formHeight) in the
  // markup and the payload copy alike, and that many pixels are reserved on load (form_embed.js resizes); the inline
  // form_embed.js loader leaves the markup — components/GhlEmbedScripts.tsx loads it once per page
  n = n.replace(/(<iframe[^>]*data-form-name=\\*"Optin\\*"[^>]*title=\\*")(?:Optin|Contact form)(\\*")/g, '$1Contact form$2');
  n = n.replace(/(data-form-name=\\*"Optin\\*"(?:\s|\\+n)*data-height=\\*")\d+/g, `$1${formHeight}`);
  n = n.replace(/(<iframe[^>]*(?:\/widget\/form\/|\/ghl-stub\/form\/)[^>]*style=\\*")width:100%;height:(?:100%|\d+px);border:none;border-radius:3px(\\*")/g, `$1width:100%;height:${formHeight}px;border:none;border-radius:3px$2`);
  // the markup writes `<script src="…" async="">`, the payload `<script async src=\"…\">`: any attribute order, either encoding
  n = n.replace(/(?:<|\\\\u003C)script\b[^>]*?link\.snoozesleep\.com\/js\/form_embed\.js[^>]*>(?:<|\\\\u003C)\/script>/g, '');
  n = payloadCopy(n);
  embeds += (n.match(/data-form-id=\\*"/g) || []).length;
  if (n !== s) { changed++; if (!CHECK) fs.writeFileSync(f, n); console.log(`${path.relative(ROOT, f).replace(/\\/g, '/')}`); }
}
console.log(`integrations: form id ${formId ? `'${formId}' (live embeds at ${WIDGET_HOST})` : `not set — embeds point at the placeholder page (${TOKEN})`}; data-height ${formHeight}; ${changed} page(s) ${CHECK ? 'would change' : 'changed'}, ${embeds} form embed attribute group(s)`);
