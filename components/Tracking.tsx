'use client';
/* Tracking tags for every page, rendered once by the root layout, high in <head>, all loading at parse time (nothing
   waits for an interaction, the load event or consent — a previous performance pass deferred the tags until the first
   interaction and GA4 stopped recording visitors who bounced). In this order, as the client's snippets:
     1. Google tag (gtag.js) + its config — ONCE
     2. Google Tag Manager, one snippet per container on one shared dataLayer; each gets its <noscript> iframe as the
        first thing in <body>
     3. Simpli.fi (async)
   plus the Google Search Console verification meta (rendered through the layout's metadata). Every id lives in
   lib/integrations.ts (supplied November 5, 2026: the shared container GTM-TVPN94M, GA4 G-RRW8EFJHLW, the Simpli.fi
   tag); an EMPTY id renders nothing — the previous location's tags were removed. Site events (phone_click, directions_click, booking_confirmation, optin_submit, quiz_*) go to the
   same window.dataLayer from public/snz-events.js and the quiz, so a container picks them up the moment it is configured.

   Why this is a client component: React 19 treats every `<script async src>` as a hoistable resource and moves it
   ahead of the rest of <head>, which would put the gtag.js loader before its inline config. A script that has an onLoad
   handler is rendered in place instead, so each async loader carries a no-op onLoad (it adds nothing to the HTML) and the
   order in view-source is the client's.

   Hydration safety: tags fired by the GTM containers insert elements into <body> while a long page is still streaming.
   components/GhlPage.tsx keeps the server-rendered page markup and puts it back if React ever has to re-render the tree
   after such an insertion, so the page never comes back blank. */
import { INTEGRATIONS } from '@/lib/integrations';

const keep = () => {};
const GA4 = INTEGRATIONS.ga4Id.trim();
const GTM_IDS = INTEGRATIONS.gtmIds.map((id) => id.trim()).filter(Boolean);
const SIMPLIFI = INTEGRATIONS.simplifiTagId.trim();
export const TRACKING_ENABLED = Boolean(GA4 || GTM_IDS.length || SIMPLIFI);

/* the standard snippets, with the configured ids */
const gtagConfig = (id: string) => `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${id}');
`;
const gtmSnippet = (id: string) => `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${id}');`;
const gtmNoscript = (id: string) => `<iframe src="https://www.googletagmanager.com/ns.html?id=${id}"
height="0" width="0" style="display:none;visibility:hidden"></iframe>`;

/** <head> tags; nothing while no id is configured. */
export function TrackingHead() {
  if (!TRACKING_ENABLED) return null;
  return (
    <>
      {(GA4 || GTM_IDS.length) ? <link rel="preconnect" href="https://www.googletagmanager.com" /> : null}
      {SIMPLIFI ? <link rel="dns-prefetch" href="https://tag.simpli.fi" /> : null}
      {GA4 ? (
        <>
          {/* Google tag (gtag.js) */}
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA4}`} onLoad={keep} />
          <script dangerouslySetInnerHTML={{ __html: gtagConfig(GA4) }} />
        </>
      ) : null}
      {GTM_IDS.map((id) => (
        // Google Tag Manager — one snippet per container, same dataLayer
        <script key={id} dangerouslySetInnerHTML={{ __html: gtmSnippet(id) }} />
      ))}
      {SIMPLIFI ? <script async src={`https://tag.simpli.fi/sifitag/${SIMPLIFI}`} onLoad={keep} /> : null}
    </>
  );
}

/** Google Tag Manager (noscript), immediately after <body>: one iframe per container. */
export function TrackingBody() {
  if (!GTM_IDS.length) return null;
  return <noscript dangerouslySetInnerHTML={{ __html: GTM_IDS.map(gtmNoscript).join('\n') }} />;
}
