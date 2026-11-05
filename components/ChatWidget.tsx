'use client';
/**
 * The client's GoHighLevel chat widget (LeadConnector), one per page. The snippet is the client's, verbatim (loader.js with
 * data-resources-url and data-widget-id); it is appended to the end of <body> once the page has loaded and the browser is
 * idle (lazy, after load), so it adds nothing to the critical path, the main-thread work before load, or hydration (it
 * lands after #snz-app, where React never looks). Once per page view: the root layout stays mounted across client-side
 * navigations, so the widget keeps running instead of loading again. The site does not style the widget: its position,
 * look, copy and hours are managed in the client's CRM.
 *
 * Castle Rock, CO (November 2026): the widget id comes from lib/integrations.ts ([CR_CHAT_EN]) and is empty until the
 * client supplies it — nothing is loaded; the previous location's widgets (English and Spanish) were removed.
 */
import { useEffect } from 'react';
import { INTEGRATIONS } from '@/lib/integrations';
import type { Locale } from '@/lib/i18n';

const SCRIPT_ID = 'snz-chat-widget';

export function ChatWidget({ locale: _locale = 'en' }: { locale?: Locale }) {
  useEffect(() => {
    const widgetId = INTEGRATIONS.chatWidgetId.trim();
    if (!widgetId || document.getElementById(SCRIPT_ID)) return;
    let idle = 0;
    let timer = 0;
    const add = () => {
      if (document.getElementById(SCRIPT_ID)) return;
      const s = document.createElement('script');
      s.id = SCRIPT_ID;
      s.src = 'https://widgets.leadconnectorhq.com/loader.js';
      s.setAttribute('data-resources-url', 'https://widgets.leadconnectorhq.com/chat-widget/loader.js');
      s.setAttribute('data-widget-id', widgetId);
      document.body.appendChild(s);
    };
    const schedule = () => {
      if (typeof window.requestIdleCallback === 'function') idle = window.requestIdleCallback(add, { timeout: 4000 });
      else timer = window.setTimeout(add, 1500);
    };
    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });
    return () => {
      window.removeEventListener('load', schedule);
      if (idle) window.cancelIdleCallback(idle);
      if (timer) window.clearTimeout(timer);
    };
  }, []);
  return null;
}
