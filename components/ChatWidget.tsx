/**
 * The client's GoHighLevel chat widget (LeadConnector), one per page in the page's language: the English widget on every
 * page under app/(en) (and the global 404), the Spanish one on /es and /es/* (app/es). Rendered once, by the root layout
 * (components/SiteDocument.tsx SiteBody), never by a page. The snippet is the client's (loader.js with data-resources-url
 * and data-widget-id) as ONE next/script per page, strategy "lazyOnload" (the browser loads it when idle after the load
 * event, so it adds nothing to the critical path, the main-thread work before load, or hydration), keyed and identified
 * by the widget id so it is never added twice. next/script appends it to the end of <body>, outside #snz-app and the
 * React tree. The root layout stays mounted across client-side navigations within a language, so the widget keeps
 * running instead of loading again; switching language is a full page load (the EN | ES links in the top bar and the
 * mobile menu are plain <a> elements, and each language has its own root layout), so every page starts with only its own
 * language's widget. The site does not style the widget: its position, look, copy and hours are managed in the client's
 * CRM.
 *
 * Castle Rock, CO: the widget ids live in lib/integrations.ts `chatWidgetId` (EN 6aecf1606e7a665a17da2e4d, ES
 * 6aecf3bd11a83697ce11aafb, supplied November 6, 2026); an empty id renders nothing.
 */
import Script from 'next/script';
import { INTEGRATIONS } from '@/lib/integrations';
import type { Locale } from '@/lib/i18n';

const LOADER_SRC = 'https://widgets.leadconnectorhq.com/loader.js';
const RESOURCES_URL = 'https://widgets.leadconnectorhq.com/chat-widget/loader.js';

export function ChatWidget({ locale }: { locale: Locale }) {
  const widgetId = (INTEGRATIONS.chatWidgetId[locale] || '').trim();
  if (!widgetId) return null;
  return (
    <Script
      key={widgetId}
      id={`snz-chat-${widgetId}`}
      src={LOADER_SRC}
      strategy="lazyOnload"
      data-resources-url={RESOURCES_URL}
      data-widget-id={widgetId}
    />
  );
}
