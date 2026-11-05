/* Blog entries shown in the site navigation (header dropdown + mobile drawer). Kept tiny on purpose:
   the header is a client component and must not pull the full article content into every page.
   English only (the Castle Rock site has no Spanish mirror). */
import type { Locale } from './i18n';

export const BLOG_INDEX = { label: 'All articles', href: '/blog' };


export const BLOG_NAV = [
  { label: 'Memory Foam or Hybrid? A Guide for Hot Castle Rock Nights', href: '/blog/memory-foam-vs-hybrid-mattress-castle-rock', blurb: 'Which sleeps cooler, which suits couples, how long each lasts' },
  { label: 'Full, Queen or King? Mattress Size Guide', href: '/how-to-choose-a-mattress', blurb: 'Real dimensions, room sizes and who each size suits' },
  { label: 'Custom Mattresses Improving Health', href: '/blog/custom-mattresses-improving-health', blurb: 'Why a mattress fitted to you changes more than your nights' },
  { label: 'Dream Mapping: Pressure Maps for Better Sleep', href: '/blog/pressure-mapping-for-sleep', blurb: 'What the colours reveal about support and alignment' },
  { label: 'Mattresses That Relieve Aches', href: '/blog/mattresses-that-relieve-aches', blurb: 'Wake up without the morning stiffness' },
];

export const blogNav = (_locale: Locale = 'en') => BLOG_NAV;
