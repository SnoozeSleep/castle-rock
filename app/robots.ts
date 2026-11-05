import type { MetadataRoute } from 'next';

// prerendered once at build time, served as a plain file
export const dynamic = 'force-static';

import { SITE_URL } from '@/lib/location';

/* /robots.txt: everything is crawlable except the offline placeholders under /ghl-stub (the contact page, /contact-us,
   included: it is indexable). The booking and Dream Mapping thank-you pages (/thank/you, /dream/map/thank/you) are
   deliberately NOT disallowed: they carry a noindex,follow robots meta tag, and Google can only honour it if it is
   allowed to fetch the page. /llms.txt (app/llms.txt/route.ts) is a plain-text guide to the site for AI assistants. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/ghl-stub/', '/ghl-stub.html'] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
