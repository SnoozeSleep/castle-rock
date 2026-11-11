import { activeSlides, bannerManagerUrl, fetchBanners } from '@/lib/banners';
import { LOCATION } from '@/lib/location';
import { alternateHref, type Locale } from '@/lib/i18n';
import { PromoSlide, frameStyle } from './PromoSlide';
import { PromoCarousel } from './PromoCarousel';
import styles from './PromoBanner.module.css';

/* The promo banner slot (home page, / and /es; November 2026). Reads the banner feed (lib/banners.ts: BANNERS_URL, else
   the banner manager's endpoint for this store) for this store's slug and today's date in its time zone. No eligible slide → nothing at all (no empty band). One slide → a
   static picture, no JavaScript. Two or more → the small carousel (components/PromoCarousel.tsx), with every slide in
   the server HTML so crawlers and no-JS visitors get them (the first one shows). This site is not a static export: it
   is rendered on the server and revalidated every 60 seconds (see lib/banners.ts).
   The feed has no language: the same art shows on / and /es. A slide's site-relative link (e.g. /booking) is taken to
   the Spanish page on /es (/es/booking; a blog post to its Spanish twin, lib/i18n.ts alternateHref), so the banner
   never sends a Spanish visitor to the English site; absolute links are used exactly as the feed gives them. */
const LABEL: Record<Locale, string> = { en: 'Promotions', es: 'Promociones' };

const inLocale = (href: string, locale: Locale): string => {
  if (locale === 'en' || !href.startsWith('/') || href.startsWith('//')) return href;
  const cut = href.search(/[?#]/);
  const path = cut === -1 ? href : href.slice(0, cut), rest = cut === -1 ? '' : href.slice(cut);
  return alternateHref(path || '/', locale) + rest;
};

export async function PromoBanner({ locale }: { locale: Locale }) {
  const active = activeSlides(await fetchBanners(bannerManagerUrl(LOCATION.slug)), LOCATION.slug, LOCATION.timeZone);
  const slides = active.slides.map((s) => (s.href ? { ...s, href: inLocale(s.href, locale) } : s));
  const { interval } = active;
  if (!slides.length) return null;
  if (slides.length === 1) {
    return (
      <section className={styles.promo} aria-label={LABEL[locale] || LABEL.en} data-promo-banner="static">
        <div className={styles.frame} style={frameStyle(slides[0])}>
          <PromoSlide slide={slides[0]} index={0} active />
        </div>
      </section>
    );
  }
  return <PromoCarousel slides={slides} interval={interval} locale={locale} label={LABEL[locale] || LABEL.en} />;
}
