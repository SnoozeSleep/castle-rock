/* Blog entries shown in the site navigation (header dropdown + mobile drawer). Kept tiny on purpose:
   the header is a client component and must not pull the full article content into every page.
   Hrefs are English-style paths; the header localizes them (/es/...) for the Spanish site.
   Castle Rock, CO: the five articles of November 5, 2026 (lib/blog-posts.ts, the document's order) and their Spanish
   versions (lib/blog-posts-es.ts). Each entry is the article's own title and one of its own section headings — no copy
   written for the menu. */
import type { Locale } from './i18n';

export const BLOG_INDEX = { label: 'All articles', href: '/blog' };

/* Every article has its own slug per language: English slug -> Spanish slug. lib/i18n.ts alternateHref() uses it so the
   EN | ES switcher lands on the same article; components/blog/pages.tsx and app/sitemap.ts take the same pairing from
   BlogPost.altSlug, which lib/blog-posts.ts fills from this table (English posts) and lib/blog-posts-es.ts from its own
   `en` field (Spanish posts) — one table, so the pair cannot disagree. */
export const BLOG_SLUG_ES: Record<string, string> = {
  'moving-to-castle-rock-mattress-guide': 'mudanza-a-castle-rock-guia-de-colchones',
  'side-sleeper-mattress-castle-rock': 'colchon-para-dormir-de-lado-castle-rock',
  'sleep-recovery-active-coloradans': 'sueno-y-recuperacion-coloradenses-activos',
  'adjustable-beds-explained-castle-rock': 'camas-ajustables-explicadas-castle-rock',
  'mattress-size-guide-castle-rock': 'guia-de-tamanos-de-colchon-castle-rock',
};
/** the slug of the same article in `target`, or null when the article has no version in that language */
export function blogSlugFor(slug: string, target: Locale): string | null {
  if (target === 'es') return BLOG_SLUG_ES[slug] || null;
  return Object.keys(BLOG_SLUG_ES).find((en) => BLOG_SLUG_ES[en] === slug) || null;
}

export type BlogNavItem = { label: string; href: string; blurb: string };
export const BLOG_NAV: BlogNavItem[] = [
  { label: 'Moving to Castle Rock? Don’t Forget Your Sleep', href: '/blog/moving-to-castle-rock-mattress-guide', blurb: 'Should you move your old mattress?' },
  { label: 'Side Sleeper in Castle Rock? How to Find a Mattress That Supports Your Shoulders and Hips', href: '/blog/side-sleeper-mattress-castle-rock', blurb: 'What side sleepers should look for' },
  { label: 'Sleep and Recovery for Active Coloradans: Does Your Mattress Keep Up?', href: '/blog/sleep-recovery-active-coloradans', blurb: 'Why sleep matters when you’re active' },
  { label: 'Adjustable Beds Explained: Who They’re For and What to Know Before You Buy', href: '/blog/adjustable-beds-explained-castle-rock', blurb: 'What to think about before buying' },
  { label: 'Queen, King or California King? How to Choose the Right Mattress Size for Your Bedroom', href: '/blog/mattress-size-guide-castle-rock', blurb: 'Mattress sizes at a glance' },
];

/* the Spanish articles (lib/blog-posts-es.ts), in the same order: each one's own title and one of its section headings */
export const BLOG_NAV_ES: BlogNavItem[] = [
  { label: '¿Te mudas a Castle Rock? No te olvides de tu descanso', href: '/blog/mudanza-a-castle-rock-guia-de-colchones', blurb: '¿Conviene llevarte tu colchón viejo?' },
  { label: '¿Duermes de lado en Castle Rock? Cómo encontrar un colchón que dé soporte a tus hombros y caderas', href: '/blog/colchon-para-dormir-de-lado-castle-rock', blurb: 'Qué debe buscar quien duerme de lado' },
  { label: 'Sueño y recuperación para coloradenses activos: ¿tu colchón te sigue el paso?', href: '/blog/sueno-y-recuperacion-coloradenses-activos', blurb: 'Por qué importa el sueño cuando eres activo' },
  { label: 'Camas ajustables explicadas: para quién son y qué saber antes de comprar', href: '/blog/camas-ajustables-explicadas-castle-rock', blurb: 'En qué pensar antes de comprar' },
  { label: '¿Queen, king o California king? Cómo elegir el tamaño de colchón correcto para tu recámara', href: '/blog/guia-de-tamanos-de-colchon-castle-rock', blurb: 'Tamaños de colchón de un vistazo' },
];

export const blogNav = (locale: Locale) => (locale === 'es' ? BLOG_NAV_ES : BLOG_NAV);
