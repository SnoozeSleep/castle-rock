/* Third-party integrations of the Castle Rock store. ONE place for every id (November 2026 brief). An EMPTY value
   DISABLES the integration: nothing is rendered, nothing is loaded, no event is lost (the dataLayer events in
   public/snz-events.js and the quiz keep pushing to window.dataLayer either way). Every previous location's id was
   removed; every value below is an [CR_*] placeholder, listed in the README under NEEDS CLIENT INPUT until supplied.

   Readers: components/Tracking.tsx (ga4Id, gtmIds, simplifiTagId; googleSiteVerification through the layout metadata),
   components/ChatWidget.tsx (chatWidgetId), components/BookingPage.tsx (bookingCalendarUrl), scripts/integrations.mjs
   (formId -> the opt-in form iframes in the generated pages' content.ts), scripts/reviews-widget.mjs (ghlLocationId +
   reviewsWidgetId -> the reviews widget), the README. public/sleep-fit-quiz.js is a static file and cannot import this
   module: its CONFIG.store.webhookUrl mirrors quizWebhookUrl (change both; bump QUIZ_SCRIPT ?v= in
   components/SleepQuiz.tsx). */
export const INTEGRATIONS = {
  /** Google Search Console verification (meta name="google-site-verification"); none supplied */
  googleSiteVerification: '',
  /** [CR_GTM] Google Tag Manager container id(s), e.g. 'GTM-XXXXXXX'. The shared store container GTM-TVPN94M goes in
      here ONLY once the agency confirms it applies to Castle Rock. */
  gtmIds: [] as string[],
  /** [CR_GA4] Google Analytics 4 measurement id, e.g. 'G-XXXXXXXXXX' (gtag.js + config, installed once) */
  ga4Id: '',
  /** [CR_SIMPLIFI] Simpli.fi tag id (https://tag.simpli.fi/sifitag/<id>, async) */
  simplifiTagId: '',
  /** [CR_CHAT_EN] LeadConnector chat widget id (data-widget-id); the site is English only */
  chatWidgetId: '',
  /** [CR_GHL_LOCATION_ID] the Castle Rock GoHighLevel sub-account (location) id: the reviews widget URL, the CDN media
      path and the webhook host. The image library paths under /assets/filesafe/<previous location id>/ are files copied
      from the clone (shared brand assets) and keep that path. */
  ghlLocationId: '',
  /** [CR_REVIEWS_WIDGET_ID] the LeadConnector reviews widget id (scripts/reviews-widget.mjs builds the iframe URL from
      ghlLocationId + this) */
  reviewsWidgetId: '',
  /** [CR_CALENDAR_ID] the Dream Mapping booking calendar: the embed URL, e.g.
      'https://link.snoozesleep.com/widget/booking/<calendarId>' (components/BookingPage.tsx) */
  bookingCalendarUrl: '',
  /** [CR_FORM_ID] the LeadConnector "Optin" form id: the contact page form and the popup form on the product pages
      (scripts/integrations.mjs) */
  formId: '',
  /** [CR_QUIZ_WEBHOOK] the inbound webhook of the Castle Rock sub-account's Sleep Fit Quiz workflow; mirrored in
      public/sleep-fit-quiz.js CONFIG.store.webhookUrl — change both together */
  quizWebhookUrl: '',
};
