/* Blog entries shown in the site navigation (header dropdown + mobile drawer). Kept tiny on purpose:
   the header is a client component and must not pull the full article content into every page.
   English only (the Castle Rock site has no Spanish mirror).
   Castle Rock, CO: the five articles of November 5, 2026 (lib/blog-posts.ts, the document's order). Each entry is the
   article's own title and one of its own section headings — no copy written for the menu. */
import type { Locale } from './i18n';

export const BLOG_INDEX = { label: 'All articles', href: '/blog' };

export type BlogNavItem = { label: string; href: string; blurb: string };
export const BLOG_NAV: BlogNavItem[] = [
  { label: 'Moving to Castle Rock? Don’t Forget Your Sleep', href: '/blog/moving-to-castle-rock-mattress-guide', blurb: 'Should you move your old mattress?' },
  { label: 'Side Sleeper in Castle Rock? How to Find a Mattress That Supports Your Shoulders and Hips', href: '/blog/side-sleeper-mattress-castle-rock', blurb: 'What side sleepers should look for' },
  { label: 'Sleep and Recovery for Active Coloradans: Does Your Mattress Keep Up?', href: '/blog/sleep-recovery-active-coloradans', blurb: 'Why sleep matters when you’re active' },
  { label: 'Adjustable Beds Explained: Who They’re For and What to Know Before You Buy', href: '/blog/adjustable-beds-explained-castle-rock', blurb: 'What to think about before buying' },
  { label: 'Queen, King or California King? How to Choose the Right Mattress Size for Your Bedroom', href: '/blog/mattress-size-guide-castle-rock', blurb: 'Mattress sizes at a glance' },
];

export const blogNav = (_locale: Locale = 'en') => BLOG_NAV;
