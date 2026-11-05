import type { MetadataRoute } from 'next';

// prerendered once at build time, served as a plain file
export const dynamic = 'force-static';
import { postsFor } from '@/lib/blog-posts';
import LASTMOD from '@/lib/lastmod.json';

import { SITE_URL } from '@/lib/location';

/* Public, indexable pages of the site (hand-maintained; regeneration keeps this file). English only (section B of the
   November 2026 brief removed the Spanish mirror), so no hreflang alternates. Not listed on purpose: the
   noindex pages (the /thank/you and /dream/map/thank/you confirmation pages), the URLs that redirect (/home-page,
   /main-page, the duplicate legal pages, the builder's old contact-form URL) and the /ghl-stub placeholders.
   lastmod is per page: the date of the last commit that touched the page's own source (lib/lastmod.json, written by
   scripts/lastmod.mjs: run `npm run lastmod` before building whenever page content changed); blog posts carry their
   own dates from lib/blog-posts.ts. */
/* priorities: home 1.0, main pages 0.8, blog posts 0.6 (below), legal pages 0.3 */
const PAGES: Array<[path: string, priority: number]> = [
  ['/', 1],
  ['/about-us', 0.8],
  ['/mattresses', 0.8],
  ['/adjustable-mattress-bases', 0.8],
  ['/massage-chairs', 0.8],
  ['/pillows', 0.8],
  ['/mattress-protectors', 0.8],
  ['/premium-sheets', 0.8],
  ['/sleep-recliner', 0.8],
  ['/at-home-sleep-test-kit-by-sleepcorner', 0.8],
  ['/mattress-financing', 0.8],
  ['/mattress-sales', 0.8],
  ['/booking', 0.8],
  ['/contact-us', 0.7], // the contact page (indexable since October 29, 2026)
  ['/sleep-quiz', 0.8],
  ['/blog', 0.8],
  // hand-written content pages (lib/pages/*, build pass October 2026)
  ['/dream-mapping', 0.8],
  ['/queen-mattresses', 0.8],
  ['/king-mattresses', 0.8],
  ['/full-twin-mattresses', 0.8],
  ['/memory-foam-mattresses', 0.8],
  ['/mattresses-for-back-pain', 0.8],
  ['/cooling-mattresses', 0.8],
  ['/mattress-store-parker', 0.7],
  ['/mattress-store-highlands-ranch', 0.7],
  ['/mattress-store-lone-tree', 0.7],
  ['/faq', 0.7],
  ['/how-to-choose-a-mattress', 0.8],
  ['/privacy-policy-page', 0.3],
  ['/terms-conditions-page', 0.3],
];

// the home page canonical is the bare origin (no trailing slash): the sitemap uses the identical string
const abs = (path: string) => (path === '/' ? SITE_URL : `${SITE_URL}${path}`);
const lastmod = (path: string, fallback: Date) => { const d = (LASTMOD as Record<string, string>)[path]; return d ? new Date(d) : fallback; };

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const out: MetadataRoute.Sitemap = [];
  for (const [path, priority] of PAGES) out.push({ url: abs(path), lastModified: lastmod(path, now), changeFrequency: 'monthly', priority });
  // blog posts carry their own dates
  for (const p of postsFor('en')) out.push({ url: abs(`/blog/${p.slug}`), lastModified: new Date(p.dateModified || p.datePublished), changeFrequency: 'yearly', priority: 0.6 });
  return out;
}
