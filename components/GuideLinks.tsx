import { localizeHref, type Locale } from '@/lib/i18n';
import { ArrowRightIcon, Icon } from './icons';

/* "Buying guides" — a short band at the end of /mattresses linking two of the Castle Rock blog articles (the blog brief,
   November 5, 2026): the side-sleeper guide and the mattress size guide (lib/blog-posts.ts posts 2 and 5). The band title
   is one of the articles' own taglines and each card carries the article's title and one of its own sentences — no copy
   written for the band. Server-rendered, outside the GoHighLevel markup, so it never touches the page payload. Styles:
   overrides/global.css (.snz-areas, .snz-card). */
const COPY = {
  en: {
    eyebrow: 'Buying guides',
    title: 'Not Every Mattress Fits Every Body.',
    text: 'Two guides to read before you come in for your Dream Mapping fitting.',
    cards: [
      { icon: 'spine' as const, title: 'Side Sleeper in Castle Rock? How to Find a Mattress That Supports Your Shoulders and Hips', text: 'Here’s what side sleepers should know before shopping.', href: '/blog/side-sleeper-mattress-castle-rock' },
      { icon: 'bed-wide' as const, title: 'Queen, King or California King? How to Choose the Right Mattress Size for Your Bedroom', text: 'Here’s how to pick the size that fits your body, your partner and your bedroom.', href: '/blog/mattress-size-guide-castle-rock' },
    ],
    more: 'Read article',
  },
  es: {
    eyebrow: 'Del Blog del Sueño',
    title: '¿No sabes qué tamaño necesitas, o si te conviene espuma o resortes?',
    text: 'Dos guías de nuestros Sleep Coaches para leer antes de venir a tu ajuste de Dream Mapping.',
    cards: [
      { icon: 'bed-wide' as const, title: 'Guía de tamaños de colchón: full, queen o king', text: 'Medidas reales, tamaños de recámara y consejos para parejas, niños y visitas.', href: '/blog/guia-tamanos-de-colchon-castle-rock' },
      { icon: 'snowflake' as const, title: 'Memory foam vs híbrido para las noches calurosas de verano', text: 'Cuál duerme más fresco, cuál conviene a las parejas y cuánto dura cada tipo.', href: '/blog/colchon-memory-foam-vs-hibrido-castle-rock' },
    ],
    more: 'Leer la guía',
  },
};

export function GuideLinks({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  return (
    <section className="snz-areas snz-guides" aria-labelledby="snz-guides-title">
      <div className="snz-areas__inner">
        <p className="snz-areas__eyebrow">{c.eyebrow}</p>
        <h2 id="snz-guides-title" className="snz-areas__title">{c.title}</h2>
        <p className="snz-areas__text">{c.text}</p>
        <ul className="snz-cards snz-cards--2 snz-guides__cards">
          {c.cards.map((card) => (
            <li key={card.href}>
              <a className="snz-card snz-card--link" href={localizeHref(card.href, locale)}>
                <span className="snz-badge"><Icon name={card.icon} /></span>
                <span className="snz-card__title">{card.title}</span>
                <span className="snz-card__text">{card.text}</span>
                <span className="snz-card__more">{c.more} <ArrowRightIcon /></span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
