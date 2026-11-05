'use client';
/* The LeadConnector embed loaders, exactly once per page (November 2026 brief, D): after hydration the component looks
   at the page's iframes and loads only the scripts those embeds need —
     - review-widget.js (reputationhub.site) when the page has the reviews widget (iframe.lc_reviews_widget), lazyOnload;
     - form_embed.js (link.snoozesleep.com) when the page has an opt-in form and/or the booking calendar
       (iframe[src*="/widget/form/"], iframe[src*="/widget/booking/"]), afterInteractive — one script even when a form and
       the calendar share a page; it resizes the iframes to the widget's content (components/BookingPage.tsx registers
       its height guard inline, so it listens before this loads).
   next/script with a fixed id keeps each loader to one copy; the generated pages no longer carry the loaders inline
   (scripts/integrations.mjs and scripts/reviews-widget.mjs strip them) and the hand-written pages render none of their
   own. While an embed is a placeholder (/ghl-stub/…, lib/integrations.ts ids empty) nothing is loaded. Rendered by the
   root layout at the end of <body>. */
import { useEffect, useState } from 'react';
import Script from 'next/script';

const FORM_EMBED_SRC = 'https://link.snoozesleep.com/js/form_embed.js';
const REVIEW_WIDGET_SRC = 'https://reputationhub.site/reputation/assets/review-widget.js';

export function GhlEmbedScripts() {
  const [need, setNeed] = useState<{ form: boolean; reviews: boolean }>({ form: false, reviews: false });
  useEffect(() => {
    const form = !!document.querySelector('iframe[src*="/widget/form/"], iframe[src*="/widget/booking/"]');
    const reviews = !!document.querySelector('iframe.lc_reviews_widget');
    if (form || reviews) setNeed({ form, reviews });
  }, []);
  return (
    <>
      {need.form ? <Script id="lc-form-embed" src={FORM_EMBED_SRC} strategy="afterInteractive" /> : null}
      {need.reviews ? <Script id="lc-review-widget" src={REVIEW_WIDGET_SRC} strategy="lazyOnload" /> : null}
    </>
  );
}
