import { localizeHref, type Locale } from '@/lib/i18n';
import { ArrowRightIcon, Icon } from './icons';

/* "Not sure what size you need?" — a short band at the end of /mattresses (EN + ES) linking the two guides the
   agency's blog drafts asked to be linked from the mattresses page (SEO report, October 27, 2026): the mattress size
   guide and the memory foam vs hybrid comparison. Server-rendered, outside the GoHighLevel markup (like
   components/AreaLinks.tsx on the home page), so it never touches the page payload. Styles: overrides/global.css
   (.snz-areas, .snz-card). */
const COPY = {
  en: {
    eyebrow: 'From the Sleep Blog',
    title: 'Not sure what size you need, or whether foam or coils suit you?',
    text: 'Two guides from our Sleep Coaches to read before you come in for your Dream Mapping fitting.',
    cards: [
      { icon: 'bed-wide' as const, title: 'Mattress size guide: full, queen or king', text: 'Real dimensions, room sizes and tips for couples, kids and holiday guests.', href: '/how-to-choose-a-mattress' },
      { icon: 'snowflake' as const, title: 'Memory foam vs hybrid for Colorado summers and heated winters', text: 'Which sleeps cooler, which suits couples, and how long each type lasts.', href: '/blog/memory-foam-vs-hybrid-mattress-castle-rock' },
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
