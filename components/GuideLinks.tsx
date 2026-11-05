import { localizeHref, type Locale } from '@/lib/i18n';
import { ArrowRightIcon, Icon } from './icons';

/* "Buying guides" — a short band at the end of /mattresses linking the two guides most relevant to a mattress shopper
   (November 2026 brief, E): the buying guide (sizes, comfort levels, foam vs coils) and the cooling mattresses page.
   The previous location's version linked two of its blog posts; the Castle Rock blog ships empty (F), so the cards point at the
   hand-written guide pages until Castle Rock articles exist. Server-rendered, outside the GoHighLevel markup, so it
   never touches the page payload. Styles: overrides/global.css (.snz-areas, .snz-card). */
const COPY = {
  en: {
    eyebrow: 'Buying guides',
    title: 'Not sure what size you need, or whether foam or coils suit you?',
    text: 'Two guides to read before you come in for your Dream Mapping fitting.',
    cards: [
      { icon: 'bed-wide' as const, title: 'How to choose a mattress', text: 'Standard sizes, the five comfort levels, foam, hybrid or innerspring, and what to try in the showroom.', href: '/how-to-choose-a-mattress' },
      { icon: 'snowflake' as const, title: 'Cooling mattresses', text: 'Why a mattress sleeps hot through bright Colorado summers and dry, heated winters, and the cooling models on the floor.', href: '/cooling-mattresses' },
    ],
    more: 'Read the guide',
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
