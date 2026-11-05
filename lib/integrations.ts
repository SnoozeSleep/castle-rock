/* Third-party integrations of the Castle Rock store. ONE place for every id (November 2026 brief). An EMPTY value
   DISABLES the integration: nothing is rendered, nothing is loaded, no event is lost (the dataLayer events in
   public/snz-events.js and the quiz keep pushing to window.dataLayer either way). Every previous location's id was
   removed. The GoHighLevel values (location, reviews widget, calendar, form, quiz webhook) are the client's, supplied
   November 5, 2026, like the tracking ids (GTM, GA4, Simpli.fi); the chat widget id is still a [CR_*] placeholder,
   listed in the README under NEEDS CLIENT INPUT until supplied.

   Readers: components/Tracking.tsx (ga4Id, gtmIds, simplifiTagId; googleSiteVerification through the layout metadata),
   components/ChatWidget.tsx (chatWidgetId), components/BookingPage.tsx (bookingCalendarUrl), scripts/integrations.mjs
   (formId -> the opt-in form iframes in the generated pages' content.ts), scripts/reviews-widget.mjs (ghlLocationId +
   reviewsWidgetId -> the reviews widget), the README. public/sleep-fit-quiz.js is a static file and cannot import this
   module: its CONFIG.store.webhookUrl mirrors quizWebhookUrl (change both; bump QUIZ_SCRIPT ?v= in
   components/SleepQuiz.tsx). */
export const INTEGRATIONS = {
  /** Google Search Console verification (meta name="google-site-verification"); none supplied */
  googleSiteVerification: '',
  /** Google Tag Manager container(s): the shared store container, supplied for Castle Rock (November 5, 2026); one
      snippet per container in <head> at parse time, its <noscript> iframe right after <body> */
  gtmIds: ['GTM-TVPN94M'] as string[],
  /** Google Analytics 4 measurement id (gtag.js + config, installed once, before the container) */
  ga4Id: 'G-RRW8EFJHLW',
  /** Simpli.fi tag id (https://tag.simpli.fi/sifitag/<id>, async) */
  simplifiTagId: 'f02b62cf-a006-4430-9df7-96dfd0660612',
  /** [CR_CHAT_EN] / [CR_CHAT_ES] LeadConnector chat widget ids (data-widget-id), one per language: the English widget on
      the English pages, the Spanish one under /es. Neither is supplied yet. A language without an id gets NO widget —
      the English widget never loads on /es (components/ChatWidget.tsx). */
  chatWidgetId: { en: '', es: '' } as Record<'en' | 'es', string>,
  /** the Castle Rock GoHighLevel sub-account (location) id (supplied November 5, 2026): the reviews widget URL, the CDN
      media path and the webhook host. The image library paths under /assets/filesafe/<previous location id>/ are files
      copied from the clone (shared brand assets) and keep that path. */
  ghlLocationId: 'gsqZfpbY5MmVessxREvK',
  /** the LeadConnector reviews widget id (scripts/reviews-widget.mjs builds the iframe URL from ghlLocationId + this) */
  reviewsWidgetId: '679d4982d04bf58812792124',
  /** the Dream Mapping booking calendar embed URL (components/BookingPage.tsx; iframe id = the calendar id + the
      snippet's timestamp suffix) */
  bookingCalendarUrl: 'https://link.snoozesleep.com/widget/booking/3JULWAhT1FJeSO6Nk2Rn',
  /** the LeadConnector "Optin" form id: the contact page form, embedded INLINE, and the popup form on the product pages
      (scripts/integrations.mjs writes it into the generated pages); not on /about-us */
  formId: 'j5X6ShHH15vRKdggRsLr',
  /** the form embed's data-height, as in the client's snippet: the height reserved for the iframe on load (form_embed.js
      resizes it to the form's real height afterwards); scripts/integrations.mjs writes it with the id */
  formHeight: 736,
  /** the inbound webhook of the Castle Rock sub-account's Sleep Fit Quiz workflow (supplied November 5, 2026); mirrored
      in public/sleep-fit-quiz.js CONFIG.store.webhookUrl — change both together and bump QUIZ_SCRIPT ?v= */
  quizWebhookUrl: 'https://services.leadconnectorhq.com/hooks/gsqZfpbY5MmVessxREvK/webhook-trigger/qhy1QYTG65DvduRltRW9',
};
