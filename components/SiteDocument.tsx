import Script from 'next/script';
import { TopBar } from '@/components/TopBar';
import { SiteHeader } from '@/components/SiteHeader';
import { AnnouncementTicker } from '@/components/AnnouncementTicker';
import { SiteFooter } from '@/components/SiteFooter';
import { PageLoader } from '@/components/PageLoader';
import { TrackingHead, TrackingBody } from '@/components/Tracking';
import { ChatWidget } from '@/components/ChatWidget';
import { GhlEmbedScripts } from '@/components/GhlEmbedScripts';
import { GHL_SHIM } from '@/lib/ghl-shim';
import { BODY_GUARD } from '@/lib/body-guard';
import type { Locale } from '@/lib/i18n';

/* The document parts every page shares, in ONE place: the English root layout (app/(en)/layout.tsx, <html lang="en">),
   the Spanish root layout (app/es/layout.tsx, <html lang="es">) and the global 404 (app/global-not-found.tsx) each
   render <html>, declare the font and import the global stylesheet themselves (Next needs those in the entry module),
   and take everything else from here — so tracking, the embed loaders, the chrome and the scripts cannot drift apart
   between the two languages (the Spanish site was restored in November 2026; scripts/convert.mjs's layout template
   predates this split). */

/** the <head> children: the hydration guard, tracking (at parse time, the client's order), the widget host hint, the shim */
export function SiteHead() {
  return (
    <>
      {/* keeps elements that tags append to <body> before the React wrapper exists from breaking hydration (lib/body-guard.ts) */}
      <script dangerouslySetInnerHTML={{ __html: BODY_GUARD }} />
      {/* tracking first, high in <head>, in the client's order (components/Tracking.tsx) */}
      <TrackingHead />
      {/* the LeadConnector widget host (form / calendar embeds: lib/integrations.ts) */}
      <link rel="preconnect" href="https://link.snoozesleep.com" />
      {/* Safety net: rewrites any asset URL the GHL runtime still builds against the original CDNs to the
          local copies, provides window.__ghlOnReady for the site's own DOMContentLoaded scripts, and filters the
          review widget's height messages. A plain parser-blocking script on purpose: next/script's
          "beforeInteractive" runs after the page's own inline scripts (the review-widget.js embed among them),
          and the message filter must register before the vendor's listener. Inlined (lib/ghl-shim.ts, generated
          with public/ghl-offline-shim.js) so it costs no extra request on the critical path. */}
      <script dangerouslySetInnerHTML={{ __html: GHL_SHIM }} />
    </>
  );
}

/** the <body> children: the GTM noscript first, then everything React renders inside #snz-app, in the page's language */
export function SiteBody({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <>
      <TrackingBody />
      {/* Everything React renders in <body> sits in this one element (display: contents, so it adds no box and changes no
          layout). Tags fired by Google Tag Manager append elements to <body> while a long page is still streaming;
          with this wrapper they land after it, at the end of <body>, where React's hydration ignores them, instead of
          between React-rendered siblings (React error #418, a full client re-render). Keeps GTM at parse time safe. */}
      <div id="snz-app" style={{ display: 'contents' }}>
        <PageLoader locale={locale} />
        {/* slim NAP + language strip above the sticky header, on every page (components/TopBar.tsx) */}
        <TopBar locale={locale} />
        <SiteHeader locale={locale} />
        {/* announcement ticker directly under the sticky header, on every page (lib/announcements.ts) */}
        <AnnouncementTicker locale={locale} />
        {children}
        <SiteFooter locale={locale} />
        <Script src="/snz-motion.js?v=mv2keep" strategy="afterInteractive" />
        {/* dataLayer events for GA4 key events: phone / directions clicks, booking and opt-in confirmations (SEO audit 7b) */}
        <Script src="/snz-events.js?v=ev2" strategy="afterInteractive" />
        {/* the GoHighLevel chat widget in this language, added after the page has loaded (components/ChatWidget.tsx) */}
        <ChatWidget locale={locale} />
        {/* the LeadConnector embed loaders (form_embed.js, review-widget.js), once per page, only where a live embed exists */}
        <GhlEmbedScripts />
      </div>
    </>
  );
}
