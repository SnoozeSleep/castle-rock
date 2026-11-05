/* Blog entries shown in the site navigation (header dropdown + mobile drawer). Kept tiny on purpose:
   the header is a client component and must not pull the full article content into every page.
   English only (the Castle Rock site has no Spanish mirror). */
import type { Locale } from './i18n';

export const BLOG_INDEX = { label: 'All articles', href: '/blog' };


/* Castle Rock, CO: no posts yet (lib/blog-posts.ts). With an empty list the header renders Blog as a plain link to /blog
   instead of a dropdown (components/SiteHeader.tsx). */
export const BLOG_NAV: Array<{ label: string; href: string; blurb: string }> = [];

export const blogNav = (_locale: Locale = 'en') => BLOG_NAV;
