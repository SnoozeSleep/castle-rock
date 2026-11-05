/*
 * Integration ids in the generated pages (Castle Rock, CO, November 2026).
 *
 * The LeadConnector opt-in form is embedded as an <iframe> in the builder markup of 9 routes (the contact page and the
 * popup form on the product pages), in the page markup AND in the Nuxt hydration payload, with the form id in four
 * places per embed (src, id="inline-<id>", data-layout-iframe-id, data-form-id). The id is the client's, per location:
 * this script writes lib/integrations.ts formId ([CR_FORM_ID]) into every embed. While no id is configured the
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
const target = formId || TOKEN;
const known = [...PREVIOUS_IDS, TOKEN, ...(formId ? [formId] : [])];
const anyId = `(?:${known.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`;
/* the src may be the live host or the placeholder path; slashes may be JSON-escaped inside the payload */
const SRC = new RegExp(`(?:${WIDGET_HOST.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}|\\\\?/ghl-stub)((?:/|\\\\\\\\u002F)widget(?:/|\\\\\\\\u002F)form(?:/|\\\\\\\\u002F)|/form/)${anyId}`, 'g');
const ID_ATTRS = new RegExp(`(inline-|data-form-id=\\\\*")${anyId}`, 'g');
const newSrc = formId ? `${WIDGET_HOST}/widget/form/${formId}` : `/ghl-stub/form/${TOKEN}`;

const files = []; (function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (e.name === 'content.ts') files.push(p); } })(path.join(ROOT, 'app'));
let changed = 0, embeds = 0;
for (const f of files) {
  const s = fs.readFileSync(f, 'utf8');
  if (!new RegExp(anyId).test(s)) continue;
  let n = s.replace(SRC, (m, sep) => (sep.includes('u002F') ? newSrc.replace(/\//g, '\\\\u002F') : newSrc));
  n = n.replace(ID_ATTRS, (m, attr) => `${attr}${target}`);
  // the builder's own form element config carries the id too (payload value, field CSS ids "#el_<id>_first_name_0",
  // the "$sschedule-gate:<id>" state key): every remaining bare occurrence follows
  n = n.replace(new RegExp(anyId, 'g'), target);
  // the embed's title is "Contact form", 744px are reserved on load (form_embed.js resizes), and the inline form_embed.js
  // loader leaves the markup — components/GhlEmbedScripts.tsx loads it once per page
  n = n.replace(/(<iframe[^>]*data-form-name=\\*"Optin\\*"[^>]*title=\\*")(?:Optin|Contact form)(\\*")/g, '$1Contact form$2');
  n = n.replace(/(<iframe[^>]*(?:\/widget\/form\/|\/ghl-stub\/form\/)[^>]*style=\\*")width:100%;height:100%;border:none;border-radius:3px(\\*")/g, '$1width:100%;height:744px;border:none;border-radius:3px$2');
  // the markup writes `<script src="…" async="">`, the payload `<script async src=\"…\">`: any attribute order, either encoding
  n = n.replace(/(?:<|\\\\u003C)script\b[^>]*?link\.snoozesleep\.com\/js\/form_embed\.js[^>]*>(?:<|\\\\u003C)\/script>/g, '');
  embeds += (n.match(/data-form-id=\\*"/g) || []).length;
  if (n !== s) { changed++; if (!CHECK) fs.writeFileSync(f, n); console.log(`${path.relative(ROOT, f).replace(/\\/g, '/')}`); }
}
console.log(`integrations: form id ${formId ? `'${formId}' (live embeds at ${WIDGET_HOST})` : `not set — embeds point at the placeholder page (${TOKEN})`}; ${changed} page(s) ${CHECK ? 'would change' : 'changed'}, ${embeds} form embed attribute group(s)`);
